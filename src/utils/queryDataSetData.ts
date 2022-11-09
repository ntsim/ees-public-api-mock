import Hashids from 'hashids';
import { compact, groupBy, keyBy, mapValues } from 'lodash';
import { DataSetQuery, DataSetResultsViewModel } from '../schema';
import { DataRow, Filter, Indicator } from '../types/dbSchemas';
import Database from './Database';
import getDataSetDir from './getDataSetDir';
import {
  createFilterIdHasher,
  createIndicatorIdHasher,
  createLocationIdHasher,
} from './idHashers';
import { csvLabelsToGeographicLevels } from './locationConstants';
import parseTimePeriodCode from './parseTimePeriodCode';
import { timePeriodCodeIdentifiers } from './timePeriodConstants';

type FilterItem = Pick<Filter, 'id' | 'label' | 'group_name'>;

interface Result extends DataRow {
  location_id: number;
}

export default async function queryDataSetData(
  dataSetId: string,
  query: DataSetQuery,
  { useFacts, debug }: { useFacts: boolean; debug: boolean }
): Promise<DataSetResultsViewModel> {
  const dataSetDir = getDataSetDir(dataSetId);

  const db = new Database();

  const filterIdHasher = createFilterIdHasher();
  const locationIdHasher = createLocationIdHasher();
  const indicatorIdHasher = createIndicatorIdHasher();

  const { timePeriod } = query;
  const locationIds = parseIds(query.locations, locationIdHasher);
  const filterItemIds = parseIds(query.filterItems, filterIdHasher);
  const indicatorIds = parseIds(query.indicators, indicatorIdHasher);

  const startCode = timePeriodCodeIdentifiers[timePeriod.startCode];

  const [locationCols, filterCols, indicators, filterItems] = await Promise.all(
    [
      getLocationColumns(db, dataSetDir),
      getFilterColumns(db, dataSetDir),
      getIndicators(db, dataSetDir, indicatorIds),
      getFilterItems(db, dataSetDir, filterItemIds),
    ]
  );

  const indicatorCols = indicators.reduce<Set<string>>((acc, indicator) => {
    acc.add(`"${indicator.name}"`);
    return acc;
  }, new Set());

  const groupedFilterItems = groupBy(
    filterItems,
    (filter) => filter.group_name
  );

  let dbQuery: string;

  if (useFacts) {
    // Facts query generally outperforms non-fact query by 20-40% (with basic analysis)
    dbQuery = `
        SELECT time_periods.year AS time_period,
               time_periods.identifier AS time_identifier,
               locations.geographic_level,
               locations.id AS location_id,
               ${[
                 ...filterCols.map((col) => `${col}.id AS ${col}`),
                 ...indicatorCols,
               ]}
        FROM '${tableFile(dataSetDir, 'data_facts')}' AS data
            ${getFilterJoins(dataSetDir, filterCols, 'id')}
            JOIN '${tableFile(dataSetDir, 'locations')}' AS locations 
                ON locations.id = data.location_id
            JOIN '${tableFile(dataSetDir, 'time_periods')}' AS time_periods 
                ON time_periods.id = data.time_period_id 
        WHERE time_periods.identifier = ?
            AND time_periods.year >= ?
            AND time_periods.year <= ? ${
              locationIds.length > 0
                ? `AND locations.id IN (${placeholders(locationIds)})`
                : ''
            } ${getFiltersCondition(dataSetDir, groupedFilterItems)};
    `;
  } else {
    dbQuery = `
        SELECT time_period,
               time_identifier,
               locations.geographic_level,
               locations.id AS location_id,
               ${[
                 ...filterCols.map((col) => `${col}.id AS ${col}`),
                 ...indicatorCols,
               ]}
        FROM '${tableFile(dataSetDir, 'data')}' AS data
            ${getFilterJoins(dataSetDir, filterCols, 'label')}
            JOIN '${tableFile(dataSetDir, 'locations')}' AS locations
        ON row (${locationCols.map((col) => `locations.${col}`)})
            = row (${locationCols.map((col) => `data.${col}`)})
        WHERE time_identifier = ?
          AND time_period >= ?
          AND time_period <= ? ${
            locationIds.length > 0
              ? `AND locations.id IN (${placeholders(locationIds)})`
              : ''
          } ${getFiltersCondition(dataSetDir, groupedFilterItems)};
    `;
  }

  const results = await db.all<Result>(dbQuery, [
    startCode,
    timePeriod.startYear,
    timePeriod.endYear,
    ...locationIds,
    ...Object.values(groupedFilterItems).flatMap((items) =>
      items.map((item) => (useFacts ? item.id : item.label))
    ),
  ]);

  const unquotedFilterCols = filterCols.map((col) => col.slice(1, -1));
  const indicatorsById = keyBy(indicators, (indicator) =>
    debug ? indicator.name.toString() : indicatorIdHasher.encode(indicator.id)
  );

  return {
    _links: {
      self: {
        href: `/api/v1/data-sets/${dataSetId}/query`,
        method: 'POST',
      },
      file: {
        href: `/api/v1/data-sets/${dataSetId}/file`,
      },
      meta: {
        href: `/api/v1/data-sets/${dataSetId}/meta`,
      },
    },
    footnotes: [],
    warnings:
      results.length === 0
        ? [
            'No results matched the query criteria. You may need to refine your query.',
          ]
        : undefined,
    results: results.map((result) => {
      return {
        filterItemIds: unquotedFilterCols.map((col) =>
          debug
            ? `${col}:${result[col]}`
            : filterIdHasher.encode(Number(result[col]))
        ),
        timePeriod: {
          code: parseTimePeriodCode(result.time_identifier),
          year: Number(result.time_period),
        },
        geographicLevel: csvLabelsToGeographicLevels[result.geographic_level],
        locationId: debug
          ? result.location_id.toString()
          : locationIdHasher.encode(result.location_id),
        values: mapValues(indicatorsById, (indicator) =>
          result[indicator.name].toString()
        ),
      };
    }),
  };
}

function getFilterJoins(
  dataSetDir: string,
  filterCols: string[],
  property: keyof Filter
) {
  const table = tableFile(dataSetDir, 'filters');
  return filterCols
    .map(
      (filter) =>
        `JOIN '${table}' AS ${filter} ON ${filter}.${property} = data.${filter} 
          AND ${filter}.group_name = '${filter.slice(1, -1)}'`
    )
    .join(' ');
}

function getFiltersCondition(
  dataSetDir: string,
  groupedFilterItems: Dictionary<FilterItem[]>
): string {
  if (!Object.keys(groupedFilterItems).length) {
    return '';
  }

  const condition = Object.entries(groupedFilterItems)
    .map(
      ([groupName, filterItems]) =>
        `data."${groupName}" IN (${placeholders(filterItems)})`
    )
    .join(' AND ');

  return `AND ${condition}`;
}

async function getLocationColumns(
  db: Database,
  dataSetDir: string
): Promise<string[]> {
  return (
    await db.all<{ column_name: string }>(
      `DESCRIBE SELECT * EXCLUDE id FROM '${tableFile(
        dataSetDir,
        'locations'
      )}';`
    )
  ).map((row) => row.column_name);
}

async function getFilterColumns(
  db: Database,
  dataSetDir: string
): Promise<string[]> {
  return (
    await db.all<{ group_name: string }>(`
        SELECT DISTINCT group_name
        FROM '${tableFile(dataSetDir, 'filters')}';
    `)
  ).map((row) => `"${row.group_name}"`);
}

async function getIndicators(
  db: Database,
  dataSetDir: string,
  indicatorIds: number[]
): Promise<Indicator[]> {
  if (!indicatorIds.length) {
    return [];
  }

  return await db.all<Indicator>(
    `SELECT *
     FROM '${tableFile(dataSetDir, 'indicators')}'
     WHERE id IN (${placeholders(indicatorIds)});`,
    indicatorIds
  );
}

async function getFilterItems(
  db: Database,
  dataSetDir: string,
  filterItemIds: number[]
): Promise<FilterItem[]> {
  if (!filterItemIds.length) {
    return [];
  }

  return await db.all<Filter>(
    `SELECT *
        FROM '${tableFile(dataSetDir, 'filters')}'
        WHERE id IN (${placeholders(filterItemIds)});
    `,
    filterItemIds
  );
}

function parseIds(ids: string[], idHasher: Hashids): number[] {
  return compact(
    ids.map((id) => {
      try {
        return idHasher.decode(id)[0] as number;
      } catch (err) {
        return Number.NaN;
      }
    })
  );
}

function placeholders(value: unknown[]): string[] {
  return value.map(() => '?');
}

function tableFile(
  dataSetDir: string,
  table:
    | 'data'
    | 'data_facts'
    | 'indicators'
    | 'filters'
    | 'time_periods'
    | 'locations'
) {
  return `${dataSetDir}/${table}.parquet`;
}

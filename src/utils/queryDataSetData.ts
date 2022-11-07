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

const filterIdHasher = createFilterIdHasher();
const locationIdHasher = createLocationIdHasher();
const indicatorIdHasher = createIndicatorIdHasher();

export default async function queryDataSetData(
  dataSetId: string,
  query: DataSetQuery
): Promise<DataSetResultsViewModel> {
  const dataSetDir = getDataSetDir(dataSetId);

  const db = new Database();

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
    acc.add(indicator.name);
    return acc;
  }, new Set());

  const dbQuery = `
      SELECT time_period,
             time_identifier,
             locations.geographic_level,
             locations.id AS location_id,
             ${[
               ...filterCols.map((col) => `${col}.id AS ${col}`),
               ...indicatorCols,
             ]}
      FROM '${tableFile(dataSetDir, 'data')}' AS data
          ${filterCols
            .map(
              (col) =>
                `JOIN '${tableFile(
                  dataSetDir,
                  'filters'
                )}' AS ${col} ON ${col}.label = data.${col} AND ${col}.group_name = '${col}'`
            )
            .join(' ')}
          JOIN '${tableFile(dataSetDir, 'locations')}' AS locations
            ON row(${locationCols.map((col) => `locations.${col}`)})
                = row(${locationCols.map((col) => `data.${col}`)})
      WHERE time_identifier = ?
          AND time_period >= ?
          AND time_period <= ? ${
            locationIds.length > 0
              ? `AND locations.id IN (${placeholders(locationIds)})`
              : ''
          } ${getFiltersCondition(dataSetDir, filterItems)};
  `;

  const results = await db.all<Result>(dbQuery, [
    startCode,
    timePeriod.startYear,
    timePeriod.endYear,
    ...locationIds,
  ]);

  const indicatorsById = keyBy(indicators, (indicator) =>
    indicatorIdHasher.encode(indicator.id)
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
        filterItemIds: filterCols.map((col) =>
          filterIdHasher.encode(Number(result[col]))
        ),
        timePeriod: {
          code: parseTimePeriodCode(result.time_identifier),
          year: Number(result.time_period),
        },
        geographicLevel: csvLabelsToGeographicLevels[result.geographic_level],
        locationId: locationIdHasher.encode(result.location_id),
        values: mapValues(indicatorsById, (indicator) =>
          result[indicator.name].toString()
        ),
      };
    }),
  };
}

function getFiltersCondition(
  dataSetDir: string,
  filterItems: FilterItem[]
): string {
  if (!filterItems.length) {
    return '';
  }

  const groupedFilters = groupBy(filterItems, (filter) => filter.group_name);

  const condition = Object.entries(groupedFilters)
    .map(
      ([groupName, filterItems]) =>
        `data.${groupName} IN (${filterItems.map((item) => `'${item.label}'`)})`
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
  ).map((row) => row.group_name);
}

async function getIndicators(
  db: Database,
  dataSetDir: string,
  indicatorIds: string[]
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
  filterItemIds: string[]
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

function parseIds(ids: string[], idHasher: Hashids) {
  return compact(ids).map((id) => {
    try {
      return idHasher.decode(id).toString();
    } catch (err) {
      return id;
    }
  });
}

function placeholders(value: unknown[]): string[] {
  return value.map(() => '?');
}

function tableFile(
  dataSetDir: string,
  table: 'data' | 'indicators' | 'filters' | 'time_periods' | 'locations'
) {
  return `${dataSetDir}/${table}.parquet`;
}

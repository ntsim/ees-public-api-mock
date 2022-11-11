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
  { debug }: { debug: boolean }
): Promise<DataSetResultsViewModel> {
  const dataSetDir = getDataSetDir(dataSetId);

  const db = new Database();

  const filterIdHasher = createFilterIdHasher();
  const locationIdHasher = createLocationIdHasher();
  const indicatorIdHasher = createIndicatorIdHasher();

  const { timePeriod, page = 1, pageSize = 100 } = query;
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

  const groupedFilterItems = groupBy(
    filterItems,
    (filter) => filter.group_name
  );

  const createQuery = (columns: string[]) => `
      SELECT ${columns}
      FROM '${tableFile(dataSetDir, 'data')}' AS data
          ${getFilterJoins(dataSetDir, filterCols, 'label')}
          JOIN '${tableFile(dataSetDir, 'locations')}' AS locations
            ON (${locationCols.map((col) => `locations.${col}`)})
                = (${locationCols.map((col) => `data.${col}`)})
      WHERE data.time_identifier = ?
        AND data.time_period >= ?
        AND data.time_period <= ? ${
          locationIds.length > 0
            ? `AND locations.id IN (${placeholders(locationIds)})`
            : ''
        } ${getFiltersCondition(dataSetDir, groupedFilterItems)}
      `;

  const totalQuery = createQuery(['count(*) as total']);
  const resultsQuery = `
    ${createQuery([
      'data.time_period',
      'data.time_identifier',
      'locations.geographic_level',
      'locations.id AS location_id',
      ...filterCols.map(
        (col) =>
          `${
            debug ? `concat(${col}.id, '::', ${col}.label)` : `${col}.id`
          } AS ${col}`
      ),
      ...indicators.map((i) => `data."${i.name}"`),
    ])}
    LIMIT ?
    OFFSET ?
  `;

  // Tried cursor/keyset pagination, but it's probably too difficult to implement.
  // Might need to revisit this in the future if performance is an issue.
  // - Ordering is a real headache as we'd need to perform struct comparisons across
  //   non-indicator columns. This could potentially be even worse in terms of performance!
  // - We would most likely need to create new columns for row ids and row structs (of
  //   non-indicator columns). This would blow up the size of the Parquet file.
  // - The WHERE clause we would need to generate would be actually horrendous, especially
  //   if we want to allow users to specify custom sorting.
  // - The cursor token we'd generate for clients could potentially become big as
  //   it'd rely on a bunch of columns being combined.
  // - If we scale this horizontally, offset pagination is probably fine even if it's
  //   not as fast on paper. Cursor pagination may be a premature optimisation.
  const pageOffset = (page - 1) * pageSize;

  const params = [
    startCode,
    timePeriod.startYear,
    timePeriod.endYear,
    ...locationIds,
    ...Object.values(groupedFilterItems).flatMap((items) =>
      items.map((item) => item.label)
    ),
  ];

  const [{ total }, results] = await Promise.all([
    db.first<{ total: number }>(totalQuery, params),
    db.all<Result>(resultsQuery, [...params, pageSize, pageOffset]),
  ]);

  const unquotedFilterCols = filterCols.map((col) => col.slice(1, -1));
  const indicatorsById = keyBy(indicators, (indicator) =>
    indicator.name.toString()
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
    paging: {
      page,
      pageSize,
      totalResults: total,
      totalPages: Math.ceil(total / pageSize),
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
        filters: unquotedFilterCols.reduce<Dictionary<string>>((acc, col) => {
          acc[col] = debug
            ? result[col].toString()
            : filterIdHasher.encode(Number(result[col]));

          return acc;
        }, {}),
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
  table: 'data' | 'indicators' | 'filters' | 'time_periods' | 'locations'
) {
  return `${dataSetDir}/${table}.parquet`;
}

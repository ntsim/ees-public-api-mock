import { invert } from 'lodash';
import {
  DataSetMetaViewModel,
  FilterMetaViewModel,
  GeographicLevel,
  IndicatorMetaViewModel,
  LocationMetaViewModel,
  TimePeriodMetaViewModel,
  Unit,
} from '../schema';
import { Filter, Indicator, TimePeriod } from '../types/dbSchemas';
import Database from './Database';
import getDataSetDir from './getDataSetDir';
import {
  createFilterIdHasher,
  createIndicatorIdHasher,
  createLocationIdHasher,
} from './idHashers';
import {
  geographicLevelColumns,
  geographicLevelCsvLabels,
} from './locationConstants';
import parseTimePeriodCode from './parseTimePeriodCode';

export default async function getDataSetMeta(
  dataSetId: string
): Promise<DataSetMetaViewModel> {
  const dataDir = getDataSetDir(dataSetId);
  const db = new Database();

  try {
    return {
      timePeriods: await getTimePeriodsMeta(db, dataDir),
      filters: await getFiltersMeta(db, dataDir),
      indicators: await getIndicatorsMeta(db, dataDir),
      locations: await getLocationsMeta(db, dataDir),
    };
  } finally {
    db.close();
  }
}

async function getTimePeriodsMeta(
  db: Database,
  dataDir: string
): Promise<TimePeriodMetaViewModel[]> {
  const timePeriods = await db.all<TimePeriod>(
    `SELECT *
       FROM '${dataDir}/time_periods.parquet';`
  );

  return timePeriods.map((timePeriod) => ({
    code: parseTimePeriodCode(timePeriod.identifier),
    label: timePeriod.identifier,
    year: timePeriod.year,
  }));
}

async function getLocationsMeta(
  db: Database,
  dataDir: string
): Promise<Dictionary<LocationMetaViewModel[]>> {
  const filePath = `${dataDir}/locations.parquet`;

  const levels = (
    await db.all<{ level: string }>(
      `SELECT DISTINCT geographic_level AS level FROM '${filePath}';`
    )
  ).map((row) => row.level);

  const geographicLevelLabels = invert(geographicLevelCsvLabels);

  const hasher = createLocationIdHasher();

  const locationsMeta: Dictionary<LocationMetaViewModel[]> = {};

  for (const level of levels) {
    const geographicLevel = geographicLevelLabels[level] as
      | GeographicLevel
      | undefined;

    if (!geographicLevel) {
      throw new Error(`Invalid geographic level: ${level}`);
    }

    const cols = [
      'id',
      `${geographicLevelColumns[geographicLevel].code} AS code`,
      `${geographicLevelColumns[geographicLevel].name} AS label`,
    ];

    const levelLocations = await db.all<{
      id: number;
      code: string;
      label: string;
    }>(`SELECT ${cols} FROM '${filePath}' WHERE geographic_level = ?`, [level]);

    locationsMeta[geographicLevel] = levelLocations.map<LocationMetaViewModel>(
      (location) => {
        return {
          id: hasher.encodeHex(BigInt(location.id)),
          code: location.code,
          label: location.label,
          level: geographicLevel,
        };
      }
    );
  }

  return locationsMeta;
}

async function getFiltersMeta(
  db: Database,
  dataDir: string
): Promise<FilterMetaViewModel[]> {
  const filePath = `${dataDir}/filters.parquet`;

  const groups = await db.all<{ label: string; name: string; hint: string }>(
    `SELECT DISTINCT 
        group_label AS label,
        group_name AS name,
        group_hint AS hint
      FROM '${filePath}';`
  );

  const hasher = createFilterIdHasher();

  const filtersMeta: FilterMetaViewModel[] = [];

  for (const group of groups) {
    const items = await db.all<Pick<Filter, 'id' | 'label' | 'is_aggregate'>>(
      `SELECT id, label, is_aggregate FROM '${filePath}' WHERE group_label = ?`,
      [group.label]
    );

    filtersMeta.push({
      label: group.label,
      name: group.name,
      hint: group.hint,
      options: items.map((item) => {
        return {
          id: hasher.encodeHex(BigInt(item.id)),
          label: item.label,
          isAggregate: item.is_aggregate || undefined,
        };
      }),
    });
  }

  return filtersMeta;
}

async function getIndicatorsMeta(
  db: Database,
  dataDir: string
): Promise<IndicatorMetaViewModel[]> {
  const filePath = `${dataDir}/indicators.parquet`;

  const hasher = createIndicatorIdHasher();

  const indicators = await db.all<Indicator>(`SELECT * FROM '${filePath}';`);

  return indicators.map((indicator) => {
    return {
      id: hasher.encodeHex(BigInt(indicator.id)),
      label: indicator.label,
      name: indicator.name,
      unit: indicator.unit as Unit,
      decimalPlaces: indicator.decimal_places || undefined,
    };
  });
}

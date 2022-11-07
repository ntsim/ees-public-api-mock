import fs from 'fs-extra';
import { partition } from 'lodash';
import path from 'path';
import { MetaFileRow } from '../types/metaFile';
import { geographicLevelColumns } from '../utils/locationConstants';
import Database from '../utils/Database';
import parseCsv from '../utils/parseCsv';

const projectRoot = path.resolve(__dirname, '../..');
const dataImportsDir = path.resolve(projectRoot, 'data-imports');
const dataOutputDir = path.resolve(projectRoot, 'src/data');

async function runImport() {
  await fs.ensureDir(dataOutputDir);
  await fs.ensureDir(dataImportsDir);

  const files = (await fs.readdir(dataImportsDir)).filter((file) =>
    file.endsWith('.csv')
  );

  if (!files.length) {
    throw new Error(
      'No data files to import. Place some in the `data-imports` directory.'
    );
  }

  const [metaFiles, dataFiles] = partition(files, (file) =>
    file.endsWith('.meta.csv')
  );

  for (const dataFile of dataFiles) {
    console.log(`Importing data file: ${dataFile}`);

    const fileBaseName = path.basename(dataFile, '.csv');

    const metaFile = metaFiles.find(
      (file) => file === `${fileBaseName}.meta.csv`
    );

    if (!metaFile) {
      throw new Error(`Could not find meta file for: ${fileBaseName}`);
    }

    const outputDir = path.resolve(dataOutputDir, fileBaseName);

    // Clean output directory
    await fs.ensureDir(outputDir);
    await fs.emptyDir(outputDir);

    console.log(`=> Importing to directory: ${outputDir}`);

    const dataFilePath = path.resolve(dataImportsDir, dataFile);
    const metaFilePath = path.resolve(dataImportsDir, metaFile);

    const timeLabel = '=> Finished importing to directory';
    console.time(timeLabel);

    const db = new Database();

    await extractData(db, dataFilePath);
    await extractMeta(db, metaFilePath);
    await extractDataFacts(db);

    await db.run(`EXPORT DATABASE '${outputDir}' (FORMAT PARQUET, CODEC ZSTD)`);

    console.timeEnd(timeLabel);

    db.close();
  }
}

runImport().then(() => {
  console.log('DONE: All imports completed!');
});

async function extractData(db: Database, csvPath: string) {
  const timeLabel = '=> Imported data';
  console.time(timeLabel);

  try {
    await db.run(
      `CREATE TABLE data AS SELECT * FROM read_csv_auto('${csvPath}', ALL_VARCHAR=TRUE);`
    );

    console.timeEnd(timeLabel);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function extractMeta(db: Database, metaFilePath: string) {
  const metaFileRows = await parseCsv<MetaFileRow>(metaFilePath);

  try {
    const columns = (
      await db.all<{ column_name: string }>(`DESCRIBE data;`)
    ).map((col) => col.column_name);

    await extractTimePeriods(db);
    await extractLocations(db, columns);
    await extractFilters(db, columns, metaFileRows);
    await extractIndicators(db, columns, metaFileRows);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function extractDataFacts(db: Database) {
  const timeLabel = '=> Imported data facts';
  console.time(timeLabel);

  const filterCols = (
    await db.all<{ group_name: string }>(
      'SELECT DISTINCT group_name FROM filters;'
    )
  ).map((row) => row.group_name);
  const indicatorRows = await db.all<{ name: string }>(
    'SELECT DISTINCT name FROM indicators;'
  );

  await db.run('CREATE SEQUENCE data_facts_seq START 1;');
  await db.run(
    `CREATE TABLE data_facts(
      id BIGINT PRIMARY KEY DEFAULT nextval('data_facts_seq'),
      time_period_id INT NOT NULL,
      location_id INT NOT NULL,
      ${[
        ...filterCols.map((col) => `${col} INT NOT NULL`),
        ...indicatorRows.map((row) => `${row.name} VARCHAR`),
      ]}
    );`
  );

  const locationCols = (
    await db.all<{ column_name: string }>(
      `DESCRIBE SELECT * EXCLUDE id FROM locations;`
    )
  ).map((row) => row.column_name);

  const insertCols = [
    'time_period_id',
    'location_id',
    ...filterCols,
    ...indicatorRows.map((row) => row.name),
  ];

  await db.run(
    `INSERT INTO data_facts(${insertCols})
     SELECT time_periods.id AS time_period_id,
            locations.id AS location_id,
            ${[
              ...filterCols.map((col) => `${col}.id AS ${col}`),
              ...indicatorRows.map((row) => row.name),
            ]}
     FROM data
         JOIN locations 
             ON row(${locationCols.map((col) => `locations.${col}`)})
                    = row(${locationCols.map((col) => `data.${col}`)})
         JOIN time_periods ON time_periods.year = data.time_period AND time_periods.identifier = data.time_identifier
         ${filterCols
           .map(
             (col) =>
               `JOIN filters AS ${col} ON ${col}.label = data.${col} AND ${col}.group_name = '${col}'`
           )
           .join(' ')};`
  );

  console.timeEnd(timeLabel);
}

async function extractTimePeriods(db: Database): Promise<void> {
  const timeLabel = '=> Imported time periods meta';
  console.time(timeLabel);

  await db.run('CREATE SEQUENCE time_periods_seq START 1;');
  await db.run(
    `CREATE TABLE time_periods(
        id INT PRIMARY KEY DEFAULT nextval('time_periods_seq'),
        year INT NOT NULL,
        identifier VARCHAR
     );`
  );

  await db.run(
    `INSERT INTO time_periods(year, identifier) 
      SELECT DISTINCT
        time_period AS year, 
        time_identifier AS identifier
      FROM data
      ORDER BY time_period ASC;`
  );

  console.timeEnd(timeLabel);
}

async function extractLocations(
  db: Database,
  columns: string[]
): Promise<void> {
  const timeLabel = '=> Imported locations meta';
  console.time(timeLabel);

  const allowedCols = Object.values(geographicLevelColumns).reduce(
    (acc, cols) => {
      [cols.code, cols.name, ...(cols.other ?? [])].forEach((col) =>
        acc.add(col)
      );
      return acc;
    },
    new Set()
  );
  const locationCols = [
    'geographic_level',
    ...columns.filter((column) => allowedCols.has(column)),
  ];

  await db.run('CREATE SEQUENCE locations_seq START 1;');
  await db.run(
    `CREATE TABLE locations(
       id INT PRIMARY KEY DEFAULT nextval('locations_seq'),
       ${locationCols.map((col) => `${col} VARCHAR`)}
     );`
  );
  await db.run(
    `INSERT INTO locations(${locationCols}) SELECT DISTINCT ${locationCols} FROM data;`
  );

  console.timeEnd('=> Imported locations meta');
}

async function extractFilters(
  db: Database,
  columns: string[],
  metaFileRows: MetaFileRow[]
): Promise<void> {
  const timeLabel = '=> Imported filters meta';
  console.time(timeLabel);

  await db.run('CREATE SEQUENCE filters_seq START 1;');
  await db.run(
    `CREATE TABLE filters(
       id INT PRIMARY KEY DEFAULT nextval('filters_seq'),
       label VARCHAR NOT NULL,
       group_label VARCHAR NOT NULL,
       group_name VARCHAR NOT NULL,
       group_hint VARCHAR,
       is_aggregate BOOLEAN DEFAULT FALSE
     );`
  );

  const filters = metaFileRows.filter((row) => row.col_type === 'Filter');

  for (const filter of filters) {
    await db.run(
      `INSERT INTO
        filters(label, group_label, group_name, group_hint, is_aggregate)
        SELECT label, $1, $2, $3, CASE WHEN label = 'Total' THEN TRUE END
            FROM (SELECT DISTINCT ${filter.col_name} AS label FROM data);`,
      [filter.label, filter.col_name, filter.filter_hint]
    );
  }

  console.timeEnd(timeLabel);
}

async function extractIndicators(
  db: Database,
  columns: string[],
  metaFileRows: MetaFileRow[]
): Promise<void> {
  const timeLabel = '=> Imported indicators meta';
  console.time(timeLabel);

  await db.run('CREATE SEQUENCE indicators_seq START 1;');
  await db.run(
    `CREATE TABLE indicators(
       id INT PRIMARY KEY DEFAULT nextval('indicators_seq'),
       label VARCHAR NOT NULL,
       name VARCHAR NOT NULL,
       decimal_places INT,
       unit VARCHAR
     );`
  );

  const indicators = metaFileRows.filter((row) => row.col_type === 'Indicator');

  for (const indicator of indicators) {
    await db.run(
      `INSERT INTO indicators(label, name, decimal_places, unit) VALUES ($1, $2, $3, $4);`,
      [
        indicator.label,
        indicator.col_name,
        indicator.indicator_dp,
        indicator.indicator_unit,
      ]
    );
  }

  console.timeEnd(timeLabel);
}

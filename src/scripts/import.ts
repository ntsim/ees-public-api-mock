import fs from 'fs-extra';
import { partition } from 'lodash';
import path from 'path';
import Papa from 'papaparse';
import { TimePeriodMetaViewModel } from '../schema';
import MemoryDatabase from '../utils/MemoryDatabase';

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
    const outputFilePath = path.resolve(
      dataOutputDir,
      `${fileBaseName}.parquet`
    );

    const metaFile = metaFiles.find(
      (file) => file === `${fileBaseName}.meta.csv`
    );

    if (!metaFile) {
      throw new Error(`Could not find meta file for: ${fileBaseName}`);
    }

    // Remove output file if it already exists
    await fs.remove(outputFilePath);

    const dataFilePath = path.resolve(dataImportsDir, dataFile);
    const metaFilePath = path.resolve(dataImportsDir, metaFile);

    const db = new MemoryDatabase();

    await convertDataFileToParquet(db, dataFilePath, outputFilePath);
    await extractMeta(db, outputFilePath, metaFilePath);

    db.close();
  }
}

runImport().then(() => {
  console.log('Import completed!');
});

async function convertDataFileToParquet(
  db: MemoryDatabase,
  csvPath: string,
  outputPath: string
) {
  try {
    await db.run(
      `COPY '${csvPath}' TO '${outputPath}' (FORMAT 'PARQUET', CODEC 'ZSTD');`
    );

    console.log(`=> Imported data to Parquet file: ${outputPath}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function extractMeta(
  db: MemoryDatabase,
  parquetPath: string,
  metaFilePath: string
) {
  const meta = await parseCsv(metaFilePath);

  try {
    await db.run(
      `CREATE TABLE import_data AS SELECT * FROM read_parquet('${parquetPath}');`
    );

    const timePeriods = await getTimePeriods(db);

    // console.log(timePeriods);

    const columns = await db.all(`DESCRIBE import_data;`);

    console.log(columns);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

async function parseCsv(filePath: string) {
  return await new Promise((resolve) => {
    Papa.parse(fs.createReadStream(filePath), {
      header: true,
      skipEmptyLines: true,
      transformHeader(header) {
        return header.trim();
      },
      complete(results) {
        resolve(results.data);
      },
    });
  });
}

async function getTimePeriods(
  db: MemoryDatabase
): Promise<TimePeriodMetaViewModel[]> {
  const results = await db.all<{
    time_period: string | number;
    time_identifier: string;
  }>(`SELECT DISTINCT time_period, time_identifier FROM import_data;`);

  console.log(results);

  return results.map(({ time_period, time_identifier }) => {
    return {
      code: parseTimeIdentifierCode(time_identifier),
    };
  });
}

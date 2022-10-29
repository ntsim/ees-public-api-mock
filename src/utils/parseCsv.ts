import fs from 'fs-extra';
import Papa from 'papaparse';

export default async function parseCsv<TResult = Record<string, string>>(
  filePath: string
): Promise<TResult[]> {
  return await new Promise((resolve) => {
    Papa.parse<TResult>(fs.createReadStream(filePath), {
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

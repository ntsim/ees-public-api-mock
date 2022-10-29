import * as duckdb from 'duckdb';

export default class Database {
  private readonly db: duckdb.Database;

  constructor(destination: string = ':memory:') {
    this.db = new duckdb.Database(destination);
  }

  /**
   * Run a {@param query} using some {@param params}.
   * Does not return any results.
   */
  async run(query: string, params: (string | number)[] = []): Promise<void> {
    await new Promise((resolve, reject) => {
      this.db.run(query, ...params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Run a {@param query} using some {@param params}.
   * Returns a list of results.
   */
  async all<TResult>(query: string, params: any[] = []): Promise<TResult[]> {
    return await new Promise((resolve, reject) => {
      this.db.all(query, ...params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  close(): void {
    this.db.close();
  }
}

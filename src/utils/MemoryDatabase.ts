import * as duckdb from 'duckdb';

export default class MemoryDatabase {
  private readonly db = new duckdb.Database(':memory:');

  async run(query: string): Promise<void> {
    await new Promise((resolve, reject) => {
      this.db.run(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async all<TResult>(query: string): Promise<TResult[]> {
    return await new Promise((resolve, reject) => {
      this.db.all(query, (err, result) => {
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

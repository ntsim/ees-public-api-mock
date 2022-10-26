declare module 'duckdb' {
  export class Database {
    constructor(target: string);

    exec(
      ...commands: string[],
      callback: (err: unknown, result: any) => void
    ): void;
    run(query: string, callback: (err: unknown, result: any) => void): void;
    all(query: string, callback: (err: unknown, result: any) => void): void;
    close(): void;
  }
}

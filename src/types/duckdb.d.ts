declare module 'duckdb' {
  export class Database {
    constructor(destination: string);

    run(
      query: string,
      ...args: [
        ...params: (string | number)[],
        callback: (err: unknown, result: any) => void
      ]
    ): void;
    all(
      query: string,
      ...args: [
        ...params: (string | number)[],
        callback: (err: unknown, result: any) => void
      ]
    ): void;
    close(): void;
  }
}

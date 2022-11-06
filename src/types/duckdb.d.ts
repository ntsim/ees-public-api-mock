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
    stream<T>(
      query: string,
      ...params: (string | number)[]
    ): Generator<T, void, []>;
    close(): void;
  }
}

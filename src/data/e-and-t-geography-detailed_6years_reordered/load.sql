COPY "data" FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/e-and-t-geography-detailed_6years_reordered/data.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY time_periods FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/e-and-t-geography-detailed_6years_reordered/time_periods.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY locations FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/e-and-t-geography-detailed_6years_reordered/locations.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY filters FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/e-and-t-geography-detailed_6years_reordered/filters.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY indicators FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/e-and-t-geography-detailed_6years_reordered/indicators.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY data_facts FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/e-and-t-geography-detailed_6years_reordered/data_facts.parquet' (FORMAT 'parquet', CODEC 'ZSTD');

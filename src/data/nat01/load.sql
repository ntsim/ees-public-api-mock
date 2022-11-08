COPY "data" FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/nat01/data.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY time_periods FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/nat01/time_periods.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY locations FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/nat01/locations.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY filters FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/nat01/filters.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY indicators FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/nat01/indicators.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY data_facts FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/nat01/data_facts.parquet' (FORMAT 'parquet', CODEC 'ZSTD');

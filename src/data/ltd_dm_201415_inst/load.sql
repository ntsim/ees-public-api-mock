COPY "data" FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/ltd_dm_201415_inst/data.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY time_periods FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/ltd_dm_201415_inst/time_periods.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY locations FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/ltd_dm_201415_inst/locations.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY filters FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/ltd_dm_201415_inst/filters.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY indicators FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/ltd_dm_201415_inst/indicators.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY data_facts FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/ltd_dm_201415_inst/data_facts.parquet' (FORMAT 'parquet', CODEC 'ZSTD');

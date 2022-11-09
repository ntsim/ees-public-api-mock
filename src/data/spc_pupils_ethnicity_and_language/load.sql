COPY "data" FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_ethnicity_and_language/data.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY time_periods FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_ethnicity_and_language/time_periods.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY locations FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_ethnicity_and_language/locations.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY filters FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_ethnicity_and_language/filters.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY indicators FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_ethnicity_and_language/indicators.parquet' (FORMAT 'parquet', CODEC 'ZSTD');

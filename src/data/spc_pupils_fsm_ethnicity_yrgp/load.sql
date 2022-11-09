COPY "data" FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_fsm_ethnicity_yrgp/data.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY time_periods FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_fsm_ethnicity_yrgp/time_periods.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY locations FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_fsm_ethnicity_yrgp/locations.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY filters FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_fsm_ethnicity_yrgp/filters.parquet' (FORMAT 'parquet', CODEC 'ZSTD');
COPY indicators FROM '/home/nick/Development/personal/ees-public-api-mock/src/data/spc_pupils_fsm_ethnicity_yrgp/indicators.parquet' (FORMAT 'parquet', CODEC 'ZSTD');

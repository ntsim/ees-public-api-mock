

CREATE SEQUENCE indicators_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 3 NO CYCLE;
CREATE SEQUENCE filters_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 36 NO CYCLE;
CREATE SEQUENCE locations_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 362 NO CYCLE;
CREATE SEQUENCE time_periods_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 7 NO CYCLE;

CREATE TABLE "data"(time_period VARCHAR, time_identifier VARCHAR, geographic_level VARCHAR, country_code VARCHAR, country_name VARCHAR, region_code VARCHAR, region_name VARCHAR, lad_code VARCHAR, lad_name VARCHAR, english_devolved_area_code VARCHAR, english_devolved_area_name VARCHAR, ssa_t1_desc VARCHAR, sex VARCHAR, ethnicity_group VARCHAR, notional_nvq_level VARCHAR, e_and_t_aims_enrolments VARCHAR, e_and_t_aims_ach VARCHAR);
CREATE TABLE time_periods(id UINTEGER PRIMARY KEY DEFAULT(nextval('time_periods_seq')), "year" UINTEGER NOT NULL, identifier VARCHAR);
CREATE TABLE locations(id UINTEGER PRIMARY KEY DEFAULT(nextval('locations_seq')), geographic_level VARCHAR, country_code VARCHAR, country_name VARCHAR, region_code VARCHAR, region_name VARCHAR, lad_code VARCHAR, lad_name VARCHAR, english_devolved_area_code VARCHAR, english_devolved_area_name VARCHAR);
CREATE TABLE filters(id UINTEGER PRIMARY KEY DEFAULT(nextval('filters_seq')), "label" VARCHAR NOT NULL, group_label VARCHAR NOT NULL, group_name VARCHAR NOT NULL, group_hint VARCHAR, is_aggregate BOOLEAN DEFAULT(CAST('f' AS BOOLEAN)));
CREATE TABLE indicators(id UINTEGER PRIMARY KEY DEFAULT(nextval('indicators_seq')), "label" VARCHAR NOT NULL, "name" VARCHAR NOT NULL, decimal_places INTEGER, unit VARCHAR);






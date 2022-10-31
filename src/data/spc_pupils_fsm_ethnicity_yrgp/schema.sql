

CREATE SEQUENCE indicators_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 4 NO CYCLE;
CREATE SEQUENCE filters_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 50 NO CYCLE;
CREATE SEQUENCE locations_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 170 NO CYCLE;

CREATE TABLE "data"(time_period INTEGER, time_identifier VARCHAR, geographic_level VARCHAR, country_code VARCHAR, country_name VARCHAR, region_name VARCHAR, region_code VARCHAR, old_la_code INTEGER, la_name VARCHAR, new_la_code VARCHAR, phase_type_grouping VARCHAR, characteristic_group VARCHAR, characteristic VARCHAR, fsm_eligibility VARCHAR, number_of_pupils INTEGER, denominator INTEGER, percent_of_pupils DOUBLE);
CREATE TABLE time_periods("year" INTEGER NOT NULL, identifier VARCHAR);
CREATE TABLE locations(id INTEGER PRIMARY KEY DEFAULT(nextval('locations_seq')), geographic_level VARCHAR, country_code VARCHAR, country_name VARCHAR, region_name VARCHAR, region_code VARCHAR, old_la_code VARCHAR, la_name VARCHAR, new_la_code VARCHAR);
CREATE TABLE filters(id INTEGER PRIMARY KEY DEFAULT(nextval('filters_seq')), "label" VARCHAR NOT NULL, group_label VARCHAR NOT NULL, group_name VARCHAR NOT NULL, group_hint VARCHAR, is_aggregate BOOLEAN DEFAULT(CAST('f' AS BOOLEAN)));
CREATE TABLE indicators(id INTEGER PRIMARY KEY DEFAULT(nextval('indicators_seq')), "label" VARCHAR NOT NULL, "name" VARCHAR NOT NULL, decimal_places INTEGER, unit VARCHAR);





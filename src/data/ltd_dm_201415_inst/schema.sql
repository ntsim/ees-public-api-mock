

CREATE SEQUENCE indicators_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 21 NO CYCLE;
CREATE SEQUENCE filters_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 14 NO CYCLE;
CREATE SEQUENCE locations_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 4292 NO CYCLE;
CREATE SEQUENCE time_periods_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 2 NO CYCLE;

CREATE TABLE "data"(time_period VARCHAR, time_identifier VARCHAR, geographic_level VARCHAR, country_code VARCHAR, country_name VARCHAR, region_code VARCHAR, region_name VARCHAR, old_la_code VARCHAR, new_la_code VARCHAR, la_name VARCHAR, destination_year VARCHAR, school_urn VARCHAR, school_laestab VARCHAR, school_name VARCHAR, institution_group VARCHAR, characteristic VARCHAR, data_type VARCHAR, "version" VARCHAR, cohort VARCHAR, overall VARCHAR, education VARCHAR, he VARCHAR, hel4 VARCHAR, hel5 VARCHAR, hel6 VARCHAR, fe VARCHAR, fel10no VARCHAR, fel2 VARCHAR, fel3 VARCHAR, sfc_and_ssf VARCHAR, other_edu VARCHAR, appren VARCHAR, appl4 VARCHAR, appl3 VARCHAR, appl2 VARCHAR, all_work VARCHAR, all_notsust VARCHAR, all_unknown VARCHAR);
CREATE TABLE time_periods(id UINTEGER PRIMARY KEY DEFAULT(nextval('time_periods_seq')), "year" UINTEGER NOT NULL, identifier VARCHAR);
CREATE TABLE locations(id UINTEGER PRIMARY KEY DEFAULT(nextval('locations_seq')), geographic_level VARCHAR, country_code VARCHAR, country_name VARCHAR, region_code VARCHAR, region_name VARCHAR, old_la_code VARCHAR, new_la_code VARCHAR, la_name VARCHAR, school_urn VARCHAR, school_name VARCHAR);
CREATE TABLE filters(id UINTEGER PRIMARY KEY DEFAULT(nextval('filters_seq')), "label" VARCHAR NOT NULL, group_label VARCHAR NOT NULL, group_name VARCHAR NOT NULL, group_hint VARCHAR, is_aggregate BOOLEAN DEFAULT(CAST('f' AS BOOLEAN)));
CREATE TABLE indicators(id UINTEGER PRIMARY KEY DEFAULT(nextval('indicators_seq')), "label" VARCHAR NOT NULL, "name" VARCHAR NOT NULL, decimal_places INTEGER, unit VARCHAR);
CREATE TABLE data_facts(time_period_id UINTEGER NOT NULL, location_id UINTEGER NOT NULL, destination_year UINTEGER NOT NULL, characteristic UINTEGER NOT NULL, data_type UINTEGER NOT NULL, cohort VARCHAR, overall VARCHAR, education VARCHAR, he VARCHAR, hel4 VARCHAR, hel5 VARCHAR, hel6 VARCHAR, fe VARCHAR, fel10no VARCHAR, fel2 VARCHAR, fel3 VARCHAR, sfc_and_ssf VARCHAR, other_edu VARCHAR, appren VARCHAR, appl4 VARCHAR, appl3 VARCHAR, appl2 VARCHAR, all_work VARCHAR, all_notsust VARCHAR, all_unknown VARCHAR);





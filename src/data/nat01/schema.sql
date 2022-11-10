

CREATE SEQUENCE indicators_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 34 NO CYCLE;
CREATE SEQUENCE filters_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 89 NO CYCLE;
CREATE SEQUENCE locations_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 2 NO CYCLE;
CREATE SEQUENCE time_periods_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 7 NO CYCLE;

CREATE TABLE "data"(time_period VARCHAR, time_identifier VARCHAR, geographic_level VARCHAR, country_code VARCHAR, country_name VARCHAR, "Provision" VARCHAR, "LevelOfLearningGroup" VARCHAR, "LevelOfLearning" VARCHAR, "AppType" VARCHAR, "Gender" VARCHAR, "AgeBand" VARCHAR, "LearningDifficulties" VARCHAR, "BAME" VARCHAR, "Ethnicity" VARCHAR, "EthnicityDetailed" VARCHAR, "BenefitLearner" VARCHAR, "NumberOfLearners" VARCHAR, "NumberOfMatchedLearners" VARCHAR, "SPDPercent" VARCHAR, "EmpPercent" VARCHAR, "SelfEmpPercent" VARCHAR, "EmpOnlyPercent" VARCHAR, "EmpAndLearnPercent" VARCHAR, "LearnPercent" VARCHAR, "LearnOnlyPercent" VARCHAR, "FEPercent" VARCHAR, "BelowL2Percent" VARCHAR, "EngMathPercent" VARCHAR, "Level2Percent" VARCHAR, "FullLevel2Percent" VARCHAR, "Level3Percent" VARCHAR, "FullLevel3Percent" VARCHAR, "Level4PlusPercent" VARCHAR, "NotAssignedPercent" VARCHAR, "HEPercent" VARCHAR, "AppPercent" VARCHAR, "AppIntermediatePercent" VARCHAR, "AppAdvancedPlusPercent" VARCHAR, "AnyLearnPercent" VARCHAR, "ProgressionSustainedPriorPercent" VARCHAR, "NotSustainedPercent" VARCHAR, "NotSustainedNBPercent" VARCHAR, "NotSustainedBenefitPercent" VARCHAR, "BenefitPercent" VARCHAR, "NoDestPercent" VARCHAR, "LearnersWithEarnings" VARCHAR, "25thPercentile" VARCHAR, "Median" VARCHAR, "75thPercentile" VARCHAR);
CREATE TABLE time_periods(id UINTEGER PRIMARY KEY DEFAULT(nextval('time_periods_seq')), "year" UINTEGER NOT NULL, identifier VARCHAR);
CREATE TABLE locations(id UINTEGER PRIMARY KEY DEFAULT(nextval('locations_seq')), geographic_level VARCHAR NOT NULL, country_code VARCHAR, country_name VARCHAR);
CREATE TABLE filters(id UINTEGER PRIMARY KEY DEFAULT(nextval('filters_seq')), "label" VARCHAR NOT NULL, group_label VARCHAR NOT NULL, group_name VARCHAR NOT NULL, group_hint VARCHAR, is_aggregate BOOLEAN DEFAULT(CAST('f' AS BOOLEAN)));
CREATE TABLE indicators(id UINTEGER PRIMARY KEY DEFAULT(nextval('indicators_seq')), "label" VARCHAR NOT NULL, "name" VARCHAR NOT NULL, decimal_places INTEGER, unit VARCHAR);





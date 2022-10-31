import { DataSetViewModel } from '../schema';

export const absenceRatesDataSet = createDataSet({
  id: '63cfc86e-c334-4e58-2912-08da0807d53c',
  content:
    '<p>Absence information for full academic year 2020/21 for pupils aged 5-15.</p>',
  geographicLevels: ['National'],
  name: 'Absence rates',
  timePeriods: {
    start: '2020/21',
    end: '2020/21',
  },
});

export const absenceRatesByCharacteristicsDataSet = createDataSet({
  id: '79e2f31e-e3f9-4e98-1cc6-08da0b9545bd',
  content:
    '<p>Absence information for the full academic year, by pupil characteristics including gender and ethnicity for England.</p>',
  geographicLevels: ['National', 'Regional'],
  name: 'Absence rates by pupil characteristic',
  timePeriods: {
    start: '2018/19',
    end: '2020/21',
  },
});

export const permanentExclusionsDataSet = createDataSet({
  id: 'b24b5476-79ea-45ab-6195-08d948561bc9',
  content:
    '<p>Number and percentage of permanent exclusions and suspensions and those pupils receiving one or more suspension.</p>',
  geographicLevels: ['National'],
  name: 'Permanent exclusions and suspensions',
  timePeriods: {
    start: '2018/19',
    end: '2019/20',
  },
});

export const spcEthnicityLanguageDataSet = createDataSet({
  id: '9eee125b-5538-49b8-aa49-4fda877b5e57',
  content:
    '<p>Number of pupils in state-funded nursery, primary, secondary and special schools, non-maintained special schools and pupil referral units by language and ethnicity.</p>',
  name: 'Pupil characteristics - Ethnicity and Language',
  geographicLevels: ['National', 'Local Authority', 'Regional'],
  timePeriods: {
    start: '2015/16',
    end: '2021/22',
  },
});

export const spcYearGroupGenderDataSet = createDataSet({
  id: 'c5292537-e29a-4dba-a361-8363d2fb08f1',
  content:
    '<p>Number of pupils in state-funded nursery, primary, secondary and special schools, non-maintained special schools, pupil referral units and independent schools by national curriculum year and gender.</p>',
  name: 'Pupil characteristics - Year group and Gender',
  geographicLevels: ['National', 'Local Authority', 'Regional'],
  timePeriods: {
    start: '2015/16',
    end: '2021/22',
  },
});

export const pupilAbsenceDataSets = [
  absenceRatesDataSet,
  absenceRatesByCharacteristicsDataSet,
];

export const permanentExclusionsDataSets = [permanentExclusionsDataSet];

export const spcDataSets = [
  spcEthnicityLanguageDataSet,
  spcYearGroupGenderDataSet,
];

function createDataSet(dataSet: Omit<DataSetViewModel, '_links'>) {
  return {
    ...dataSet,
    _links: {
      self: {
        href: `/api/v1/data-sets/${dataSet.id}`,
      },
      query: {
        href: `/api/v1/data-sets/${dataSet.id}/query`,
        method: 'POST',
      },
      file: {
        href: `/api/v1/data-sets/${dataSet.id}/file`,
      },
      meta: {
        href: `/api/v1/data-sets/${dataSet.id}/meta`,
      },
    },
  };
}

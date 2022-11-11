import { DataSetViewModel } from '../schema';

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

export const benchmarkETDetailedReorderedDataSet = createDataSet({
  id: '91f449b6-0850-45ff-8e09-23d5fdc87fb5',
  content: '',
  name: 'ET Detailed Reordered',
  geographicLevels: ['National', 'Local Authority', 'Regional'],
  timePeriods: {
    start: '2015/16',
    end: '2021/22',
  },
});

export const benchmarkQuaDataSet = createDataSet({
  id: 'a96044e5-2310-4890-a601-8ca0b67d2964',
  content: '',
  name: 'QUA01',
  geographicLevels: ['National'],
  timePeriods: {
    start: '2013/14',
    end: '2018/19',
  },
});

export const benchmarkNatDataSet = createDataSet({
  id: '942ea929-05da-4e52-b77c-6cead4afb2f0',
  content: '',
  name: 'NAT01',
  geographicLevels: ['National'],
  timePeriods: {
    start: '2013/14',
    end: '2018/19',
  },
});

export const benchmarkLtdDmDataSet = createDataSet({
  id: '60849ca0-055d-4144-9ec5-30c100ad2245',
  content: '',
  name: 'LTD DM',
  geographicLevels: ['School'],
  timePeriods: {
    start: '2014/15',
    end: '2015/15',
  },
});

export const spcDataSets: DataSetViewModel[] = [
  spcEthnicityLanguageDataSet,
  spcYearGroupGenderDataSet,
];

export const benchmarkDataSets: DataSetViewModel[] = [
  benchmarkETDetailedReorderedDataSet,
  benchmarkLtdDmDataSet,
  benchmarkNatDataSet,
  benchmarkQuaDataSet,
];

export const allDataSets: DataSetViewModel[] = [
  ...spcDataSets,
  ...benchmarkDataSets,
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

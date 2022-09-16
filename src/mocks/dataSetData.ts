import {
  absenceRatesDataSet,
  absenceRatesByCharacteristicsDataSet,
  permanentExclusionsDataSet,
} from './dataSets';
import { DataSetResultsViewModel, DataSetViewModel } from '../schema';

export const absenceRatesDataSetData = createLinks(
  {
    footnotes: [
      {
        id: 'bf89061a-0180-42e1-0b3d-08da372be1c6',
        content:
          'Sessions recorded as not attending due to COVID circumstances are included as possible sessions in 2020/21 only, but not as an absence within absence rates.',
      },
      {
        id: '11953366-8af6-4206-0b3e-08da372be1c6',
        content:
          'Total includes state-funded primary, secondary and special schools. Data for special schools is available from 2016/17 to present.',
      },
    ],
    results: [
      {
        id: 'a1c0d27a-b645-40f8-3395-08da0807f3aa',
        filterItemIds: ['14cbe6d4-e0ff-47e7-ade2-3af43813165a'],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: { 'b38edd21-892e-4793-3361-08da0807f3aa': '117183525' },
        timePeriod: { code: 'AY', year: 2020 },
      },
    ],
  },
  absenceRatesDataSet
);

export const absenceRatesByCharacteristicsDataSetData = createLinks(
  {
    footnotes: [
      {
        id: 'bf89061a-0180-42e1-0b3d-08da372be1c6',
        content:
          'Sessions recorded as not attending due to COVID circumstances are included as possible sessions in 2020/21 only, but not as an absence within absence rates.',
      },
      {
        id: '11953366-8af6-4206-0b3e-08da372be1c6',
        content:
          'Total includes state-funded primary, secondary and special schools. Data for special schools is available from 2016/17 to present.',
      },
    ],
    results: [
      {
        id: '469f4daa-c307-477a-5b3a-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
        ],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '6709391',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '4942325',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: '744b1cc7-54b0-430b-5b82-08da0b95637f',
        filterItemIds: [
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '117183525',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '85416979',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: 'e53027ac-ef01-4d2c-5bfe-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
        ],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '51400577',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '38337355',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: '870cfe0d-5c49-4085-5c1e-08da0b95637f',
        filterItemIds: [
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '13139879',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '9627501',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: '0d701655-33cd-4a6c-5e07-08da0b95637f',
        filterItemIds: [
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Region',
        locationId: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '1849559',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '1294242',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: '3050e189-053a-4a7a-6255-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
        ],
        geographicLevel: 'Region',
        locationId: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '110317',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '83767',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: 'cdbf6d8a-1afa-4e8a-64d4-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
        ],
        geographicLevel: 'Region',
        locationId: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '7152217',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '5249899',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: 'ae0e75fd-82e1-45dd-65a3-08da0b95637f',
        filterItemIds: [
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Region',
        locationId: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '16603590',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '11940979',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: 'b6a0b332-2885-40d5-69e1-08da0b95637f',
        filterItemIds: [
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Region',
        locationId: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '5769305',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '4075488',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: 'dc545910-9869-45bd-6a05-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
        ],
        geographicLevel: 'Region',
        locationId: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '949634',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '662770',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: '625b36de-4855-410a-6add-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
        ],
        geographicLevel: 'Region',
        locationId: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '2281424',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '1708016',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: 'f704d401-68bb-4a46-6ba6-08da0b95637f',
        filterItemIds: [
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Region',
        locationId: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '216070',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '160556',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: '75c99f09-a4d9-4360-7212-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
        ],
        geographicLevel: 'Region',
        locationId: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '7874252',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '5431285',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: '7d451338-b95f-4d85-725a-08da0b95637f',
        filterItemIds: [
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Region',
        locationId: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '1558413',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '1031090',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: '497d7425-ec8f-43fd-72da-08da0b95637f',
        filterItemIds: [
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Region',
        locationId: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '5944784',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '3878412',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: 'b60aeddc-00ce-4bd1-72f0-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
        ],
        geographicLevel: 'Region',
        locationId: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '854528',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '570546',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: '961cbe6c-10fb-454a-747a-08da0b95637f',
        filterItemIds: [
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Region',
        locationId: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '198634',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '135393',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: '7d5b196b-b00e-4b22-753f-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
        ],
        geographicLevel: 'Region',
        locationId: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '110502',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '75741',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: 'e5ae9443-5342-4522-9bd9-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
        ],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '6496506',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '4565375',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: '5b9b11d8-9f8a-49ab-9da1-08da0b95637f',
        filterItemIds: [
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '119207289',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '83570764',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: 'cd052097-a1f6-4d11-9f50-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
        ],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '57891483',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '41461217',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: '7520a2bf-cec0-4ef2-9f70-08da0b95637f',
        filterItemIds: [
          '9b81021a-f60f-4d38-8816-dd3aef54de1b',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '11978185',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '8434992',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: 'd4682fcb-4688-461b-aaa5-08da0b95637f',
        filterItemIds: [
          'b936e2a5-a082-443c-a2ce-2c24195ad664',
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
        ],
        geographicLevel: 'Region',
        locationId: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '2696641',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '1851043',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
      {
        id: 'ac12acfe-ddd7-4156-ad15-08da0b95637f',
        filterItemIds: [
          '1df4d473-0a9f-4171-9194-8b5ed747f87d',
          '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
        ],
        geographicLevel: 'Region',
        locationId: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
        values: {
          'c82070d0-d1fd-4ac2-5ae8-08da0b95637f': '16342791',
          '772c60cd-d8eb-40c8-5ae9-08da0b95637f': '10928244',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
    ],
  },
  absenceRatesByCharacteristicsDataSet
);

export const permanentExclusionsDataSetData = createLinks(
  {
    footnotes: [
      {
        id: 'eb0e06d9-a4fd-4e34-e206-08da6fcfb467',
        content:
          'For 2019/20 and 2020/21, while suspensions and permanent exclusions were possible throughout the academic year, pandemic restrictions will have had an impact on the numbers presented and caution should be taken when comparing across years.',
      },
    ],
    results: [
      {
        id: 'd45c2561-92f6-462b-5b10-08da6fdcfe48',
        filterItemIds: ['49557959-21e3-4acd-97e8-961259bbb7ee'],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          '04a90197-d94f-4606-5b0b-08da6fdcfe48': '0.04737',
          '09f59b22-1275-4922-5b0d-08da6fdcfe48': '4.25086',
        },
        timePeriod: { code: 'AY', year: 2020 },
      },
      {
        id: '7df7c269-cf94-4f56-5b11-08da6fdcfe48',
        filterItemIds: ['49557959-21e3-4acd-97e8-961259bbb7ee'],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          '04a90197-d94f-4606-5b0b-08da6fdcfe48': '0.06126',
          '09f59b22-1275-4922-5b0d-08da6fdcfe48': '3.76416',
        },
        timePeriod: { code: 'AY', year: 2019 },
      },
      {
        id: '8641904b-3a92-42ba-5b12-08da6fdcfe48',
        filterItemIds: ['49557959-21e3-4acd-97e8-961259bbb7ee'],
        geographicLevel: 'Country',
        locationId: '058416da-0cae-4958-aa00-203d745858ae',
        values: {
          '04a90197-d94f-4606-5b0b-08da6fdcfe48': '0.09651',
          '09f59b22-1275-4922-5b0d-08da6fdcfe48': '5.3581',
        },
        timePeriod: { code: 'AY', year: 2018 },
      },
    ],
  },
  permanentExclusionsDataSet
);

function createLinks(
  data: Omit<DataSetResultsViewModel, '_links'>,
  dataSet: DataSetViewModel
): DataSetResultsViewModel {
  return {
    ...data,
    _links: {
      self: {
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

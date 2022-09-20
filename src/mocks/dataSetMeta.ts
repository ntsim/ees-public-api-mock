import { LocationMetaViewModel, DataSetMetaViewModel } from '../schema';

export const englandLocationMeta: LocationMetaViewModel = {
  id: '058416da-0cae-4958-aa00-203d745858ae',
  label: 'England',
  level: 'Country',
  code: 'E92000001',
};

export const regionLocationMeta: LocationMetaViewModel[] = [
  {
    id: '6b0c3349-34c4-48d4-aa6e-745ab358acc1',
    label: 'North East',
    level: 'Region',
    code: 'E12000001',
  },
  {
    id: '520fa9b3-ea9f-4cf4-b5a7-de9539900771',
    label: 'North West',
    level: 'Region',
    code: 'E12000002',
  },
];

export const countryRegionLocationMeta: LocationMetaViewModel[] = [
  {
    ...englandLocationMeta,
    options: regionLocationMeta,
  },
];

export const absenceRatesDataSetMeta: DataSetMetaViewModel = {
  filters: [
    {
      id: 'a2eef4bc-93a4-4082-9a13-62f123ef32be',
      label: 'School type',
      name: 'school_type',
      options: [
        {
          id: '14cbe6d4-e0ff-47e7-ade2-3af43813165a',
          label: 'All',
        },
      ],
    },
  ],
  indicators: [
    {
      id: 'b38edd21-892e-4793-3361-08da0807f3aa',
      label: 'Number of overall absence sessions',
      name: 'sess_overall',
      unit: '',
      decimalPlaces: 0,
    },
  ],
  locations: [englandLocationMeta],
  timePeriods: [
    { code: 'AY', label: '2018/19', year: 2018 },
    { code: 'AY', label: '2020/21', year: 2020 },
  ],
};

export const absenceRatesByCharacteristicsDataSetMeta: DataSetMetaViewModel = {
  filters: [
    {
      id: '9340eb64-b912-45ac-a87a-71f16b7497b8',
      label: 'School type',
      name: 'school_type',
      options: [
        {
          id: '0d194014-8d2a-4abc-8b1f-e7ae899e8eb3',
          label: 'All',
          isAggregate: true,
        },
        {
          id: 'b936e2a5-a082-443c-a2ce-2c24195ad664',
          label: 'State-funded primary',
        },
      ],
    },
    {
      id: 'a3b0f933-2a70-49d9-a2b2-9e2dcecf2a34',
      label: 'Characteristic',
      name: 'characteristic',
      options: [
        {
          id: '1df4d473-0a9f-4171-9194-8b5ed747f87d',
          label: 'Total',
          isAggregate: true,
        },
        {
          id: '9b81021a-f60f-4d38-8816-dd3aef54de1b',
          label: 'Ethnicity Major Asian Total',
        },
        {
          id: '1020595a-308e-484c-8d39-a78c83734fe9',
          label: 'Ethnicity Major Black Total',
        },
      ],
    },
  ],
  indicators: [
    {
      id: '772c60cd-d8eb-40c8-5ae9-08da0b95637f',
      label: 'Number of authorised absence sessions',
      name: 'sess_authorised',
      unit: '',
      decimalPlaces: 0,
    },
    {
      id: 'c82070d0-d1fd-4ac2-5ae8-08da0b95637f',
      label: 'Number of overall absence sessions',
      name: 'sess_overall',
      unit: '',
      decimalPlaces: 0,
    },
  ],
  locations: countryRegionLocationMeta,
  timePeriods: [
    { code: 'AY', label: '2018/19', year: 2018 },
    { code: 'AY', label: '2020/21', year: 2020 },
  ],
};

export const permanentExclusionsDataSetMeta: DataSetMetaViewModel = {
  filters: [
    {
      id: '682a5316-150d-4814-85e0-54f319068e76',
      label: 'School type',
      name: 'school_type',
      options: [
        {
          id: '49557959-21e3-4acd-97e8-961259bbb7ee',
          label: 'All',
          isAggregate: true,
        },
      ],
    },
  ],
  indicators: [
    {
      id: '04a90197-d94f-4606-5b0b-08da6fdcfe48',
      label: 'Permanent exclusions (rate)',
      name: 'perm_excl_rate',
      unit: '%',
      decimalPlaces: 2,
    },
    {
      id: '09f59b22-1275-4922-5b0d-08da6fdcfe48',
      label: 'Suspension (rate)',
      name: 'susp_rate',
      unit: '%',
      decimalPlaces: 2,
    },
  ],
  locations: [englandLocationMeta],
  timePeriods: [
    { code: 'AY', label: '2018/19', year: 2018 },
    { code: 'AY', label: '2019/20', year: 2019 },
    { code: 'AY', label: '2020/21', year: 2020 },
  ],
};

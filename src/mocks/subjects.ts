import { SubjectViewModel } from '../schema';

export const absenceRatesSubject = createSubject({
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

export const absenceRatesByCharacteristicsSubject = createSubject({
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

export const permanentExclusionsSubject = createSubject({
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

export const pupilAbsenceSubjects = [
  absenceRatesSubject,
  absenceRatesByCharacteristicsSubject,
];

export const permanentExclusionsSubjects = [permanentExclusionsSubject];

function createSubject(subject: Omit<SubjectViewModel, '_links'>) {
  return {
    ...subject,
    _links: {
      self: {
        href: `/api/v1/subjects/${subject.id}`,
      },
      data: {
        href: `/api/v1/subjects/${subject.id}/data`,
        method: 'POST',
      },
      dataFile: {
        href: `/api/v1/subjects/${subject.id}/data-file`,
      },
      meta: {
        href: `/api/v1/subjects/${subject.id}/meta`,
      },
    },
  };
}

import slugify from 'slugify';
import { PublicationSummaryViewModel } from '../schema';

export const pupilAbsencePublication = createPublication({
  id: 'cbbd299f-8297-44bc-92ac-558bcf51f8ad',
  title: 'Pupil absence in schools in England',
});

export const permanentExclusionsPublication = createPublication({
  id: 'bf2b4284-6b84-46b0-aaaa-a2e0a23be2a9',
  title: 'Permanent exclusions and suspensions in England',
});

export const publications: PublicationSummaryViewModel[] = [
  pupilAbsencePublication,
  permanentExclusionsPublication,
];

function createPublication(
  data: Omit<PublicationSummaryViewModel, 'slug' | '_links'>
): PublicationSummaryViewModel {
  return {
    ...data,
    slug: slugify(data.title),
    _links: {
      self: {
        href: `/api/v1/publications/${data.id}`,
      },
      subjects: {
        href: `/api/v1/publications/${data.id}/subjects`,
      },
    },
  };
}

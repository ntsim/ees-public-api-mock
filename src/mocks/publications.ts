import slugify from 'slugify';
import { PublicationSummaryViewModel } from '../schema';

export const spcPublication = createPublication({
  id: '638482b6-d015-4798-a1a4-e2311253b3e1',
  title: 'Schools, pupils and their characteristics',
});

export const publications: PublicationSummaryViewModel[] = [spcPublication];

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
      dataSets: {
        href: `/api/v1/publications/${data.id}/data-sets`,
      },
    },
  };
}

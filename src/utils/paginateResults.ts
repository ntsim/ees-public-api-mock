import qs from 'qs';
import { LinkViewModel, PagingViewModel } from '../schema';

export interface Paginated<T> {
  _links: Dictionary<LinkViewModel>;
  paging: PagingViewModel;
  results: T[];
}

interface Options {
  baseUrl: string;
  page?: number;
  pageSize?: number;
}

export default function paginateResults<T>(
  results: T[],
  options: Options
): Paginated<T> {
  const { baseUrl, page = 1, pageSize = 20 } = options ?? {};

  const links: Dictionary<LinkViewModel> = {
    self: {
      href: `${baseUrl}?${qs.stringify({ page, pageSize })}`,
    },
  };

  if (page > 1) {
    links.prev = {
      href: `${baseUrl}?${qs.stringify({ page: page - 1, pageSize })}`,
    };
  }

  if (page * pageSize < results.length) {
    links.next = {
      href: `/${baseUrl}?${qs.stringify({ page: page + 1, pageSize })}`,
    };
  }

  const start = (page - 1) * pageSize;

  return {
    _links: links,
    paging: {
      page,
      pageSize,
      totalPages: pageSize > 0 ? Math.ceil(results.length / pageSize) : 0,
      totalResults: results.length,
    },
    results: results.slice(start, start + pageSize),
  };
}

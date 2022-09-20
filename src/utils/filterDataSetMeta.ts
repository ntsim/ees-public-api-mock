import { DataSetMetaViewModel } from '../schema';

interface Options {
  showFilterIds: boolean;
}

export default function filterDataSetMeta(
  { filters, ...dataSetMeta }: DataSetMetaViewModel,
  { showFilterIds }: Options
): DataSetMetaViewModel {
  return {
    ...dataSetMeta,
    filters: filters.map((filter) => {
      return {
        ...filter,
        id: showFilterIds ? filter.id : undefined,
      };
    }),
  };
}

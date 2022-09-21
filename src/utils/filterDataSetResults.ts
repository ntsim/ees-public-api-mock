import { englandLocationMeta, regionLocationMeta } from '../mocks/dataSetMeta';
import {
  ObservationViewModel,
  DataSetQuery,
  DataSetResultsViewModel,
  DataSetResultsMetaViewModel,
  LocationMetaViewModel,
} from '../schema';

const locationCodesToIds = [englandLocationMeta, ...regionLocationMeta].reduce<
  Record<string, string>
>((acc, option) => {
  acc[option.code] = option.id;
  return acc;
}, {});

export default function filterDataSetResults(
  dataSet: DataSetResultsViewModel,
  query: DataSetQuery
): DataSetResultsViewModel {
  const filteredResults: ObservationViewModel[] = dataSet.results
    .filter((observation) => {
      if (
        !observation.filterItemIds.every((filter) =>
          query.filterItems.includes(filter)
        )
      ) {
        return false;
      }

      if (
        !query.locations.some(
          (location) =>
            location === observation.locationId || locationCodesToIds[location]
        )
      ) {
        return false;
      }

      // This is incorrect filtering, but as we're not going to replicate all
      // the backend's time period logic, we'll just do this instead for now.
      if (
        observation.timePeriod.code !== query.timePeriod.startCode ||
        observation.timePeriod.code !== query.timePeriod.endCode
      ) {
        return false;
      }

      return (
        observation.timePeriod.year >= query.timePeriod.startYear &&
        observation.timePeriod.year <= query.timePeriod.endYear
      );
    })
    .map((observation) => {
      const values = Object.entries(observation.values).reduce<
        ObservationViewModel['values']
      >((acc, [indicatorId, value]) => {
        if (query.indicators.includes(indicatorId)) {
          acc[indicatorId] = value;
        }

        return acc;
      }, {});

      return {
        ...observation,
        values,
      };
    });

  return {
    ...dataSet,
    footnotes: filteredResults.length === 0 ? [] : dataSet.footnotes,
    meta: dataSet.meta ? filterMeta(dataSet.meta, filteredResults) : undefined,
    warnings:
      filteredResults.length === 0
        ? [
            'No results matched the query criteria. You may need to refine your query.',
          ]
        : undefined,
    results: filteredResults,
  };
}

function filterMeta(
  meta: DataSetResultsMetaViewModel,
  results: ObservationViewModel[]
): DataSetResultsMetaViewModel {
  const filters = meta.filters
    .map((filter) => ({
      ...filter,
      options: filter.options.filter((option) =>
        results.some((result) => result.filterItemIds.includes(option.id))
      ),
    }))
    .filter((filter) => filter.options.length > 0);

  const locations = filterLocations(meta.locations, results);

  const indicators = meta.indicators.filter((indicator) =>
    results.some((result) => !!result.values[indicator.id])
  );

  const timePeriodRange = meta.timePeriodRange.filter((timePeriod) =>
    results.some(
      (result) =>
        result.timePeriod.code === timePeriod.code &&
        result.timePeriod.year === timePeriod.year
    )
  );

  return {
    filters,
    locations,
    indicators,
    timePeriodRange,
  };
}

function filterLocations(
  locations: LocationMetaViewModel[],
  results: ObservationViewModel[]
): LocationMetaViewModel[] {
  return locations
    .map((location) => ({
      ...location,
      options: location.options
        ? filterLocations(location.options, results)
        : undefined,
    }))
    .filter(
      (location) =>
        results.some((result) => result.locationId === location.id) ||
        !!location.options?.length
    );
}

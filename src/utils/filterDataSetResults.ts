import {
  countryRegionLocationMeta,
  englandLocationMeta,
  regionLocationMeta,
} from '../mocks/dataSetMeta';
import {
  ObservationViewModel,
  DataSetQuery,
  DataSetResultsViewModel,
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
  const filteredResults = dataSet.results
    .filter((observation) => {
      if (
        !observation.filterItemIds.some((filter) =>
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
    warnings:
      filteredResults.length === 0
        ? [
            'No results matched the query criteria. You may need to refine your query.',
          ]
        : undefined,
    results: filteredResults,
  };
}

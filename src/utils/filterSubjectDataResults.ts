import {
  ObservationViewModel,
  SubjectDataQuery,
  SubjectDataViewModel,
} from '../schema';

export default function filterSubjectDataResults(
  subjectData: SubjectDataViewModel,
  query: SubjectDataQuery
): SubjectDataViewModel {
  const filteredResults = subjectData.results
    .filter((observation) => {
      if (
        !observation.filterItemIds.some((filter) =>
          query.filterItems.includes(filter)
        )
      ) {
        return false;
      }

      if (!query.locations.includes(observation.locationId)) {
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
      const measures = Object.entries(observation.measures).reduce<
        ObservationViewModel['measures']
      >((acc, [indicatorId, value]) => {
        if (query.indicators.includes(indicatorId)) {
          acc[indicatorId] = value;
        }

        return acc;
      }, {});

      return {
        ...observation,
        measures,
      };
    });

  return {
    ...subjectData,
    footnotes: filteredResults.length === 0 ? [] : subjectData.footnotes,
    results: filteredResults,
  };
}

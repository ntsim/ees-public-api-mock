import { snakeCase } from 'lodash';
import Papa from 'papaparse';
import {
  DataSetResultsMetaViewModel,
  DataSetResultsViewModel,
  LocationMetaViewModel,
  ObservationViewModel,
} from '../schema';

export default function dataSetResultsToCsv({
  meta,
  results,
}: DataSetResultsViewModel): string {
  const filterFields = meta?.filters.map((filter) => filter.name) ?? [];
  const indicatorFields =
    meta?.indicators.map((indicator) => indicator.name) ?? [];

  const locationFields = getLocationFields(meta?.locations ?? []);

  const fields = [
    ...locationFields,
    'geographic_level',
    'time_period',
    'time_identifier',
    ...filterFields,
    ...indicatorFields,
  ];

  return Papa.unparse({
    fields,
    data: getData({
      results,
      meta: meta as DataSetResultsMetaViewModel,
      fields: {
        all: fields,
        filters: filterFields,
        indicators: indicatorFields,
        locations: locationFields,
      },
    }),
  });
}

function getData({
  results,
  meta,
  fields,
}: {
  results: ObservationViewModel[];
  meta: DataSetResultsMetaViewModel;
  fields: {
    all: string[];
    filters: string[];
    indicators: string[];
    locations: string[];
  };
}): unknown[] {
  return results.map((result) =>
    fields.all.map((field) => {
      if (field === 'geographic_level') {
        return result.geographicLevel;
      }

      if (field === 'time_period') {
        return result.timePeriod.year;
      }

      if (field === 'time_identifier') {
        return result.timePeriod.code;
      }

      if (fields.filters.includes(field)) {
        const filter = meta.filters.find((filter) => filter.name === field);

        if (!filter) {
          throw new Error('Could not find matching filter for field');
        }

        return (
          filter.options.find((option) =>
            result.filterItemIds.includes(option.id)
          )?.label ?? ''
        );
      }

      if (fields.locations.includes(field)) {
        const level = field.replace('_code', '').replace('_', '').toLowerCase();

        const locationPath = findLocationPath(result, meta.locations);
        const location = locationPath.find(
          (part) => part.level.toLowerCase() === level
        );

        if (!location) {
          return '';
        }

        return field.endsWith('_code') ? location.code : location.label;
      }

      if (fields.indicators.includes(field)) {
        const indicator = meta.indicators.find((i) => i.name === field);

        if (!indicator) {
          throw new Error('Could not find matching indicator for field');
        }

        return result.values[indicator.id];
      }

      return '';
    })
  );
}

function findLocationPath(
  result: ObservationViewModel,
  locations: LocationMetaViewModel[]
): LocationMetaViewModel[] {
  return locations.reduce<LocationMetaViewModel[]>((acc, location) => {
    if (location.id === result.locationId) {
      return [location];
    }

    if (!location.options) {
      return acc;
    }

    const nextPath = findLocationPath(result, location.options);

    if (nextPath.length > 0) {
      acc.push(location, ...nextPath);
    }

    return acc;
  }, []);
}

function getLocationFields(locations: LocationMetaViewModel[]): string[] {
  const [firstLocation] = locations;
  const level = snakeCase(firstLocation.level);
  const fields = [level, `${level}_code`];

  if (firstLocation.options) {
    return [...fields, ...getLocationFields(firstLocation.options)];
  }

  return fields;
}

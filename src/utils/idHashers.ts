import Hashids from 'hashids';

export function createLocationIdHasher(): Hashids {
  return new Hashids('locations', 16);
}

export function createFilterIdHasher(): Hashids {
  return new Hashids('filters', 16);
}

export function createIndicatorIdHasher(): Hashids {
  return new Hashids('indicators', 16);
}

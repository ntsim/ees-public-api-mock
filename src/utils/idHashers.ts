import Hashids from 'hashids';

export function createLocationIdHasher(): Hashids {
  return new Hashids('locations', 8);
}

export function createFilterIdHasher(): Hashids {
  return new Hashids('filters', 8);
}

export function createIndicatorIdHasher(): Hashids {
  return new Hashids('indicators', 8);
}

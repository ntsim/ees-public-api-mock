import { GeographicLevel } from '../schema';

export interface DataRow {
  time_period: number;
  time_identifier: string;
  geographic_level: string;
  [column: string]: string | number;
}

export interface TimePeriod {
  year: number;
  identifier: string;
}

export interface Location {
  geographic_level: GeographicLevel;
  [column: string]: string;
}

export interface Filter {
  id: number;
  label: string;
  group_label: string;
  group_name: string;
  group_hint: string | null;
  is_aggregate: boolean | null;
}

export interface Indicator {
  id: number;
  label: string;
  name: string;
  decimal_places: number | null;
  unit: string | null;
}

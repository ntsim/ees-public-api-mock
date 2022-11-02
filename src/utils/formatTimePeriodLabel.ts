import { TimePeriodCode } from '../schema';
import formatTimePeriodYearLabel from './formatTimePeriodYearLabel';
import { timePeriodCodeIdentifiers } from './timePeriodConstants';

export default function formatTimePeriodLabel(
  code: TimePeriodCode,
  year: number
): string {
  const yearLabel = formatTimePeriodYearLabel(code, year);

  switch (code) {
    case 'AY':
    case 'CY':
    case 'FY':
    case 'RY':
    case 'TY':
      return yearLabel;
    case 'AYQ1':
    case 'CYQ1':
    case 'FYQ1':
    case 'TYQ1':
      return `${yearLabel} Q1`;
    case 'AYQ2':
    case 'CYQ2':
    case 'FYQ2':
    case 'TYQ2':
      return `${yearLabel} Q2`;
    case 'AYQ3':
    case 'CYQ3':
    case 'FYQ3':
    case 'TYQ3':
      return `${yearLabel} Q3`;
    case 'AYQ4':
    case 'CYQ4':
    case 'FYQ4':
    case 'TYQ4':
      return `${yearLabel} Q4`;
    case 'P1':
      return `${yearLabel} Part 1 (Apr to Sep)`;
    case 'P2':
      return `${yearLabel} Part 2 (Oct to Mar)`;
    case 'T1':
      return `${yearLabel} Autumn term`;
    case 'T1T2':
      return `${yearLabel} Autumn and Spring term`;
    case 'T2':
      return `${yearLabel} Spring term`;
    case 'T3':
      return `${yearLabel} Summer term`;
    default:
      return `${yearLabel} ${timePeriodCodeIdentifiers[code]}`;
  }
}

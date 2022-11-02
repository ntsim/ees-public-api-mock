import { TimePeriodCode } from '../schema';

export default function formatTimePeriodYearLabel(
  code: TimePeriodCode,
  year: number
): string {
  const fourDigitYear = year.toString().slice(0, 4);
  const twoDigitYear = fourDigitYear.slice(2);
  const twoDigitNextYear =
    Number(twoDigitYear) + 1 >= 100 ? '00' : `${Number(twoDigitYear) + 1}`;

  switch (code) {
    case 'AY':
    case 'AYQ1':
    case 'AYQ2':
    case 'AYQ3':
    case 'AYQ4':
    case 'T1':
    case 'T1T2':
    case 'T2':
    case 'T3':
      return `${fourDigitYear}/${twoDigitNextYear}`;
    case 'P1':
    case 'P2':
    case 'FY':
    case 'FYQ1':
    case 'FYQ2':
    case 'FYQ3':
    case 'FYQ4':
    case 'TY':
    case 'TYQ1':
    case 'TYQ2':
    case 'TYQ3':
    case 'TYQ4':
      return `${fourDigitYear}-${twoDigitNextYear}`;
    default:
      return fourDigitYear;
  }
}

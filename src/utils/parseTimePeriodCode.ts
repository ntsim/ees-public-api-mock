import { TimePeriodCode } from '../schema';

export default function parseTimePeriodCode(
  identifier: string
): TimePeriodCode {
  switch (identifier) {
    case 'Academic year':
      return 'AY';
    default:
      throw new Error(`Invalid time identifier: ${identifier}`);
  }
}

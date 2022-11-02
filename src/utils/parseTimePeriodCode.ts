import { invert } from 'lodash';
import { TimePeriodCode } from '../schema';
import { timePeriodCodeIdentifiers } from './timePeriodConstants';

const identifierCodes = invert(
  timePeriodCodeIdentifiers
) as Dictionary<TimePeriodCode>;

export default function parseTimePeriodCode(
  identifier: string
): TimePeriodCode {
  const timePeriodCode = identifierCodes[identifier];

  if (!timePeriodCode) {
    throw new Error(`Invalid time identifier: ${identifier}`);
  }

  return timePeriodCode;
}

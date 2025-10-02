import {parseTimeString} from './parse-time-string';

/**
 * Converts a time input to days for internal use.
 * Supports backwards compatibility with existing day-based inputs.
 * 
 * @param timeInput The time input (could be a number for days or string for flexible time)
 * @returns The equivalent number of days as a float
 */
export function parseTimeTodays(timeInput: string | number): number {
  if (typeof timeInput === 'number') {
    return timeInput;
  }
  
  if (typeof timeInput === 'string') {
    return parseTimeString(timeInput);
  }
  
  throw new Error('Time input must be a string or number');
}
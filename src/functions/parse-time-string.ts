/**
 * Parses a time string and returns the equivalent number of days.
 * Supports the following units:
 * - d or days: days
 * - h or hours: hours
 * - m or minutes: minutes
 * 
 * Examples:
 * - "1d" or "1 day" = 1 day
 * - "20h" or "20 hours" = 20/24 days
 * - "50m" or "50 minutes" = 50/(24*60) days
 * - "1.5d" = 1.5 days
 * - "30" = 30 days (backwards compatibility)
 * 
 * @param timeString The time string to parse
 * @returns The equivalent number of days as a float
 * @throws Error if the time string format is invalid
 */
export function parseTimeString(timeString: string): number {
  if (!timeString || timeString.trim() === '') {
    throw new Error('Time string cannot be empty');
  }

  const trimmed = timeString.trim();
  
  // Handle backwards compatibility - if it's just a number, treat as days
  const numberOnlyMatch = trimmed.match(/^-?\d+(\.\d+)?$/);
  if (numberOnlyMatch) {
    return parseFloat(trimmed);
  }

  // Parse time string with units
  const timeRegex = /^(-?\d+(?:\.\d+)?)\s*(d|day|days|h|hour|hours|m|min|minute|minutes)$/i;
  const match = trimmed.match(timeRegex);

  if (!match) {
    throw new Error(`Invalid time format: "${timeString}". Expected format: number followed by unit (d, h, m) or just a number for days. Examples: "1d", "20h", "50m", "1.5d"`);
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (isNaN(value)) {
    throw new Error(`Invalid numeric value: "${match[1]}"`);
  }

  switch (unit) {
    case 'd':
    case 'day':
    case 'days':
      return value;
    case 'h':
    case 'hour':
    case 'hours':
      return value / 24;
    case 'm':
    case 'min':
    case 'minute':
    case 'minutes':
      return value / (24 * 60);
    default:
      throw new Error(`Unsupported time unit: "${unit}"`);
  }
}

/**
 * Converts a number of days to milliseconds for time comparisons
 * @param days The number of days (can be fractional)
 * @returns The equivalent number of milliseconds
 */
export function daysToMilliseconds(days: number): number {
  return days * 24 * 60 * 60 * 1000;
}
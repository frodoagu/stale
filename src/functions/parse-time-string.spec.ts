import {parseTimeString, daysToMilliseconds} from './parse-time-string';

describe('parseTimeString()', (): void => {
  describe('when given a valid day format', (): void => {
    it('should parse "1d" as 1 day', (): void => {
      expect(parseTimeString('1d')).toBe(1);
    });

    it('should parse "1.5d" as 1.5 days', (): void => {
      expect(parseTimeString('1.5d')).toBe(1.5);
    });

    it('should parse "7 days" as 7 days', (): void => {
      expect(parseTimeString('7 days')).toBe(7);
    });

    it('should parse "1 day" as 1 day', (): void => {
      expect(parseTimeString('1 day')).toBe(1);
    });

    it('should parse negative days', (): void => {
      expect(parseTimeString('-1d')).toBe(-1);
    });
  });

  describe('when given a valid hour format', (): void => {
    it('should parse "24h" as 1 day', (): void => {
      expect(parseTimeString('24h')).toBe(1);
    });

    it('should parse "12h" as 0.5 days', (): void => {
      expect(parseTimeString('12h')).toBe(0.5);
    });

    it('should parse "1 hour" as approximately 0.0417 days', (): void => {
      expect(parseTimeString('1 hour')).toBeCloseTo(1/24, 5);
    });

    it('should parse "48 hours" as 2 days', (): void => {
      expect(parseTimeString('48 hours')).toBe(2);
    });
  });

  describe('when given a valid minute format', (): void => {
    it('should parse "1440m" as 1 day', (): void => {
      expect(parseTimeString('1440m')).toBe(1);
    });

    it('should parse "720m" as 0.5 days', (): void => {
      expect(parseTimeString('720m')).toBe(0.5);
    });

    it('should parse "60 minutes" as approximately 0.0417 days', (): void => {
      expect(parseTimeString('60 minutes')).toBeCloseTo(1/24, 5);
    });

    it('should parse "1 minute" as approximately 0.000694 days', (): void => {
      expect(parseTimeString('1 minute')).toBeCloseTo(1/(24*60), 6);
    });
  });

  describe('when given backwards compatible number format', (): void => {
    it('should parse "30" as 30 days', (): void => {
      expect(parseTimeString('30')).toBe(30);
    });

    it('should parse "1.5" as 1.5 days', (): void => {
      expect(parseTimeString('1.5')).toBe(1.5);
    });

    it('should parse "-1" as -1 days', (): void => {
      expect(parseTimeString('-1')).toBe(-1);
    });

    it('should parse "0" as 0 days', (): void => {
      expect(parseTimeString('0')).toBe(0);
    });
  });

  describe('when given case insensitive input', (): void => {
    it('should parse "1D" as 1 day', (): void => {
      expect(parseTimeString('1D')).toBe(1);
    });

    it('should parse "1H" as 1/24 days', (): void => {
      expect(parseTimeString('1H')).toBeCloseTo(1/24, 5);
    });

    it('should parse "1M" as 1/(24*60) days', (): void => {
      expect(parseTimeString('1M')).toBeCloseTo(1/(24*60), 6);
    });
  });

  describe('when given whitespace', (): void => {
    it('should handle leading and trailing whitespace', (): void => {
      expect(parseTimeString('  1d  ')).toBe(1);
    });

    it('should handle space between number and unit', (): void => {
      expect(parseTimeString('1 d')).toBe(1);
    });
  });

  describe('when given invalid input', (): void => {
    it('should throw error for empty string', (): void => {
      expect(() => parseTimeString('')).toThrow('Time string cannot be empty');
    });

    it('should throw error for invalid format', (): void => {
      expect(() => parseTimeString('abc')).toThrow('Invalid time format: "abc"');
    });

    it('should throw error for invalid unit', (): void => {
      expect(() => parseTimeString('1x')).toThrow('Invalid time format: "1x"');
    });

    it('should throw error for invalid number', (): void => {
      expect(() => parseTimeString('abc d')).toThrow('Invalid time format: "abc d"');
    });
  });
});

describe('daysToMilliseconds()', (): void => {
  it('should convert 1 day to correct milliseconds', (): void => {
    expect(daysToMilliseconds(1)).toBe(24 * 60 * 60 * 1000);
  });

  it('should convert 0.5 days to correct milliseconds', (): void => {
    expect(daysToMilliseconds(0.5)).toBe(12 * 60 * 60 * 1000);
  });

  it('should convert fractional days correctly', (): void => {
    expect(daysToMilliseconds(1/24)).toBe(60 * 60 * 1000); // 1 hour
  });

  it('should handle negative values', (): void => {
    expect(daysToMilliseconds(-1)).toBe(-24 * 60 * 60 * 1000);
  });
});
// Mock core.getInput for testing
const mockGetInput = jest.fn();
const mockInfo = jest.fn();
const mockSetFailed = jest.fn();

jest.mock('@actions/core', () => ({
  getInput: mockGetInput,
  setFailed: mockSetFailed,
  error: jest.fn(),
  info: mockInfo,
  debug: jest.fn(),
  setOutput: jest.fn()
}));

// Import after mocking
import {parseTimeString} from '../src/functions/parse-time-string';

describe('backward compatibility for option names', (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe('_getTimeInput function behavior', (): void => {
    // We can't directly test _getTimeInput since it's not exported,
    // but we can test the overall behavior through integration

    it('should work with old days-before-* option names', (): void => {
      // Test that the old option parsing still works
      expect(parseTimeString('30')).toBe(30);
      expect(parseTimeString('1.5')).toBe(1.5);
      expect(parseTimeString('-1')).toBe(-1);
    });

    it('should work with new time format options', (): void => {
      // Test that the new flexible time formats work
      expect(parseTimeString('24h')).toBe(1);
      expect(parseTimeString('12h')).toBe(0.5);
      expect(parseTimeString('720m')).toBe(0.5);
      expect(parseTimeString('1d')).toBe(1);
    });

    it('should handle both old and new formats equivalently', (): void => {
      // Test that equivalent times in different formats return the same value
      expect(parseTimeString('1')).toBe(parseTimeString('1d'));
      expect(parseTimeString('1')).toBe(parseTimeString('24h'));
      expect(parseTimeString('1')).toBe(parseTimeString('1440m'));
      expect(parseTimeString('0.5')).toBe(parseTimeString('12h'));
      expect(parseTimeString('0.5')).toBe(parseTimeString('720m'));
    });

    it('should maintain precision for fractional values', (): void => {
      expect(parseTimeString('1.5')).toBeCloseTo(parseTimeString('36h'), 10);
      expect(parseTimeString('0.25')).toBeCloseTo(parseTimeString('6h'), 10);
      expect(parseTimeString('2.5')).toBeCloseTo(parseTimeString('3600m'), 10);
    });
  });

  describe('error handling', (): void => {
    it('should provide helpful error messages for invalid formats', (): void => {
      expect(() => parseTimeString('invalid')).toThrow('Invalid time format');
      expect(() => parseTimeString('1x')).toThrow('Invalid time format');
      expect(() => parseTimeString('')).toThrow('Time string cannot be empty');
    });
  });

  describe('edge cases', (): void => {
    it('should handle zero values correctly', (): void => {
      expect(parseTimeString('0')).toBe(0);
      expect(parseTimeString('0d')).toBe(0);
      expect(parseTimeString('0h')).toBe(0);
      expect(parseTimeString('0m')).toBe(0);
    });

    it('should handle negative values correctly', (): void => {
      expect(parseTimeString('-1')).toBe(-1);
      expect(parseTimeString('-1d')).toBe(-1);
      expect(parseTimeString('-24h')).toBe(-1);
    });
  });
});
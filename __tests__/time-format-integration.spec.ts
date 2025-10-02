import {parseTimeString} from '../src/functions/parse-time-string';

// Mock core.getInput for testing
const mockGetInput = jest.fn();
jest.mock('@actions/core', () => ({
  getInput: mockGetInput,
  setFailed: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  setOutput: jest.fn()
}));

// Test the time parsing integration
describe('time format integration', (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  describe('parseTimeString integration', (): void => {
    it('should handle day format correctly', (): void => {
      expect(parseTimeString('1d')).toBe(1);
      expect(parseTimeString('30')).toBe(30);
    });

    it('should handle hour format correctly', (): void => {
      expect(parseTimeString('24h')).toBe(1);
      expect(parseTimeString('12h')).toBe(0.5);
    });

    it('should handle minute format correctly', (): void => {
      expect(parseTimeString('1440m')).toBe(1);
      expect(parseTimeString('720m')).toBe(0.5);
    });

    it('should maintain backwards compatibility', (): void => {
      // Old format - just numbers representing days
      expect(parseTimeString('7')).toBe(7);
      expect(parseTimeString('1.5')).toBe(1.5);
      expect(parseTimeString('-1')).toBe(-1);
    });

    it('should convert various time units to equivalent days', (): void => {
      // 1 day = 24 hours = 1440 minutes
      expect(parseTimeString('1d')).toBe(parseTimeString('24h'));
      expect(parseTimeString('1d')).toBe(parseTimeString('1440m'));
      expect(parseTimeString('24h')).toBe(parseTimeString('1440m'));
    });

    it('should handle fractional values correctly', (): void => {
      expect(parseTimeString('0.5d')).toBe(0.5);
      expect(parseTimeString('12h')).toBe(0.5);
      expect(parseTimeString('720m')).toBe(0.5);
    });

    it('should be case insensitive', (): void => {
      expect(parseTimeString('1D')).toBe(parseTimeString('1d'));
      expect(parseTimeString('1H')).toBe(parseTimeString('1h'));
      expect(parseTimeString('1M')).toBe(parseTimeString('1m'));
    });

    it('should handle various unit spellings', (): void => {
      expect(parseTimeString('1 day')).toBe(parseTimeString('1d'));
      expect(parseTimeString('1 days')).toBe(parseTimeString('1d'));
      expect(parseTimeString('1 hour')).toBe(parseTimeString('1h'));
      expect(parseTimeString('1 hours')).toBe(parseTimeString('1h'));
      expect(parseTimeString('1 minute')).toBe(parseTimeString('1m'));
      expect(parseTimeString('1 minutes')).toBe(parseTimeString('1m'));
    });
  });
});
/* eslint-env jest */
import { parseRootMargin } from '../src/utils';

describe('parseRootMargin', () => {
  test('throws when using wrong units', () => {
    expect(() => parseRootMargin('10')).toThrowErrorMatchingSnapshot();
    expect(() => parseRootMargin('10% 10')).toThrowErrorMatchingSnapshot();
  });

  test('returns rootMargins with all four values', () => {
    expect(parseRootMargin()).toBe('0px 0px 0px 0px');
    expect(parseRootMargin('')).toBe('0px 0px 0px 0px');
    expect(parseRootMargin('10px 5px 0%')).toBe('10px 5px 0% 5px');
  });
});

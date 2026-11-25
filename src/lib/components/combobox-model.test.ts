import { describe, expect, it } from 'vitest';
import { filterOptions, stepIndex } from './combobox-model';

const options = [
  { value: 'lisbon', label: 'Lisbon' },
  { value: 'london', label: 'London' },
  { value: 'lucerne', label: 'Lucerne' }
];

describe('filterOptions', () => {
  it('returns every option for an empty query', () => {
    expect(filterOptions(options, '')).toEqual(options);
  });

  it('matches case-insensitively and trims the query', () => {
    expect(filterOptions(options, '  LIS  ')).toEqual([options[0]]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterOptions(options, 'xyz')).toEqual([]);
  });
});

describe('stepIndex', () => {
  it('starts at the first option when nothing is active and moving forward', () => {
    expect(stepIndex(-1, 3, 1)).toBe(0);
  });

  it('starts at the last option when nothing is active and moving back', () => {
    expect(stepIndex(-1, 3, -1)).toBe(2);
  });

  it('wraps forward from the last option', () => {
    expect(stepIndex(2, 3, 1)).toBe(0);
  });

  it('wraps back from the first option', () => {
    expect(stepIndex(0, 3, -1)).toBe(2);
  });

  it('returns -1 for an empty list', () => {
    expect(stepIndex(0, 0, 1)).toBe(-1);
  });
});

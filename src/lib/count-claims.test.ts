import { describe, expect, it } from 'vitest';
import componentsPage from '../routes/components/+page.svelte?raw';
import homePage from '../routes/+page.svelte?raw';
import readme from '../../README.md?raw';
import indexSource from './index.ts?raw';

const COMPONENT_EXPORT = /^export \{ default as \w+ \} from '\.\/components\/[^']+\.svelte';$/gm;

export function exportedComponentCount(source: string): number {
  return source.match(COMPONENT_EXPORT)?.length ?? 0;
}

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};
const SMALL: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

export function claimsIn(text: string): number[] {
  const normalised = text.replace(/[-\u2010-\u2015]/g, ' ').replace(/\s+/g, ' ');
  const re = /\b([a-z]+)(?:\s+([a-z]+))?\s+Svelte 5 components\b/gi;
  const out: number[] = [];
  for (const m of normalised.matchAll(re)) {
    const tens = TENS[m[1].toLowerCase()];
    if (tens === undefined) continue;
    const ones = m[2] ? SMALL[m[2].toLowerCase()] : 0;
    if (m[2] && ones === undefined) continue;
    out.push(tens + (ones ?? 0));
  }
  return out;
}

describe('count claims', () => {
  it('derives the exported component count from index.ts', () => {
    const count = exportedComponentCount(indexSource);
    expect(count).toBeGreaterThan(20);

    expect(
      exportedComponentCount(
        "export { default as Component } from './components/Component.svelte';\nexport type Token = string;"
      )
    ).toBe(1);

    expect(
      exportedComponentCount(
        "export { default as Field } from './components/forms/Field.svelte';"
      )
    ).toBe(1);
  });

  it('finds all five hand-maintained claim sites', () => {
    expect(claimsIn(readme)).toHaveLength(2);
    expect(claimsIn(homePage)).toHaveLength(2);
    expect(claimsIn(componentsPage)).toHaveLength(1);
  });

  it('every claim equals the derived count', () => {
    const count = exportedComponentCount(indexSource);
    for (const [file, text] of [
      ['README.md', readme],
      ['src/routes/+page.svelte', homePage],
      ['src/routes/components/+page.svelte', componentsPage],
    ] as const) {
      const claims = claimsIn(text);
      expect(claims.length, file).toBeGreaterThan(0);
      for (const claim of claims) expect(claim, file).toBe(count);
    }
  });

  it('word parser maps the two neighbouring counts and rejects a bare small word', () => {
    expect(claimsIn('Twenty-two Svelte 5 components')).toEqual([22]);
    expect(claimsIn('twenty-three Svelte 5 components')).toEqual([23]);
    expect(claimsIn('Twenty-Three Svelte 5 components')).toEqual([23]);
    expect(claimsIn('Twenty  three Svelte 5 components')).toEqual([23]);
    expect(claimsIn('Twenty\u2013three Svelte 5 components')).toEqual([23]);
    expect(claimsIn('three Svelte 5 components')).toEqual([]);
  });
});

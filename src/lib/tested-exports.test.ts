import { describe, expect, it } from 'vitest';
import indexSource from './index.ts?raw';

const COMPONENT_EXPORT = /^export \{ default as (\w+) \} from '\.\/components\/[^']+\.svelte';$/gm;

export function exportedComponentNames(source: string): string[] {
  return [...source.matchAll(COMPONENT_EXPORT)].map((match) => match[1]);
}

const testFiles = import.meta.glob('./components/*.test.ts');

export function testFileNames(keys: string[]): string[] {
  return keys.map((key) => key.replace('./components/', '').replace('.test.ts', ''));
}

// The measured property is a sibling test file, not coverage depth. None of
// these names is imported by any test file, so the proxy and "uncovered" agree
// today. A name leaves this list when it gains its own file.
export const WITHOUT_SIBLING_TEST = ['Alert', 'AppShell', 'Badge', 'Card', 'Input', 'Select', 'Stat'];

describe('sibling test files', () => {
  it('derives more than twenty component export names from index.ts', () => {
    expect(exportedComponentNames(indexSource).length).toBeGreaterThan(20);
  });

  it('reports exactly the documented set without a sibling test', () => {
    const exports = exportedComponentNames(indexSource);
    const withSibling = new Set(testFileNames(Object.keys(testFiles)));
    const withoutSibling = exports.filter((name) => !withSibling.has(name)).sort();

    expect(withoutSibling).toEqual([...WITHOUT_SIBLING_TEST].sort());
  });

  it('reports a new export without a sibling test instead of hiding it', () => {
    const synthetic = "export { default as NewThing } from './components/NewThing.svelte';";
    const withSibling = new Set(testFileNames(Object.keys(testFiles)));
    const withoutSibling = exportedComponentNames(synthetic).filter((name) => !withSibling.has(name));

    expect(withoutSibling).toEqual(['NewThing']);
  });

  it('keeps every allowlisted name a current export', () => {
    const exports = new Set(exportedComponentNames(indexSource));

    expect(WITHOUT_SIBLING_TEST.filter((name) => !exports.has(name))).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import changelog from '../../CHANGELOG.md?raw';
import packageSource from '../../package.json?raw';

const version: string = JSON.parse(packageSource).version;

interface Section {
  name: string;
  date: string | undefined;
}

// Every `## [name]` heading, with its date when one is present. A heading that
// loses its date still lands here, so the assertions below can see it.
const sections: Section[] = [
  ...changelog.matchAll(/^## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?$/gm)
].map((match) => ({ name: match[1], date: match[2] }));

const released = sections.filter((section) => section.name !== 'Unreleased');

function compare(left: string, right: string): number {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);

  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }

  return 0;
}

describe('version claims', () => {
  it('names the package version as the top released, dated section', () => {
    expect(released[0]?.name).toBe(version);
    expect(released[0]?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('shapes, dates, de-duplicates and orders every released section', () => {
    const names = released.map((section) => section.name);

    expect(names.every((name) => /^\d+\.\d+\.\d+$/.test(name))).toBe(true);
    expect(released.every((section) => section.date !== undefined)).toBe(true);
    expect(new Set(names).size).toBe(names.length);
    // Asserting the shape first keeps a malformed name out of the comparator.
    expect(names).toEqual([...names].sort((left, right) => compare(right, left)));
  });
});

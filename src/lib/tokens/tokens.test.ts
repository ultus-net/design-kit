import { describe, expect, it } from 'vitest';
import tokens from './tokens.json';

interface TokenLeaf {
  value: string;
  status: string;
}

interface Mode {
  tokens: Record<string, TokenLeaf>;
}

interface Profile {
  id: string;
  label: string;
  source: string;
  modes: Record<string, Mode>;
}

interface CornerPreset {
  id: string;
  label: string;
  source: string;
  tokens: Record<string, TokenLeaf>;
}

// JSON imports are literal types, which cannot be indexed by runtime strings.
const document = tokens as unknown as {
  meta: { defaultProfile: string; defaultCorners: string };
  profiles: Record<string, Profile>;
  corners: Record<string, CornerPreset>;
};

const defaultProfile = document.profiles[document.meta.defaultProfile];

function tokenKeys(mode: Mode): string[] {
  return Object.keys(mode.tokens).sort();
}

function eachTokenLeaf(profile: Profile): Array<[string, TokenLeaf]> {
  return Object.entries(profile.modes).flatMap(([modeName, mode]) =>
    Object.entries(mode.tokens).map(
      ([tokenName, leaf]) => [`${profile.id}.${modeName}.${tokenName}`, leaf] as [string, TokenLeaf]
    )
  );
}

describe('tokens.json', () => {
  it('defaults to blueprint', () => {
    expect(document.meta.defaultProfile).toBe('blueprint');
    expect(Object.keys(document.profiles)).toContain('blueprint');
  });

  it('every profile is complete', () => {
    for (const [key, profile] of Object.entries(document.profiles)) {
      expect(profile.id).toBe(key);
      expect(profile.label.length).toBeGreaterThan(0);
      expect(profile.source.length).toBeGreaterThan(0);
      expect(profile.modes.light).toBeTruthy();
      expect(profile.modes.dark).toBeTruthy();
      expect(profile.modes.light.tokens).toBeTruthy();
      expect(profile.modes.dark.tokens).toBeTruthy();
    }
  });

  it('all profiles share one token set', () => {
    const reference = tokenKeys(defaultProfile.modes.light);

    for (const profile of Object.values(document.profiles)) {
      for (const mode of Object.values(profile.modes)) {
        expect(tokenKeys(mode)).toEqual(reference);
      }
    }
  });

  it('every leaf carries a value and a status', () => {
    for (const profile of Object.values(document.profiles)) {
      for (const [path, leaf] of eachTokenLeaf(profile)) {
        expect(typeof leaf, path).toBe('object');
        expect(typeof leaf.value, path).toBe('string');
        expect(leaf.value, path).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(['extracted', 'derived'], path).toContain(leaf.status);
      }
    }
  });

  it('every corner preset carries one radius scale', () => {
    const reference = Object.keys(document.corners[document.meta.defaultCorners].tokens).sort();

    for (const [key, preset] of Object.entries(document.corners)) {
      expect(preset.id).toBe(key);
      expect(Object.keys(preset.tokens).sort()).toEqual(reference);

      for (const [name, leaf] of Object.entries(preset.tokens)) {
        const path = `${key}.${name}`;
        expect(typeof leaf.value, path).toBe('string');
        expect(leaf.value, path).toMatch(/^[0-9]+(px|%)$/);
        expect(leaf.status, path).toBe('derived');
      }
    }

    for (const leaf of Object.values(document.corners.sharp.tokens)) {
      expect(leaf.value).toBe('0px');
    }
  });
});

import { getContext, setContext } from 'svelte';
import tokens from '$lib/tokens/tokens.json';

export type ModeId = 'light' | 'dark';

export const modes: { id: ModeId; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' }
];

export const profiles = Object.entries(tokens.profiles).map(([id, entry]) => ({
  id,
  label: entry.label
}));

export const defaultProfile: string = tokens.meta.defaultProfile;

export const cornerPresets = Object.entries(tokens.corners).map(([id, entry]) => ({
  id,
  label: entry.label
}));

export const defaultCorners: string = tokens.meta.defaultCorners;

export interface Chrome {
  mode: ModeId;
  profile: string;
  corners: string;
}

const key = Symbol('chrome');

export function setChrome(): Chrome {
  const chrome = $state<Chrome>({ mode: 'light', profile: defaultProfile, corners: defaultCorners });
  setContext(key, chrome);
  return chrome;
}

export function getChrome(): Chrome {
  const chrome = getContext<Chrome | undefined>(key);
  if (!chrome) throw new Error('Chrome context is missing. Render this inside the docs layout.');
  return chrome;
}

export const isMode = (value: string | null): value is ModeId => value === 'light' || value === 'dark';

export const isProfile = (value: string | null): value is string =>
  value !== null && Object.hasOwn(tokens.profiles, value);

export const isCornerPreset = (value: string | null): value is string =>
  value !== null && Object.hasOwn(tokens.corners, value);

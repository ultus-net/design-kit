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

export const chrome = $state<{ mode: ModeId; profile: string }>({
  mode: 'light',
  profile: defaultProfile
});

export const isMode = (value: string | null): value is ModeId => value === 'light' || value === 'dark';

export const isProfile = (value: string | null): value is string =>
  value !== null && Object.hasOwn(tokens.profiles, value);

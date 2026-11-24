import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const tokens = JSON.parse(await readFile(join(root, 'src/lib/tokens/tokens.json'), 'utf8'));

const toRgb = (hex) => {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(clean)) throw new Error(`Not a 6-digit hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16) / 255);
};

const channel = (value) =>
  value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

// Channels normalized to 0-1 before linearisation
const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrast = (foreground, background) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

const failures = [];
const rows = [];

const compare = (label, foreground, background, minimum) => {
  const ratio = contrast(foreground, background);
  const pass = ratio >= minimum;
  const row = { label, foreground, background, minimum, ratio, pass };
  rows.push(row);
  if (!pass) {
    failures.push(`${label}: ${ratio.toFixed(2)} < ${minimum} (${foreground} on ${background})`);
  }
  return row;
};

const themePairs = [
  ['text', 'page', 4.5],
  ['text', 'raised', 4.5],
  ['text', 'sunken', 4.5],
  ['text-muted', 'page', 4.5],
  ['text-muted', 'raised', 4.5],
  ['link', 'page', 4.5],
  ['on-accent', 'accent', 4.5],
  ['on-accent', 'accent-hover', 4.5],
  ['on-danger', 'danger', 4.5],
  ['chrome-text', 'chrome', 4.5],
  ['accent-strong', 'page', 3],
  ['border', 'page', 3],
  ['border', 'raised', 3],
  ['border', 'sunken', 3],
  ['focus', 'page', 3],
  ['text', 'accent-tint', 4.5],
  ['success', 'page', 4.5],
  ['success', 'raised', 4.5],
  ['success', 'success-tint', 4.5],
  ['warning', 'page', 4.5],
  ['warning', 'raised', 4.5],
  ['warning', 'warning-tint', 4.5],
  ['danger', 'page', 4.5],
  ['danger', 'raised', 4.5],
  ['danger', 'danger-tint', 4.5],
  ['info', 'page', 4.5],
  ['info', 'raised', 4.5],
  ['info', 'info-tint', 4.5],
  ['review', 'page', 4.5],
  ['review', 'raised', 4.5],
  ['review', 'review-tint', 4.5]
];

const defaultId = tokens.meta.defaultProfile;
const defaultNames = Object.keys(tokens.profiles[defaultId]?.modes?.light?.tokens ?? {});

if (Object.keys(tokens.profiles).length > 0 && !tokens.profiles[defaultId]) {
  failures.push(`meta.defaultProfile: no profile named ${defaultId}`);
}

for (const [id, profile] of Object.entries(tokens.profiles)) {
  if (!profile.source) failures.push(`${id}: missing source`);
  if (!profile.label) failures.push(`${id}: missing label`);
  if (profile.id !== id) failures.push(`${id}: id ${profile.id} does not match the profile key`);
  for (const mode of ['light', 'dark']) {
    const names = Object.keys(profile.modes?.[mode]?.tokens ?? {});
    if (names.length === 0) {
      failures.push(`${id} ${mode}: missing tokens`);
      continue;
    }
    const missing = defaultNames.filter((name) => !names.includes(name));
    const extra = names.filter((name) => !defaultNames.includes(name));
    if (missing.length > 0) failures.push(`${id} ${mode}: missing names ${missing.join(', ')}`);
    if (extra.length > 0) failures.push(`${id} ${mode}: unexpected names ${extra.join(', ')}`);
  }
  const lightNames = Object.keys(profile.modes?.light?.tokens ?? {});
  const darkNames = Object.keys(profile.modes?.dark?.tokens ?? {});
  const onlyLight = lightNames.filter((name) => !darkNames.includes(name));
  const onlyDark = darkNames.filter((name) => !lightNames.includes(name));
  if (onlyLight.length > 0) failures.push(`${id}: light only names ${onlyLight.join(', ')}`);
  if (onlyDark.length > 0) failures.push(`${id}: dark only names ${onlyDark.join(', ')}`);
}

const profileStats = new Map();
for (const [id, profile] of Object.entries(tokens.profiles)) {
  const stats = { pairs: 0, failures: 0, min: { light: Infinity, dark: Infinity } };
  profileStats.set(id, stats);
  for (const mode of ['light', 'dark']) {
    const values = profile.modes?.[mode]?.tokens ?? {};
    for (const [foregroundName, backgroundName, minimum] of themePairs) {
      const foreground = values[foregroundName]?.value;
      const background = values[backgroundName]?.value;
      if (!foreground || !background) {
        failures.push(`${id} ${mode}: missing ${foregroundName} or ${backgroundName}`);
        continue;
      }
      const row = compare(`${id} ${mode} ${foregroundName}/${backgroundName}`, foreground, background, minimum);
      stats.pairs += 1;
      if (!row.pass) stats.failures += 1;
      if (row.ratio < stats.min[mode]) stats.min[mode] = row.ratio;
    }
  }
}

for (const row of rows) {
  const mark = row.pass ? 'PASS' : 'FAIL';
  console.log(
    `${mark} ${row.ratio.toFixed(2).padStart(5)}:1  min ${row.minimum}  ${row.label}  (${row.foreground} on ${row.background})`
  );
}

for (const [id, stats] of profileStats) {
  const minimum = (mode) => (Number.isFinite(stats.min[mode]) ? stats.min[mode].toFixed(2) : 'n/a');
  console.log(
    `${id}: ${stats.pairs} pairs, ${stats.failures} failures (light min ${minimum('light')}, dark min ${minimum('dark')})`
  );
}

const reference = contrast('#FFFFFF', '#000000');
if (Math.abs(reference - 21) > 0.01) {
  failures.push(`reference white/black: ${reference.toFixed(2)} != 21.00`);
}
console.log(`reference white/black ${reference.toFixed(2)}:1`);

console.log(`\n${rows.length} pairs, ${failures.length} failures`);

if (failures.length > 0) {
  console.error(`\n${failures.join('\n')}`);
  process.exit(1);
}

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
  rows.push({ label, foreground, background, minimum, ratio, pass });
  if (!pass) {
    failures.push(`${label}: ${ratio.toFixed(2)} < ${minimum} (${foreground} on ${background})`);
  }
  return ratio;
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

for (const [id, theme] of Object.entries(tokens.themes)) {
  for (const [foregroundName, backgroundName, minimum] of themePairs) {
    const foreground = theme.tokens[foregroundName]?.value;
    const background = theme.tokens[backgroundName]?.value;
    if (!foreground || !background) throw new Error(`${id}: missing ${foregroundName} or ${backgroundName}`);
    compare(`${id} ${foregroundName}/${backgroundName}`, foreground, background, minimum);
  }
}

for (const row of rows) {
  const mark = row.pass ? 'PASS' : 'FAIL';
  console.log(
    `${mark} ${row.ratio.toFixed(2).padStart(5)}:1  min ${row.minimum}  ${row.label}  (${row.foreground} on ${row.background})`
  );
}

console.log(`\n${rows.length} pairs, ${failures.length} failures`);

// Verify with #FFFFFF vs #000000
const whiteRatio = contrast('#FFFFFF', '#000000');
console.log(whiteRatio.toFixed(2));

if (failures.length > 0) {
  console.error(`\n${failures.join('\n')}`);
  process.exit(1);
}

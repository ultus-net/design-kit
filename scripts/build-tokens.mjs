import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const tokensPath = join(root, 'src/lib/tokens/tokens.json');
const cssPath = join(root, 'src/lib/tokens/tokens.css');
const tailwindPath = join(root, 'src/lib/tokens/tailwind.css');

const tokens = JSON.parse(await readFile(tokensPath, 'utf8'));
const failures = [];

const requireStatus = (label, entry) => {
  if (entry.status !== 'extracted' && entry.status !== 'derived') {
    failures.push(`${label}: missing status`);
  }
};

const requireValue = (label, entry) => {
  if (typeof entry.value !== 'string' && typeof entry.value !== 'number') {
    failures.push(`${label}: missing or invalid value`);
  }
};

for (const [group, entries] of Object.entries(tokens.primitives)) {
  for (const [name, entry] of Object.entries(entries)) {
    requireStatus(`primitives.${group}.${name}`, entry);
    requireValue(`primitives.${group}.${name}`, entry);
  }
}

// Validate tokenPrefix
if (!tokens.meta.tokenPrefix) {
  failures.push('tokens.meta.tokenPrefix is missing');
}

const defaultId = tokens.meta.defaultProfile;
const defaultProfile = tokens.profiles[defaultId];
if (!defaultProfile) {
  failures.push(`meta.defaultProfile: no profile named ${defaultId}`);
}
const defaultNames = Object.keys(defaultProfile?.modes?.light?.tokens ?? {});

for (const [id, profile] of Object.entries(tokens.profiles)) {
  for (const field of ['id', 'label', 'source']) {
    if (!profile[field]) failures.push(`profiles.${id}: missing ${field}`);
  }
  for (const mode of ['light', 'dark']) {
    const entries = profile.modes?.[mode]?.tokens;
    if (!entries) {
      failures.push(`profiles.${id}: missing modes.${mode}.tokens`);
      continue;
    }
    for (const [name, entry] of Object.entries(entries)) {
      requireStatus(`profiles.${id}.${mode}.${name}`, entry);
      requireValue(`profiles.${id}.${mode}.${name}`, entry);
    }
    const names = Object.keys(entries);
    const missing = defaultNames.filter((name) => !names.includes(name));
    const extra = names.filter((name) => !defaultNames.includes(name));
    if (missing.length > 0) {
      failures.push(`profiles.${id}.modes.${mode}: missing names ${missing.join(', ')}`);
    }
    if (extra.length > 0) {
      failures.push(`profiles.${id}.modes.${mode}: unexpected names ${extra.join(', ')}`);
    }
  }
}

const defaultCornersId = tokens.meta.defaultCorners;
const defaultCorners = tokens.corners?.[defaultCornersId];
if (!defaultCorners) {
  failures.push(`meta.defaultCorners: no preset named ${defaultCornersId}`);
}
const defaultCornerNames = Object.keys(defaultCorners?.tokens ?? {});

for (const [id, preset] of Object.entries(tokens.corners ?? {})) {
  if (preset.id !== id) failures.push(`corners.${id}: id does not equal the key`);
  for (const field of ['label', 'source']) {
    if (!preset[field]) failures.push(`corners.${id}: missing ${field}`);
  }
  const entries = preset.tokens;
  if (!entries) {
    failures.push(`corners.${id}: missing tokens`);
    continue;
  }
  for (const [name, entry] of Object.entries(entries)) {
    requireStatus(`corners.${id}.${name}`, entry);
    requireValue(`corners.${id}.${name}`, entry);
  }
  const names = Object.keys(entries);
  const missing = defaultCornerNames.filter((name) => !names.includes(name));
  const extra = names.filter((name) => !defaultCornerNames.includes(name));
  if (missing.length > 0) {
    failures.push(`corners.${id}: missing names ${missing.join(', ')}`);
  }
  if (extra.length > 0) {
    failures.push(`corners.${id}: unexpected names ${extra.join(', ')}`);
  }
}

for (const [name, entry] of Object.entries(defaultCorners?.tokens ?? {})) {
  if (entry.value !== '0px') {
    failures.push(`corners.${defaultCornersId}.${name}: default value must be 0px`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const prefix = tokens.meta.tokenPrefix;
const cssGroup = (group) => (group === 'font-family' ? 'font' : group);

const cornerVars = (name, preset) => `  --${prefix}-${name}: ${preset.tokens[name].value};`;

const cornerRootBlock = `  /* corners */\n${defaultCornerNames
  .map((name) => cornerVars(name, defaultCorners))
  .join('\n')}`;

const primitiveGroups = Object.entries(tokens.primitives).map(([group, entries]) => {
  const lines = Object.entries(entries).map(
    ([name, entry]) => `  --${prefix}-${cssGroup(group)}-${name}: ${entry.value};`
  );
  return `  /* ${group} */\n${lines.join('\n')}`;
});

// The default corners hold the slot the radius primitives used to take.
primitiveGroups.splice(1, 0, cornerRootBlock);
const primitiveBlock = primitiveGroups.join('\n\n');

const tokenBlock = (profile, mode) =>
  defaultNames.map((name) => `  --${prefix}-${name}: ${profile.modes[mode].tokens[name].value};`).join('\n');

const semanticEntries = defaultNames
  .map((name) => `  --color-${prefix}-${name}: var(--${prefix}-${name});`)
  .join('\n');

const typeEntries = Object.entries(tokens.primitives['font-size'])
  .map(
    ([name]) =>
      `  --text-${prefix}-${name}: var(--${prefix}-font-size-${name});\n  --text-${prefix}-${name}--line-height: var(--${prefix}-line-height-${name});`
  )
  .join('\n');

const radiusEntries = defaultCornerNames
  .map((name) => `  --radius-${prefix}-${name.replace(/^radius-/, '')}: var(--${prefix}-${name});`)
  .join('\n');

const spacingEntries = Object.keys(tokens.primitives.space)
  .map((name) => `  --spacing-${prefix}-${name}: var(--${prefix}-space-${name});`)
  .join('\n');

const breakpointEntries = Object.entries(tokens.primitives.breakpoint)
  .map(([name, entry]) => `  --breakpoint-${prefix}-${name}: ${entry.value};`)
  .join('\n');

const weightEntries = Object.keys(tokens.primitives.weight)
  .map((name) => `  --font-weight-${prefix}-${name}: var(--${prefix}-weight-${name});`)
  .join('\n');

const tailwind = `/* Generated by scripts/build-tokens.mjs from tokens.json. Do not edit. */
/* Opt-in Tailwind v4 bridge. Import after "tailwindcss". */

@theme inline {
${semanticEntries}

  --font-${prefix}-display: var(--${prefix}-font-display);
  --font-${prefix}-body: var(--${prefix}-font-body);
  --font-${prefix}-mono: var(--${prefix}-font-mono);

${typeEntries}

${radiusEntries}

${spacingEntries}

${weightEntries}

${breakpointEntries}
}
`;

const profileIds = Object.keys(tokens.profiles);
const otherProfiles = profileIds.filter((id) => id !== defaultId);

const profileBlocks = otherProfiles
  .flatMap((id) => [
    `[data-profile="${id}"] {
  color-scheme: light;
${tokenBlock(tokens.profiles[id], 'light')}
}`,
    `[data-profile="${id}"][data-mode="dark"] {
  color-scheme: dark;
${tokenBlock(tokens.profiles[id], 'dark')}
}`
  ])
  .join('\n\n');

const cornerIds = Object.keys(tokens.corners);
const cornerBlocks = cornerIds
  .map(
    (id) => `[data-corners="${id}"] {
${defaultCornerNames.map((name) => cornerVars(name, tokens.corners[id])).join('\n')}
}`
  )
  .join('\n\n');

const css = `/* Generated by scripts/build-tokens.mjs from tokens.json. Do not edit. */
/* Default profile: ${defaultId}. Default corners: ${defaultCornersId}. Available profiles: ${profileIds.join(', ')}. */

:root {
  color-scheme: light;
${primitiveBlock}

${tokenBlock(defaultProfile, 'light')}
}

[data-mode="dark"] {
  color-scheme: dark;
${tokenBlock(defaultProfile, 'dark')}
}

${profileBlocks}

${cornerBlocks}
`;

await writeFile(cssPath, css);
await writeFile(tailwindPath, tailwind);
console.log(`wrote ${cssPath}`);
console.log(`wrote ${tailwindPath}`);

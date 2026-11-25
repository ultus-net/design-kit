# Design Kit: rename, corner presets, and a 29-component range

Date: 2026-11-26
Status: proposed
Supersedes: the 0.2.0 rule that every radius resolves to zero

## Context

`@ultus-net/formwork` 0.2.0 ships three colour profiles (`blueprint`, `oxide`,
`ledger`), each with a light and a dark mode, 186 gated contrast pairs, fourteen
Svelte 5 components and a static docs site. PR #4 carries that work and is
awaiting merge.

Three requests follow it: rename the product to Design Kit, make soft corners a
first-class option, and grow the component range.

## Goals

- Rename the repository, package, site and documentation to Design Kit.
- Make corner geometry a preset axis with `sharp` (default), `soft` and `round`.
- Grow the exported components from fourteen to twenty-nine.
- Keep every gate: contrast pairs, vitest, svelte-check, static build, browser
  audit.

## Non-goals

- Renaming the `fw` token prefix or the `--fw-*` custom properties. Every
  consumer and every documentation page names them, so it is a 1.0 change with
  its own migration.
- Renaming the local checkout directory.
- Corner values that differ per mode or per profile.
- Shadows. All presets keep `--fw-shadow-*` at `none`.
- A data grid, a date picker or a rich-text editor.

## 1. Rename to Design Kit

### Surfaces

| Surface | Before | After |
| --- | --- | --- |
| GitHub repository | `ultus-net/formwork` | `ultus-net/design-kit` |
| npm package | `@ultus-net/formwork` | `@ultus-net/design-kit` |
| `package.json` `name` | `@ultus-net/formwork` | `@ultus-net/design-kit` |
| `tokens.json` `meta.name` | `formwork` | `design-kit` |
| Site title, `src/app.html` | `formwork` | `Design Kit` |
| Sidebar wordmark and home page | `formwork` | `Design Kit` |
| `README.md` heading | `# formwork` | `# Design Kit` |
| Docs references | `@ultus-net/formwork/...` | `@ultus-net/design-kit/...` |

### Mechanics

1. Merge PR #4 first. Renaming the repository while a pull request is open
   rewrites that pull request's own links for no benefit.
2. Run `gh repo rename design-kit`, then
   `git remote set-url origin https://github.com/ultus-net/design-kit.git`.
   GitHub redirects the old URL, but the local remote must not depend on the
   redirect.
3. Apply the code and documentation edits in one commit.
4. Add a `CHANGELOG.md` entry under `0.3.0` naming the package rename as
   breaking, with the one-line import change.

### What does not change

The token prefix `fw`, the custom property names, the `data-profile`,
`data-mode` and future `data-corners` attributes, and every component export
name. Consumers change one import specifier.

## 2. Corner presets

### Why an axis, not a profile

Profiles carry twenty-seven colour tokens measured by the contrast gate. Corners
carry geometry with no contrast meaning. Separate axes compose: three profiles
times two modes times three corner presets is eighteen appearances, from three
small token sets.

### Schema

Radius leaves `primitives` and becomes a top-level `corners` object. Each preset
is:

```json
"soft": {
  "id": "soft",
  "label": "Soft",
  "source": "Hand-set for 0.3.0; small radii on controls, moderate on dialog and alert.",
  "tokens": {
    "radius-sm": { "value": "4px", "status": "derived" },
    "radius-md": { "value": "6px", "status": "derived" },
    "radius-lg": { "value": "10px", "status": "derived" },
    "radius-pill": { "value": "999px", "status": "derived" },
    "radius-full": { "value": "9999px", "status": "derived" }
  }
}
```

### Values

| Step | Used by | sharp | soft | round |
| --- | --- | --- | --- | --- |
| `sm` | nav links, sidebar buttons, pagination, toast, app shell | 0px | 4px | 8px |
| `md` | alert, dialog, panels | 0px | 6px | 12px |
| `lg` | large surfaces | 0px | 10px | 18px |
| `pill` | reserved for badges and tags | 0px | 999px | 999px |
| `full` | reserved for truly circular shapes | 0px | 9999px | 9999px |

`sharp` is the default and emits into `:root`, so no attribute is needed and
nothing changes for existing consumers.

### Component change

`src/lib/components/Button.svelte:159` holds the file's only `border-radius`, and
it belongs to the loading spinner. `.fw-button` itself, declared at line 61, sets
none, so buttons are square today by omission rather than by token. Add
`border-radius: var(--fw-radius-sm)` to `.fw-button` and leave the spinner on
`var(--fw-radius-full)`.

Under `sharp` the visual result is unchanged. Under `soft` and `round` the
button gains the control radius rather than becoming a pill. `pill` stays
reserved for badges and tags, and `full` for circular shapes such as the
spinner.

`Alert` and `Dialog` already read `--fw-radius-md`, so they follow the preset
with no change of their own.

### Generator

`scripts/build-tokens.mjs`:

- Validate each preset has `id`, `label`, `source` and exactly the five radius
  keys, identical to the default preset's key set.
- Validate every `sharp` value is `0px`, so the default stays defensible as the
  construction baseline.
- Emit the default preset's five variables inside `:root`, where the primitives
  block sits today.
- Emit a `[data-corners="<id>"]` block for every preset, including the default,
  so a subtree can pin a preset while the page uses another.
- Derive the Tailwind bridge's `--radius-fw-*` from the default preset's keys
  instead of `primitives.radius`.
- Remove the `primitives.radius` block. Nothing may read it afterwards,
  including `src/routes/spacing/+page.svelte`.

### Gate and tests

- `src/lib/tokens/tokens.test.ts` gains a test that every corner preset carries
  the same key set as the default and that `sharp` is all `0px`.
- `npm run tokens` fails on a preset with a missing step, a mismatched key set,
  or a missing `source`. Prove each failure with a throwaway in-memory mutation,
  as the profile checks were proved.
- Contrast is unaffected and stays at 186 pairs. Corners carry no colour.

### Site

- A new `/corners` route: the three presets with live samples of `Button`,
  `Input`, `Card`, `Alert` and `Dialog`, plus a table of the five values per
  preset.
- The docs rail gains a third group, `role="group" aria-label="Corners"`, with
  one button per preset.
- `src/routes/_chrome.svelte.ts` gains `corners: string`. The layout applies
  `document.documentElement.dataset.corners` and deletes the attribute for the
  default preset. Persistence key `fw-corners`, validated with the same pattern
  as `isProfile`.
- Nav gains a `Corners` entry after `Profiles`.

### Documentation consistency

Line numbers refer to `HEAD` `c78297b`. These claims become false under a
non-sharp preset and must change in the same pull request:

- `src/routes/+page.svelte:19`: "zero radius" becomes "sharp corners by
  default".
- `src/routes/+page.svelte:10`: the Spacing card body.
- `src/routes/+page.svelte:25`: "One kit, two modes, three surfaces" is already
  stale.
- `src/routes/spacing/+page.svelte:31-33`: states every radius resolves to
  `0px`.
- `src/routes/guidelines/+page.svelte:44`: the invariant row.
- `src/routes/profiles/+page.svelte:17`: "radius stays zero".
- `src/routes/cheatsheet/+page.svelte`: the token row and any radius claim.

### Wording for the colour model

The docs describe the colour model as "two modes each" on the home page, the
Colours page and the cheatsheet. Replace that framing with the axes: three
colour profiles, each with a light and a dark mode, so six colour combinations,
plus three corner presets. Keep the word "profiles" for palettes and "modes" for
light and dark. Never use "theme".

## 3. Component range

Every component ships with a typed `Props` interface, token-only CSS, a
behavioural test file, a demo partial under `src/routes/_demos/`, and a section
on `/components`.

### Pull request C: form controls

| Component | Contract | Test focus |
| --- | --- | --- |
| `Checkbox` | Native input, label, hint, error, `indeterminate` prop, forwards `id` and ARIA | indeterminate reflects to the element, label association, error wiring |
| `RadioGroup` | `fieldset` with `legend`, native radios sharing a `name`, `$bindable` value | arrow-key selection, legend as group name, one checked |
| `Switch` | Native `button` with `role="switch"` and `aria-checked`, `$bindable` checked | Space toggles, `aria-checked` tracks state |
| `Textarea` | Native textarea, forwards `id` and ARIA, `rows` prop | label association, attribute forwarding, no resize jitter |
| `Combobox` | Text input plus listbox: `aria-expanded`, `aria-controls`, `aria-activedescendant`, Down/Up/Enter/Escape, caller-supplied options | open on input, arrow navigation moves the active option, Enter selects, Escape closes and restores the query |

`Combobox` is the hardest of the five. Budget a second round for it.

### Pull request D: chrome

| Component | Contract | Test focus |
| --- | --- | --- |
| `Menu` | Trigger button plus popup of `role="menuitem"`, ArrowDown/Up, Home/End, Escape, focus returns to the trigger | open, arrow moves, Escape closes and restores focus |
| `Tooltip` | Hover and focus show, Escape hides, `aria-describedby` on the trigger, never interactive | describedby link, Escape dismissal |
| `Breadcrumbs` | `nav` plus `ol`, trailing item `aria-current="page"` | landmark name, current item |
| `EmptyState` | Slot for mark, `title`, `description`, optional action snippet | renders all parts, action fires |
| `Skeleton` | `aria-hidden`, shapes `line`, `block`, `circle` built from radius tokens | hidden from the accessibility tree, shape classes |

### Pull request E: advanced

| Component | Contract | Test focus |
| --- | --- | --- |
| `Accordion` | Native `details`/`summary` per item, `multiple` prop, `aria-expanded` on the summary | one-open mode closes siblings, multiple mode keeps them |
| `Progress` | `role="progressbar"`, `aria-valuenow/min/max`, indeterminate when no value | ARIA values, indeterminate omits `aria-valuenow` |
| `Avatar` | Image with required `alt`, initials fallback from `name`, size scale | alt text, fallback initials, size class |
| `Drawer` | Native `dialog` with side placement, `showModal`, Escape, focus return, same guard pattern as `Dialog` | opens through `showModal` once, close event returns focus |
| `CommandPalette` | Native `dialog` plus input plus listbox, grouped results, ArrowDown/Up, Enter, Escape, reuses the `Combobox` keyboard contract | filter narrows results, Enter invokes the active item, Escape closes |

## 4. Phasing and versions

| PR | Scope | Version |
| --- | --- | --- |
| #4 | profiles, six components, sticky rail (already open) | 0.2.0 |
| A | rename to Design Kit | 0.3.0 |
| B | corners axis, `/corners`, documentation rewording | 0.4.0 |
| C | form controls, five components | 0.5.0 |
| D | chrome, five components | 0.6.0 |
| E | advanced, five components | 0.7.0 |

Each pull request carries its own changelog entry, documentation updates, full
gate run and browser audit. A and B are small and could merge as one if the
rename lands cleanly.

## 5. Risks

| Risk | Mitigation |
| --- | --- |
| Repo rename breaks clone URLs, badges and old links | GitHub redirects; update the local remote; name the change in the changelog |
| Radius claims scattered across seven documentation files go stale | Fix them in the corners commit; grep for "zero radius" and "0px" as part of acceptance |
| `Combobox` and `CommandPalette` diverge in keyboard behaviour | Build `Combobox` first, then have `CommandPalette` reuse its contract and tests |
| `Drawer` reintroduces the double-open bug fixed in `Dialog` | Copy the guarded effect and land the same once-only test |
| The full range outruns review capacity | One pull request per group, each independently mergeable |

## 6. Acceptance

Rename:

- `git grep -n formwork -- '*.md' '*.svelte' '*.json' '*.ts' '*.html'
  ':!CHANGELOG.md' ':!docs/design/'` prints nothing. The only permitted mentions
  are changelog history and this spec's context paragraph, which record what the
  package was called then.
- `npm pack --dry-run` lists the package as `@ultus-net/design-kit`.

Corners:

- `grep -c "data-corners" src/lib/tokens/tokens.css` equals 3 (one block per
  preset; the generated CSS includes the default so a subtree can pin it).
- A preset with a missing step or a non-zero `sharp` value fails
  `npm run tokens`.
- The throwaway audit harness at `.tmp/visual/audit.mjs`, regenerated per phase
  and never committed, runs three corner presets at 1440 and 390 and passes every
  existing assertion. It restarts `vite preview` first, because a preview server
  started before a build caches its file map and 404s new hashed chunks.
- No page claims zero radius as a global invariant.

Components:

- Twenty-nine exports from `src/lib/index.ts`.
- Each new component has at least three behavioural tests that fail without it.
- `/components` renders every new demo at 390 and 1440 without overflow.

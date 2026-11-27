# Changelog

All notable changes to this package. The format follows Keep a Changelog, and versions follow Semantic Versioning.

## [Unreleased]

### Added

- `Breadcrumbs`: a `nav` landmark with an ordered list, an optional accessible name, anchors on ancestor items and `aria-current="page"` on the current item.
- `Tooltip`: a button trigger that shows a text tooltip on hover and focus, wires `aria-describedby` while open, and hides on Escape without moving focus.
- `Menu`: a trigger button with a `role="menu"` popup, arrow and Home/End navigation, Enter or click to select, and Escape or Tab to close with focus back on the trigger.
- `EmptyState`: a decorative mark slot, a title, an optional description and an optional action snippet, with the action always interactive.
- `Skeleton`: an aria-hidden placeholder with line, block and circle shapes built from radius tokens.
- `Progress`: a role="progressbar" bar with aria-valuenow/min/max, a custom max, clamped values and an indeterminate state that omits aria-valuenow.
- `Accordion`: native details and summary items in one-open or multiple mode, with aria-expanded on each summary.
- `Avatar`: an image with a required alt, an initials fallback derived from the name, and sm/md/lg sizes.
- `Drawer`: a native `dialog` pinned to the start or end edge, reusing the `Dialog` guard and the native focus return.

### Changed

- The hand-maintained count claims in `README.md`, `/` and `/components` are now checked against the exported component list by `src/lib/count-claims.test.ts`, so a stale claim fails `npm test`.
- The four gates also run in GitHub Actions (`.github/workflows/gates.yml`) on push to `main` and on every pull request, so a failure appears on the pull request instead of only in whichever session last ran them. `src/lib/workflow-gates.test.ts` pins the step order and that every gate step is fatal; `actionlint` checks the YAML. The checks are advisory: `main` has no branch protection yet, so they do not block a merge.

## [0.5.0] - 2026-11-26

### Added

- Five form controls: `Checkbox`, `RadioGroup`, `Switch`, `Textarea` and `Combobox`, each with typed props, token-only CSS, behavioural tests and a demo on `/components`.
- `Combobox` implements the ARIA combobox contract: `aria-expanded`, `aria-controls`, `aria-activedescendant`, arrow navigation, Enter to select, and Escape to close and restore the query.

## [0.4.0] - 2026-11-26

### Added

- A corners axis with three presets, `sharp`, `soft` and `round`, emitted as `[data-corners="<id>"]`. `sharp` is the default.
- `/corners` with live samples of every preset and the radius scale.

### Changed

- Radius left `primitives` for the top-level `corners` object. `--fw-radius-*` names are unchanged.
- `Button`, `Input` and `Select` take their radius from `--fw-radius-sm`, and `Card` from `--fw-radius-md`, so they follow the preset.
- Documentation no longer claims zero radius as a global invariant.

## [0.3.0] - 2026-11-26

### Changed

- Renamed the repository, npm package and documentation to Design Kit. The package is now `@ultus-net/design-kit`, so consumers change one import specifier. The `fw` token prefix and every custom property name are unchanged.
- Added the design spec for corner presets and the 29-component range at `docs/design/2026-11-26-design-kit-shape-and-components.md`.

## [0.2.0] - 2026-11-24

### Added

- Three palette profiles, `blueprint`, `oxide` and `ledger`, each with a light and a dark mode and all 27 semantic tokens.
- `Table`, `Tabs`, `Dialog`, `Toast`, `Field` and `Pagination` components.
- `npm test`: a vitest suite covering the token schema and the interactive components.
- `/profiles` route with a live switcher, anchors and every measured pair.

### Changed

- `tokens.json` now exposes `profiles` instead of `themes`. Reading the file directly is a breaking change; importing `tokens.css` is not.
- `npm run contrast` measures 186 pairs across three profiles instead of 62.
- `Input` and `Select` forward `id` and arbitrary ARIA attributes, so `Field` can wire them.

## [0.1.0] - 2026-11-23

### Added

- Blueprint token model: one primitive ramp and two themes, `formwork-light` (whiteprint) and `formwork-dark` (cyanotype).
- Contrast gate: 31 pairs per theme, 62 measurements, non-zero exit on regression.
- Self-hosted Bricolage Grotesque and JetBrains Mono latin subsets under the SIL Open Font License 1.1.
- Rulebook at `/guidelines` with invariants, three surfaces, type, colour and tells.

### Changed

- Components squared onto zero-radius, zero-shadow tokens.
- Danger button hover uses token-backed declarations, not a filter.
- Tailwind bridge no longer emits shadow utilities.
- Contrast gate asserts the white/black reference instead of printing it.
- Docs shell and all documentation routes migrated from section themes to the two-mode model.
- Package identity moved to `@ultus-net/formwork`, MIT.

### Fixed

- Documentation tables stack below 640px, and pannable data tables carry a scroll hint.
- Table body text sits at 14px, and the overview cards balance 3+3 and 2+2+2.
- The docs wordmark and AppShell nav links meet the 24px minimum target size.
- The site ships a favicon, so no page logs a 404.

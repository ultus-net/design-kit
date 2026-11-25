# Changelog

All notable changes to this package. The format follows Keep a Changelog, and versions follow Semantic Versioning.

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

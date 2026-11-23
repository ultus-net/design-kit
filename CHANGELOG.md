# Changelog

All notable changes to this package. The format follows Keep a Changelog, and versions follow Semantic Versioning.

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

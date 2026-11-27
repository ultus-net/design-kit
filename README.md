# Design Kit

A personal brand kit. Blueprint palette, brutalist construction: Prussian blue and whiteprint grounds, one pastel signal, no elevation, and rules that hold a measured 3:1 or 4.5:1.

## Status

Pre-1.0. Tokens, three palette profiles, three corner presets, twenty-two Svelte 5 components and the documentation site are in place. The gate is real: `npm run contrast` asserts 186 colour pairs across every profile and mode, and fails the build on any regression.

Profiles select a palette family, modes select light or dark inside that family, and the two attributes compose.

## Start

    npm install
    npm run dev       # tokens, then the docs site on http://localhost:5173
    npm run check     # svelte-check, zero errors and zero warnings
    npm run contrast  # 186 pairs, 0 failures
    npm test          # unit and component tests
    npm run build     # static site

## What is in it

| Path | Holds |
|---|---|
| `src/lib/tokens/tokens.json` | Single source. Primitives plus three profiles, each with a light and a dark mode. |
| `scripts/build-tokens.mjs` | Generates `tokens.css` and the Tailwind bridge from that JSON. |
| `scripts/check-contrast.mjs` | The contrast gate. 31 pairs per mode, non-zero exit on a miss. |
| `src/lib/components/` | Twenty-two Svelte 5 components, tokens only. |
| `src/routes/profiles/` | The profile switcher and every measured pair. |
| `src/routes/corners/` | The three corner presets and live samples. |
| `src/lib/assets/fonts/` | Bricolage Grotesque and JetBrains Mono, latin subsets. |
| `src/routes/guidelines/` | The rulebook: invariants, surfaces, type, colour, tells. |

## Licence

MIT. Type is licensed under the SIL Open Font License 1.1; both upstream OFL texts ship in `src/lib/assets/fonts/`. The palette is authored from the Omoro Blueprint dataset and measured in this repo.

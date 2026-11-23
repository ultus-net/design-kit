# formwork

A personal brand kit. Blueprint palette, brutalist construction: Prussian blue and whiteprint grounds, one pastel signal, zero radius, no elevation, and rules that hold a measured 3:1 or 4.5:1.

## Status

Pre-1.0. Tokens, two themes, eight Svelte 5 components and the documentation site are in place. The gate is real: `npm run contrast` asserts 62 colour pairs and fails the build on any regression.

## Start

    npm install
    npm run dev       # tokens, then the docs site on http://localhost:5173
    npm run check     # svelte-check, zero errors and zero warnings
    npm run contrast  # 62 pairs, 0 failures
    npm run build     # static site

## What is in it

| Path | Holds |
|---|---|
| `src/lib/tokens/tokens.json` | Single source. Primitives plus the `formwork-light` and `formwork-dark` themes. |
| `scripts/build-tokens.mjs` | Generates `tokens.css` and the Tailwind bridge from that JSON. |
| `scripts/check-contrast.mjs` | The contrast gate. 31 pairs per mode, non-zero exit on a miss. |
| `src/lib/components/` | Eight Svelte 5 components, tokens only. |
| `src/lib/assets/fonts/` | Bricolage Grotesque and JetBrains Mono, latin subsets. |
| `src/routes/guidelines/` | The rulebook: invariants, surfaces, type, colour, tells. |

## Licence

MIT. Type is licensed under the SIL Open Font License 1.1. The palette is authored from the Omoro Blueprint dataset and measured in this repo.

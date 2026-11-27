# L017 — carry the source index through a regrouping, never recompute it with indexOf

Date: 2026-11-27
Iteration: campaign 5, n=17 (`feature/command-palette`)
Status: admitted

## Lesson

- L017 — when a flat list is regrouped for rendering, each entry must carry its
  index from the flat list. Recomputing it with `indexOf` inside the group loop
  ties the rendered id to object identity, so a repeated reference yields two
  entries with the same id and an `aria-activedescendant` that points at the
  wrong option. (evidence: `src/lib/components/CommandPalette.svelte:29-48` and
  `:150-185`; the first diff used `{@const flatIndex = filtered.indexOf(item)}`
  inside both group branches, and the review raised it as a P1.)

## What happened

`CommandPalette` filters one flat array and then buckets it into groups for
rendering. The option id, `aria-selected` and the mousedown handler all need the
position in the flat array, so the first version looked it up per item with
`filtered.indexOf(item)`. That works only while every item is a distinct object
reference. It is also quadratic, and it puts the same lookup in two branches that
must stay in step. The review's objection was correct in principle: the
accessibility link between the input's `aria-activedescendant` and the option's
`id` is a correctness property, and a property that depends on object identity is
a silent failure waiting for a caller who reuses an item object.

## Applicability conditions

- Applies whenever a rendered collection is derived from a filtered, sorted or
  grouped source and the DOM needs a stable id or index per entry.
- Requires the index to come from the source iteration (`forEach((item, index)`)
  or to be assigned when the collection is built, not recovered later.
- Does not apply to keyed `{#each}` blocks that key by the item's own stable id,
  because the key is already the identity the DOM needs.
- A repeated reference in the caller's array is the test case. If the component
  cannot render the same object twice correctly, it cannot claim an index.

## Why it is admitted

The review rejected the first diff and approved the second, and the committed
markup now reads `entry.index` in both branches. The change also removed the
quadratic lookup, so the rule costs nothing to follow.

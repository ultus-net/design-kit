# L007 — a known-gap allowlist ratchets only when it is compared as a set in both directions

Date: 2026-11-27
Iteration: campaign 2, n=7 (`feature/tested-export-ratchet`)
Status: admitted

## Lesson

- L007 — an allowlist of known gaps stops the gap growing only if the gate
  compares the allowlist to the observed gap as a set, and also checks that
  every allowlisted name is still real. Comparing lengths passes when one name
  is swapped for another. Checking only for new gaps lets a name linger after
  the gap closes. (evidence: `src/lib/tested-exports.test.ts:23-43` at commit
  `5a91731`; adding a synthetic `NewThing` export failed with `+ "NewThing"`,
  removing `Stat` from the allowlist failed with `+ "Stat"`, and restoring gave
  4/4.)

## What happened

The repo exports 24 components and only 17 had a sibling test file. Writing
seven tests in one iteration would have broken the annealed edit budget, so the
gap became a documented allowlist. The first draft of the gate compared the
observed gap to the allowlist with `toEqual` on sorted arrays, and separately
asserted every allowlisted name is a current export. Both directions were
exercised as negative controls before the change was kept.

## Applicability conditions

- Applies to a ratchet over a known debt set: untested exports, untyped
  boundary modules, suppressed lint rules with a tracked work item.
- Requires the observed set to be derived, never typed by hand. Here the names
  come from `index.ts?raw` and `import.meta.glob`, so the allowlist cannot
  drift from the tree.
- Does not apply to a target you intend to reach in one change; there the gate
  should assert the empty gap directly.
- A gate that only counts `allowlist.length === gap.length` is the failure this
  lesson names: it cannot see a substitution.

## Why it is admitted

Both failure directions have a recorded output, and the committed set
comparisons are the code that produced them. The scope condition keeps the
pattern off one-shot cleanup work, where an allowlist would be pure overhead.

# L021 — Sabotage the extraction to prove the tests reach it

Date: 2026-11-27
Iteration: campaign 6, n=21 (`refactor/dialog-modal-guard`)
Status: admitted

## Lesson

- L021 — after extracting shared code, disable the extracted code and run the
  suites. A green run proves the suite still passes, not that it still reaches
  the moved lines. (evidence: stubbing `syncDialogModal` to `return` fails 21 of
  the 23 `Dialog`/`Drawer`/`CommandPalette` tests; wrapping the call in
  `untrack` fails exactly one.)

## What happened

The refactor moved a six-line modal guard out of three components into
`dialog-modal.ts`. Every gate passed, which shows nothing was broken. It does
not show that the moved branches are still executed, because a component test
can pass with the guard inert: it renders a dialog that is already in the right
state.

Two controls fixed that. First, the helper body was reduced to `return;` before
its real calls: 21 of 23 component tests failed, so the wiring is load-bearing
rather than incidental. Second, the call was wrapped in Svelte's `untrack` in
one component: exactly one test failed (`closes on a close event and calls
onclose`), which is the test that depends on the effect re-running when `open`
changes.

Both controls took one edit and one test run each, and both were reverted before
the commit, leaving `git diff --stat` empty.

## Applicability conditions

- Applies to any extraction or move where the suite is the only verifier:
  shared helpers, hooks, middleware, adapters.
- Requires a single edit point that disables the moved code without changing the
  call sites, so a failure is attributable.
- The count matters as much as the failure. One failure out of seven localises
  the coverage; zero failures means the suite never reached it.
- Does not prove a visual or timing property; it only proves the tests execute
  the code.
- Revert the control before committing, and say so in the PR.

## Why it is admitted

The refactor was approved after a review round that asked whether the tests
cover the helper's wiring. The two controls answered with counts, and the review
accepted them. Without them the answer would have been "the suite is green",
which is the same evidence a deleted guard would produce.

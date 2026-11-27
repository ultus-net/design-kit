# L008 — an under-specified spec row is a recorded contract decision, not a gap to leave

Date: 2026-11-27
Iteration: campaign 2, n=8 (`feature/progress-component`)
Status: admitted

## Lesson

- L008 — when a spec row under-specifies a user-visible behaviour, the
  component owns the decision. State it at the surface a reader checks (the
  component page note), pin it with an assertion, and record the rationale in
  the ledger. Here the row said the indeterminate bar "omits `aria-valuenow`";
  the component also omits `aria-valuemin` and `aria-valuemax`, because an
  operation of unknown extent has no honest range to state. (evidence:
  `src/lib/components/Progress.svelte:19-21`, the three `null` assertions at
  `src/lib/components/Progress.test.ts:26-32`, the note at
  `src/routes/components/+page.svelte:230`, and the `contract decision` line in
  `docs/agents/ledger.md` n=8; the first review rejected the change for exactly
  this unstated difference and withdrew after the decision was written down.)

## What happened

The executable part of the spec named one omission. The implementation omitted
three attributes, which changes what assistive technology announces: a bounded
but indeterminate bar carries a known range, an unbounded one does not. The
reviewer called that a P1, not because the behaviour was wrong but because the
contract was invisible. The fix was three statements of the same decision, not
a code change.

## Applicability conditions

- Applies when a spec's test-focus sentence is narrower than the behaviour the
  component must implement to be correct.
- Requires the decision to be user-visible: a rendered note, a test assertion
  or both. An internal comment alone does not discharge it.
- Does not apply when the spec is explicit. Then the implementation follows the
  spec and a deviation is a defect, not a decision.
- Keeping the narrower behaviour and dropping the stronger one is also valid,
  but then the test must assert the narrower contract, otherwise the test and
  the component disagree.

## Why it is admitted

The review output names the gap verbatim, and the committed note, assertions
and ledger line are the three artefacts that closed it. The scope condition
keeps the lesson from licensing silent deviations where the spec already
decides.

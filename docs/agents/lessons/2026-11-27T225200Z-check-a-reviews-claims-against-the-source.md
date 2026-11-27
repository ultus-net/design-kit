# L020 — Check a review's claims against the source before changing code

Date: 2026-11-27
Iteration: campaign 6, n=20 (`fix/field-layout`)
Status: admitted

## Lesson

- L020 — read the file a review cites before acting on it. A finding's stated
  facts can be wrong while its underlying criticism is right, and the fix
  belongs to the criticism, not to the stated facts. (evidence:
  `src/lib/components/Field.svelte:55-60` was already `semibold` and
  `src/lib/components/Input.svelte:45` already had the `.fw-field` wrapper,
  so two of the review's claims were false; the real point was a 4px flex gap
  before the required marker at `Field.svelte:49-53`.)

## What happened

The review returned a P0 saying the label weight was still medium and that
`Input` had no wrapper. Reading both files showed the weight was `semibold`
and both components had the same `.fw-field` wrapper. Implementing the P0 as
written would have been churn against lines that already matched.

The same review carried a P1 claiming the required marker could move inside
the `label` without breaking `getByLabelText('Email')`. That was cheap to test
and false: with the marker inside, the lookup fails with `Unable to find a
label with the text of: Email`, because the label text becomes `Email *`.

What survived was a 4px flex gap before the asterisk, so the label row read
`Email` + gap + `*` instead of the controls' `Email *`. Fixing that, and
rebutting the rest with file:line and a measured failure, produced an APPROVE
on the next round.

## Applicability conditions

- Applies when a review cites a file or line as evidence.
- Read that line before editing it. A claim about current state is checkable in
  one read.
- When a claim is testable in seconds, test it rather than argue about it.
  Record the output as the rebuttal.
- Does not license ignoring a finding. Separate the claim from the criticism,
  then fix the criticism.
- The rebuttal belongs in the response and, when it changes the plan, in the
  preregistration clause it corrects.

## Why it is admitted

The review's real defect was fixed and approved, and two stated facts were
disproved by reading the source and by one failing test. Acting on all three
claims would have broken a held-out test to satisfy a premise that was false.

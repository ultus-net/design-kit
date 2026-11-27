# L016 — when four components share a contract, give each one a different case of it

Date: 2026-11-27
Iteration: campaign 5, n=16 (`test/form-control-forwarding`)
Status: admitted

## Lesson

- L016 — a contract shared by several components needs one distinct case per
  component, not the same assertion copied. Name which component proves
  override, which proves additivity, and which proves identity, and record the
  split so the next reader sees a design instead of a coincidence. (evidence:
  `src/lib/components/Checkbox.test.ts:64-91`,
  `Input.test.ts:43-66`, `Select.test.ts:58-70`, `Textarea.test.ts:51-68`; the
  first version pinned caller precedence only in `Checkbox`, and the review
  called that arbitrary.)

## What happened

`Checkbox`, `Input`, `Select` and `Textarea` all forward a caller `id` and
spread caller attributes last, so a caller's `aria-describedby` replaces the
computed hint/error list. The first version of the four tests asserted the
override in `Checkbox` and the plain forwarding in the other three. That left
two dimensions unpinned: that a caller attribute the component does not compute
is added rather than replacing, and that the control is what the label points
at. The review flagged the asymmetry as arbitrary, which it was: the suite
covered one instance four ways.

## Applicability conditions

- Applies when a contract is identical across components and one assertion per
  component would repeat the same fact.
- Requires the split to be written down where the contract is recorded, so a
  later reader does not read the missing cases as gaps.
- Does not apply when the components differ. Then each one owns its own case and
  no split is needed.
- The components must each already behave correctly. If one is broken, the
  iteration is a `fix` for that component, never a test that documents the
  break.

## Why it is admitted

The review rejected the first version and the second approved, so the
difference between an assertion copied four times and four distinct cases is
recorded in this iteration's own review rounds. The committed files are the
artefact: override in two files, additivity in `Input`, identity in `Select`
and `Textarea`.

# L011 — when a query fails, fix the query before weakening the claim

Date: 2026-11-27
Iteration: campaign 3, n=11 (`feature/sibling-tests`)
Status: admitted

## Lesson

- L011 — a failing accessibility query is evidence about one of two things: the
  component's markup, or the query's assumption. Swapping it for a weaker query
  that passes hides which. Here `getByLabelText('Email')` failed on a required
  field, and the test was rewritten to `getByRole('textbox')`, which proves a
  textbox exists but not that the label reaches it. The honest fix was a query
  that tolerates the aria-hidden asterisk (`getByLabelText(/Email/)`) plus
  `label.htmlFor === input.id`. (evidence:
  `src/lib/components/Input.test.ts:27-40`; the first review rejected the
  weaker query as a P1 and the reviewer withdrew after the label proof
  returned.)

## What happened

`Input` renders the required marker as a `<span aria-hidden="true">*</span>`
inside the `<label>`. `getByLabelText('Email')` matches label text content
rather than the accessible name, so it saw `Email *` and failed. The test
author changed the query to `getByRole('textbox')` and the suite went green.
That is the failure mode this lesson names: the green suite no longer said
anything about the label.

## Applicability conditions

- Applies whenever a query fails after a markup change: label text, accessible
  name, role, described-by.
- Requires the replacement assertion to be at least as strong as the one it
  replaces. If it is weaker, say what it no longer proves and record it in the
  ledger.
- Does not apply when the query was simply wrong about the component's contract
  (a decorative element where a landmark was assumed). Then the weaker query is
  correct and the contract is what changed.
- A regex on label text is not a substitute for the accessible name; prefer
  asserting the association (`htmlFor`/`id`) alongside the query.

## Why it is admitted

The review output names the weakened claim, and the committed association
assertions are the artefact that restored it. The scope condition keeps the
lesson from blocking legitimate query changes where the contract, not the
coverage, was wrong.

# L013 — a test that documents defective behaviour must call it a defect and cite the fix

Date: 2026-11-27
Iteration: campaign 4, n=13 (`feature/button-contract-tests`)
Status: admitted

## Lesson

- L013 — when a test pins behaviour that is wrong, the test must say it is
  wrong and cite the work item that fixes it. A comment that explains the
  mechanism reads as a design note, so a green suite hides the defect. Name it
  in the test title, mark it in the body, and cite the issue with a `TODO(#id)`
  so the fix is tracked. (evidence: `src/lib/components/Button.test.ts:92-109`;
  the first version's comment said only that a fragment href keeps jsdom from
  navigating, the reviewer rejected it as papering over, and the rewritten test
  names the defect and cites issue #35.)

## What happened

The new contract test clicked a busy `Button` rendered as a link and asserted
that the caller's handler was not called. It passed, and the component was
still broken: `aria-disabled` and `tabindex="-1"` do not stop an anchor's
default navigation, so a pointer click leaves the page even though the control
reads as disabled. The comment explained why the click did not navigate in
jsdom, which made the test look deliberate. The reviewer's P0 was correct about
the artefact: the suite recorded a defect without reporting one.

## Applicability conditions

- Applies when a test must pin current behaviour that the iteration is not
  allowed to fix, or when an environment cannot observe the real failure.
- Requires a tracked work item before the comment is written, because the
  `TODO` cites an id. Open the issue first, then cite it.
- Does not apply when the behaviour is intended and merely surprising. Then the
  test name states the contract and no defect is claimed.
- A `TODO` without an id does not survive the PR, so this is also the mechanism
  that keeps a documented defect from becoming permanent.

## Why it is admitted

The review rejected the artefact and the second review approved the rewrite, so
the difference between "explained" and "reported" is recorded in this session's
own output. The committed title and `TODO(#35)` are the artefact that keeps the
defect visible until the fix lands.

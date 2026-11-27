# L010 — a controlled native element must suppress its default action, and the test must drive the real activation path

Date: 2026-11-27
Iteration: campaign 3, n=10 (`feature/accordion-component`)
Status: admitted

## Lesson

- L010 — when a component renders a native element's state from its own
  variable (`open={openIds.includes(id)}`), it must cancel the element's default
  action and be the only writer. Otherwise the browser writes the state too and
  the two disagree. And the test must drive the activation path a user takes
  (a click), never the event the implementation happens to listen for: jsdom
  never fires `toggle`, so a `toggle` handler is untested while the suite is
  green. (evidence: `src/lib/components/Accordion.svelte:19-46`,
  `src/lib/components/Accordion.test.ts:64-104`; the first design listened to
  `toggle`, its click path left `aria-expanded` at `"false"` in jsdom, and the
  reviews rejected it until the click path became the single writer.)

## What happened

The first implementation listened for `toggle` on each `details` and updated a
set. The suite passed because the tests set `details.open = true` and dispatched
`toggle` by hand. Replacing that with `fireEvent.click(summary)` showed the
failure: jsdom opens the element natively but fires no `toggle`, so the
component's state never changed and `aria-expanded` stayed `"false"` forever.
The fix is the pattern the controlled-`details` bug reports converged on:
`preventDefault()` on the summary click and render the state from the set, so
the browser's toggle cannot fight the component.

## Applicability conditions

- Applies to any native element whose state a component mirrors: `details`,
  `dialog`, checkbox, select. One writer per state, and the other writer's
  default action is cancelled.
- Requires the test to use the user's activation path. If the platform does not
  synthesise that path in the test environment (keyboard to click), dispatch the
  event the platform would dispatch and say so in the test.
- Does not apply when the component lets the native element own its state and
  only reads it. Then no suppression is needed and the native state is the
  source of truth.
- A green suite over a hand-dispatched event is evidence about the test, not the
  component. Check the path the user takes before trusting it.

## Why it is admitted

The jsdom failure is recorded in the review output and in this record's
evidence, and the committed click test is the artefact that would have caught
it. The scope condition keeps the pattern from licensing suppression of native
behaviour where the component does not own the state.

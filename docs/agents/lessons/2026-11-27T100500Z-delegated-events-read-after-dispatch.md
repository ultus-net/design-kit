# L015 — with delegated events, read the event after dispatch, not from a later listener

Date: 2026-11-27
Iteration: campaign 4, n=15 (`fix/busy-link-navigation`)
Status: admitted

## Lesson

- L015 — Svelte 5 delegates `click` handlers to the mount root, so a listener
  added on the element does not run after the component's handler and cannot
  observe what it did. To assert that a handler called `preventDefault()`,
  dispatch the event yourself and read `event.defaultPrevented` after
  `dispatchEvent` returns. (evidence: `src/lib/components/Button.test.ts:98-119`;
  the first attempt registered a link-level listener, read `false`, and only
  passed after the dispatch was made direct.)

## What happened

The fix for #35 needs a test that a busy link's activation is cancelled. The
first version added `link.addEventListener('click', ...)` and expected to run
after the component's handler, since the component mounted first. It read
`defaultPrevented === false` and failed, because the component's handler is not
on the element at all: Svelte 5 delegates click events to the root and runs its
handler during the bubble phase. A listener bound to the link therefore runs
before it, whatever the registration order looks like.

## Applicability conditions

- Applies to any assertion about a handler's effect that the DOM records after
  dispatch: `defaultPrevented`, propagation stopped, files on a drop event.
- Requires the event to be dispatched directly with the options the assertion
  depends on (`bubbles: true`, `cancelable: true`) so the delegated handler still
  runs.
- Does not apply to assertions about DOM state the handler leaves behind. Those
  are read from the DOM after `await tick()` as usual.
- A testing-library `fireEvent` call discards the event object, so it cannot be
  used when the event itself is the evidence.

## Why it is admitted

The failure is recorded in this iteration's own test run, and the committed
dispatch form is the artefact that proves the cancellation. The condition keeps
the lesson from replacing DOM assertions with event plumbing where the DOM is
the better evidence.

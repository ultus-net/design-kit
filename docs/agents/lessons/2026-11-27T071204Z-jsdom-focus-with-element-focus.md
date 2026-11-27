# L002 — move focus with element.focus() in jsdom tests, not fireEvent.focus

Date: 2026-11-27
Iteration: base-loop 2 (`feature/tooltip-component`)
Status: admitted

## Lesson

- L002 — In a jsdom test, call `await element.focus()` to move focus before
  asserting `document.activeElement` or focus-dependent behaviour.
  `fireEvent.focus(element)` dispatches the focus event without setting
  `document.activeElement`, so the event handler runs while focus stays on
  `body`. (evidence: `src/lib/components/Tooltip.test.ts:65-67` at commit
  `379cc8d`; the cheap attempt's run failed with
  `expect(document.activeElement).toBe(trigger)` receiving `body`.)

## What happened

The first Tooltip test opened the tooltip with `fireEvent.focus(trigger)` and
then asserted that Escape leaves focus on the trigger. The handler ran, the
tooltip opened, but `document.activeElement` was `body`, so the test failed for
a reason unrelated to the component. Replacing the dispatch with
`await trigger.focus()` made the focus contract real, and the Escape test then
passed while proving that the trigger keeps focus.

## Applicability conditions

- Applies to jsdom-based tests (`vitest` + `@testing-library/svelte`) that
  assert `document.activeElement`, focus return, or a handler reading
  `document.activeElement`.
- Does not apply when only the focus or blur event handler is under test and
  no focus state is asserted, where `fireEvent.focus` is sufficient and
  cheaper.
- Does not change the component under test; the fix is in the test's setup.

## Why it is admitted

The failing assertion output and the passing rerun are the evidence. The scope
condition matters: a blanket ban on `fireEvent.focus` would reject valid
handler-only tests.

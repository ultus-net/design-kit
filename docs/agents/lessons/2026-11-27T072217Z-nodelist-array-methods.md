# L003 — convert querySelectorAll's NodeList with Array.from before using Array methods

Date: 2026-11-27
Iteration: base-loop 3 (`feature/menu-component`)
Status: admitted

## Lesson

- L003 — `querySelectorAll` returns a `NodeList`, which has no `findIndex`,
  `indexOf`, `some`, or `map`. Convert it first (`Array.from(...)` or spread)
  before index-based keyboard navigation or any Array method. The TypeScript
  signature reports `NodeListOf<Element>` and will not stop the call, so the
  failure appears at runtime, and only on the code path that runs it.
  (evidence: `src/lib/components/Menu.svelte:57-60` at commit `cdde374`, which
  now wraps the query in `Array.from`; the escalating run reported a runtime
  crash on `menuitems.findIndex` and the component's own test only exposed it
  once the arrow-key focus path executed.)

## What happened

The first Menu implementation queried `[role="menuitem"]` and called
`.findIndex` on the result to locate the focused item. TypeScript accepted the
call. The acceptance run failed before the focus path could be exercised for
another reason, and the correction surfaced the `NodeList` problem when the
tests were run for real. The fixed code converts once per keydown and uses the
resulting array for `findIndex`, `length`, and index access.

## Applicability conditions

- Applies to DOM queries in components and tests, including
  `querySelectorAll`, `getElementsBy*` (`HTMLCollection`), and
  `document.forms`-style collections, whenever Array methods are used.
- Does not apply when only `length` and index access are needed, which a
  `NodeList` supports directly.
- A cast such as `as unknown as HTMLElement[]` suppresses the compiler without
  converting the value; it is not a fix.

## Why it is admitted

The runtime error is named in the escalation output, and the committed
`Array.from` call is the change that removed it. The scope condition keeps the
lesson from forcing pointless copies where index access already suffices.

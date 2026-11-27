# L006 — cast a `querySelector` result to the element type before reading element-only properties

Date: 2026-11-27
Iteration: campaign 6 (`feature/skeleton-component`)
Status: admitted

## Lesson

- L006 — `container.querySelector('.x')` is typed `Element | null`, and
  `Element` has no `style`, `dataset`, `value` or `focus`. Cast the result to
  the concrete element type at the query, e.g.
  `const root = container.querySelector('.fw-skeleton') as HTMLDivElement;`,
  then read `root?.style.width`. The cast is a claim about markup the test
  renders itself, so it stays local to the assertion. (evidence:
  `src/lib/components/Skeleton.test.ts:36` at commit `7b9d237`; removing the
  cast makes `npm run check` report
  `Property 'style' does not exist on type 'Element'` twice, once per
  assertion, and restoring it returns 0 errors and 0 warnings.)

## What happened

The new Skeleton test asserted the rendered width and height of a
`aria-hidden` div. With no cast, svelte-check rejected `root?.style.width`
because `querySelector` returns `Element`. The repo's existing tests already
cast (`Dialog.test.ts` does the same for a dialog element). Adding the cast
cleared both errors without changing the runtime behaviour or the assertion's
strength.

## Applicability conditions

- Applies to structural queries in tests (`querySelector`, `getElementById`)
  that are then read for element-specific members.
- Does not apply to `getByRole`/`getByText` queries from Testing Library, which
  already return `HTMLElement`; adding a cast there is noise.
- Prefer a role or query that returns `HTMLElement` when the element is not
  accessibility-hidden. Reach for the cast when the element is deliberately
  hidden, as a skeleton is.
- `as any` or `@ts-ignore` silences the check without saying which element the
  markup renders; it is not a fix.

## Why it is admitted

The failing check is quoted verbatim, the restored 0/0 is observed, and the
cast line is the change that removed it. The scope condition keeps the lesson
from spraying casts across role-based queries that do not need one.

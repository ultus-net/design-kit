# L004 — pass a snippet value, never a snippet factory call

Date: 2026-11-27
Iteration: campaign 4 (`feature/emptystate-component`)
Status: admitted

## Lesson

- L004 — A Svelte 5 prop typed `Snippet` takes a snippet value, not a factory
  result. Define it with `{#snippet name()}...{/snippet}` and pass
  `name={name}`; in tests use `createRawSnippet(...)`. Calling a helper that
  returns `{ render }` yields a plain object and fails the type check with
  "Type '{ render: () => string; }' is not assignable to type 'Snippet<[]>'".
  (evidence: `src/routes/_demos/EmptyStateDemo.svelte:5-10` at commit
  `0ff4583`; the escalating acceptance run reported that exact error three
  times for `mark={markSnippet()}` and `action={actionSnippet()}`.)

## What happened

The first demo defined `markSnippet` and `actionSnippet` helpers returning
`{ render: () => '<span/>' }` and passed their call results as props. The
component type-checks against `Snippet`, so svelte-check reported three errors
and the demo could not build. Replacing the helpers with `{#snippet mark()}` and
`{#snippet action()}` blocks and passing the identifiers cleared all three
errors and produced the same markup.

## Applicability conditions

- Applies to Svelte 5 components whose props are typed `Snippet` or
  `Snippet<[Args]>`.
- Does not apply to tests that need raw HTML: there `createRawSnippet` is the
  correct constructor, and it returns a real snippet value.
- A cast such as `as unknown as Snippet` compiles but leaves a value the
  renderer cannot call; it is not a fix.

## Why it is admitted

The compiler error is quoted verbatim in the escalation output, and the
committed snippet blocks are the change that removed it. The scope condition
keeps the lesson from banning `createRawSnippet` in tests, which is the
supported path there.

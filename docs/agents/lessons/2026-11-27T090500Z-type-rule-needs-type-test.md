# L012 — a type-level rule needs a type-level test, and look at the error a `@ts-expect-error` hides

Date: 2026-11-27
Iteration: campaign 3, n=12 (`feature/avatar-component`)
Status: admitted

## Lesson

- L012 — a prop contract enforced only by a union is a claim until a test pins
  the rejection. Pin it with `@ts-expect-error` on a call that must not compile,
  and remove the directive once to read the compiler's message: an
  `@ts-expect-error` also passes when the error is unrelated to the rule you
  meant to enforce. (evidence: `src/lib/components/Avatar.svelte:3-5`,
  `src/lib/components/Avatar.test.ts:73-78`; the review called the union
  unsound, the directive was removed to read `Property 'src' is missing in type
  '{ name: string; alt: string; }'`, and the restored directive now fails
  svelte-check if the union is widened.)

## What happened

`Avatar` requires `alt` exactly when `src` is present, expressed as
`{ src: string; alt: string } | { src?: undefined; alt?: undefined }`. A
reviewer read the union as admitting `{ name, alt }` without `src`. Removing
the `@ts-expect-error` line and running svelte-check printed the rejection and
the reason, which showed the branch already covered it. Keeping the directive
turns that one-off check into a permanent gate: widen the union with
`alt?: string` and the directive becomes unused, which is an error.

## Applicability conditions

- Applies to any contract expressed in types: required pairs, branded ids,
  exhaustion of a union, a prop that must not be passed.
- Requires the suppressed error to be read once, by hand and in full. A
  directive that hides a different error is worse than no directive.
- Does not apply when the rule can be checked at runtime on real input. A type
  test proves what a caller can write, never what a value can be.
- A reviewer disagreement about a type is answered with the compiler, not with
  an argument about the type's shape.

## Why it is admitted

The review output and the compiler message are both recorded in the ledger's
n=12 exceptions, and the committed directive is the artefact that keeps the rule
enforced. The scope condition stops the lesson from being read as "add
`@ts-expect-error` everywhere".

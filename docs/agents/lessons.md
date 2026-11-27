# Lessons — append-only agent memory

Itemized, id'd, evidence-backed bullets (ACE-style). Append only — never
rewrite, renumber, or delete existing bullets. Dedupe by listing ids in a
DEDUPE note for a later pass; a human or a dedicated consolidation pass does
the merging.

Admission gate: accumulation is non-monotonic and a defective lesson
contaminates later ones irreversibly, so a candidate lesson must pass an
external critical check — does the cited evidence actually support the
claim? — *before* it is written here. Post-hoc dedupe clears clutter; it
cannot undo contamination. The semantic half — evidence actually supports the
claim — remains an external review, not a regex.

## Format

- L<nnn> — <one-line lesson> (evidence: <file, run, or PR reference>)

One file per lesson under `lessons/`, named `<timestamp>-<slug>.md`, each
carrying its id in the bullet and registered below.

## Registry

<!-- register lesson files below this line, newest last -->

- L001 — A container-wide query can contradict the contract the test is checking: scope the assertion to the element under test. (evidence: `2026-11-27T06-54-11Z-assertion-scope.md`)
- L002 — In a jsdom test, move focus with `await element.focus()`, not `fireEvent.focus`, before asserting `document.activeElement` or focus-dependent behaviour. (evidence: `2026-11-27T071204Z-jsdom-focus-with-element-focus.md`)
- L003 — Convert a `querySelectorAll` NodeList with `Array.from` before using Array methods such as `findIndex`; the compiler will not catch it and the failure appears at runtime. (evidence: `2026-11-27T072217Z-nodelist-array-methods.md`)
- L004 — A `Snippet` prop takes a snippet value: use `{#snippet name()}` and `name={name}`, or `createRawSnippet` in tests; a factory call returns a plain object and fails the type check. (evidence: `2026-11-27T073951Z-snippet-value-not-factory.md`)

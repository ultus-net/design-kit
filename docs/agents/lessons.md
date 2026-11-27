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
- L005 — Read repository files in a test with `?raw` imports, not `node:fs`; `@types/node` is absent, so the svelte-check gate rejects `node:fs` even when the tests pass. (evidence: `2026-11-27T075017Z-raw-imports-instead-of-node-fs.md`)
- L006 — Cast a `container.querySelector` result to the concrete element type before reading `style`, `dataset`, `value` or `focus`; `Element` has none of them and svelte-check fails. (evidence: `2026-11-27T080149Z-cast-queried-element.md`)
- L007 — A known-gap allowlist ratchets only when the gate compares it to the derived gap as a set in both directions: a new gap fails, and a stale allowlisted name fails too. (evidence: `2026-11-27T081940Z-bidirectional-ratchet.md`)
- L008 — An under-specified spec row is a contract decision the component owns: state it in the rendered note, pin it with an assertion, and record the rationale in the ledger. (evidence: `2026-11-27T082407Z-under-specified-contract.md`)
- L009 — A workflow file is prose until it runs: claim only what the text-level test proves (step order and fatality), and say so where a reader checks. (evidence: `2026-11-27T082818Z-workflow-is-prose-until-it-runs.md`)
- L010 — A controlled native element must cancel its default action and be the only writer; test the activation path the user takes, not the event the code listens for. (evidence: `2026-11-27T084700Z-controlled-native-element.md`)
- L011 — When a query fails, fix the query before weakening the claim: a replacement assertion must prove at least as much, or say what it stopped proving. (evidence: `2026-11-27T085551Z-query-failure-not-claim-failure.md`)
- L012 — A type-level rule needs a type-level test, pinned with `@ts-expect-error`; read the suppressed error once, because an unrelated error satisfies it too. (evidence: `2026-11-27T090500Z-type-rule-needs-type-test.md`)
- L013 — A test that documents defective behaviour must call it a defect and cite the fix's work item, or a green suite hides it. (evidence: `2026-11-27T092500Z-name-the-defect-in-the-test.md`)

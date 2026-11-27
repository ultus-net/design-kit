# RSI experiment ledger

Structured, create-only record of every base-loop attempt, accepted or
rejected. One record per iteration; append only. Never edit or delete a prior
record: a negative result is data, not clutter.

## Schema (one block per iteration)

```text
n · date (UTC) · hypothesis (falsifiable) · trace evidence · code change ·
commit SHA + git tree · artifact name + checksum · exact command/config ·
test results · eval job path · score · gains · losses · exceptions ·
token/cost/duration · interpretation · keep/revert · next hypothesis
```

Schema v2 adds two fields, required on every new record:

```text
selection score (n items) · held-out score (n items, never used for selection)
· prev-chain: sha256:<hex of the preceding record block>
```

`selection score` is the score on the items the loop selected against.
`held-out score` is the score on a disjoint item set never used for
selection. Report both (winner's curse). `prev-chain` links each record to the
sha256 of the prior record block so the create-only rule is tamper-evident
(hash-chained admission).

## Rules

- Append only. One block per iteration. No rewrites, renumbering, or deletes.
- Report `selection score` and `held-out score` side by side; a `keep`
  requires a non-empty `held-out score`. Held-out items are never reused for
  selection.
- `prev-chain` is the sha256 of the preceding record block.
- Record failures with the same care as successes; an empty failures column
  is a smell, not a clean run.
- Name idiosyncratic infrastructure/verifier constraints explicitly, so a
  later reader does not re-derive them.
- Every `keep` cites the eval run that justified it; every `revert` keeps the
  failure evidence and the next hypothesis.
- A record is written by the base loop, not a subagent.

## Records

<!-- append blocks below this line, newest last -->

### n=1

- date (UTC): 2026-11-27T06:54Z
- hypothesis (falsifiable): Adding one PR D component (`Breadcrumbs`) lifts the exported component count from 19 to 20 and passes its five behavioural assertions, while every pre-existing gate stays green.
- trace evidence: `docs/design/2026-11-26-design-kit-shape-and-components.md:191-213` (ship bar and the `Breadcrumbs` contract), `src/lib/index.ts` (19 exports at the base commit), `src/lib/components/Pagination.svelte` (nav landmark and token conventions), `src/routes/components/+page.svelte` (demo wiring).
- code change: new `src/lib/components/Breadcrumbs.svelte`, `src/lib/components/Breadcrumbs.test.ts` and `src/routes/_demos/BreadcrumbsDemo.svelte`; the export, the `/components` section, and the counts in `README.md` and `/`.
- commit SHA + git tree: `5ab1b96` + `ec8d2efc17938fe5c13238d86b2ff98acd5f259d`
- artifact name + checksum: `@ultus-net/design-kit` static build at git tree `ec8d2efc17938fe5c13238d86b2ff98acd5f259d`
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 15 test files, 79 tests passed (74 baseline plus 5 new). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean.
- eval job path: none. The anchors define the verifier as the local gate run, so there is no remote eval job.
- selection score: 5/5 new `Breadcrumbs` assertions passed (5 items, the set the change was selected against).
- held-out score: 74/74 pre-existing tests passed (74 items, never used for selection).
- gains: exported components 19 → 20; one PR D component with landmark name, current item and empty-input coverage.
- losses: none observed. The suite reports 1.37 s wall clock, not compared to the baseline.
- exceptions: the first run failed at `Breadcrumbs.test.ts:38` because a container-wide anchor query matched the ancestor link; the assertion now scopes to the current item. The demo import order was corrected to alphabetical.
- token/cost/duration: tokens not captured by the harness; one session.
- interpretation: the component meets its documented contract and the frozen baseline is intact.
- keep/revert: keep.
- next hypothesis: adding `Tooltip` from PR D moves the count 20 → 21 without disturbing the 79-test baseline.
- prev-chain: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (genesis: no preceding block, so the link hashes the empty byte string).

### n=1 addendum (correction and review record)

Appended, not a rewrite. The block above was written by the harness hook before
the feature commit was amended and before the fresh-eyes review returned.

- superseding commit SHA + git tree: `0dd33dc60d98e92ab3bae53a918cd96a01cae92a` + `a61241da8c94bb4a8436983887f43d177b76d7b5`. The earlier `5ab1b96` / `ec8d2ef` pair named a pre-amend commit that no longer exists; the amend added one assertion, so the test count is unchanged at 79.
- review record: `record_review` APPROVED, reviewer `ses_de4379128ffeRgrfHwEZ1F6E5x`. The first pass returned REJECT with only P2/P3 findings and no P0/P1. On follow-up the reviewer confirmed no P0/P1, called the terminal-crumb non-link contract defensible, and withdrew the rejection. The one altered assertion is in the new test file, not a pre-existing test.
- added after review: `expect(container.querySelectorAll('a')).toHaveLength(1)` pins the terminal-crumb-ignores-`href` contract. Test count stays 79.
- held-out note: the held-out items are the 74 pre-existing tests plus the 186 contrast pairs, svelte-check and build, none of which this iteration tuned.
- next hypothesis unchanged: `Tooltip` from PR D, count 20 -> 21.
- prev-chain: sha256:4b89a72771807000cfce457a0e8e030dd9590221c778b3a40351b7b2508856ac (the `### n=1` block above, from its heading to its prev-chain line).

### n=1 close-out

- final review: `record_review` APPROVED, reviewer `ses_de43236efffeLJlCfHIXbCTh9Y`, bound to commit `bd33a570f968` (tree fingerprint `93828194f0ad`). The re-review was required because the first approval predated the amended assertion and the docs commit.
- work item: GitHub issue #11.
- PR: #12, `feature/breadcrumbs-component` into `main`.
- final gate run after the last mutation: `npm test` 15 files / 79 tests passed.

### n=2

- date (UTC): 2026-11-27T07:12Z
- hypothesis (falsifiable): Adding the PR D `Tooltip` lifts the exported component count from 20 to 21 and passes five behavioural assertions (hover show, focus show, leave hide, Escape hide without focus loss, non-interactive content), while every pre-existing gate stays green.
- trace evidence: `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR D, `Tooltip` row; `src/lib/components/Dialog.svelte:47-73` (focus and Escape conventions); `src/lib/components/Toast.svelte:21-33` (role and live-region conventions); `src/lib/index.ts` (20 exports at `7223388`).
- code change: new `src/lib/components/Tooltip.svelte`, `Tooltip.test.ts`, `src/routes/_demos/TooltipDemo.svelte`; export, `/components` section, five count claims, `[Unreleased]` bullet.
- commit SHA + git tree: `379cc8d` + `bc8eb02f28b61dd95d7baa6d7e3764100a77ba80` (the docs close-out commit follows).
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 16 files, 84 tests passed (79 baseline plus 5 new). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 5/5 new `Tooltip` assertions passed (5 items, the set the change was selected against).
- held-out score: 79/79 pre-existing tests passed (79 items, never used for selection), plus the unchanged contrast, check and build gates.
- gains: exported components 20 -> 21; one PR D component with hover, focus, Escape and non-interactive content coverage.
- losses: none observed. Suite wall clock 1.38 s, not a controlled comparison.
- exceptions: the cheap tier failed twice over (hover called `onclick`, `handleBlur` referenced an undefined `event`, two tests could not pass, five svelte-check errors), so the same spec went to the strong tier with the failing output. The spec's mandated `{#if open}<svelte:window onkeydown>` does not compile on Svelte 5.59.1 (`svelte_meta_invalid_placement`), so the requirement was met with an `$effect` add/remove listener. The first review returned REJECT labelled on P1 lines that affirmed correctness; a targeted follow-up produced "No P0 or P1 defect" and the rejection was withdrawn. A `console.log` and a pointless `preventDefault` were removed from the demo after the gates passed, which is why the gate run was repeated.
- token/cost/duration: tokens not captured; one session, two executor dispatches and two reviewer passes.
- interpretation: the component meets its documented contract; the frozen baseline is intact; the escape-listener deviation is deliberate and compile-forced.
- keep/revert: keep.
- next hypothesis: `Menu` from PR D moves the count 21 -> 22 with arrow-key navigation, Escape and focus return, without disturbing the 84-test baseline.
- prev-chain: sha256:672a114a235a6aff72f2084fdd0250f51165cb248da4ecc168e134df86ab295d (the `### n=1 close-out` block above, from its heading to the final gate line).

### n=2 close-out

- final review: `record_review` APPROVED, reviewer `ses_de42799a5ffeJs23zI8q7TZ9Gx`, bound to commit `d878d25ab6bd` (tree fingerprint `7b773e5df95d`).
- work item: GitHub issue #13.
- PR: #14, `feature/tooltip-component` into `main`.
- final gate run after the last code mutation: `npm test` 16 files / 84 tests passed.

### n=3

- date (UTC): 2026-11-27T07:22Z
- hypothesis (falsifiable): Adding the PR D `Menu` lifts the exported component count from 21 to 22 and passes its eight behavioural assertions (closed default, click open with named menu, arrow focus sequence, Home/End, Escape restore, click select, outside close without focus theft, Tab close), while every pre-existing gate stays green.
- trace evidence: `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR D, `Menu` row; `src/lib/components/Tabs.svelte:33-62` (roving focus via `[role="tab"]`); `src/lib/components/Tooltip.svelte:42-46` (`$effect` listener pattern); `src/lib/components/Dialog.test.ts` (jsdom focus conventions); `src/lib/index.ts` (21 exports at `bd38316`).
- code change: new `src/lib/components/Menu.svelte`, `Menu.test.ts`, `src/routes/_demos/MenuDemo.svelte`; export, `/components` section, five count claims, `[Unreleased]` bullet.
- commit SHA + git tree: `cdde374` + `6d6a0eb454fbff9939a2466bb1cf4cf8cb818072`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 17 files, 92 tests passed (84 baseline plus 8 new). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 8/8 new `Menu` assertions passed (8 items, the set the change was selected against).
- held-out score: 84/84 pre-existing tests passed (84 items, never used for selection), plus the unchanged contrast, check and build gates.
- gains: exported components 21 -> 22; one PR D component with trigger, menu, arrow/Home/End navigation, Escape/Tab close and outside-dismiss coverage.
- losses: none observed. Suite wall clock 1.36 s, not a controlled comparison.
- exceptions: the cheap tier exhausted its step cap with a compile error (stray `});` at `Menu.svelte:116`), an extra required `id` prop, 18 svelte-check errors and a changelog bullet missing, so the spec went to the strong tier with that output. A runtime `NodeList.findIndex` crash and an uninstalled jest-dom `toHaveFocus` matcher only surfaced under the real focus path. The first review returned REVISE with one P1 (the outside-click test asserted only that focus was not on the trigger) and a P2 (`Tab` focus outcome unpinned); both were fixed in-session: the test now spies on `trigger.focus`, and `Tab` focuses the trigger before closing, with an eighth test. The reviewer then returned ACCEPT.
- token/cost/duration: tokens not captured; one session, two executor dispatches and two reviewer passes.
- interpretation: the component meets the documented contract, the keyboard path is pinned by tests, and the frozen baseline is intact.
- keep/revert: keep.
- next hypothesis: `EmptyState` from PR D moves the count 22 -> 23 with a mark slot, title, description and optional action, without disturbing the 92-test baseline.
- prev-chain: sha256:afd2e13345668805d102788a6ad0767375c181b7fc0c6fae7db26f154f65fde1 (the `### n=2 close-out` block above, from its heading to the final gate line).

### n=3 close-out

- final review: `record_review` APPROVED, reviewer `ses_de41dfacfffemcmn1sDv54asAh`, bound to commit `bf925275e587` (tree fingerprint `4204476562bb`).
- work item: GitHub issue #15.
- PR: #16, `feature/menu-component` into `main`.
- final gate run after the last code mutation: `npm test` 17 files / 92 tests passed.

### n=4 (preregistration, schema v2)

- date (UTC): 2026-11-27T07:26Z
- change-type: feature
- hypothesis (falsifiable): adding `EmptyState` from PR D lifts exported components 22 -> 23 and passes four new behavioural assertions (title+description render, decorative mark is `aria-hidden`, action snippet fires, optional parts omitted), while the 92-test held-out baseline and the three other gates stay green.
- candidate source: campaign screener shortlist position 1 (C1); `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR D, `EmptyState` row; `docs/agents/ledger.md` n=3 `next hypothesis`.
- selection score (4 items): the four new `EmptyState` assertions, authored this iteration from the spec row.
- held-out score (92 items, never used for selection): the 92 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` > 92 with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, export count 23.
- reject rule: any gate red, or the change requires editing a pre-existing test, the verifier, or a token file.
- non-goals: PR E components, token changes, refactoring existing components, any change to the measured baseline.
- at-risk regressions: the five hand-maintained count claims go stale (flagged in n=1, n=2 and n=3); the decorative mark leaks into the accessibility tree; a required prop is added to an optional slot.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic (`vitest`, `svelte-check`, a contrast script, a static build), so compute per item is fixed and the harness edit cannot buy a gain with more sampling.
- citations used: the design spec section 3 PR D row (repo document, no id); `docs/agents/ledger.md` records n=1..n=3. This repo has no `docs/agents/reading-list.md` and no `docs/agents/findings/`, so the campaign's harness citations are not asserted as grounding for a component addition; the record says so rather than borrowing ids.
- code change: new `src/lib/components/EmptyState.svelte`, `EmptyState.test.ts`, `src/routes/_demos/EmptyStateDemo.svelte`; export between `Dialog` and `Field`; `/components` section; five count claims; `[Unreleased]` bullet.
- commit SHA + git tree: `0ff4583` + `93c8b302d1b896221a2efaf669fd870efc762c81`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 18 files, 96 tests passed (92 baseline plus 4 new). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 4/4 new `EmptyState` assertions passed (4 items).
- held-out score: 92/92 pre-existing tests passed (92 items, never used for selection), plus the unchanged contrast, check and build gates.
- gains: exported components 22 -> 23; one PR D component with decorative mark, title, optional description and optional action.
- losses: none observed.
- exceptions: the cheap tier exhausted its step cap with two wrong assertions (a `<span>` has no `img` role; the omission test queried a title it never rendered) and a demo that passed snippet factory calls, producing 3 type errors and 1 unused-selector warning. The strong tier corrected the new tests structurally, replaced the factories with `{#snippet}` blocks, and finished the count claims and changelog. The first review returned REJECT with both P1 entries affirming the code and one P2 (the action test proved a child click but not that the snippet rendered inside `.fw-empty__action`); the test now asserts the wrapper exists and `action.contains(button)`, and the reviewer withdrew the rejection.
- token/cost/duration: tokens not captured; one session, two executor dispatches and two reviewer passes.
- interpretation: the component meets the spec row, the action slot is pinned by a test, and the frozen baseline is intact.
- keep/revert: keep.
- next hypothesis: the count-claim gate (`instrument`) derives the export count and asserts the five hand-maintained claims, moving nothing in the component count while catching the regression flagged in n=1..n=4.
- prev-chain: sha256:351867578e3fbe21e8689828dc6e83bbc6a674368acde84c314e9b25bfccc623 (record n=3, the highest top-level `### n=` below 4, hashed with the repo's `validate-ledger.cjs` `parseRecords`/`sha256` so the bytes match the gate).

### n=4 close-out

- final review: `record_review` APPROVED, reviewer `ses_de40e470cffe5GfvmbW2hFWvmT`, bound to commit `f30f4bdb141d` (tracked fingerprint `86c3909ce2ff`).
- work item: GitHub issue #17.
- PR: #18, `feature/emptystate-component` into `main`.
- final gate run after the last code mutation: `npm test` 18 files / 96 tests passed.

### n=5 (preregistration, schema v2)

- date (UTC): 2026-11-27T07:47Z
- change-type: instrument
- hypothesis (falsifiable): a new `src/lib/count-claims.test.ts` derives the exported component count from `src/lib/index.ts`, parses the five hand-maintained count claims from `README.md` (2), `src/routes/+page.svelte` (2) and `src/routes/components/+page.svelte` (1), and fails when any claim disagrees with the derived count. `npm test` moves 96 -> 100 passing with 0 failures, the export count stays 23, and the other three gates are unchanged.
- candidate source: campaign screener shortlist position 2 (CV); the at-risk regression recorded in `docs/agents/ledger.md` n=1, n=2, n=3 and n=4 (`the five hand-maintained count claims go stale`).
- selection score (4 items): the four new assertions — derived count equals the number of `.svelte` component exports, all five claim sites are located, every claim equals the derived count, and the word parser maps `Twenty-two` to 22 and `twenty-three` to 23 while the export counter ignores non-component exports.
- held-out score (96 items, never used for selection): the 96 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 100 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, export count still 23.
- reject rule: any gate red, any pre-existing test edited, or the new test hard-codes the component list instead of deriving it.
- non-goals: adding components, changing tokens, editing `vite.config.ts`, or replacing the hand-maintained claims with generated text.
- at-risk regressions: a matcher that misses a claim and silently passes (guarded by the located-sites assertion); a file read that depends on the working directory (use `import.meta.url`, not `process.cwd()`); the parser accepting an unrelated `... Svelte 5 components` phrase (guarded by requiring a tens word).
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic, so compute per item is fixed.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: the new test is additive and the stale-claim case is exercised with synthetic strings inside the same test file, so no restored-state re-run is needed.
- citations used: `docs/agents/ledger.md` n=1..n=4 (the stale-count regression is the trace); `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3 (the component set the count describes). This repo has no `docs/agents/reading-list.md`, so no harness citation id is asserted.

- code change: new `src/lib/count-claims.test.ts` only. No existing file changed.
- commit SHA + git tree: `b45dbe18d271` + `2b55106283e949278832b3476619559012376144`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 19 files, 100 tests passed (96 baseline plus 4 new). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 4/4 new gate tests passed (4 items).
- held-out score: 96/96 pre-existing tests passed (96 items, never used for selection), plus the unchanged contrast, check and build gates.
- negative control: changing one `README.md` claim to `twenty-two` made the gate fail with `README.md: expected 22 to be 23`; reverting restored 4/4. The gate fails on the stale claim, not on an unrelated assertion.
- gains: the five hand-maintained count claims are now checked against `src/lib/index.ts`, closing the regression flagged in n=1..n=4. Export count unchanged at 23.
- losses: none observed. `npm test` file count 18 -> 19.
- exceptions: the cheap tier exhausted its step cap with all four tests failing (`parseInt('twenty-two')` is `NaN`, capture-group `.filter` read `undefined`, `index.ts` has no default export) and left two debug scratch files, which were deleted. The strong tier rewrote the file, then svelte-check failed with two `node:fs` errors because `@types/node` is absent; the fix was `?raw` imports, made in-session. The first review returned REQUEST CHANGES on two P2s (irregular spacing variants; an export path outside `./components/<name>.svelte`); the parser now normalises dashes and whitespace, the export matcher accepts any `./components/**.svelte` path, both cases have tests, and the reviewer withdrew the request.
- token/cost/duration: tokens not captured; one session, two executor dispatches and two reviewer passes.
- interpretation: the gate derives its number, fails on a stale claim, and adds no dependency. The frozen baseline is intact.
- keep/revert: keep.
- next hypothesis: `Skeleton` from PR D (`feature`) moves the count 23 -> 24 with an `aria-hidden` shape primitive, and the new count gate fails until all five claims are updated, which makes the claim update mechanical rather than a thing to remember.
- prev-chain: sha256:fc37f3eb60683e8861fcd05af58143eb5964abb639cf808d619d29e278f486ca (same link as the preregistration, restated for the gate).








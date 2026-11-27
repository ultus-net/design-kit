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

### n=5 close-out

- final review: `record_review` APPROVED, reviewer `ses_de404c46fffeQF13zUIu1n7yVK`, bound to commit `8c5f8ea51afe` (tracked fingerprint `9f9ec6d13ad1`).
- work item: GitHub issue #19.
- PR: #20, `feature/count-claim-gate` into `main`.
- final gate run after the last code mutation: `npm test` 19 files / 100 tests passed.

### n=6 (preregistration, schema v2)

- date (UTC): 2026-11-27T07:58Z
- change-type: feature
- hypothesis (falsifiable): adding `Skeleton` from PR D lifts exported components 23 -> 24 and passes four new behavioural assertions (root is `aria-hidden`, default shape is `line`, all three shape classes apply, explicit `width`/`height` reach the style attribute), while the 100-test held-out baseline, the count gate and the three other gates stay green.
- candidate source: campaign screener shortlist position 3 (C3); `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR D, `Skeleton` row: "`aria-hidden`, shapes `line`, `block`, `circle` built from radius tokens | hidden from the accessibility tree, shape classes".
- selection score (4 items): the four new `Skeleton` assertions, authored this iteration from the spec row.
- held-out score (100 items, never used for selection): the 100 pre-existing tests (including the n=5 count gate), plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` > 100 with 0 failures (the count gate included), svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, export count 24.
- reject rule: any gate red, any pre-existing test edited, or a literal colour in the component CSS.
- non-goals: animation or shimmer, a `lines` convenience prop, the PR E `Progress` component, token changes.
- at-risk regressions: the count gate fails until all five claims read twenty-four (expected signal, not a regression to suppress); `aria-hidden` placed on an inner node instead of the root; a circle without an explicit size collapsing to zero; a literal colour instead of a token.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic, so compute per item is fixed.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: the change is additive; the count gate is the unchanged incumbent that must stay green.
- citations used: `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3 PR D `Skeleton` row (repo document, no id); `docs/agents/ledger.md` n=5 (the count gate this iteration must satisfy). This repo has no `docs/agents/reading-list.md`, so no harness citation id is asserted.
- prev-chain: sha256:353ced258faf37987f89bd6b4e62d03127d3edf8da352f6d1cd065e3ba129ee4 (the n=5 preregistration block, the highest top-level `### n=` below 6 that the gate's `reduce` selects when two records share n=5; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: new `src/lib/components/Skeleton.svelte`, `Skeleton.test.ts`, `src/routes/_demos/SkeletonDemo.svelte`; export between `Select` and `Stat`; `/components` section; five count claims; `[Unreleased]` bullet.
- commit SHA + git tree: `7b9d237` + `bb4c7b7c9051c4f2b963f8bf270f106a72d1e76c`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 20 files, 104 tests passed (100 baseline plus 4 new). The n=5 count gate passed, proving all five claims read twenty-four. svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 4/4 new `Skeleton` assertions passed (4 items).
- held-out score: 100/100 pre-existing tests passed (100 items, never used for selection, count gate included), plus the unchanged contrast, check and build gates.
- gains: exported components 23 -> 24; one PR D placeholder with line, block and circle shapes from radius tokens. The count gate caught the stale claims immediately, so the update was mechanical rather than remembered.
- losses: none observed.
- exceptions: the cheap tier hit its step cap with the component and tests written but the wiring half-done: a stray `let shapes = $state(...)` in the components page, no demo, no section, no changelog and no README/home claim updates. The strong tier removed the stray state, found two type errors the cheap draft left (`export type { Props as SkeletonProps }` in `index.ts` and an uncast `querySelector` result read for `.style`), and finished the wiring. The reviewer returned ACCEPT with no P0 or P1.
- token/cost/duration: tokens not captured; one session, two executor dispatches and one reviewer pass.
- interpretation: the component meets the spec row, the gate now enforces the count claims, and the frozen baseline is intact.
- keep/revert: keep.
- next hypothesis: with PR D's five rows shipped, the campaign's next candidate is outside the frozen PR D scope, so a fresh spec decision (PR E: `Progress`) is required before another iteration.

### n=6 close-out

- final review: `record_review` APPROVED, reviewer `ses_de3f98a85ffeUoVnJtlwyPRB3q`, bound to commit `e4017dc04d3d` (tracked fingerprint `b9cefd22fd47`).
- work item: GitHub issue #21.
- PR: #22, `feature/skeleton-component` into `main`.
- final gate run after the last code mutation: `npm test` 20 files / 104 tests passed.
- prev-chain: sha256:353ced258faf37987f89bd6b4e62d03127d3edf8da352f6d1cd065e3ba129ee4 (same link as the preregistration, restated for the gate).

### n=7 (preregistration, schema v2)

- date (UTC): 2026-11-27T08:20Z
- change-type: instrument
- hypothesis (falsifiable): a new `src/lib/tested-exports.test.ts` derives the component export names from `src/lib/index.ts` and the sibling test files from `import.meta.glob('./components/*.test.ts')`, then asserts the untested set equals a documented seven-name allowlist (Alert, AppShell, Badge, Card, Input, Select, Stat). `npm test` moves 104 -> 108 passing, the 7/24 gap becomes explicit, a new untested export fails the gate, and a stale allowlist entry fails it too.
- candidate source: campaign 2 screener position 1 (C1); goal audit during campaign 2 setup, which found the metric line reporting 24 exports while only 17 exports carry a sibling test.
- selection score (4 items): the four new assertions — export derivation returns more than 20 names, the untested set equals the allowlist exactly, a synthetic export without a test is reported as untested, and the tested count equals exports minus the allowlist.
- held-out score (104 items, never used for selection): the 104 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 108 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, export count still 24.
- reject rule: any gate red, any pre-existing test edited, or the allowlist silently growing without a ledger record.
- non-goals: writing the seven missing component tests in this iteration, changing any component, changing the count claims (they describe exports, not tested exports), or editing `src/lib/count-claims.test.ts`.
- at-risk regressions: the glob keys and the export names differing by case (`Button` vs `button`); the allowlist hiding a new gap because the gate compares sets, not lengths; the metric line and the gate drifting apart.
- metric correction (recorded here because the audit belongs with the change): the playbook metric read 19 -> 24 "exported components that carry behavioural tests". The measured value is 17 tested of 24 exported, because seven exports never had a sibling test. The earlier deltas were export-count deltas. The playbook line is corrected in this iteration to state the honest value and the discrepancy.
- measurement note (added after the first review): the gate measures a sibling `*.test.ts`, not coverage depth. No test file imports any of the seven names (`grep "from './\(Alert\|AppShell\|Badge\|Card\|Input\|Select\|Stat\)\.svelte'"` over `*.test.ts` returns nothing), so the proxy and "no test imports it" agree today. The test, the playbook and this record use the sibling-file wording so the metric is not read as a coverage claim.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic, so compute per item is fixed.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: the gate is additive; the negative controls (a synthetic untested export, a stale allowlist entry) run inside the new test file.
- citations used: `docs/agents/ledger.md` n=4..n=6 (each records a component added with tests, but no record audited the seven untested exports); `docs/agents/rsi-loop-playbook.md` "Anchors for this repo", whose metric line is the artefact under audit. The playbook's own "Grounding" section states this repo carries no reading list and no arXiv ids, so no citation id is asserted.
- prev-chain: sha256:973f0771720f72c68ac5aea7a937ec3a1939ad592436810b4c7f88aea5aba4c2 (the n=6 preregistration block, the highest top-level `### n=` below 7 that the gate's `reduce` selects when two records share n=6; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: new `src/lib/tested-exports.test.ts`; `docs/agents/rsi-loop-playbook.md` metric line corrected. No component, token or pre-existing test changed.
- commit SHA + git tree: `5a91731f2279` + `0c87741f0a61026a9767baf8bf6611a409eb80db`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 21 files, 108 tests passed (104 baseline plus 4 new). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports unchanged at 24.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 4/4 new ratchet assertions passed (4 items).
- held-out score: 104/104 pre-existing tests passed (104 items, never used for selection), plus the unchanged contrast, check and build gates.
- negative controls: adding `export { default as NewThing } from './components/NewThing.svelte';` to `index.ts` failed the set comparison with `+ "NewThing"`; removing `Stat` from the allowlist failed with `+ "Stat"`. Both restored to 4/4.
- gains: the metric is now honest and pinned at 17 of 24 exports with a sibling test; the seven-name gap cannot grow, cannot be silently substituted, and cannot linger after a component gains a test. The playbook's overstated 19 -> 24 history is corrected in place.
- losses: none observed. Suite 20 -> 21 files.
- exceptions: written by the calling session, not delegated, because it changes what the metric counts. The first review returned REQUEST CHANGES with one P1 (the sibling-file proxy could mislabel coverage). The fix relabelled the property everywhere to "sibling test file", added the evidence that no test imports any of the seven, and the reviewer withdrew the request with no P0/P1.
- token/cost/duration: tokens not captured; one session, one reviewer pass plus one follow-up.
- interpretation: the ruler is now measured, not assumed, and the gap is documented instead of hidden.
- keep/revert: keep.
- next hypothesis: `Progress` from PR E moves the tested count 17 -> 18 and pins `role="progressbar"`, `aria-valuenow/min/max`, and an indeterminate state that omits `aria-valuenow`.

### n=7 close-out

- final review: `record_review` APPROVED, reviewer `ses_de3ea2667ffeubwnb6feWw5hbF`, bound to commit `17d058bde469` (tracked fingerprint `fff365721e9b`).
- work item: GitHub issue #23.
- PR: #24, `feature/tested-export-ratchet` into `main`.
- final gate run after the last code mutation: `npm test` 21 files / 108 tests passed.
- prev-chain: sha256:973f0771720f72c68ac5aea7a937ec3a1939ad592436810b4c7f88aea5aba4c2 (same link as the preregistration, restated for the gate).

### n=8 (preregistration, schema v2)

- date (UTC): 2026-11-27T08:32Z
- change-type: feature
- hypothesis (falsifiable): adding `Progress` from PR E lifts exports 24 -> 25 and tested exports 17 -> 18, and passes four new behavioural assertions (determinate ARIA values, custom max with proportional fill, indeterminate omitting `aria-valuenow`, and clamping out-of-range values), while the 108-test held-out baseline, the count gate, the ratchet and the other gates stay green.
- candidate source: campaign 2 screener position 2 (C2); `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR E, `Progress` row: "`role=\"progressbar\"`, `aria-valuenow/min/max`, indeterminate when no value | ARIA values, indeterminate omits `aria-valuenow`"; ledger n=7 `next hypothesis`.
- selection score (4 items): the four new `Progress` assertions.
- held-out score (108 items, never used for selection): the 108 pre-existing tests (count gate and tested-export ratchet included), plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` > 108 with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, export count 25, ratchet still green.
- reject rule: any gate red, any pre-existing test edited, or a literal colour in the component CSS.
- non-goals: animation or indeterminate motion, a segmented or stacked variant, the other PR E components, token changes.
- at-risk regressions: `aria-valuenow` emitted on the indeterminate state; division by zero when `max` is 0 or negative; a fill width above 100% for an out-of-range value; the count gate failing until all five claims read twenty-five.
- contract decision (added after the first review): the indeterminate state omits `aria-valuemin` and `aria-valuemax` as well as `aria-valuenow`. The spec row names only `aria-valuenow`; the component owns the stronger contract because an operation whose completion is unknown has no honest range to state, and emitting `0`/`100` would claim one. The `/components` note and the tests state all three omissions, so the contract is visible where a reader looks.
- router decision: dispatched to `executor-strong` without a cheap attempt. The cheap tier has produced no acceptable diff in seven dispatches across two campaigns (step-cap exhaustion, compile errors, wrong assertions), which is the sustained-difficulty trigger the escalation router names, already met at campaign start.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic, so compute per item is fixed.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: additive; the count gate and the ratchet are the incumbents that must stay green.
- citations used: the design spec section 3 PR E `Progress` row (repo document, no id); `docs/agents/ledger.md` n=7. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:0e224f8205081007f9785eb0585f75dc7f124cb950d86919746ac87d5f521977 (the n=7 preregistration block, the highest top-level `### n=` below 8 that the gate's `reduce` selects when two records share n=7; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: new `src/lib/components/Progress.svelte`, `Progress.test.ts`, `src/routes/_demos/ProgressDemo.svelte`; export between `Pagination` and `RadioGroup`; `/components` section and note; five count claims; `[Unreleased]` bullet.
- commit SHA + git tree: `840d46ff9aae` + `8f9d9cb0a5cb0bc1bbf699f35cfe5e08748dc3cf`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 22 files, 113 tests passed (108 baseline plus 5 new). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports 25; the ratchet stayed green because `Progress` has a sibling test, so the tested count moved 17 -> 18.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 4/4 preregistered assertions passed, plus a fifth test added when the two-bar clamp case was split after review; the split strengthens isolation and does not change the contract.
- held-out score: 108/108 pre-existing tests passed (108 items, never used for selection), plus the unchanged contrast, check and build gates.
- gains: exported components 24 -> 25, tested exports 17 -> 18; the progressbar contract is pinned including clamping and the indeterminate state; the count gate forced the five claim updates.
- losses: none observed.
- exceptions: dispatched to `executor-strong` directly per the recorded router decision; it passed the four gates on the first attempt. Its only deviation was `$derived` instead of the specified plain `const` for `safeMax`, `clamped` and `percent`, which is correct for Svelte 5 props and keeps the specified expressions. The first review returned REQUEST CHANGES with one P1 (the indeterminate state omits min/max as well as valuenow, which the spec row did not state) and one P2 (two bars in one test); the contract was written into the component page note and this record, the test was split into two, and the reviewer withdrew with no P0/P1.
- token/cost/duration: tokens not captured; one session, one executor dispatch and two reviewer passes.
- interpretation: the component meets and documents the contract, and the metric moved by one tested export.
- keep/revert: keep.
- next hypothesis: the GitHub Actions `gate` candidate runs the four gates on push and PR, so a red tree cannot reach `main` again; it is locally checkable with `actionlint`.
- prev-chain: sha256:0e224f8205081007f9785eb0585f75dc7f124cb950d86919746ac87d5f521977 (same link as the preregistration, restated for the gate).

### n=8 close-out

- final review: `record_review` APPROVED, reviewer `ses_de3e51cfbffeEnDveJkSa8PARS`, bound to commit `3184e76d5ff3` (tracked fingerprint `86a49179744c`).
- work item: GitHub issue #25.
- PR: #26, `feature/progress-component` into `main`.
- final gate run after the last code mutation: `npm test` 22 files / 113 tests passed.

### n=9 (preregistration, schema v2)

- date (UTC): 2026-11-27T08:50Z
- change-type: gate
- hypothesis (falsifiable): a new `.github/workflows/gates.yml` runs `npm ci` then the four existing gate scripts on push to `main` and on every pull request, and a new `src/lib/workflow-gates.test.ts` pins the contract by parsing the workflow with `?raw`. `actionlint` reports zero findings, the pinned assertions pass 4/4, `npm test` moves 113 -> 117, exports stay 25, and no component, token or existing test changes.
- candidate source: campaign 2 screener position 3 (C4); ledger n=8 `next hypothesis`. The audit fact behind it: there is no `.github/` directory, so nothing runs the four gates on a PR today and a red tree reaches `main` whenever a session forgets a gate.
- selection score (4 items): the four new workflow assertions — `npm ci` is present, each of `test`/`check`/`contrast`/`build` is invoked, every `npm run <script>` named in the workflow exists in `package.json`, and the workflow triggers on both `push` and `pull_request`.
- held-out score (113 items, never used for selection): the 113 pre-existing tests (count gate and tested-export ratchet included), plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 117 passed with 0 failures, `actionlint .github/workflows/gates.yml` exits 0, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports stay 25.
- reject rule: any gate red, `actionlint` finding, any pre-existing test edited, or the workflow pinning `npm install` instead of `npm ci` (which would ignore the lockfile).
- non-goals: adding a status badge to the README, caching beyond `setup-node`'s npm cache, splitting jobs, adding a fifth gate, or enforcing branch protection through the API.
- at-risk regressions: `actionlint` flagging the workflow's expression syntax; the workflow and `package.json` script names drifting apart; the workflow passing while a contributor runs a different Node major; CI cost on every push.
- honest limit recorded before the run: this iteration can verify the workflow file statically (`actionlint`) and semantically (the pinned assertions), but it cannot prove the workflow executes on GitHub until a later PR triggers it. The first real signal arrives on the next PR's checks tab. That is a weaker verifier than a local test run, and it is stated here rather than assumed.
- router decision: written by the calling session. The change defines the CI contract and its own verifier, which is a measurement decision like n=7, and the cheap tier has produced no acceptable diff in seven dispatches.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic, so compute per item is fixed.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: the workflow is additive; the four gates it invokes and the two existing gate tests are the incumbents that must stay green.
- citations used: GitHub Actions workflow syntax for `on`, `permissions`, `concurrency` and `setup-node` (vendor documentation, no arXiv id); `package.json` scripts (repo file); ledger n=8. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:237be1d9876a65eb9851fc632ef86b3be444387e6b8916ed97c087f7aafe813e (the n=8 preregistration block, the highest top-level `### n=` below 9 that the gate's `reduce` selects when two records share n=8; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: new `.github/workflows/gates.yml` and `src/lib/workflow-gates.test.ts`; one `CHANGELOG.md` bullet; one verifier-anchor sentence in `docs/agents/rsi-loop-playbook.md`. No component, token or pre-existing test changed.
- commit SHA + git tree: `75166090dd5d` + `a6e988d98b97fb8128558c3e696f21ca600f24a0`.
- artifact name + checksum: no packaged artifact; the workflow file at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build`, `actionlint .github/workflows/gates.yml` on Node v26.13.0, vitest 5.1.1, actionlint from the system package.
- test results: 23 files, 118 tests passed (113 baseline plus 5 new; the preregistration predicted 117 because it listed four assertions, and the review round added the step-order assertion that binds the workflow to the gates it claims). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. `actionlint` exit 0. Exports unchanged at 25.
- eval job path: none. The anchors define the verifier as the local gate run; for a workflow file the local run cannot execute the workflow, which the `honest limit` line in the preregistration already recorded.
- selection score: 5/5 pinned assertions passed (five items: `npm ci` first, gate order exactly test/check/contrast/build, only scripts that exist in `package.json`, no `continue-on-error` or `|| true` or step `if:`, both triggers present).
- held-out score: 113/113 pre-existing tests passed (113 items, never used for selection), plus the unchanged contrast, check and build gates.
- negative controls: `npm run contrst` typo failed the order and existence assertions (`[ 'contrast' ]`, `[ 'contrst' ]`); deleting the `pull_request:` trigger failed the trigger assertion; moving `contrast` before `check` failed the order assertion; adding `continue-on-error: true` to the build step failed the fatality assertion. All four restored to 5/5.
- gains: a red tree now reports on the pull request instead of only in the session that ran the gates. The workflow installs from the lockfile, runs the four gates in order, and no step can be made non-fatal without failing the test.
- losses: one more workflow to maintain, and one more file that the count-claims and tested-export gates read past.
- exceptions: authored by the calling session (it defines the CI contract and its own verifier). The first review returned REQUEST CHANGES with two P1s, both "the promise is stronger than the check": the merge path was not pinned, and the trigger assertion checked for a key rather than a behaviour. The fix narrowed the promise to advisory visibility, stated that `main` has no branch protection (verified: `gh api .../branches/main/protection` returns 404), and strengthened the test to pin step order and fatality. The second round withdrew the block, leaving one P2: the runtime pin.
- runtime pin decision: the reviewer's P2 asked whether `node-version` should be LTS. The workflow pins `26.13.0`, the exact version every gate in this campaign ran on, rather than a floating major or an LTS major that would verify a different runtime from the one the maintainer uses. An unavailable pin fails loudly at `setup-node`, which is visible in the checks tab and is a one-line fix, whereas a silent LTS/Current divergence would not be.
- honest limit, restated after the run: the local verifier proves the workflow text, not that GitHub executes it. The first real signal is this PR's own `gates` run.
- token/cost/duration: tokens not captured; one session, two reviewer rounds.
- interpretation: the gate exists and is pinned; whether it executes is proven by the checks tab on this PR, not by `npm test`.
- keep/revert: keep.
- next hypothesis: `Accordion` from PR E (`details`/`summary` per item, `multiple` prop, `aria-expanded` on the summary) is the next feature candidate, and the campaign's remaining structural gap is that the CI checks are advisory until branch protection requires them.
- prev-chain: sha256:237be1d9876a65eb9851fc632ef86b3be444387e6b8916ed97c087f7aafe813e (same link as the preregistration, restated for the gate).

### n=9 close-out

- final review: `record_review` APPROVED, reviewer `ses_de3e14790ffeMxTnEfv6EvWppf`, bound to commit `b75a7b9a47c6` (tracked fingerprint `55bfd41ac4db`).
- work item: GitHub issue #27.
- PR: #28, `feature/ci-gate` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45966249719 — job `gates` passed in 39s on the PR head, which is the run the preregistration said the local verifier could not supply. The workflow executed `npm ci` and all four gates on GitHub.
- final gate run after the last code mutation: `npm test` 23 files / 118 tests passed.

### n=10 (preregistration, schema v2)

- date (UTC): 2026-11-27T09:10Z
- change-type: feature
- hypothesis (falsifiable): adding `Accordion` from PR E lifts exports 25 -> 26 and tested exports 18 -> 19, and passes five new behavioural assertions (one `details`/`summary` per item with titles, one-open mode closing the previously open sibling, multiple mode keeping both open, closing the open item leaving none open, and the content snippet rendering inside its own item), while the 118-test held-out baseline, the count gate, the tested-export ratchet and the other gates stay green.
- candidate source: campaign 3 screener position 1 (C1); `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR E, `Accordion` row: "Native `details`/`summary` per item, `multiple` prop, `aria-expanded` on the summary | one-open mode closes siblings, multiple mode keeps them"; ledger n=9 `next hypothesis`.
- screener disagreement recorded: the screener proposed `gate` (branch protection) first, which would repeat the previous iteration's type and break the diversity brake. Branch protection also changes the merge path for every future session, which is an operator decision. It is deferred, not adopted, and the campaign runs feature -> test -> feature.
- selection score (5 items): the five new `Accordion` assertions.
- held-out score (118 items, never used for selection): the 118 pre-existing tests (count gate, tested-export ratchet and workflow text test included), plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 123 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, export count 26, count gate green after the five claims read twenty-six.
- reject rule: any gate red, any pre-existing test edited, a literal colour in the component CSS, or a one-open mode that closes the newly opened item instead of the sibling.
- non-goals: animation of the disclosure, a heading-level prop, an `openIds` controlled API beyond the bindable default, the other PR E components.
- at-risk regressions: jsdom not dispatching a native `toggle` on summary click, so the tests drive the state change explicitly; the `open` attribute and internal `openIds` disagreeing after a close event; `aria-expanded` duplicating the native details state and drifting from it; `role="group"` without an accessible name.
- router decision: dispatched to `executor-strong`. The cheap tier has produced no acceptable diff in seven dispatches across two campaigns, the sustained-difficulty trigger is already met, and this component needs a toggle-synchronisation design the tests can observe.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic, so compute per item is fixed.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: the component is additive; the count gate and the ratchet are the incumbents that must stay green.
- citations used: the design spec section 3 PR E `Accordion` row (repo document, no id); `src/lib/components/Tabs.svelte` and `Tabs.test.ts` (the repo's array-plus-snippet idiom this component follows); ledger n=9. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:e1f0c7a8090c9cb72c8d53a0be1ab31ecacbf6156b50069d74fdfeddfb9ef16b (the n=9 preregistration block, the highest top-level `### n=` below 10 that the gate's `reduce` selects when two records share n=9; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: new `src/lib/components/Accordion.svelte`, `Accordion.test.ts`, `src/routes/_demos/AccordionDemo.svelte`; export before `Alert`; `/components` section; five count claims; `[Unreleased]` bullet; playbook metric line refreshed to 19 of 26.
- commit SHA + git tree: `55b49175d6b6` + `93bb890674d6347563a75334bc05639b1904dcd3`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 24 files, 125 tests passed (118 baseline plus 7 new; the preregistration predicted five assertions, and the review rounds replaced the synthetic toggle machine with the real click path and added a controlled-state test and a keyboard-dispatched click test). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports 26; the ratchet stayed green because `Accordion` has a sibling test, so the tested count moved 18 -> 19.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 7/7 new `Accordion` assertions passed (seven items: per-item details and summaries, one-open closes the sibling on a click, multiple keeps both, closing leaves none, bound `openIds` opens the named item, a keyboard-dispatched click opens and keeps focus, and each item's content stays inside its own details).
- held-out score: 118/118 pre-existing tests passed (118 items, never used for selection), plus the unchanged contrast, check and build gates.
- gains: exported components 25 -> 26, tested exports 18 -> 19; the disclosure group has one writer for its open state, with pointer and keyboard activation on the same path.
- losses: none observed.
- exceptions: dispatched to `executor-strong`, which passed the four gates at 123 tests on its first attempt. The first review rejected the design: the `toggle` handler could be raced by a sibling close event, and the tests drove a synthetic state machine rather than the click path. A probe showed jsdom never fires `toggle`, so the handler was untested and the aria state never left `false` under a real click. The component was redesigned to render from `openIds` and to suppress the native toggle with `preventDefault()` on the summary click. A second review round held the change until keyboard activation was shown; a keyboard-dispatched click test plus the HTML activation-behaviour evidence cleared it, and the third verdict was ACCEPT.
- real-browser check, attempted and not obtained: Chrome DevTools could not drive a page because no Chrome binary exists at `/opt/google/chrome/chrome`. The keyboard evidence is therefore the `detail: 0` click test plus the platform's activation behaviour, not an observed browser session.
- token/cost/duration: tokens not captured; one session, one executor dispatch and three reviewer rounds.
- interpretation: the component meets the spec row with a single state writer; the review caught a test that would have passed while the component was inert in jsdom.
- keep/revert: keep.
- next hypothesis: sibling behavioural tests for the seven exports the ratchet allowlists (Alert, AppShell, Badge, Card, Input, Select, Stat) empty that allowlist and move the tested count 19 -> 26 without adding exports.
- prev-chain: sha256:e1f0c7a8090c9cb72c8d53a0be1ab31ecacbf6156b50069d74fdfeddfb9ef16b (same link as the preregistration, restated for the gate).

### n=10 close-out

- final review: `record_review` APPROVED, reviewer `ses_de3ce6600ffeRGy46JGzzcIxFT`, bound to commit `be2c26b873f7` (tracked fingerprint `45036cbec372`).
- work item: GitHub issue #29.
- PR: #30, `feature/accordion-component` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45968883095 — `gates` passed in 26s on the PR head.
- final gate run after the last code mutation: `npm test` 24 files / 125 tests passed.








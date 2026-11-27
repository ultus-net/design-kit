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

### n=11 (preregistration, schema v2)

- date (UTC): 2026-11-27T09:20Z
- change-type: test
- hypothesis (falsifiable): adding sibling test files for the seven exports the ratchet allowlists (`Alert`, `AppShell`, `Badge`, `Card`, `Input`, `Select`, `Stat`) moves `npm test` 125 -> 146 with 0 failures, shrinks the allowlist to empty, and moves the tested-export metric 19 -> 26 of 26, while exports stay 26, the count claims stay twenty-six, and the four gates stay green.
- candidate source: campaign 3 screener position 2 (C2); ledger n=10 `next hypothesis`; `src/lib/tested-exports.test.ts` allowlist, which names the seven.
- selection score (21 items): three behavioural assertions per component, listed in the dispatch: alert role by variant, badge variant class, card header/footer snippets, stat delta and tone class, input label/hint/error wiring, select options and disabled option, app shell skip link and nav landmark.
- held-out score (125 items, never used for selection): the 125 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 146 passed with 0 failures, the ratchet green with `WITHOUT_SIBLING_TEST = []`, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports 26.
- reject rule: any gate red, any component edited to make a test pass, a test that asserts a class name instead of a behaviour where a behaviour is observable, or the allowlist emptied while a listed component still has no test file.
- non-goals: changing any component, adding exports, changing the count gate, adding a coverage tool or a dependency.
- at-risk regressions: a component edited to satisfy a test (the rule above forbids it, and the reviewer checks the diff); tests that pass vacuously on an empty render; `Input` and `Select` generated ids making label association assertions fragile; `AppShell` asserting CSS classes rather than the skip link's target and the main landmark.
- honest limit: three assertions per component is a floor, not coverage. The metric this iteration moves counts sibling files, not depth, and the playbook wording says so.
- router decision: dispatched to `executor-strong`. Seven files across seven contracts in one dispatch is beyond the cheap tier's demonstrated capacity, and the sustained-difficulty trigger is already met.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: additive tests only; every component and gate is the incumbent.
- citations used: `src/lib/tested-exports.test.ts` (the allowlist being emptied); `src/lib/components/{Alert,AppShell,Badge,Card,Input,Select,Stat}.svelte` (the contracts the tests pin); ledger n=10. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:84464f7fe6ac98cf1d5b9f3d73da4d24d6b1313996bafc340fe1dc6baa7b2ec9 (the n=10 preregistration block, the highest top-level `### n=` below 11 that the gate's `reduce` selects when two records share n=10; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: seven new test files, `src/lib/components/{Alert,AppShell,Badge,Card,Input,Select,Stat}.test.ts`; `src/lib/tested-exports.test.ts` allowlist emptied. No component, token, claim or gate changed.
- commit SHA + git tree: `4ecd6c53d136` + `3e9868b5257aac9bdc2d5e0972e08b870a93b55b`.
- artifact name + checksum: no packaged artifact; the test tree at that commit is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 31 files, 146 tests passed (125 baseline plus 21 new, three per component). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports stay 26; the ratchet is green with an empty allowlist, so the metric moves 19 -> 26 of 26.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 21/21 preregistered assertions passed (three per component).
- held-out score: 125/125 pre-existing tests passed (125 items, never used for selection), plus the unchanged contrast, check and build gates.
- gains: every exported component now has a sibling behavioural test; the allowlist is empty and still ratchets, so a new export without a test fails and a name that stops being exported cannot linger. The metric reads 26 of 26 instead of 19 of 26.
- losses: three assertions per component is a floor, not depth. `Card` and `Stat` have no interaction to test; `AppShell` and `Stat` variants are colour or layout only, so their class assertions are documented proxies.
- exceptions: dispatched to `executor-strong`, which passed the gates at 146 on the first attempt and touched no component. Two test-level deviations: `Input` queried the control by role because the required asterisk breaks `getByLabelText('Email')`, and `Badge` snippets return bare text so `getByText` resolves to the badge span. The first review rejected the Input deviation as a P1 (label association was no longer proven) and the class assertions as P1 implementation detail; the fix restored the label proof with `getByLabelText(/Email/)` plus `htmlFor === id`, scoped the `Alert` queries with `within(container)`, and documented why the two class assertions have no behavioural alternative. The reviewer withdrew with no P0/P1.
- token/cost/duration: tokens not captured; one session, one executor dispatch and two reviewer rounds.
- interpretation: the allowlist is closed, so the tested-export metric is now total and self-enforcing.
- keep/revert: keep.
- next hypothesis: `Avatar` from PR E (`img` with required `alt`, initials fallback from `name`, size scale) moves the metric's tested and exported counts together, 26 -> 27 of 27.
- prev-chain: sha256:84464f7fe6ac98cf1d5b9f3d73da4d24d6b1313996bafc340fe1dc6baa7b2ec9 (same link as the preregistration, restated for the gate).

### n=11 close-out

- final review: `record_review` APPROVED, reviewer `ses_de3c80f1cffeiw1U8oFvLjB0bs`, bound to commit `ea4ebeb76cd9` (tracked fingerprint `8a750865efaf`).
- work item: GitHub issue #31.
- PR: #32, `feature/sibling-tests` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45969839584 — `gates` passed on the PR head.
- final gate run after the last code mutation: `npm test` 31 files / 146 tests passed.

### n=12 (preregistration, schema v2)

- date (UTC): 2026-11-27T09:40Z
- change-type: feature
- hypothesis (falsifiable): adding `Avatar` from PR E lifts exports 26 -> 27 and tested exports 26 -> 27, and passes five behavioural assertions (an image with its required alt text and a size class, a two-word name falling back to two initials, a single-word name falling back to one initial, the default `md` size, and initials trimmed from a name with extra spaces), while the 146-test held-out baseline, the count gate and the now-empty ratchet stay green.
- candidate source: campaign 3 screener position 3 (C3, denied there only because Accordion ranked higher); `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR E, `Avatar` row: "Image with required `alt`, initials fallback from `name`, size scale | alt text, fallback initials, size class"; ledger n=11 `next hypothesis`.
- contract decision: `alt` is required whenever `src` is present, and forbidden when it is absent, expressed as a discriminated union so TypeScript enforces it. The fallback renders as `role="img"` with `aria-label` set to the name, because initials alone are not a usable accessible name.
- selection score (5 items): the five new `Avatar` assertions.
- held-out score (146 items, never used for selection): the 146 pre-existing tests (count gate, ratchet, workflow text and the seven sibling files), plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 151 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports 27, five count claims read twenty-seven.
- reject rule: any gate red, any pre-existing test edited, an image rendered without alt text, initials that are not derived from the name, or a fallback with no accessible name.
- non-goals: image loading states, an avatar group or stack, status dots, a photo-upload affordance, the remaining PR E components.
- at-risk regressions: a missing `alt` slipping through because the union is widened with `alt?: string`; initials computed from a non-breaking space or punctuation; the size class being asserted while the default is unasserted; `role="img"` on the fallback colliding with an ancestor landmark.
- router decision: dispatched to `executor-strong`. The cheap tier has produced no acceptable diff in seven dispatches, and the union-typed props plus initials derivation need the type checker to cooperate.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: additive; every existing gate is the incumbent.
- citations used: the design spec section 3 PR E `Avatar` row (repo document, no id); `src/lib/components/Input.svelte` (the house pattern for derived ids and typed unions is not needed here, but the field wiring is); ledger n=11. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:6b8dacd8d17b9cdfda5b8724a53d654382a53529a00d2aa08b276b236b90c536 (the n=11 preregistration block, the highest top-level `### n=` below 12 that the gate's `reduce` selects when two records share n=11; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: new `src/lib/components/Avatar.svelte`, `Avatar.test.ts`, `src/routes/_demos/AvatarDemo.svelte`; export between `AppShell` and `Badge`; `/components` section with its note; five count claims; `[Unreleased]` bullet; playbook metric line refreshed to 27 of 27.
- commit SHA + git tree: `7b058af1faac` + `2e78e187a14f8854375f0f8836b7a5a395d6f889`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 32 files, 156 tests passed (146 baseline plus 10 new; the preregistration predicted five and the review rounds added the hyphen, three-part, empty-name, punctuation-name and type-rejection assertions). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports 27; the ratchet is green, so tested exports move 26 -> 27 of 27.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 10/10 new `Avatar` assertions passed (exact `src` with alt text and the lg class, two initials from two words, one initial from one word, md by default, whitespace collapsed in the accessible name, `AL` across a hyphen, middle names ignored, whitespace-only name decorative, punctuation-only name decorative, and `alt` without `src` rejected at the type level).
- held-out score: 146/146 pre-existing tests passed (146 items, never used for selection), plus the unchanged contrast, check and build gates.
- gains: exported components 26 -> 27 and tested exports 26 -> 27; `alt` cannot be omitted because the union rejects it and a test pins the rejection; a fallback always carries the full name as its accessible name, and a name with no letter or digit renders as decorative instead of announcing punctuation.
- losses: a `name` that is one token gives one initial, so a CJK or mononym name shows a single character rather than two. That is the intended shape for those names, not a defect, and it is recorded rather than silent.
- exceptions: dispatched to `executor-strong`, which passed the gates at 151 on its first attempt with four documented deviations (a `body-s` font token substituted for the absent `body-sm`; the Avatar section placed before Badge because AppShell renders after Badge; the demo image using `/favicon.svg` because no portrait asset exists; the raw spaced `aria-label` asserted as observed). The first review rejected the union as unsound, the empty and hyphenated names as user-visible defects and `aria-label` on `role=img` as the wrong pattern. Probing the union with the `@ts-expect-error` removed showed the compiler rejects `{ name, alt }` without `src` (`Property 'src' is missing`), so the shape was already sound and the fix was to pin it with that directive. The initials derivation then split on hyphens, rejected parts with no letter or digit, and keyed the decorative rendering off the derived initials instead of the raw name. A second review round asked for the ARIA citation for `aria-label` on `role=img`; WAI-ARIA 1.2 answered it ("MUST provide a label using the aria-label or aria-labelledby attribute", with children presentational), and the third verdict was ACCEPT.
- token/cost/duration: tokens not captured; one session, one executor dispatch and three reviewer rounds.
- interpretation: the component meets the spec row, and the two rules that matter most are now enforced where a caller cannot escape them, at the type for `alt` and in the rendered markup for the accessible name.
- keep/revert: keep.
- next hypothesis: none inside PR E that the brake allows next; `Drawer` and `CommandPalette` are the remaining PR E rows, and branch protection is still deferred to the operator.
- prev-chain: sha256:6b8dacd8d17b9cdfda5b8724a53d654382a53529a00d2aa08b276b236b90c536 (same link as the preregistration, restated for the gate).

### n=12 close-out

- final review: `record_review` APPROVED, reviewer `ses_de3c153b6ffeXBMEdw3AeD282T`, bound to commit `9cbf966e64a3` (tracked fingerprint `83030d7bdd7c`).
- work item: GitHub issue #33.
- PR: #34, `feature/avatar-component` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45971116704 — `gates` passed on the PR head.
- final gate run after the last code mutation: `npm test` 32 files / 156 tests passed.

### campaign 3 close-out

- iterations: n=10 `feature` (PR #30), n=11 `test` (PR #32), n=12 `feature` (PR #34), all merged.
- stop reason: N=3 reached, the campaign size the request asked for. No iteration produced a no-gain result, so the no-gain brake never fired, and no two consecutive iterations shared a change-type, so the diversity brake never fired.
- metric: exported components 25 -> 27; tested exports 18 -> 27 of 27. Tests 118 -> 156 across 23 -> 32 files.

### campaign 4 (plan)

- request: "new campaign for next items"; no count given, so N=3 (default, cap 5).
- base: `c51f72d`, clean tree, 32 test files, 156 tests, 27 exports, 186 contrast pairs, svelte-check 0/0, clean build.
- planned positions: n=13 `test` (`Button` contract depth), n=14 `feature` (`Drawer`, PR E), n=15 `test` (the `id`/ARIA forwarding contract across `Checkbox`, `Input`, `Select` and `Textarea`).
- brake state: n=12 was `feature`, so position 1 cannot be `feature`, which rules out `Drawer` and `CommandPalette` at n=13. The plan is `test` -> `feature` -> `test`, so no two consecutive iterations share a type.
- gain measure: **the export metric is saturated at 27 of 27, so it cannot move without a new component.** The campaign therefore measures each iteration by (a) the preregistered assertions passed, (b) the held-out suite green, (c) exports where the iteration adds one, and (d) a named contract-depth before/after for the component the iteration touches. A `test` iteration is not a no-gain iteration: "no gain" means the preregistered claim did not hold, never that the export count stayed flat.
- screener shortlist (campaign 4, ranked by the screener): `fix` Checkbox id forwarding, `test` RadioGroup arrow selection, `feature` Drawer, `feature` CommandPalette, `instrument` Menu active option.
- candidate overrides and denies, with reasons:
  - `fix` Checkbox id forwarding is **denied as a `fix`**. `Checkbox.svelte` already derives `inputId = id ?? uid-checkbox` (`Checkbox.svelte:33-35`) and labels the control with `for={inputId}` (`Checkbox.svelte:53`), so there is no defect; only the assertion is missing. It becomes an assertion in n=15.
  - `instrument` Menu active option is **denied**. It edits `Menu.svelte` to emit an active-option id, which is a component change labelled as instrumentation, not a measurement. `Menu.test.ts` already asserts arrow, Home/End and Escape movement through focus, so the menu contract is pinned.
  - `feature` Drawer and `feature` CommandPalette are denied at position 1 by the diversity brake (n=12 was `feature`). Drawer is adopted at n=14.
  - branch protection and required checks are **not proposed**. That is an operator decision, denied at n=10, and nothing about the status has changed.
  - `Button` is added to the shortlist the screener did not rank. `Button.test.ts` holds one assertion (`Button.test.ts:9-23`) against a contract with four variants, three sizes, a `type` passthrough, a `disabled`/`loading` pair, a loading spinner with screen-reader text, and a separate anchor branch with `aria-disabled` and a suppressed handler (`Button.svelte:43-62`). It is the most-used export and the thinnest-tested one in the repo.

### n=13 (preregistration, schema v2)

- date (UTC): 2026-11-27T09:25Z
- change-type: test
- hypothesis (falsifiable): adding a sibling contract test for `Button` moves that file from 1 assertion to 10 and `npm test` from 156 to 166 with 0 failures, pinning ten behaviours (the default `type="button"` and label, a `submit` type passthrough, the `danger` variant class without the primary class, the `lg` size class, the `md` default size, `disabled` reaching the native property with `aria-busy="false"`, `loading` setting `disabled` plus `aria-busy="true"` plus `is-loading` plus an `aria-hidden` spinner plus screen-reader "Loading", a `href` rendering an anchor with no `type` and `aria-disabled="false"`, a busy anchor carrying `aria-disabled="true"` and `tabindex="-1"` and not calling `onclick`, and a custom `class` appended rather than replacing `fw-button`), while exports stay 27, the count claims stay twenty-seven, the ratchet stays green and the four gates stay green.
- candidate source: campaign 4 screener output, overridden by the driver because the screener omitted `Button`; `Button.test.ts:9-23` (one assertion); `Button.svelte:43-62` (the untested branches); the repo's own rule that an exported component carries a behavioural test.
- selection score (10 items): the ten new `Button` assertions.
- held-out score (156 items, never used for selection): the 156 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 166 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports 27, five count claims read twenty-seven.
- reject rule: any gate red, any edit to `Button.svelte` or to a pre-existing test, an assertion that pins a class where a property or attribute expresses the same fact, or a click assertion on a disabled native control (jsdom dispatches events that a browser would not, so the disabled branch is asserted on the DOM state).
- non-goals: changing any component, adding exports, changing the count gate, adding a coverage tool or a dependency, deepening any other file.
- at-risk regressions: `Button.svelte` edited to satisfy a test (forbidden); the screen-reader "Loading" text joining the accessible name and breaking an exact-name query; `fireEvent.click` on a disabled button firing in jsdom and giving a false pass on suppression.
- honest limit: ten assertions still do not cover every prop combination, and the `loading` spinner is asserted for presence and accessibility only, not for animation.
- router decision: dispatched to `executor-strong`. The cheap tier has failed eight of eight dispatches across three campaigns, and the anchor branch needs `tabindex` and `aria-disabled` assertions that a cheap attempt tends to simplify.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: additive test only; `Button.svelte` and every gate are the incumbent.
- citations used: `Button.svelte` (the contract), `Button.test.ts` (the gap), `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3 (the kit-wide rule that every component ships a behavioural test file), ledger n=12. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:45801c90002133a09a4b32135693033eea1bb5f0e82fd0c692df77975d2282d0 (the n=12 preregistration block, the highest top-level `### n=` below 13 that the gate's `reduce` selects; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: `src/lib/components/Button.test.ts` only. The single existing assertion was replaced by eleven contract tests. No component, gate, token, claim or other test touched.
- commit SHA + git tree: `9bca341d77a3` + `a2e31a29a9be53a2fb7dc3ba06d1df0b056c479d`.
- artifact name + checksum: no packaged artifact; the test tree at that commit is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 32 files, 166 tests passed (156 baseline; the one replaced assertion became eleven). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports stay 27, so the tested-export metric stays 27 of 27.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 11/11 preregistered behaviours passed. The preregistration listed ten; the two-render size test was split into two tests on review, which is where the eleventh came from.
- held-out score: 155 of the 155 untouched pre-existing tests passed (the single replaced `Button` assertion is superseded by test 1, which carries its four claims), plus the unchanged contrast, check and build gates.
- gains: `Button`, the most-used export, moves from 1 assertion to 11, and the branches a caller relies on are now pinned: the loading state's `disabled`, `aria-busy`, `is-loading`, `aria-hidden` spinner and screen-reader text; the anchor branch's `href`, absent `type`, `aria-disabled` and tab order; the busy anchor's `tabindex="-1"` and dropped handler; `type`, `variant`, `size` and `class` passthrough.
- losses: none observed. The export metric does not move, which the campaign plan anticipated.
- exceptions: dispatched to `executor-strong`, which passed all four gates on the first attempt. Two corrections followed. First, the preregistration's arithmetic was wrong: it predicted 166 as `156 + 10`, but replacing the single existing test yields `156 - 1 + 10 = 165`. The executor reported the mismatch instead of adding an eleventh test to hit the number, which is the behaviour the preregistration wanted. 166 was reached later by splitting the two-render test on review, not by padding. Second, the jsdom "Not implemented: navigation to another Document" notice from clicking a real `href` was removed by using a fragment href, since the assertion is about the handler, not navigation.
- defect found, not fixed here: the busy anchor drops its handler and its tab stop but not its default action, so a pointer click still navigates. MDN on `aria-disabled` says the attribute "only semantically exposes these elements as being disabled. Web developers must manually ensure such elements have functionality suppressed". The first review called the test's comment a papering-over, and it was right about the comment: describing the mechanism is not reporting a defect. The test now names the defect in its title, carries a comment that calls it a known defect, and cites issue #35 with a `TODO(#35)`. Fixing it in this iteration would have broken the preregistration's `test` change-type and its rule against editing `Button.svelte`; the second review agreed with that order and approved.
- plan change for the campaign: the n=15 slot moves from the `id`/ARIA forwarding tests to `fix` for issue #35. Reason: a test iteration surfaced a user-visible defect on the most-used component, and closing it is worth more than four more forwarding assertions. The type sequence becomes `test` -> `feature` -> `fix`, still brake-clean.
- token/cost/duration: tokens not captured; one session, one executor dispatch and two reviewer rounds.
- interpretation: the campaign found the first real defect of the three campaigns, and it found it in the component the kit uses most, which is what a contract test is for.
- keep/revert: keep.
- next hypothesis: a busy `Button` with `href` cancels activation, so a pointer click neither calls the caller's handler nor navigates, and the test's `TODO(#35)` becomes an `event.defaultPrevented` assertion without changing the test count.
- prev-chain: sha256:45801c90002133a09a4b32135693033eea1bb5f0e82fd0c692df77975d2282d0 (same link as the preregistration, restated for the gate).

### n=13 close-out

- final review: `record_review` APPROVED, reviewer `ses_de39db4d1ffev1kzRQPUDST2ze`, bound to commit `e527fb292277` (tracked fingerprint `f02f4190d5d1`).
- work item: GitHub issue #36. Defect found and tracked: issue #35.
- PR: #37, `feature/button-contract-tests` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45976231082 — `gates` passed on the PR head.
- final gate run after the last code mutation: `npm test` 32 files / 166 tests passed.

### n=14 (preregistration, schema v2)

- date (UTC): 2026-11-27T09:50Z
- change-type: feature
- hypothesis (falsifiable): adding `Drawer` from PR E lifts exports 27 -> 28 and tested exports 27 -> 28, and passes seven behavioural assertions (a dialog named by its title, one `showModal` call when `open` is true, no `close` call when the drawer is already closed, the `close` event writing `open` back to false and calling `onclose`, the default `end` side class, the `start` side class, and the title element id naming the dialog through `aria-labelledby`), while the 166-test held-out baseline, the count gate, the empty ratchet and the four gates stay green.
- candidate source: campaign 4 screener position 3 (`feature` Drawer); `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR E, `Drawer` row: "Native `dialog` with side placement, `showModal`, Escape, focus return, same guard pattern as `Dialog` | opens through `showModal` once, close event returns focus"; ledger n=13 `next hypothesis` is the #35 fix, so this is the `feature` slot the campaign plan reserved.
- contract decision: the guard pattern is copied from `Dialog` deliberately, not re-invented. The effect calls `showModal` only when the element is connected and not already open, and calls `close` only when it is open, both behind `typeof` guards because jsdom implements neither. `Drawer` adds `side: 'start' | 'end'` (default `end`) and keeps `id`, `open` (bindable), `title`, `children`, `actions` and `onclose` identical to `Dialog` so a caller can swap one for the other, including the `${id}-title` id that names the dialog. An earlier draft added a separate `label` prop for that id; it was dropped before implementation because it duplicated `id` and made the caller reason about an internal element id.
- focus return: native to `showModal`, exactly as `Dialog` documents. The spec's test focus says "close event returns focus"; jsdom's stubbed `close` does not restore focus, so the test pins the close event path and the ledger records focus return as native behaviour, not as an assertion. Claiming a test for it would be false.
- selection score (7 items): the seven new `Drawer` assertions.
- held-out score (166 items, never used for selection): the 166 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 173 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports 28, five count claims read twenty-eight.
- reject rule: any gate red, any pre-existing test edited, `showModal` called more than once while open, `close` called on a closed drawer, the dialog not named by its title, or a side class that does not follow the prop.
- non-goals: a backdrop-click close, a swipe or drag dismissal, a close button, a focus trap beyond the native one, and `CommandPalette`.
- at-risk regressions: jsdom's missing `showModal`/`close`, so the test must define them as `Dialog.test.ts:13-28` does; the effect firing twice on a re-render and double-opening; a `side` value baked into CSS that the test cannot observe; the count gate reading twenty-eight in five places.
- router decision: dispatched to `executor-strong`. The cheap tier has failed nine of nine dispatches, and the dialog guard plus the stubbed prototype methods is the pattern the cheap tier has never reproduced.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: additive; `Dialog` and every gate are the incumbent.
- citations used: `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3 PR E `Drawer` row; `src/lib/components/Dialog.svelte` and `Dialog.test.ts` (the guard pattern and the jsdom stubs); ledger n=13. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:630df0377d96a7014626e65b023e10a296818583030aae9f75592ec8e64f9dfc (the n=13 preregistration block, the highest top-level `### n=` below 14 that the gate's `reduce` selects; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: new `src/lib/components/Drawer.svelte`, `Drawer.test.ts`, `src/routes/_demos/DrawerDemo.svelte`; export between `Dialog` and `EmptyState`; `/components` section; five count claims; `[Unreleased]` bullet; playbook metric line refreshed to 28 of 28.
- commit SHA + git tree: `1efe44af0944` + `84c92c03cbee51891680c7db0664bde6e0b51338`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 33 files, 173 tests passed (166 baseline plus seven). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports 28; the ratchet is green, so tested exports move 27 -> 28 of 28.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 7/7 new `Drawer` assertions passed (dialog named by its title, one `showModal` call, no `close` on an already-closed drawer, the `close` event writing state and calling `onclose`, the default `end` class, the `start` class, and `aria-labelledby` resolving to the title element).
- held-out score: 166/166 pre-existing tests passed (166 items, never used for selection), plus the unchanged contrast, check and build gates.
- gains: exported components 27 -> 28 and tested exports 27 -> 28 of 28; the kit gains an edge drawer that reuses the `Dialog` guard instead of a second dialog state machine, so the two cannot drift on open/close.
- losses: Escape and focus return are native to `showModal` and unasserted, because jsdom implements neither. The ledger says so rather than implying coverage.
- exceptions: dispatched to `executor-strong`, which passed the four gates on the first attempt. Two corrections followed. Before implementation the contract lost a planned `label` prop, which duplicated `id`; the `${id}-title` convention from `Dialog` replaced it and the preregistration was corrected in the same branch. On review, a P0 said the edge pinning relied on the UA stylesheet's `position: fixed` for modal dialogs; `.fw-drawer` now declares `position: fixed` itself. A P1 said the demo's `actions` snippet might not reach the prop; the prerendered `build/components.html` shows `<div class="fw-drawer__actions">…<button class="fw-button…`, so the snippet is passed and rendered, and the reviewer withdrew the finding. One test name was renamed from "uses the label" to "names the dialog from its title element" after the prop was dropped.
- token/cost/duration: tokens not captured; one session, one executor dispatch and two reviewer rounds.
- interpretation: the component meets the spec row, and the guard is a copy rather than a second implementation, which is the property the spec row asked for.
- keep/revert: keep.
- next hypothesis: the busy-anchor fix for issue #35, moved into the n=15 slot from the forwarding tests (reason recorded at n=13).
- prev-chain: sha256:630df0377d96a7014626e65b023e10a296818583030aae9f75592ec8e64f9dfc (same link as the preregistration, restated for the gate).

### n=14 close-out

- final review: `record_review` APPROVED, reviewer `ses_de396e4b0ffejCsRMpVTfLsCdy`, bound to commit `61096320006b` (tracked fingerprint `74255ac5743b`).
- work item: GitHub issue #38.
- PR: #39, `feature/drawer-component` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45977235502 — `gates` passed in 29s on the PR head.
- final gate run after the last code mutation: `npm test` 33 files / 173 tests passed.

### n=15 (preregistration, schema v2)

- date (UTC): 2026-11-27T10:00Z
- change-type: fix
- hypothesis (falsifiable): a busy `Button` with `href` cancels activation, so a pointer click on it neither calls the caller's handler nor navigates, proven by `event.defaultPrevented` being `true` in a second listener after the component's own handler ran; the `TODO(#35)` becomes that assertion, `npm test` stays 173 with 0 failures because one test is rewritten rather than added, exports stay 28, and the count claims, the ratchet and the four gates stay green.
- candidate source: issue #35, found at n=13 while pinning the `Button` contract; ledger n=14 `next hypothesis`; `src/lib/components/Button.svelte:49-52`; MDN's `aria-disabled` page ("only semantically exposes these elements as being disabled. Web developers must manually ensure such elements have functionality suppressed").
- contract decision: the anchor keeps its `href`, its `aria-disabled` and its `tabindex="-1"`. Dropping the `href` when busy would have changed the element's role and removed the link from assistive technology's model, which is a larger behavioural change than the defect needs. Suppressing the default action in one handler keeps the element a link, keeps it out of the tab order, and closes the pointer path.
- selection score (1 item): the rewritten busy-link test, whose assertion is `event.defaultPrevented === true` plus the existing handler and tab-order checks.
- held-out score (172 items, never used for selection): the other 172 tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 173 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports 28, five count claims read twenty-eight, and no `TODO` left in `Button.test.ts`.
- reject rule: any gate red, any test deleted or weakened, `preventDefault` applied to the enabled anchor (which would break real navigation), or the caller's handler still called while busy.
- non-goals: changing the disabled `<button>` path, changing the anchor's role, adding a `type` to the anchor, and any other component.
- at-risk regressions: `preventDefault` swallowing the enabled link's navigation if the `busy` guard is placed wrong; the second listener running before the component's handler and reading `defaultPrevented` as `false`; jsdom `fireEvent.click` not honouring `defaultPrevented` for assertion purposes.
- honest limit: `event.defaultPrevented` proves the default action was cancelled at the event level. It cannot prove that a real browser then stays on the page, because jsdom does not navigate; the claim is the cancellation, not the absence of navigation.
- router decision: authored in-session, not dispatched. A three-line handler change with a one-test rewrite is below the size where a dispatch pays for itself, and the defect was found in-session. The sustained-difficulty trigger applies to dispatches, not to small session-authored fixes.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: the `Button` anchor branch is the revision; everything else is the incumbent.
- citations used: issue #35 (the defect); `src/lib/components/Button.svelte:43-62` and `Button.test.ts:92-109` (the branch and the test that names the defect); MDN `aria-disabled`. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:c2a27eed5764c6a9349b335252c76a3312c3365a956bb87f973f73312463fbd4 (the n=14 preregistration block, the highest top-level `### n=` below 15 that the gate's `reduce` selects; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: `src/lib/components/Button.svelte` (the anchor's single click handler), `Button.test.ts` (busy-link test rewritten, enabled-link test strengthened), `CHANGELOG.md` (`### Fixed` bullet). No other component, test, gate or claim touched.
- commit SHA + git tree: `f615e7c5ee56` + `0e883434a5141955f7f827b791f9c2545a0c184c`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 33 files, 173 tests passed, unchanged from the baseline because one test was rewritten and one strengthened. svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports 28. No `TODO` remains in `Button.test.ts`.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 1/1 preregistered assertion pair passed: the busy link shows `event.defaultPrevented === true` and the caller's handler is not called; the enabled link shows `defaultPrevented === false` and the handler is called once.
- held-out score: 172/172 untouched tests passed, plus the unchanged contrast, check and build gates.
- gains: a busy `Button` with `href` no longer navigates on a pointer click, while the enabled anchor still navigates and still calls its handler. Both directions are pinned, so a future guard placed the wrong way round fails the suite.
- losses: none observed. The element stays a link, so assistive technology still sees link semantics on a disabled action, which is the trade the preregistration chose over removing `href`.
- exceptions: authored in-session. The first test attempt registered a listener on the link and read `defaultPrevented === false`; Svelte 5 delegates `click` to the mount root, so the component's handler runs after any element-level listener. The test now dispatches a `MouseEvent` directly and reads the event afterwards, which is order-independent. The reviewer rejected once because it could not run `git diff --stat` itself; the stat was supplied (four files, one of them the preregistration record) and the reviewer approved with no defect.
- token/cost/duration: tokens not captured; one session, no executor dispatch and two reviewer rounds.
- interpretation: the defect n=13 found is closed in the iteration after the feature slot, which is the order the campaign plan recorded. The fix is 9 lines of component change, and the two-sided assertion is what makes it safe.
- keep/revert: keep.
- next hypothesis: `CommandPalette` (PR E, the last spec row) for the next `feature` slot; the `id`/ARIA forwarding assertions and the `Field` seam refactor remain unstarted.
- prev-chain: sha256:c2a27eed5764c6a9349b335252c76a3312c3365a956bb87f973f73312463fbd4 (same link as the preregistration, restated for the gate).

### n=15 close-out

- final review: `record_review` APPROVED, reviewer `ses_de391fae6ffex6VtpQ2kzR1FUy`, bound to commit `50037737d322` (tracked fingerprint `a2d21a219f65`).
- work item: GitHub issue #35 (the defect found at n=13). Issue #40 was created in error while opening this iteration and is closed by the same PR as a duplicate.
- PR: #41, `fix/busy-link-navigation` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45977890382 — `gates` passed in 37s on the PR head.
- final gate run after the last code mutation: `npm test` 33 files / 173 tests passed.

### campaign 4 close-out

- iterations: n=13 `test` (PR #37), n=14 `feature` (PR #39), n=15 `fix` (PR #41). N=3 reached, so the campaign stopped on the count, not on a brake.
- diversity brake: never fired. The type sequence was `test` -> `feature` -> `fix`, so no two consecutive iterations shared a change-type.
- no-gain brake: never reached. Every iteration produced a named gain: n=13 moved `Button` from 1 to 11 assertions, n=14 added an export (27 -> 28), n=15 closed a user-visible defect.
- saturated-metric note: the export metric was already 27 of 27 at the start, so it could not measure n=13 or n=15. The campaign measured (a) preregistered assertions passed, (b) held-out suite green, (c) named contract depth before/after, and (d) exports where applicable. `docs/agents/rsi-loop-playbook.md` records the distinction between a sibling test file and coverage depth.
- preregistration accuracy: n=13 predicted 166 tests and produced 165 (`156 - 1 + 10`); the executor reported the mismatch instead of padding, and review produced the 166th test legitimately. n=14 and n=15 predicted their counts exactly.
- defects found: two. The busy-anchor navigation defect (n=13 found, n=15 fixed) and the Drawer edge-pinning dependency on the UA stylesheet (n=14 found and fixed in the same iteration).
- lessons: L013 (name the defect in a test), L014 (declare UA layout dependencies), L015 (read a delegated event after dispatch).
- unstarted: `CommandPalette` (the last PR E row), the `id`/ARIA forwarding assertions for `Checkbox`/`Input`/`Select`/`Textarea`, the `Field` seam refactor (three controls duplicate the wrapper's wiring), and the branch-protection decision for `main`.

### campaign 5 (plan)

- request: "next." after the campaign 4 report; no count given, so N=3 (default, cap 5).
- base: `db3ed72`, clean tree, 33 test files, 173 tests, 28 exports, 28 of 28 tested, 186 contrast pairs, svelte-check 0/0, clean build.
- planned positions: n=16 `test` (`id`/ARIA forwarding across `Checkbox`, `Input`, `Select`, `Textarea`), n=17 `feature` (`CommandPalette`, the last PR E row), n=18 `chore` (release 0.7.0 plus a version/CHANGELOG agreement gate).
- brake state: n=15 was `fix`, so position 1 cannot be `fix`. The sequence is `test` -> `feature` -> `chore`, so no two consecutive iterations share a change-type.
- gain measure: the export metric is saturated at 28 of 28, so each iteration is measured by (a) preregistered assertions passed, (b) held-out suite green, (c) exports where the iteration adds one, and (d) a named contract-depth or release-state before/after. "No gain" means the preregistered claim did not hold, never that the export count stayed flat.
- screener output and its limits: the screener returned a partial report headed "VERIFICATION PENDING - Tool access blocked", after reading the component sources but without finishing its held-out enumeration. Its component reads agree with the driver's own: all four controls forward `id` and ARIA through `{...rest}`. Its verdicts are therefore recorded, and the driver overrides three of the six.
- screener denials upheld, with reasons:
  - `refactor` `Field` seam is **denied**. Four components would change their markup for a structural gain the suite cannot measure as a behavioural difference, and the screener could not establish it as a provable zero-op. Deferred to a campaign where it can be the only change.
  - `test` `Combobox` contract depth is **denied as its own iteration**. `Combobox.test.ts:21-102` already pins open, arrow movement, Enter, Escape and the query restore; the remaining gap is grouping, which n=17 builds.
  - `instrument` branch protection is **denied**. It needs the operator to change GitHub settings, denied at n=10, status unchanged.
- driver overrides, with reasons:
  - `test` forwarding is **admitted over the screener's "structural vacuity" denial**. The screener read the components correctly and drew the wrong conclusion: an unasserted forwarding contract is exactly what a `test` iteration is for. Spec lines 199 and 202 name forwarding as the contract, `Checkbox`/`Input`/`Select` hold no assertion for it, and `Textarea.test.ts:29-40` covers only `data-*` and `aria-label`, not `id`. Without an assertion, `{...rest}` can move above the computed `aria-describedby` and the suite stays green.
  - `chore` release is **admitted over the screener's "incomplete"**. The screener could not read `package.json`. `package.json:3` reads `0.5.0` and `private` is `false` with a `svelte-package` build, while `CHANGELOG.md:5` holds ten PR D and PR E components under `[Unreleased]` and the top released section is `[0.5.0]`. A publish today would ship two minor versions of components as `0.5.0`.

### n=16 (preregistration, schema v2)

- date (UTC): 2026-11-27T10:20Z
- change-type: test
- hypothesis (falsifiable): adding one forwarding test to each of `Checkbox`, `Input`, `Select` and `Textarea` moves the suite from 173 to 177 tests with 0 failures and pins twelve behaviours: a caller `id` reaching the control element and the sibling `label` `for` matching it in all four; a caller `aria-describedby` overriding the computed hint/error list in `Checkbox`, the documented escape hatch; a caller `aria-errormessage` forwarded onto the `Input` control while the computed `aria-describedby` survives; and the `Textarea` `id` forwarding that its existing attribute test does not cover. No component, gate, claim or existing test changes, exports stay 28.
- candidate source: campaign 5 screener findings plus the driver's read of `Checkbox.svelte:53-69`, `Input.svelte:44-66`, `Select.svelte:51-62`, `Textarea.svelte:46-59`, `Field.svelte:22-38`; spec lines 199 and 202; the ledger's `### campaign 4 close-out` unstarted list.
- contract decision: the forwarding contract is "the caller's `id` names the control and the label points at it", plus "caller-supplied ARIA reaches the control". The `{...rest}` spread sits last, so a caller's `aria-describedby` replaces the computed hint/error list. That precedence is pinned once, in `Checkbox`, and stated in the ledger rather than left as an accident of attribute order.
- selection score (12 items): 3 `Checkbox` assertions, 4 `Input`, 2 `Select`, 3 `Textarea`.
- held-out score (173 items, never used for selection): the 173 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 177 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports 28, five count claims still read twenty-eight.
- reject rule: any gate red, any component edited (a real forwarding bug is a `fix` and gets its own preregistration), an assertion that reads an internal `${uid}-*` id instead of the label-to-control relationship, or an assertion that duplicates one already in the file.
- non-goals: changing any component, changing `Field`, merging the four controls onto that seam, adding attributes to the props interfaces, and touching `Combobox`.
- at-risk regressions: `Select` nests the `select` inside `.fw-select` so a `container.querySelector('label')` could pick the wrong node; `Checkbox` renders hint and error outside the `<label>`; `Textarea`'s existing test already uses `aria-label`, so a new test must use `id` and must not collide with it; `Input`'s existing hint test asserts the computed list, so the new test must prove the caller attribute is additive.
- honest limit: four tests prove the forwarding path for one attribute family each, not for every ARIA attribute a caller may pass, and they prove the spread order but not that the order is the right design for every attribute.
- router decision: dispatched to `executor-strong`. The cheap tier has failed nine of nine dispatches, and the four-file spread needs per-file contracts rather than one pattern applied four times.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: additive tests only; the four components and every gate are the incumbent.
- citations used: `Checkbox.svelte:53-69`, `Input.svelte:44-66`, `Select.svelte:51-62`, `Textarea.svelte:46-59`, `Field.svelte:22-38`, `Textarea.test.ts:29-40`, the four sibling test files, spec lines 199 and 202, ledger campaign 4 close-out. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:64dc891e85bafb5b7a1f83c34e0c30d997f1f85a45eee2f4dacda98c21eac522 (the n=15 preregistration record with its result block, the highest top-level `### n=` below 16 that the gate's `reduce` selects; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: four test files only, one test each: `Checkbox.test.ts`, `Input.test.ts`, `Select.test.ts`, `Textarea.test.ts`. No `.svelte`, gate, token, claim or other test touched.
- commit SHA + git tree: `4f67e77c65d5` + `f17c242bfb15b34cd0ac5a9f6b6a32ac8e5962d5`.
- artifact name + checksum: no packaged artifact; the test tree at that commit is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 33 files, 177 tests passed (173 baseline plus four). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports 28, so the tested-export metric stays 28 of 28 and the five count claims still read twenty-eight.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 4/4 tests passed, carrying seventeen assertions across the twelve preregistered behaviours: `Checkbox` (found node is an `HTMLInputElement`, wrapping label tag, caller `id`, label `htmlFor`, label query resolves to the same node, `aria-invalid` true, caller `aria-describedby` wins), `Input` (non-empty computed list, caller `id`, caller `aria-errormessage`, list resolves to `['Work address']`), `Select` (tag, caller `id`, label `htmlFor`), `Textarea` (caller `id`, label `htmlFor`, caller `aria-describedby` wins over the hint).
- held-out score: 173/173 untouched tests passed, plus the unchanged contrast, check and build gates.
- gains: the forwarding contract is now pinned for four controls. `{...rest}` can no longer move above the computed `aria-describedby`, or drop the caller `id`, without a failure. `Textarea`'s existing attribute test covered `data-testid` and `aria-label` but not `id`; that gap is closed.
- losses: none observed. No component changed, so no behaviour moved.
- exceptions: dispatched to `executor-strong`, which passed all four gates on the first attempt and reported one deviation from the spec: the `Textarea` label is a sibling, not a wrapper, so the test uses the render container to read `htmlFor`. The first review returned REQUEST CHANGES with one P0 and three P1s. The P0 said the `Checkbox` assertion could pass on a stale node; the test now checks the looked-up node is an `HTMLInputElement` before casting, so a missing forward fails at that line. Two review claims were wrong on the mechanics and are recorded rather than silently accepted: `document.getElementById` cannot return a node from a previous render because testing-library unmounts in cleanup and the id is unique per render, and an empty `aria-describedby` already failed the Input assertion, since `split('')` yields `['']`, `getElementById('')` is null and the mapped array is `[undefined]`. The guard was added anyway because it states the intent. The remaining P1s were real and are fixed: precedence is now pinned in two files, `Select` asserts the control is a `select`, and `Textarea` asserts the override rather than only the label link. Second review APPROVED.
- token/cost/duration: tokens not captured; one session, one executor dispatch and two reviewer rounds.
- interpretation: a `test` iteration over already-correct components produces no behaviour change, which is what the export metric cannot show. Its gain is the ratchet: four contracts that a refactor would otherwise break silently.
- keep/revert: keep.
- next hypothesis: `CommandPalette` (PR E, the last spec row) reuses `filterOptions` and `stepIndex` from `combobox-model.ts` rather than a second keyboard handler, and ships with its own test file so the tested-export metric moves to 29.
- prev-chain: sha256:64dc891e85bafb5b7a1f83c34e0c30d997f1f85a45eee2f4dacda98c21eac522 (same link as the preregistration, restated for the gate).

### n=16 close-out

- final review: `record_review` APPROVED, reviewer `ses_de38577f5ffeJDP5e6Det6Vk6R`, bound to commit `0560ad876f0f` (tracked fingerprint `efa17c86da29`).
- work item: GitHub issue #42.
- PR: #43, `test/form-control-forwarding` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45979936799 — `gates` passed in 43s on the PR head.
- final gate run after the last code mutation: `npm test` 33 files / 177 tests passed.

### n=17 (preregistration, schema v2)

- date (UTC): 2026-11-27T10:35Z
- change-type: feature
- hypothesis (falsifiable): adding `CommandPalette` from PR E lifts exports 28 -> 29 and tested exports 28 -> 29, moves the suite 177 -> 186 tests, and passes nine behavioural assertions (a dialog named by its title with the search input focused on open, exactly one `showModal` call, every item listed when the query is empty, a case-insensitive narrowing while typing, group headings exposed as labelled groups with their options inside them, arrow keys stepping the active option across a group boundary with `aria-activedescendant` following it, Enter invoking the active item and closing, Escape closing and clearing the query, and the dialog `close` event writing `open` back and calling `onclose`), while the 177-test held-out baseline, the count gate, the empty ratchet and the four gates stay green.
- candidate source: campaign 5 screener position for `feature`; spec line 225; ledger n=16 `next hypothesis`; `src/lib/components/Combobox.svelte:91-129` and `combobox-model.ts` (the keyboard contract to reuse); `src/lib/components/Dialog.svelte:24-35` (the `showModal`/`close` guard).
- contract decision: the palette is a launcher, not a field, so it differs from `Combobox` in three stated ways. Escape clears the query instead of restoring the pre-open text, because the next open starts empty. Enter selects and closes. The input is focused when the dialog opens, which is what makes the component usable and is observable in jsdom. Everything else is reused: `filterOptions` and `stepIndex` from `combobox-model.ts`, and the `Dialog` guard.
- model change: `ComboboxOption` gains an optional `group`, and `filterOptions` becomes generic over `T extends ComboboxOption` returning `T[]`, so the palette keeps its item type through filtering instead of a second matcher. `Combobox`'s call site and its eight tests are unchanged, which is the check that the widening is backward compatible.
- grouping contract: an item with a `group` renders inside a `<ul role="presentation">` wrapped by an `<li role="group" aria-label={group}>`; ungrouped items are direct `role="option"` children of the `role="listbox"`. Group order is first appearance in the caller's array, and within a group the caller's order is kept.
- selection score (9 items): the nine new `CommandPalette` assertions.
- held-out score (177 items, never used for selection): the 177 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 186 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports 29, five count claims read twenty-nine.
- reject rule: any gate red, any pre-existing test edited, `showModal` called more than once while open, `close` called on a closed palette, a group heading without an accessible name, arrow keys not stepping across the group boundary, or `filterOptions` changed in a way that breaks the eight `Combobox` tests.
- non-goals: a keyboard shortcut to open the palette, recent or fuzzy ranking, async items, nested groups, a second dialog guard implementation, and changing `Combobox`'s behaviour.
- at-risk regressions: jsdom's missing `showModal`/`close`, so the test must define them as `Dialog.test.ts` does; `role="combobox"` inside a `dialog` with `aria-activedescendant` and `aria-controls` pointing outside the input; nested lists making `getAllByRole('option')` return duplicates; the generic `filterOptions` widening breaking type inference at `Combobox.svelte:66`.
- honest limit: the tests pin the keyboard contract, the grouping structure and the close path. They cannot prove that a browser's focus trap keeps Tab inside the palette or that the dialog is announced as modal, both native to `showModal`.
- router decision: dispatched to `executor-strong`. The cheap tier has failed nine of nine dispatches, and this iteration combines a model widening, a dialog guard and a grouped listbox in one diff.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: additive; `Combobox`, `Dialog` and every gate are the incumbent, with one generic widening in `combobox-model.ts`.
- citations used: spec line 225; `Combobox.svelte:91-129`; `combobox-model.ts`; `Dialog.svelte:24-35` and `Dialog.test.ts:13-34`; `Drawer.svelte` (the same guard copied twice already); ledger n=16. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:0fa2bfe508fc2356b3d38ea1a957f42e9d3a9ee7a17a45c79f1aed49c3f4c1ef (the n=16 preregistration record with its result and close-out, the highest top-level `### n=` below 17 that the gate's `reduce` selects; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: new `src/lib/components/CommandPalette.svelte`, `CommandPalette.test.ts`, `src/routes/_demos/CommandPaletteDemo.svelte`; `filterOptions` widened to a generic signature in `combobox-model.ts`; export between `Combobox` and `Dialog`; `/components` section; five count claims; `[Unreleased]` bullet; playbook metric line refreshed to 29 of 29.
- commit SHA + git tree: `f4d91eeb6b23` + `5cba26c21d28662caabf5485cda5b2a35461bf33`.
- artifact name + checksum: no packaged artifact; the static build at that tree is the artifact.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 34 files, 186 tests passed (177 baseline plus nine). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports 29, so tested exports move 28 -> 29 of 29 and the five count claims read twenty-nine.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 9/9 new `CommandPalette` assertions passed (dialog named by its title with the input focused, one `showModal` call, every item listed when the query is empty, case-insensitive narrowing, labelled groups with their options inside them, arrow keys stepping from the last option of one group to the first of the next with `aria-activedescendant` and `aria-selected` moving together, Enter invoking the active item and closing, Escape closing and clearing the query, and the dialog `close` event writing state and calling `onclose`).
- held-out score: 177/177 pre-existing tests passed, plus the unchanged contrast, check and build gates.
- gains: exported components 28 -> 29 and tested exports 29 of 29; the palette reuses `filterOptions` and `stepIndex` instead of a second matcher and a second wrap calculation, and reuses the `Dialog` guard for the third time.
- losses: the dialog's native focus trap and its modal announcement are unasserted, because jsdom implements neither. The ledger says so rather than implying coverage.
- exceptions: the dispatched executor returned an empty result with the files written and no acceptance output, so the calling session verified every gate itself and fixed two defects before the first review: `.fw-palette` declared `position: fixed` without `inset-inline`, so `margin-inline: auto` could not centre it, and `PaletteItem` was declared in both the component and the demo. The first review returned REQUEST CHANGES with three P1s and two P2s. The unstable-id P1 was real: `filtered.indexOf(item)` recomputed the flat index inside the group loop, so two entries sharing an object reference would desynchronise the option id from `aria-activedescendant`; the groups now carry `{ item, index }`. The effects P1 was real as duplication: `handleInput` and the reset effect both wrote `active`, and `handleInput` is now the only query writer with the effect as the only `active` writer. The two P2s were also acted on: `ComboboxOption` no longer carries `group`, so the generic signature alone carries the palette's item type, and all four insets are explicit (`inset-block-end: auto`) so the panel does not depend on the dialog's UA static position. Second review APPROVED. One test name still says "Escape and clears the query" while the other eight were rewritten to their spec wording; the count is nine either way.
- token/cost/duration: tokens not captured; one session, one executor dispatch that returned nothing and two reviewer rounds.
- interpretation: the last PR E row is closed, and the reuse claim in the spec is now true in code rather than in prose: one matcher, one wrap function, one dialog guard.
- keep/revert: keep.
- next hypothesis: the release is the only unstarted item with a user-visible consequence. `package.json:3` reads 0.5.0 with `private: false` and a `svelte-package` build, while ten components from PR D and PR E sit under `[Unreleased]`, so a publish today would ship two minor versions of components as 0.5.0.
- prev-chain: sha256:0fa2bfe508fc2356b3d38ea1a957f42e9d3a9ee7a17a45c79f1aed49c3f4c1ef (same link as the preregistration, restated for the gate).

### n=17 close-out

- final review: `record_review` APPROVED, reviewer `ses_de37cb78affec9z1OycMAvxyv9`, bound to commit `0b6a7d36e45e` (tracked fingerprint `fa7aef31b733`).
- work item: GitHub issue #44.
- PR: #45, `feature/command-palette` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45981340441 — `gates` passed in 28s on the PR head.
- final gate run after the last code mutation: `npm test` 34 files / 186 tests passed.

### n=18 (preregistration, schema v2)

- date (UTC): 2026-11-27T10:50Z
- change-type: chore
- hypothesis (falsifiable): cutting the release moves `package.json` from `0.5.0` to `0.7.0` and turns the ten PR D and PR E entries under `[Unreleased]` into a dated `[0.7.0] - 2026-11-27` section with a fresh empty `[Unreleased]` above it, and a new `src/lib/version-claims.test.ts` with two assertions passes (the package version equals the top dated changelog heading, and every `## [x.y.z]` heading is dated, unique and ordered newest first), moving the suite from 186 to 188 tests with 0 failures while exports stay 29, the five count claims stay twenty-nine and the four gates stay green.
- candidate source: campaign 5 screener candidate 2, which the screener could not read; `package.json:3` (`"version": "0.5.0"`, `"private": false`, the `svelte-package` script); `CHANGELOG.md:5-32` (ten components under `[Unreleased]`, top released section `[0.5.0] - 2026-11-26`); `docs/design/2026-11-26-design-kit-shape-and-components.md` section 4 (PR D planned as 0.6.0, PR E as 0.7.0); ledger n=17 `next hypothesis`.
- release decision: the release is **0.7.0**, not 0.6.0 then 0.7.0. The repo has no git tags and `package.json` still reads 0.5.0, so 0.6.0 never shipped. A version is a release, not a plan: the changelog records what shipped when, and skipping an unused number is permitted. Both PR D and PR E rows land in the one section.
- gate decision: the version claim gets a test because `README.md` and the components page already carry counted claims pinned by `src/lib/count-claims.test.ts`, and `package.json` was the last hand-maintained claim in the repo with nothing checking it. The honest limit is recorded below: it catches a bump without a changelog heading, not a merged feature without a bump.
- selection score (2 items): the two `version-claims` assertions.
- held-out score (186 items, never used for selection): the 186 pre-existing tests, plus the 186 contrast pairs, svelte-check 0/0 and the static build.
- accept rule: `npm test` 188 passed with 0 failures, svelte-check 0/0, 186 contrast pairs 0 failures, build succeeds, exports 29, five count claims read twenty-nine, `package.json` reads 0.7.0, and the changelog's top dated heading is `0.7.0` dated 2026-11-27.
- reject rule: any gate red, any component or existing test edited, a release section that changes an entry's wording, a version heading without a date, or a `package.json` bump with no matching heading.
- non-goals: publishing to npm, creating a git tag, adding a release workflow, rewriting the changelog entries, and bumping any dependency.
- at-risk regressions: the `?raw` import path for `CHANGELOG.md` from `src/lib/`, which no existing test does; the regex silently skipping a heading that is malformed, which the "every heading is dated" assertion is there to catch; the empty `[Unreleased]` section tripping a naive heading scan.
- honest limit: the gate catches a version bump without a changelog section and a heading without a date. It cannot catch a merged feature that was never bumped, because an `[Unreleased]` section with entries is a legitimate state during development. Claiming otherwise would be false.
- router decision: authored in-session. One two-line JSON change, one section rename, and a fourteen-line test are below the size where a dispatch pays for itself.
- matched-budget test-time-scaling control: not applicable. The verifier is deterministic.
- answer-rescue audit: not applicable, the verifier is deterministic.
- incumbent-vs-revision: the changelog's released history is the incumbent; the revision adds one section and one test file.
- citations used: `package.json`, `CHANGELOG.md`, `src/lib/count-claims.test.ts` (the ratchet this one is modelled on), `src/lib/workflow-gates.test.ts:3` (the `?raw` import precedent), the design doc's phasing table, ledger n=17. The playbook's "Grounding" section states this repo cites no arXiv ids, so none is asserted.
- prev-chain: sha256:a0215935f6af58883fd868a566382b3a59b00eeaffd1e9bec5d7a2c3e98f259d (the n=17 preregistration record with its result and close-out, the highest top-level `### n=` below 18 that the gate's `reduce` selects; hashed with `validate-ledger.cjs` `parseRecords`/`sha256`).

- code change: `package.json` version 0.5.0 -> 0.7.0; `CHANGELOG.md` gains an empty `## [Unreleased]` and renames the section below it to `## [0.7.0] - 2026-11-27`, entry text unchanged; new `src/lib/version-claims.test.ts`. No component, workflow, dependency or existing test touched.
- commit SHA + git tree: release commit `c27abb222096` + `5af6d9f133d07e5ff3129a11eb5f40c549e06c34`, plus the follow-up `e2515f3` + `8b8546523dfe2509f48336cb6dfb86c57f9a5942` that syncs `package-lock.json` to 0.7.0 after the PR preflight rejected a manifest change without its lockfile. The release commit had not touched the two root lockfile version fields, which `npm install --package-lock-only` rewrites to the manifest version; nothing else in the lockfile changed.
- artifact name + checksum: no published artifact; `dist/` is not built in this iteration and no tag is created.
- exact command/config: `npm test`, `npm run check`, `npm run contrast`, `npm run build` on Node v26.13.0, vitest 5.1.1.
- test results: 35 files, 188 tests passed (186 baseline plus two). svelte-check 0 errors and 0 warnings. Contrast 186 pairs, 0 failures. Static build clean. Exports 29, five count claims read twenty-nine, `package.json` reads 0.7.0.
- eval job path: none. The anchors define the verifier as the local gate run.
- selection score: 2/2 preregistered assertions passed: two tests, seven assertions in total (top section name equals the package version, top section is dated, every released name is semver-shaped, every released section is dated, names are unique, names are ordered newest first).
- held-out score: 186/186 untouched tests passed, plus the unchanged contrast, check and build gates.
- gains: the package version now matches the release it ships with, and the version/changelog agreement is a gate instead of a convention. Before this iteration `package.json` said 0.5.0 while the changelog listed ten components from two planned minor versions.
- losses: none observed. No behaviour changed.
- exceptions: authored in-session. The first review returned REQUEST CHANGES with a P0 that the date check was implicit in a set difference, and a P1 that a malformed name could reach the comparator as `NaN`. The P0's stated mechanism was not what the code did (an undated top heading already failed the set comparison, since `released` is the dated subset and the comparison list is every heading), but the criticism of the expression was right, and the test now asserts the date and the shape directly, with the shape checked before the sort. Each failure mode was then proved against synthetic changelog text: healthy passes, an undated top heading yields `["top undated","undated section"]`, a bump without a section yields `["top name 0.7.0 != 0.8.0"]`, a malformed name yields `["malformed name 0.5"]`, and a duplicate yields `["duplicate"]`. Second review APPROVED.
- loop note: the n=16 and n=17 `prev-chain` values were wrong on the first attempt because the hash was computed while the record was still the last block, so it included the trailing blank lines that the gate trims once a new `### n=` heading appears. The gate's expected value is authoritative; both records were corrected before their commits closed.
- token/cost/duration: tokens not captured; one session, no executor dispatch and two reviewer rounds.
- interpretation: the release is the campaign's only non-code gain, and it is the one with an external consequence: a publish of this tree now ships 0.7.0 with the changelog to match, instead of 0.5.0 with ten undeclared components.
- keep/revert: keep.
- next hypothesis: nothing from the campaign 4 or 5 candidate sets remains unstarted except the `Field` seam refactor, which the campaign 5 screener denied as a multi-iteration restructure, and the branch-protection decision, which is the operator's.
- prev-chain: sha256:a0215935f6af58883fd868a566382b3a59b00eeaffd1e9bec5d7a2c3e98f259d (same link as the preregistration, restated for the gate).

### n=18 close-out

- final review: `record_review` APPROVED, reviewer `ses_de3776b55ffeaJXpKmm5EekT6k`, bound to commit `e2515f3ee85e` (tracked fingerprint `162b8e566f7c`).
- work item: GitHub issue #46.
- PR: #47, `chore/release-0-7-0` into `main`.
- CI run: https://github.com/ultus-net/design-kit/actions/runs/45982193718 — `gates` passed in 37s on the PR head.
- final gate run after the last code mutation: `npm test` 35 files / 188 tests passed, plus check 0/0, contrast 186/0 and a clean build.








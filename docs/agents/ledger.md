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





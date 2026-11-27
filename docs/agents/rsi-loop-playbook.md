# RSI loop playbook

The operating manual for the `/rsi-loop` and `/rsi-campaign` commands, and the
repo-local grounding those commands read first.

## Before the first iteration

The loop depends on three artifacts in this repo. Create any missing one from
`~/.config/opencode/templates/rsi/` before running an iteration:

- `docs/agents/rsi-loop-playbook.md` — this file.
- `docs/agents/ledger.md` — the create-only experiment ledger.
- `docs/agents/lessons.md` and `docs/agents/lessons/` — the lesson memory.

## The base loop

One iteration maps to one branch and one PR:

1. **PROPOSE** — pick one minimal candidate change. Read the actual code first;
   cite the files you read in the proposal.
2. **PREDICT** — before editing, register a falsifiable claim: expected effect
   on the metric, how it will be verified, and at-risk regressions.
3. **IMPLEMENT** — delegate mechanical work to an `executor` subagent with a
   full spec (inputs, constraints, acceptance command). Keep the diff minimal.
   Start on the cheap tier; escalate only on an observable trigger.
4. **EVALUATE** — run the external verifier only; self-review is not evidence.
   Change one causal axis per iteration.
5. **SELECT** — regularize selection: anneal the edit budget, screen proposals
   for benchmark-specific trickery, prune stale or too-small edits, and advance
   the incumbent only on a minimum effect size. Delegate a fresh-eyes check to
   a `reviewer` subagent. Archive rejected attempts with their failure evidence.
6. **REMEMBER** — write one lesson file under `docs/agents/lessons/`, and append
   one structured record to `docs/agents/ledger.md`. Write it either way; a
   negative result is data.

## Hard rules

- Never edit tests, the verifier, baselines, or run logs to make a change pass.
- Live settings changes go through a sanctioned installer, never a direct edit.
- A negative result is a valid result: log it and stop.

## Multi-iteration campaigns

`/rsi-loop` runs one iteration. `/rsi-campaign` runs a bounded batch (3-5
iterations) in one session with explicit stop brakes and subagent fan-out: it
builds a diversity-tagged candidate set before iterating, enforces no-gain and
same-type stop brakes, and isolates overlapping edits in git worktrees. Each
iteration still maps to one branch and one PR.

## Grounding

This repo carries no grounding gate and no reading list yet, so the date below
is compared to today by hand. There is no sweep to compare against, and this
date claims no sweep happened.

- **Grounding date:** 2026-11-27 (set at scaffold creation).
- **Next review date:** 2026-12-27.
- **Citation check:** not applicable. No arXiv ids are cited in this repo's
  playbook or design docs, so there is no manifest to resolve.

## Anchors for this repo

- **verifier** — `npm test` (vitest, behavioural), plus `npm run check`
  (svelte-check, zero errors and warnings) and `npm run contrast` (186 colour
  pairs, non-zero exit on a miss). `npm run build` proves the static site.
- **metric** — exported components that carry behavioural tests that fail
  without the component. Observed count moved 19 -> 20 at iteration 1
  (`Breadcrumbs`). The candidate is one component from
  `docs/design/2026-11-26-design-kit-shape-and-components.md` section 3, PR D.
- **frozen ruler** — the HEAD `bfcdf42` baseline: 14 test files, 74 tests
  passing, 186 contrast pairs with 0 failures, svelte-check 0/0, clean build.
  The ruler is the suite and the gates, not a stored score.
- **target tier** — the operator's default executor tier. Record whether an
  accepted change was measured there.

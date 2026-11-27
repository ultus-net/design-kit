# L009 — a workflow file is prose until it runs; write the promise it can prove

Date: 2026-11-27
Iteration: campaign 2, n=9 (`feature/ci-gate`)
Status: admitted

## Lesson

- L009 — a CI workflow is verified by its text locally and by its run on the
  forge. Until the run exists, the claim must be the text-level one: "the
  workflow names these steps in this order and no step can be made non-fatal".
  A claim about the merge path ("opened, synchronised and merged") needs the
  trigger set and branch protection, not a `pull_request:` key. (evidence:
  `.github/workflows/gates.yml:3-6` triggers only `push` and `pull_request`;
  `gh api repos/ultus-net/design-kit/branches/main/protection` returns 404
  "Branch not protected"; `src/lib/workflow-gates.test.ts:20-51` pins order and
  fatality, and the first review rejected the stronger wording.)

## What happened

The first draft added the workflow plus a test that checked the four script
names appeared somewhere in the file, and the PR text claimed a red tree could
not reach `main`. The reviewer rejected it twice over the same defect: the test
proved substrings and the promise described enforcement. The fix was to narrow
the promise to advisory visibility (the checks tab reports, branch protection
would block) and to make the test assert the properties the promise does rest
on: `npm ci` first, the four gates in order, and no `continue-on-error`,
`|| true` or step-level `if:`.

## Applicability conditions

- Applies to any infrastructure change whose verifier runs somewhere the local
  suite cannot reach: CI workflows, deploy hooks, cron jobs, branch protection.
- Requires the residual limit to be written where a reader checks it: the
  changelog, the playbook anchor and the ledger record, not only in the PR.
- Does not apply when the change is executable locally. A test that runs the
  same code path the gate runs discharges the claim without a caveat.
- Pinning the runtime to the exact version the suite was verified on is
  preferable to a floating or LTS major: an unavailable pin fails loudly at
  setup, a different major fails silently.

## Why it is admitted

Two review rounds name the overclaim verbatim, and the committed test,
changelog wording and ledger record are the artefacts that closed it. The
scope condition keeps the lesson from excusing unverified claims about changes
the local suite can prove.

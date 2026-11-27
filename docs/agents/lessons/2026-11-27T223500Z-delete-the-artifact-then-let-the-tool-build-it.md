# L019 — delete the artifact, then let the tool build it

Date: 2026-11-27
Iteration: campaign 6, n=19 (`fix/publishable-package`)
Status: admitted

## Lesson

- L019 — when a gate asserts that a tool produces an artifact, delete the
  artifact first and let the tool create it. A gate that builds its own input
  proves the input, not the hook. (evidence:
  `src/lib/package-contents.test.ts:27-50`; the first version built `dist/` with
  `svelte-package` and then packed with `--ignore-scripts`, so the tarball
  assertions could pass while `prepack` was absent.)

## What happened

The defect was that `npm pack` shipped no `dist/`. The first gate proved that a
built `dist/` packs, which is not the same claim. It built the package itself,
then asked npm to list a tarball with lifecycle scripts disabled. Remove the
`prepack` field and that gate still passed every tarball assertion, because the
test had already done the hook's job.

The fix is ordering, not more assertions: delete `dist/`, run `npm pack` with
scripts enabled, then run `npm pack --dry-run --json --ignore-scripts` and read
that report. The second listing can only contain `dist/` if the first run's hook
created it. A companion script writes to stdout, so the build run and the report
run are separate; a single `--json` run died on `Unexpected token 'w',
"wrote /hom"`.

## Applicability conditions

- Applies to any gate that claims a command produces output: build hooks,
  codegen, compilation, packaging, migrations.
- Requires the artifact to be absent before the action, and the assertion to
  read only what the action produced.
- Does not apply to a gate on a pure function, where the input is the test's to
  construct.
- The negative control is cheap and is the check: remove the hook, run the gate,
  watch it fail. Record that output beside the result.

## Why it is admitted

The review rejected the first version, the rewrite was approved, and the control
was run in the same environment: with `scripts.prepack` deleted the gate fails
all three tests (`expected 3 to be greater than or equal to 60`), and with it
restored the gate passes.

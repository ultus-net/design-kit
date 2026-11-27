# L005 — read project files in a test with `?raw` imports when `@types/node` is absent

Date: 2026-11-27
Iteration: campaign 5 (`feature/count-claim-gate`)
Status: admitted

## Lesson

- L005 — a test that reads repository files must not import `node:fs` in this
  repo. `@types/node` is not installed, so `npm run check` reports
  `Cannot find name 'node:fs'` and fails the gate. Import the file as text
  instead: `import readme from '../../README.md?raw';`. Vite and vitest resolve
  `?raw` through `vite/client`, which SvelteKit already references, so the
  import type-checks with no new dependency. (evidence:
  `src/lib/count-claims.test.ts:1-5` at commit `b45dbe1`; the escalating
  acceptance run reported two svelte-check errors for `node:fs` and `node:url`,
  and the baseline with the file removed was 0 errors and 0 warnings.)

## What happened

The first accepted draft of the count-claim gate read `README.md`, the two
pages and `index.ts` with `readFileSync(fileURLToPath(new URL(...)))`. Tests
passed (100) but svelte-check failed with two errors, because the repo has no
Node type definitions. Adding `@types/node` would be a new dependency and a
lockfile change; a hand-written shim would weaken the types. Rewriting the four
reads as `?raw` imports removed both errors and kept the same four assertions.
The `// @vitest-environment node` pragma that the `node:fs` version needed was
also deleted, because `?raw` works under the repo's default jsdom environment.

## Applicability conditions

- Applies to tests (and modules) that need a repository file's raw text as a
  value at test time, in a Vite or SvelteKit project.
- Does not apply when the file must be read at runtime outside the bundler
  (a build script, a CLI, a server hook). Those are plain Node programs and
  should keep `node:fs` and declare `@types/node`.
- `?raw` inlines the file at transform time, so the import does not observe a
  file changed after the module is loaded. A gate that must read the working
  tree mid-run needs the runtime reader plus the type package.
- A `// @ts-ignore` above the `node:fs` import silences the gate without
  supplying types; it is not a fix.

## Why it is admitted

The failing check output and the 0/0 baseline are both recorded, and the
`?raw` import lines are the change that made the gate green. The scope
condition keeps the lesson from steering runtime scripts away from `node:fs`,
where it is the correct API.

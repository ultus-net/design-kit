# Publishing

The package is `@ultus-net/design-kit`. It is `private: false`, so `npm publish` works from a clean checkout. There is no tag, no release workflow and no publish automation yet; a release is a manual `npm version`, a changelog cut and a publish.

## What ships

`package.json` sets `"files": ["dist", "!dist/**/*.test.*"]`. `dist/` is gitignored and built by `npm run package` (`svelte-package`), so a pack or publish without that build ships only the metadata files. `"prepack": "npm run package"` closes that gap: npm runs the build before it packs, so every tarball carries `dist/index.js`, `dist/index.d.ts` and the four `exports` targets.

## Verify before publishing

    npm run package                 # build dist by hand
    npm pack --dry-run              # prepack rebuilds, then lists the tarball
    npm publish                     # prepack rebuilds first

The `package-contents` test in `src/lib/` deletes `dist/`, runs `npm pack --dry-run --json`, and reads the report. The build it observes can only have come from `prepack`. It fails when the pack has no `dist/`, when a `src/` or test file leaks in, when an `exports` target is missing, or when the `svelte` peer range no longer admits the installed major.

## Limits

The test proves the `npm pack` path, where npm runs `prepack` and the tarball carries `dist/`. It does not run `npm publish`, and it does not resolve the package the way a consumer's bundler would.

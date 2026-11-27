import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import packageSource from '../../package.json?raw';

interface PackEntry {
  path: string;
}

interface PackReport {
  name: string;
  version: string;
  entryCount: number;
  files: PackEntry[];
}

interface Manifest {
  files: string[];
  exports: Record<string, string | Record<string, string>>;
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

const manifest: Manifest = JSON.parse(packageSource);
const timeout = 240_000;

function exportTargets(): string[] {
  return Object.values(manifest.exports).flatMap((target) =>
    typeof target === 'string' ? [target] : Object.values(target)
  );
}

let packed: PackReport;

beforeAll(() => {
  // Delete the build output, then pack once with scripts enabled. A lifecycle
  // script writes to stdout, so the JSON report comes from a second pack with
  // scripts off: dist/ can only exist for that one if prepack built it.
  rmSync('dist', { recursive: true, force: true });
  execFileSync('npm', ['pack', '--dry-run'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout
  });

  const report = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout
  }) as string;

  packed = (JSON.parse(report) as PackReport[])[0];
}, timeout);

describe('published package', () => {
  it('builds before packing, admits only dist, and admits the installed svelte major', () => {
    const installed = Number(manifest.devDependencies.svelte.replace(/^\D*/, '').split('.')[0]);

    expect(manifest.scripts.prepack).toBe('npm run package');
    expect(manifest.files).toContain('dist');
    expect(manifest.files).toContain('!dist/**/*.test.*');
    expect(manifest.peerDependencies.svelte).toBe(`^${installed}.0.0`);
  });

  it('ships the built library and no sources or tests', () => {
    const paths = packed.files.map((entry) => entry.path);

    expect(packed.entryCount).toBeGreaterThanOrEqual(60);
    expect(paths).toContain('LICENSE');
    expect(paths).toContain('dist/index.js');
    expect(paths).toContain('dist/index.d.ts');
    expect(paths.filter((path) => path.startsWith('src/'))).toEqual([]);
    expect(paths.filter((path) => path.includes('.test.'))).toEqual([]);
  });

  it('ships every file the exports map points at', () => {
    const paths = new Set(packed.files.map((entry) => entry.path));
    const missing = exportTargets()
      .map((target) => target.replace(/^\.\//, ''))
      .filter((target) => !paths.has(target));

    expect(missing).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import workflowSource from '../../.github/workflows/gates.yml?raw';
import packageSource from '../../package.json?raw';

const GATE_SCRIPTS = ['test', 'check', 'contrast', 'build'];
const scripts: string[] = Object.keys(JSON.parse(packageSource).scripts);

function stepCommands(source: string): string[] {
  return [...source.matchAll(/^\s*- run: (.+)$/gm)].map((match) => match[1].trim());
}

function scriptName(command: string): string | null {
  const direct = command.match(/^npm (test|start)$/);
  if (direct) return direct[1];

  const viaRun = command.match(/^npm run ([\w:-]+)$/);
  return viaRun ? viaRun[1] : null;
}

describe('ci gates workflow text', () => {
  it('installs from the lockfile before it runs anything else', () => {
    const commands = stepCommands(workflowSource);

    expect(commands[0]).toBe('npm ci');
  });

  it('runs the gate scripts in order', () => {
    const invoked = stepCommands(workflowSource)
      .map(scriptName)
      .filter((name): name is string => name !== null && GATE_SCRIPTS.includes(name));

    expect(invoked).toEqual(GATE_SCRIPTS);
  });

  it('names only scripts that exist in package.json', () => {
    const invoked = stepCommands(workflowSource)
      .map(scriptName)
      .filter((name): name is string => name !== null);

    expect(invoked.filter((name) => !scripts.includes(name))).toEqual([]);
  });

  it('lets every gate step fail the job', () => {
    expect(workflowSource).not.toMatch(/continue-on-error/);
    expect(workflowSource).not.toMatch(/\|\| true/);
    expect(workflowSource).not.toMatch(/^\s*if:/m);
  });

  it('runs on push and on pull request', () => {
    expect(workflowSource).toMatch(/^ {2}push:/m);
    expect(workflowSource).toMatch(/^ {2}pull_request:/m);
  });
});

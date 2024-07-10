import { join } from 'node:path';
import { Command } from 'commander';
import { readPackageJsonSync } from '@gmjs/package-json';

export function createProgram(): Command {
  const program = new Command();
  program
    .name('gmgh')
    .description('github-cli')
    .version(readPackageJsonSync(join(__dirname, '../..')).version ?? '');

  return program;
}

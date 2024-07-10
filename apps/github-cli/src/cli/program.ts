import nodePath from 'node:path';
import { Command } from 'commander';
import { readPackageJsonSync } from '@gmjs/package-json';
import { Config, Program } from '../types';

export function createProgram(config: Config): Program {
  const rootCommand = new Command();
  rootCommand
    .name('gmgh')
    .description('github-cli')
    .version(
      readPackageJsonSync(nodePath.join(__dirname, '../..')).version ?? '',
    );

  const program: Program = {
    command: rootCommand,
    config,
  };

  return program;
}

import { Command } from 'commander';
import { Config } from './config';

export interface Program {
  readonly command: Command;
  readonly config: Config;
}

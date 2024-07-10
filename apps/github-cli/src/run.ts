import { createConfig, parseEnv } from './config';
import { addCommandExample, createProgram } from './cli';

import './setup/setup-env';

export async function run(): Promise<void> {
  const env = parseEnv(process.env);
  const config = createConfig(env);

  const program = createProgram(config);
  addCommandExample(program);

  await program.command.parseAsync(process.argv);
}

run();

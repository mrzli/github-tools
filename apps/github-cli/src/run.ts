import { addCommandExample, createProgram } from './cli';

export async function run(): Promise<void> {
  const program = createProgram();
  addCommandExample(program);

  await program.parseAsync(process.argv);
}

run();
import { Command } from 'commander';

type OptionValue = string;
type Options = Readonly<Record<string, OptionValue | undefined>>;

export function addCommandExample(program: Command): Command {
  program
    .command('example')
    .alias('e')
    .description('Example command')
    .argument('[some-argument]', 'Some argument', 'some-argument-default-value')
    .option(
      '-s, --some-option <someOption>',
      'Some option',
      'some-option-default-value',
    )
    .action(action);

  return program;
}

async function action(
  someArgument: string,
  options: Options,
  _command: Command
): Promise<void> {
  console.log('Example command executed!');
  console.log('Arguments:', someArgument);
  console.log('Options:', options);
}

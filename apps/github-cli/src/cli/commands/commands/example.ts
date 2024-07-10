import { Command } from 'commander';
import { Config, Program } from '../../../types';

type OptionValue = string;
type Options = Readonly<Record<string, OptionValue | undefined>>;

export function addCommandExample(program: Program): Command {
  const { command, config } = program;

  command
    .command('example')
    .alias('e')
    .description('Example command')
    .argument('[some-argument]', 'Some argument', 'some-argument-default-value')
    .option(
      '-s, --some-option <someOption>',
      'Some option',
      'some-option-default-value',
    )
    .action(createAction(config));

  return command;
}

function createAction(
  config: Config,
): (
  someArgument: string,
  options: Options,
  _command: Command,
) => Promise<void> {
  return async (someArgument, options, _command) => {
    console.log('Example command executed!');
    console.log('Arguments:', someArgument);
    console.log('Options:', options);
    console.log('Config:', config);
  };
}

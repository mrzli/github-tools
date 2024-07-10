import { Config } from '../types';
import { createConfig, parseEnv } from '../config';
import { execute } from './execute';

import '../setup/setup-env';

const CONFIG: Config = createConfig(parseEnv(process.env));

execute(CONFIG).finally(() => {
  console.log('Done!');
});

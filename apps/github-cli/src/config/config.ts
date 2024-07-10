import { Env, Config } from '../types';

export function createConfig(env: Env): Config {
  return {
    env,
  };
}

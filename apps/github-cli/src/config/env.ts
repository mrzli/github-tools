import { z } from 'zod';
import { Env } from '../types';

const ENV_SCHEMA = z.object({
  NODE_ENV: z.string().min(1),
  GITHUB_API_URL: z.string().url(),
  GITHUB_API_VERSION: z.string().min(1),
  GITHUB_API_TOKEN: z.string().min(1),
});

type EnvRaw = z.infer<typeof ENV_SCHEMA>;

export function parseEnv(env: NodeJS.ProcessEnv): Env {
  const raw = ENV_SCHEMA.parse(env);
  return envRawToEnv(raw);
}

function envRawToEnv(raw: EnvRaw): Env {
  return {
    nodeEnv: raw.NODE_ENV,
    githubApiUrl: raw.GITHUB_API_URL,
    githubApiVersion: raw.GITHUB_API_VERSION,
    githubApiToken: raw.GITHUB_API_TOKEN,
  };
}

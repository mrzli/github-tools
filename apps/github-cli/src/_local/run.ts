import { createGithubApi, GithubApiInput } from '@gmjs/repo-list';
import { Config } from '../types';
import { createConfig, parseEnv } from '../config';

import '../setup/setup-env';

const CONFIG: Config = createConfig(parseEnv(process.env));

export async function run(config: Config): Promise<void> {
  const { env } = config;
  const { githubApiUrl, githubApiVersion, githubApiToken } = env;

  const githubApiInput: GithubApiInput = {
    url: githubApiUrl,
    version: githubApiVersion,
    token: githubApiToken,
  };

  const githubApi = createGithubApi(githubApiInput);
  const user = await githubApi.user.getCurrent();
  const organizations = await githubApi.user.getOrgs();

  console.log(user, organizations);
}

run(CONFIG).finally(() => {
  console.log('Done!');
});

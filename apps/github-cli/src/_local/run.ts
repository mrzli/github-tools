import { createGithubApi, GithubApiInput } from '@gmjs/repo-list';
import { Config } from '../types';
import { createConfig, parseEnv } from '../config';

import '../setup/setup-env';
import { writeTextAsync } from '@gmjs/file-system';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

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

  const userRepos = await githubApi.user.getRepos();
  const orgRepos = await Promise.all(
    organizations.map((org: Any) => githubApi.orgs.getRepos(org.login)),
  );

  await writeTextAsync('output/user.json', JSON.stringify(user, undefined, 2));
  await writeTextAsync(
    'output/organizations.json',
    JSON.stringify(organizations, undefined, 2),
  );
  await writeTextAsync(
    'output/user-repos.json',
    JSON.stringify(userRepos, undefined, 2),
  );
  await writeTextAsync(
    'output/org-repos.json',
    JSON.stringify(orgRepos, undefined, 2),
  );
}

run(CONFIG).finally(() => {
  console.log('Done!');
});

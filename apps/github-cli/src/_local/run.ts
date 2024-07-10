import {
  createGithubApi,
  getAllRequestItems,
  GithubApiInput,
} from '@gmjs/repo-list';
import { writeTextAsync } from '@gmjs/file-system';
import { Config } from '../types';
import { createConfig, parseEnv } from '../config';
import { invariant } from '@gmjs/assert';
import { applyFn } from '@gmjs/apply-function';
import { filterOutNullish, map, toArray } from '@gmjs/value-transformers';
import { PairWithArrayValue, RepoData } from './types';
import { validateUserRepo } from './validate-repos';
import { toPrimaryGroupsLines, toRepoLine } from './writing';
import { groupRepos } from './group-repos';

import '../setup/setup-env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const CONFIG: Config = createConfig(parseEnv(process.env));

const ITEMS_PER_PAGE = 30;

export async function run(config: Config): Promise<void> {
  const { env } = config;
  const { githubApiUrl, githubApiVersion, githubApiToken } = env;

  const githubApiInput: GithubApiInput = {
    url: githubApiUrl,
    version: githubApiVersion,
    token: githubApiToken,
  };

  const githubApi = createGithubApi(githubApiInput);
  const userResponse = await githubApi.user.getCurrent();
  const user = userResponse.data;

  const organizations = await getAllRequestItems(
    (pagingData) => githubApi.user.getOrgs(pagingData),
    ITEMS_PER_PAGE,
  );

  const userRepos = await getAllRequestItems((pagingData) =>
    githubApi.user.getRepos(pagingData),
  );

  const perOrgRepos: readonly PairWithArrayValue<Any>[] = await Promise.all(
    organizations.map(async (org: Any) => {
      const repos = await getAllRequestItems((pagingData) =>
        githubApi.orgs.getRepos(org.login, pagingData),
      );
      return [org.login, repos] as const;
    }),
  );

  const username = user.login;

  const userReposData: readonly RepoData[] = userRepos.map((repo: Any) =>
    toRepoData(repo),
  );

  const orgReposData: readonly PairWithArrayValue<RepoData>[] = perOrgRepos.map(
    ([org, repos]) =>
      [org, repos.map((repo: Any) => toRepoData(repo))] as const,
  );

  await writeTextAsync(
    'output/user-repos.json',
    JSON.stringify(userReposData, undefined, 2),
  );
  await writeTextAsync(
    'output/per-org-repos.json',
    JSON.stringify(orgReposData, undefined, 2),
  );

  const markdown = toMarkdown(username, userReposData, orgReposData);
  await writeTextAsync('output/repo-list.md', markdown);
}

function toRepoData(repo: Any): RepoData {
  return {
    id: repo.id,
    owner: repo.owner.login,
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    private: repo.private,
    archived: repo.archived,
    topics: repo.topics,
  };
}

function toMarkdown(
  username: string,
  userRepos: readonly RepoData[],
  perOrgRepos: readonly PairWithArrayValue<RepoData>[],
): string {
  const userRepoErrors = applyFn(
    userRepos,
    map((repo) => validateUserRepo(repo)),
    filterOutNullish(),
    toArray(),
  );

  if (userRepoErrors.length > 0) {
    console.error(`Found errors in ${userRepoErrors.length} user repos:`);
    const errors = userRepoErrors.map((e) => e.error);
    console.error(JSON.stringify(errors, undefined, 2));
    // invariant(false, 'User repo errors found.');
  }

  const invalidUserRepos: ReadonlySet<number> = new Set(
    userRepoErrors.map((e) => e.id),
  );

  const validUserRepos = userRepos.filter(
    (repo) => !invalidUserRepos.has(repo.id),
  );

  const groupedRepos = groupRepos(validUserRepos);
  const primaryGroupsLines = toPrimaryGroupsLines(groupedRepos);

  return (
    [
      '# Repos',
      '',
      `## User Repos ('${username}')`,
      '',
      ...primaryGroupsLines,
    ].join('\n') + '\n'
  );
}

run(CONFIG).finally(() => {
  console.log('Done!');
});

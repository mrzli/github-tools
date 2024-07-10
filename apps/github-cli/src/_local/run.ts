import {
  createGithubApi,
  getAllRequestItems,
  GithubApiInput,
} from '@gmjs/repo-list';
import { writeTextAsync } from '@gmjs/file-system';
import { parseIntegerOrThrow } from '@gmjs/number-util';
import { Config } from '../types';
import { createConfig, parseEnv } from '../config';

import '../setup/setup-env';
import { filterOutNullish } from '@gmjs/array-transformers';

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
    owner: repo.owner.login,
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    private: repo.private,
    archived: repo.archived,
    topics: repo.topics,
  };
}

type PairWithArrayValue<T> = readonly [string, readonly T[]];

interface RepoData {
  readonly owner: string; // owner.login
  readonly name: string; // name
  readonly url: string; // html_url
  readonly description: string; // description
  readonly private: boolean; // private
  readonly archived: boolean; // archived
  readonly topics: readonly string[]; // topics
}

function toMarkdown(
  username: string,
  userRepos: readonly RepoData[],
  perOrgRepos: readonly PairWithArrayValue<RepoData>[],
): string {
  return (
    [
      '# Repos',
      '',
      `## User Repos ('${username}')`,
      '',
      ...userRepos.map((r) => toRepoLine(r)),
    ].join('\n') + '\n'
  );
}

function toRepoLine(repo: RepoData): string {
  const parts: readonly string[] = filterOutNullish([
    '-',
    repo.archived ? '**A**' : undefined,
    repo.private ? '**P**' : undefined,
    `[${repo.name}](${repo.url})`,
    '-',
    isEmpty(repo.description) ? '&lt;NO-DESCRIPTION&gt;' : `_${repo.description}_`,
  ]);
  return parts.join(' ');
}

function isEmpty(str: string | undefined | null): boolean {
  return str === undefined || str === null || str === '';
}

run(CONFIG).finally(() => {
  console.log('Done!');
});

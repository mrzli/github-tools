import {
  createGithubApi,
  getAllRequestItems,
  GithubApiInput,
} from '@gmjs/repo-list';
import { writeTextAsync } from '@gmjs/file-system';
import { Config } from '../types';
import { applyFn } from '@gmjs/apply-function';
import {
  filter,
  filterOutNullish,
  map,
  toArray,
} from '@gmjs/value-transformers';
import { RepoData } from './types';
import { toPrimaryGroupsLines } from './writing';
import { groupRepos, validateUserRepo } from './util';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

const ITEMS_PER_PAGE = 30;

export async function execute(config: Config): Promise<void> {
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

  // const organizations = await getAllRequestItems(
  //   (pagingData) => githubApi.user.getOrgs(pagingData),
  //   ITEMS_PER_PAGE,
  // );

  const userRepos = await getAllRequestItems(
    (pagingData) => githubApi.user.getRepos(pagingData),
    ITEMS_PER_PAGE,
  );

  // const perOrgRepos: readonly PairWithArrayValue<Any>[] = await Promise.all(
  //   organizations.map(async (org: Any) => {
  //     const repos = await getAllRequestItems((pagingData) =>
  //       githubApi.orgs.getRepos(org.login, pagingData),
  //       ITEMS_PER_PAGE,
  //     );
  //     return [org.login, repos] as const;
  //   }),
  // );

  const username = user.login;

  const userReposData: readonly RepoData[] = userRepos.map((repo: Any) =>
    toRepoData(repo),
  );

  // const orgReposData: readonly PairWithArrayValue<RepoData>[] = perOrgRepos.map(
  //   ([org, repos]) =>
  //     [org, repos.map((repo: Any) => toRepoData(repo))] as const,
  // );

  // await writeTextAsync(
  //   'output/user-repos.json',
  //   JSON.stringify(userReposData, undefined, 2),
  // );
  // await writeTextAsync(
  //   'output/per-org-repos.json',
  //   JSON.stringify(orgReposData, undefined, 2),
  // );

  const markdown = toMarkdown(username, userReposData);
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

function toMarkdown(username: string, repos: readonly RepoData[]): string {
  const validUserRepos = getValidActiveUserRepos(username, repos);

  const groupedRepos = groupRepos(validUserRepos);
  const primaryGroupsLines = toPrimaryGroupsLines(groupedRepos);

  return (
    [
      '# Repos',
      '',
      `## User Repos ('${username}')`,
      '',
      ...primaryGroupsLines,
      '---',
      '---',
    ].join('\n') + '\n'
  );
}

function getValidActiveUserRepos(
  username: string,
  repos: readonly RepoData[],
): readonly RepoData[] {
  const activeUserRepos = repos.filter(
    (repo) => repo.owner === username && !repo.archived,
  );

  const userRepoErrors = applyFn(
    activeUserRepos,
    filter((repo) => repo.owner === username && !repo.archived),
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

  const invalidUserRepoIds: ReadonlySet<number> = new Set(
    userRepoErrors.map((e) => e.id),
  );

  const validUserRepos = activeUserRepos.filter(
    (repo) => !invalidUserRepoIds.has(repo.id),
  );

  return validUserRepos;
}

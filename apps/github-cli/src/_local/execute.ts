import {
  createGithubApi,
  getAllRequestItems,
  GithubApiInput,
} from '@gmjs/repo-list';
import { writeTextAsync } from '@gmjs/file-system';
import { Config } from '../types';
import { RepoData } from './types';
import {
  toArchivedReposResultLines,
  toOrgReposLines,
  toPrimaryGroupsLines,
  toRepoLine,
} from './writing';
import {
  getActiveUserRepos,
  getArchivedRepos,
  getOrgRepos,
  groupUserRepos,
} from './util';

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
  const activeUserRepos = getActiveUserRepos(username, repos);
  const { valid: validUserRepos, invalid: invalidUserRepos } = activeUserRepos;

  const groupedRepos = groupUserRepos(validUserRepos);
  const primaryGroupsLines = toPrimaryGroupsLines(groupedRepos);

  const orgRepos = getOrgRepos(username, repos);
  const orgReposLines = toOrgReposLines(orgRepos);

  const archivedRepos = getArchivedRepos(username, repos);
  const archivedReposLines = toArchivedReposResultLines(archivedRepos);

  return (
    [
      '# Repos',
      '',
      `## User Repos ('${username}')`,
      '',
      ...primaryGroupsLines,
      '---',
      '---',
      ...orgReposLines,
      '---',
      '---',
      '---',
      ...archivedReposLines,
      ...(invalidUserRepos.length > 0
        ? [
            '---',
            '---',
            '---',
            '## Invalid User Repos',
            '',
            ...invalidUserRepos.map((repo) => toRepoLine(repo)),
          ]
        : []),
    ].join('\n') + '\n'
  );
}

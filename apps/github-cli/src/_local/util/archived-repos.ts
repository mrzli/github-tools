import { applyFn } from '@gmjs/apply-function';
import { ArchivedRepos, ArchivedReposResult, RepoData } from '../types';
import { filter, groupBy, map, sort, toArray } from '@gmjs/value-transformers';
import { compareByStringAsc } from '@gmjs/comparers';

export function getArchivedRepos(
  username: string,
  repos: readonly RepoData[],
): ArchivedReposResult {
  const reposByOwner: ReadonlyMap<string, readonly RepoData[]> = applyFn(
    repos,
    filter((repo) => repo.archived),
    groupBy((repo) => repo.owner),
  );

  const userRepos = reposByOwner.get(username) ?? [];

  const user: ArchivedRepos = {
    owner: username,
    repos: userRepos.toSorted(compareByStringAsc((repo) => repo.name)),
  };

  const byOrg: readonly ArchivedRepos[] = applyFn(
    reposByOwner,
    filter(([owner]) => owner !== username),
    sort(compareByStringAsc(([owner]) => owner)),
    map(([owner, repos]) => ({
      owner,
      repos: repos.toSorted(compareByStringAsc((repo) => repo.name)),
    })),
    toArray(),
  );

  return {
    user,
    orgs: byOrg,
  };
}

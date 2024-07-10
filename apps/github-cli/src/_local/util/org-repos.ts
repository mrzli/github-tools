import { applyFn } from '@gmjs/apply-function';
import { OwnerWithRepos, RepoData } from '../types';
import { filter, groupBy, map, sort, toArray } from '@gmjs/value-transformers';
import { compareByStringAsc } from '@gmjs/comparers';

export function getOrgRepos(
  username: string,
  repos: readonly RepoData[],
): readonly OwnerWithRepos[] {
  const result = applyFn(
    repos,
    filter((repo) => repo.owner !== username && !repo.archived),
    groupBy((repo) => repo.owner),
    sort(compareByStringAsc(([owner]) => owner)),
    map(([owner, repos]) => ({
      owner,
      repos: repos.toSorted(compareByStringAsc((repo) => repo.name)),
    })),
    toArray(),
  );

  return result;
}

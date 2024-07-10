import { applyFn } from '@gmjs/apply-function';
import { RepoData } from '../types';
import {
  filter,
  filterOutNullish,
  map,
  toArray,
} from '@gmjs/value-transformers';
import { validateUserRepo } from './validate-user-repo';

export interface ActiveUserRepos {
  readonly valid: readonly RepoData[];
  readonly invalid: readonly RepoData[];
}

export function getActiveUserRepos(
  username: string,
  repos: readonly RepoData[],
): ActiveUserRepos {
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

  const invalidUserRepos = activeUserRepos.filter((repo) =>
    invalidUserRepoIds.has(repo.id),
  );

  return {
    valid: validUserRepos,
    invalid: invalidUserRepos,
  };
}

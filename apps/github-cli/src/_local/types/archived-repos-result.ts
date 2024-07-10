import { OwnerWithRepos } from './owner-with-repos';

export interface ArchivedReposResult {
  readonly user: OwnerWithRepos;
  readonly orgs: readonly OwnerWithRepos[];
}

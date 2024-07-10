import { RepoData } from './repo-data';

export interface ArchivedReposResult {
  readonly user: ArchivedRepos;
  readonly orgs: readonly ArchivedRepos[];
}

export interface ArchivedRepos {
  readonly owner: string;
  readonly repos: readonly RepoData[];
}

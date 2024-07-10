import { RepoData } from './repo-data';

export interface OwnerWithRepos {
  readonly owner: string;
  readonly repos: readonly RepoData[];
}

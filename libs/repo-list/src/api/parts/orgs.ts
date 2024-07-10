import { AxiosInstance } from 'axios';
import { Any } from '../../types';
import { githubApiRequest } from '../shared';

export interface GithubApiOrgs {
  readonly getRepos: (org: string) => Promise<Any>;
}

export function createGithubApiOrgs(api: AxiosInstance): GithubApiOrgs {
  return {
    getRepos: async (org: string): Promise<Any> => {
      return await githubApiRequest<undefined, Any>(api, {
        method: 'GET',
        path: `/orgs/${org}/repos`,
      });
    },
  };
}

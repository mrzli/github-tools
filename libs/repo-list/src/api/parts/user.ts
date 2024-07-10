import { AxiosInstance } from 'axios';
import { Any } from '../../types';
import { githubApiRequest } from '../shared';

export interface GithubApiUser {
  readonly getCurrent: () => Promise<Any>;
  readonly getOrgs: () => Promise<Any>;
}

export function createGithubApiUser(api: AxiosInstance): GithubApiUser {
  return {
    getCurrent: async (): Promise<Any> => {
      return await githubApiRequest<undefined, Any>(api, {
        method: 'GET',
        path: '/user',
      });
    },
    getOrgs: async (): Promise<Any> => {
      return await githubApiRequest<undefined, Any>(api, {
        method: 'GET',
        path: `/user/orgs`,
      });
    },
  };
}

import { AxiosInstance, AxiosResponse } from 'axios';
import { Any } from '../../types';
import { githubApiRequest, toGithubPagingHeaders } from '../shared';
import { GithubPagingData } from '../types';

export interface GithubApiUser {
  readonly getCurrent: () => Promise<Any>;
  readonly getOrgs: (
    pagingData?: GithubPagingData,
  ) => Promise<AxiosResponse<readonly Any[]>>;
  readonly getRepos: (
    pagingData?: GithubPagingData,
  ) => Promise<AxiosResponse<readonly Any[]>>;
}

export function createGithubApiUser(api: AxiosInstance): GithubApiUser {
  return {
    getCurrent: async (): Promise<Any> => {
      return await githubApiRequest<undefined, Any>(api, {
        method: 'GET',
        path: '/user',
      });
    },
    getOrgs: async (
      pagingData?: GithubPagingData,
    ): Promise<AxiosResponse<readonly Any[]>> => {
      return await githubApiRequest<undefined, readonly Any[]>(api, {
        method: 'GET',
        path: '/user/orgs',
        params: {
          ...toGithubPagingHeaders(pagingData),
        },
      });
    },
    getRepos: async (
      pagingData?: GithubPagingData,
    ): Promise<AxiosResponse<readonly Any[]>> => {
      return await githubApiRequest<undefined, readonly Any[]>(api, {
        method: 'GET',
        path: '/user/repos',
        params: {
          ...toGithubPagingHeaders(pagingData),
        },
      });
    },
  };
}

import { AxiosInstance, AxiosResponse } from 'axios';
import { Any } from '../../types';
import { githubApiRequest, toGithubPagingHeaders } from '../shared';
import { GithubPagingData } from '../types';

export interface GithubApiOrgs {
  readonly getRepos: (
    org: string,
    pagingData?: GithubPagingData,
  ) => Promise<AxiosResponse<readonly Any[]>>;
}

export function createGithubApiOrgs(api: AxiosInstance): GithubApiOrgs {
  return {
    getRepos: async (
      org: string,
      pagingData?: GithubPagingData,
    ): Promise<AxiosResponse<readonly Any[]>> => {
      return await githubApiRequest<undefined, readonly Any[]>(api, {
        method: 'GET',
        path: `/orgs/${org}/repos`,
        params: {
          ...toGithubPagingHeaders(pagingData),
        },
      });
    },
  };
}

import axios, { AxiosResponse } from 'axios';
import { GithubApiInput, GithubApiRequestConfig } from './types';
import {
  createGithubApiOrgs,
  createGithubApiUser,
  GithubApiOrgs,
  GithubApiUser,
} from './parts';
import { githubApiRequest } from './shared';

export interface GithubApi {
  readonly request: <TRequestData, TResponseData>(
    config: GithubApiRequestConfig<TRequestData>,
  ) => Promise<AxiosResponse<TResponseData>>;
  readonly user: GithubApiUser;
  readonly orgs: GithubApiOrgs;
}

export function createGithubApi(input: GithubApiInput): GithubApi {
  const { url, version, token } = input;

  const api = axios.create({
    baseURL: url,
    headers: {
      ...getGithubHeaders(version, token),
    },
  });

  return {
    request: async <TRequestData, TResponseData>(
      config: GithubApiRequestConfig<TRequestData>,
    ): Promise<AxiosResponse<TResponseData>> => {
      return await githubApiRequest<TRequestData, TResponseData>(api, config);
    },
    user: createGithubApiUser(api),
    orgs: createGithubApiOrgs(api),
  };
}

function getGithubHeaders(
  version: string,
  token: string,
): Readonly<Record<string, string>> {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': version,
  };
}

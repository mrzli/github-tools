import axios from 'axios';
import { GithubApiInput, GithubApiRequestConfig } from './types';
import { createGithubApiUser, GithubApiUser } from './parts';
import { githubApiRequest } from './shared';

export interface GithubApi {
  readonly request: <TRequestData, TResponseData>(
    config: GithubApiRequestConfig<TRequestData>,
  ) => Promise<TResponseData>;
  readonly user: GithubApiUser;
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
    ): Promise<TResponseData> => {
      return await githubApiRequest<TRequestData, TResponseData>(api, config);
    },
    user: createGithubApiUser(api),
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

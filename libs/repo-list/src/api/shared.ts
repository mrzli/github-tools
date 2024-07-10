import { AxiosInstance, AxiosResponse } from 'axios';
import { GithubApiRequestConfig, GithubPagingData } from './types';

export async function githubApiRequest<TRequestData, TResponseData>(
  instance: AxiosInstance,
  config: GithubApiRequestConfig<TRequestData>,
): Promise<AxiosResponse<TResponseData>> {
  const { method, path, headers, params, data, timeout } = config;

  const response = await instance.request<TResponseData>({
    method,
    url: path,
    headers,
    params,
    data,
    timeout,
  });

  return response;
}

export function toGithubPagingHeaders(
  pagingData: GithubPagingData | undefined,
): Readonly<Record<string, string | undefined>> {
  if (pagingData === undefined) {
    return {};
  }

  const { page, perPage } = pagingData;

  return {
    page: page?.toString(),
    per_page: perPage?.toString(),
  };
}

import { AxiosInstance } from 'axios';
import { GithubApiRequestConfig } from './types';

export async function githubApiRequest<TRequestData, TResponseData>(
  instance: AxiosInstance,
  config: GithubApiRequestConfig<TRequestData>,
): Promise<TResponseData> {
  const { method, path, headers, params, data, timeout } = config;

  const response = await instance.request<TResponseData>({
    method,
    url: path,
    headers,
    params,
    data,
    timeout,
  });

  const responseData = response.data;

  return responseData;
}

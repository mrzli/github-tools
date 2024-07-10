import { Method } from 'axios';
import { Any } from '../../types';

export interface GithubApiRequestConfig<TRequestData> {
  readonly method: Method;
  readonly path: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly params?: Readonly<Record<string, Any>> | URLSearchParams;
  readonly data?: TRequestData;
  readonly timeout?: number;
}

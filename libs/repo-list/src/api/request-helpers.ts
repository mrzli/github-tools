import { parseIntegerOrThrow } from '@gmjs/number-util';
import { Any } from '../types';
import { GithubPagingData } from './types';
import { AxiosResponse } from 'axios';

export async function getAllRequestItems(
  call: (
    pagingData?: GithubPagingData,
  ) => Promise<AxiosResponse<readonly Any[]>>,
  perPage?: number,
): Promise<readonly Any[]> {
  const items: Any[] = [];

  let nextPage: number | undefined = 1;
  while (nextPage !== undefined) {
    const response = await call({ page: nextPage, perPage });
    const data = response.data;
    items.push(...data);
    const linkPageIndexes = getLinkPageIndexes(response.headers);
    nextPage = linkPageIndexes.next;
  }

  return items;
}

interface RestRequestPageIndexes {
  readonly first: number | undefined;
  readonly prev: number | undefined;
  readonly next: number | undefined;
  readonly last: number | undefined;
}

function getLinkPageIndexes(
  headers: Readonly<Record<string, unknown>>,
): RestRequestPageIndexes {
  const linkHeader = headers['link'];
  if (linkHeader === undefined || typeof linkHeader !== 'string') {
    return {
      first: undefined,
      prev: undefined,
      next: undefined,
      last: undefined,
    };
  }

  const links = linkHeader.split(',').map((link) => link.trim());

  const linkMap = links.reduce<Readonly<Record<string, string>>>(
    (acc, link) => {
      const [url, rel] = link.split(';').map((part) => part.trim());
      const urlMatch = url.match(/<(.+)>/);
      if (!urlMatch) {
        return acc;
      }
      const urlPath = urlMatch[1];
      const relMatch = rel.match(/rel="(.+)"/);
      if (!relMatch) {
        return acc;
      }
      const relValue = relMatch[1];
      return { ...acc, [relValue]: urlPath };
    },
    {},
  );

  return {
    first: getPageIndex(linkMap['first']),
    prev: getPageIndex(linkMap['prev']),
    next: getPageIndex(linkMap['next']),
    last: getPageIndex(linkMap['last']),
  };
}

function getPageIndex(urlString: string | undefined): number | undefined {
  if (urlString === undefined) {
    return undefined;
  }
  const url = new URL(urlString);
  const pageValue = url.searchParams.get('page') ?? undefined;
  return pageValue === undefined ? undefined : parseIntegerOrThrow(pageValue);
}

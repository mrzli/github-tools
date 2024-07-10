import { applyFn } from '@gmjs/apply-function';
import { RepoCategory, RepoData } from '../types';
import { groupBy, map, sort, toArray } from '@gmjs/value-transformers';
import { mapGetOrThrow } from '@gmjs/data-container-util';
import { TOPIC_TO_CATEGORY_MAPPING } from './topic-to-category-mapping';
import { compareByNumberAsc, compareByStringAsc } from '@gmjs/comparers';

interface CategoryRepoPair {
  readonly category: RepoCategory;
  readonly repo: RepoData;
}

export interface RepoPrimaryGroup {
  readonly primary: string;
  readonly secondaryGroups: readonly RepoSecondaryGroup[];
}

export interface RepoSecondaryGroup {
  readonly secondary: string;
  readonly repos: readonly RepoData[];
}

export function groupUserRepos(
  repos: readonly RepoData[],
): readonly RepoPrimaryGroup[] {
  const result: readonly RepoPrimaryGroup[] = applyFn(
    repos,
    map<RepoData, CategoryRepoPair>((repo) => ({
      category: getCategory(repo),
      repo,
    })),
    sort(compareByNumberAsc((pair) => pair.category.order)),
    groupBy((pair) => pair.category.primary),
    map(([primary, pairs]) => getPrimaryGroup(primary, pairs)),
    toArray(),
  );

  return result;
}

function getCategory(repo: RepoData): RepoCategory {
  const { topics } = repo;
  const topic = topics[0];

  return mapGetOrThrow(TOPIC_TO_CATEGORY_MAPPING, topic);
}

function getPrimaryGroup(
  primary: string,
  pairs: readonly CategoryRepoPair[],
): RepoPrimaryGroup {
  const secondaryGroups: readonly RepoSecondaryGroup[] = applyFn(
    pairs,
    groupBy((pair) => pair.category.secondary),
    map(([secondary, pairs]) => getSecondaryGroup(secondary, pairs)),
    toArray(),
  );

  const result: RepoPrimaryGroup = {
    primary,
    secondaryGroups,
  };

  return result;
}

function getSecondaryGroup(
  secondary: string,
  pairs: readonly CategoryRepoPair[],
): RepoSecondaryGroup {
  const result: RepoSecondaryGroup = {
    secondary,
    repos: applyFn(
      pairs,
      map((pair) => pair.repo),
      sort(compareByStringAsc((repo) => repo.name)),
      toArray(),
    ),
  };

  return result;
}

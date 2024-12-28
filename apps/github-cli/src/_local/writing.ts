import { filterOutNullish as filterOutNullishArray } from '@gmjs/array-transformers';
import { ArchivedReposResult, OwnerWithRepos, RepoData } from './types';
import { RepoPrimaryGroup, RepoSecondaryGroup } from './util/group-user-repos';
import { EMPTY_GROUP_NAME } from './util';

export function toPrimaryGroupsLines(
  primaryGroups: readonly RepoPrimaryGroup[],
): readonly string[] {
  return primaryGroups.flatMap((pg, i) =>
    addLinesIfCondition(
      toPrimaryGroupLines(pg),
      separatorLines(1),
      i !== primaryGroups.length - 1,
    ),
  );
}

function toPrimaryGroupLines(group: RepoPrimaryGroup): readonly string[] {
  const { primary, secondaryGroups } = group;
  return [
    `### ${primary}`,
    EMPTY_STRING,
    ...secondaryGroups.flatMap((sg, i) =>
      addLinesIfCondition(
        toSecondaryGroupLines(sg),
        [EMPTY_STRING],
        i !== secondaryGroups.length - 1,
      ),
    ),
  ];
}

function toSecondaryGroupLines(group: RepoSecondaryGroup): readonly string[] {
  const { secondary, repos } = group;
  const titleLines =
    secondary === EMPTY_GROUP_NAME ? [] : [`#### ${secondary}`, EMPTY_STRING];
  return [...titleLines, ...repos.map((repo) => toRepoLine(repo))];
}

export function toRepoLine(repo: RepoData): string {
  const parts: readonly string[] = filterOutNullishArray([
    '-',
    repo.archived ? '**A**' : undefined,
    repo.private ? '**P**' : undefined,
    `[${repo.name}](${repo.url})`,
    '-',
    isEmpty(repo.description)
      ? '&lt;NO-DESCRIPTION&gt;'
      : `_${repo.description}_`,
  ]);
  return parts.join(' ');
}

function isEmpty(str: string | undefined | null): boolean {
  return str === undefined || str === null || str === EMPTY_STRING;
}

export function toArchivedReposResultLines(
  archivedRepos: ArchivedReposResult,
): readonly string[] {
  const { user, orgs } = archivedRepos;

  return [
    '## Archived Repos',
    EMPTY_STRING,
    ...toOwnerWithReposLine(user, true),
    ...separatorLines(1),
    ...orgs.flatMap((org, i) =>
      addLinesIfCondition(
        toOwnerWithReposLine(org, false),
        separatorLines(1),
        i !== orgs.length - 1,
      ),
    ),
  ];
}

export function toOrgReposLines(
  reposByOrg: readonly OwnerWithRepos[],
): readonly string[] {
  return [
    '## Org Repos',
    EMPTY_STRING,
    ...reposByOrg.flatMap((org, i) =>
      addLinesIfCondition(
        toOwnerWithReposLine(org, false),
        separatorLines(1),
        i !== reposByOrg.length - 1,
      ),
    ),
  ];
}

function toOwnerWithReposLine(
  ownerWithRepos: OwnerWithRepos,
  isUser: boolean,
): readonly string[] {
  const { owner, repos } = ownerWithRepos;

  const title = isUser ? `### User ('${owner}')` : `### Org ('${owner}')`;

  return [title, EMPTY_STRING, ...repos.map((repo) => toRepoLine(repo))];
}

function addLinesIfCondition(
  lines: readonly string[],
  linesToAdd: readonly string[],
  condition: boolean,
): readonly string[] {
  return condition ? [...lines, ...linesToAdd] : lines;
}

export function separatorLines(count: number): readonly string[] {
  if (count <= 0) {
    return [];
  }

  const result: string[] = [EMPTY_STRING];

  for (let i = 0; i < count; i++) {
    result.push(SEPARATOR, EMPTY_STRING);
  }

  return result;
}

const SEPARATOR = '---';
export const EMPTY_STRING = '';

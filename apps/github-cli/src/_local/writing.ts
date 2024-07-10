import { filterOutNullish as filterOutNullishArray } from '@gmjs/array-transformers';
import { ArchivedReposResult, OwnerWithRepos, RepoData } from './types';
import { RepoPrimaryGroup, RepoSecondaryGroup } from './util/group-user-repos';

export function toPrimaryGroupsLines(
  primaryGroups: readonly RepoPrimaryGroup[],
): readonly string[] {
  return primaryGroups.flatMap((pg, i) =>
    addLineIfCondition(
      toPrimaryGroupLines(pg),
      '---',
      i !== primaryGroups.length - 1,
    ),
  );
}

function toPrimaryGroupLines(group: RepoPrimaryGroup): readonly string[] {
  const { primary, secondaryGroups } = group;
  return [
    `### ${primary}`,
    '',
    ...secondaryGroups.flatMap((sg, i) =>
      addLineIfCondition(
        toSecondaryGroupLines(sg),
        '',
        i === secondaryGroups.length - 1,
      ),
    ),
  ];
}

function toSecondaryGroupLines(group: RepoSecondaryGroup): readonly string[] {
  const { secondary, repos } = group;
  return [`#### ${secondary}`, '', ...repos.map((repo) => toRepoLine(repo))];
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
  return str === undefined || str === null || str === '';
}

export function toArchivedReposResultLines(
  archivedRepos: ArchivedReposResult,
): readonly string[] {
  const { user, orgs } = archivedRepos;

  return [
    '## Archived Repos',
    '',
    ...toOwnerWithReposLine(user, true),
    '---',
    ...orgs.flatMap((org, i) =>
      addLineIfCondition(
        toOwnerWithReposLine(org, false),
        '---',
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
    '',
    ...reposByOrg.flatMap((org, i) =>
      addLineIfCondition(
        toOwnerWithReposLine(org, false),
        '---',
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

  return [title, '', ...repos.map((repo) => toRepoLine(repo))];
}

function addLineIfCondition(
  lines: readonly string[],
  lineToAdd: string,
  condition: boolean,
): readonly string[] {
  return condition ? [...lines, lineToAdd] : lines;
}

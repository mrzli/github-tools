import { filterOutNullish as filterOutNullishArray } from '@gmjs/array-transformers';
import { RepoData } from './types';
import { RepoPrimaryGroup, RepoSecondaryGroup } from './util/group-user-repos';

export function toPrimaryGroupsLines(
  primaryGroups: readonly RepoPrimaryGroup[],
): readonly string[] {
  return primaryGroups.flatMap((pg, i) =>
    filterOutNullishArray([
      ...toPrimaryGroupLines(pg),
      i === primaryGroups.length - 1 ? undefined : '---',
    ]),
  );
}

function toPrimaryGroupLines(group: RepoPrimaryGroup): readonly string[] {
  const { primary, secondaryGroups } = group;
  return [
    `### ${primary}`,
    '',
    ...secondaryGroups.flatMap((sg, i) =>
      filterOutNullishArray([
        ...toSecondaryGroupLines(sg),
        i === secondaryGroups.length - 1 ? undefined : '',
      ]),
    ),
  ];
}

function toSecondaryGroupLines(group: RepoSecondaryGroup): readonly string[] {
  const { secondary, repos } = group;
  return [`#### ${secondary}`, '', ...repos.map((repo) => toRepoLine(repo))];
}

function toRepoLine(repo: RepoData): string {
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

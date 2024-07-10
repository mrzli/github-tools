import { LIST_OF_REPO_TOPICS, RepoData } from '../types';

const VALID_TOPICS: ReadonlySet<string> = new Set(LIST_OF_REPO_TOPICS);

export interface ValidateUserRepoResult {
  readonly id: number;
  readonly name: string;
  readonly error: string;
}

export function validateUserRepo(
  repo: RepoData,
): ValidateUserRepoResult | undefined {
  const { topics } = repo;

  if (topics.length !== 1) {
    return createErrorResult(
      repo,
      `Invalid number of topics for repo '${repo.name}'. Expected 1, got ${topics.length}.`,
    );
  }

  const invalidTopics = topics.filter((topic) => !VALID_TOPICS.has(topic));

  if (invalidTopics.length > 0) {
    return createErrorResult(
      repo,
      `Invalid topics for repo '${repo.name}': ${invalidTopics.join(', ')}`,
    );
  }

  return undefined;
}

function createErrorResult(
  repo: RepoData,
  error: string,
): ValidateUserRepoResult {
  return {
    id: repo.id,
    name: repo.name,
    error,
  };
}

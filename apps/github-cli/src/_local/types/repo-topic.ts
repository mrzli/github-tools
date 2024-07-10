export const LIST_OF_REPO_TOPICS: readonly string[] = [
  'docs-generic',
  'docs-development',
  'libs-shared-util',
  'libs-browser-util',
  'libs-node-util',
  'libs-development-util',
  'libs-test-util',
  'tools',
  'sites',
  'trading',
] as const;

export type RepoTopic = (typeof LIST_OF_REPO_TOPICS)[number];
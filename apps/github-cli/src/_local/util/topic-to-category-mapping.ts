import { RepoCategory } from '../types';

export const EMPTY_GROUP_NAME = '<empty>';

export const TOPIC_TO_CATEGORY_MAPPING: ReadonlyMap<string, RepoCategory> =
  new Map([
    ['docs-generic', { order: 1, primary: 'Docs', secondary: 'Generic' }],
    [
      'docs-development',
      { order: 2, primary: 'Docs', secondary: 'Development' },
    ],
    [
      'libs-shared-util',
      { order: 3, primary: 'Libs', secondary: 'Shared Util' },
    ],
    [
      'libs-browser-util',
      { order: 4, primary: 'Libs', secondary: 'Browser Util' },
    ],
    ['libs-node-util', { order: 5, primary: 'Libs', secondary: 'Node Util' }],
    [
      'libs-development-util',
      { order: 6, primary: 'Libs', secondary: 'Development Util' },
    ],
    ['libs-test-util', { order: 7, primary: 'Libs', secondary: 'Test Util' }],
    ['tools', { order: 8, primary: 'Tools', secondary: EMPTY_GROUP_NAME }],
    ['setup', { order: 9, primary: 'Setup', secondary: EMPTY_GROUP_NAME }],
    ['sites', { order: 10, primary: 'Sites', secondary: EMPTY_GROUP_NAME }],
    ['trading', { order: 11, primary: 'Trading', secondary: EMPTY_GROUP_NAME }],
    ['problems', { order: 12, primary: 'Problems', secondary: EMPTY_GROUP_NAME }],
    ['example', { order: 13, primary: 'Example', secondary: EMPTY_GROUP_NAME }],
  ]);

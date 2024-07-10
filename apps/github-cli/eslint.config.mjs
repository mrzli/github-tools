import { getEsLintConfigs } from '@gmjs/eslint-config';

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  {
    ignores: [
      'dist/',
      'eslint.config.mjs',
      'jest.config.ts',
    ],
  },
  ...getEsLintConfigs({ projectType: 'node' }),
];

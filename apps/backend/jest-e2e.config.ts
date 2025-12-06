import type { Config } from 'jest';

export default {
  displayName: 'backend-e2e',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.e2e.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/backend-e2e',
  testMatch: ['**/e2e/**/*.spec.ts'],
  globalSetup: '<rootDir>/e2e/support/global-setup.ts',
  globalTeardown: '<rootDir>/e2e/support/global-teardown.ts',
} as Config;

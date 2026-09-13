import type { Config } from 'jest';

export default {
  displayName: 'backend',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/apps/backend',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
} as Config;

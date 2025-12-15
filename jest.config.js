export default {
  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/fixtures/'],
  transform: {},
};

// jest.config.mjs
export default {
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest', // Transform both .js and .mjs files
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'mjs'],
};
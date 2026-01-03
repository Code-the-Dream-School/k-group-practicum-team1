export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx', '!src/**/*.test.{js,jsx}'],
  coverageReporters: ['text-summary', 'html', 'lcov'],
};

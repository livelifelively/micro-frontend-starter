module.exports = {
  cacheDirectory: '.jest-cache',
  coverageDirectory: '.jest-coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/components-modules/(?:.+?)/lib/',
    '<rootDir>/src/micro-frontends/(?:.+?)/lib/',
    '<rootDir>/src/apis/(?:.+?)/lib/',
    '<rootDir>/src/configs-constants/(?:.+?)/lib/',
    '<rootDir>/src/services/(?:.+?)/lib/',
  ],
  coverageReporters: ['html', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testPathIgnorePatterns: [
    '<rootDir>/src/components-modules/(?:.+?)/lib/',
    '<rootDir>/src/micro-frontends/(?:.+?)/lib/',
    '<rootDir>/src/apis/(?:.+?)/lib/',
    '<rootDir>/src/configs-constants/(?:.+?)/lib/',
    '<rootDir>/src/services/(?:.+?)/lib/',
  ],
};

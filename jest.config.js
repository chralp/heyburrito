module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  roots: [
    "<rootDir>/test"
  ],
  transform: {
    "^.+\\.(ts|js)x?$": "ts-jest"
  },
  reporters: ['default'],
};

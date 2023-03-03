/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|svg)$": "identity-obj-proxy",
    "^nanoid(/(.*)|$)": "nanoid$1",
  },
};

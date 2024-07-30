// backend/jest.config.js

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  };
  
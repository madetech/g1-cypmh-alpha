module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['test'],
  setupFiles: ["dotenv/config"]
};
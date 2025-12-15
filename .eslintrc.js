module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [],
  rules: {},
  ignorePatterns: ['.eslintrc.js', 'dist/', 'node_modules/'],
};

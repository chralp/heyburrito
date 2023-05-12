module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    node: true,
  },
  rules: {
    'import/extensions': ['off'],
    'no-underscore-dangle': ['off'],
    'no-tabs': ['error', { allowIndentationTabs: true }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};

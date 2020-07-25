module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'camelcase': 'off',
    '@typescript-eslint/camelcase': 'warn'
  },
  globals: {
    'globalThis': false,
    'Cesium': false,
    'VARS': false
  }
}

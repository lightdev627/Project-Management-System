module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'semi': ['error', 'always'],
    'space-in-brackets': ['error', 'always', { 'singleValue': false }],
    'quotes': ['error', 'single'],
  },
};

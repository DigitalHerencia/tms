import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  ...compat.config({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react'],
    extends: [
      'next/core-web-vitals',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    settings: {
      react: { version: 'detect' },
    },
    env: {
      browser: true,
      node: true,
      es2020: true,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      'prefer-const': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'import/no-anonymous-default-export': 'warn',
    },
  }),
];

export default config;

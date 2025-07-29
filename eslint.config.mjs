// eslint.config.js  – Flat Config (ESM)
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  /* -------------------------------------------------------- *
   *  Base configs – converted from “extends” to flat format  *
   * -------------------------------------------------------- */

  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),

  js.configs.recommended, // ESLint core recs
  ...compat.extends(
    'plugin:@typescript-eslint/recommended', // TS recs
    'plugin:react/recommended', // React recs
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ),

  /* ---------- General JavaScript / JSX files ---------- */
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { JSX: true },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      /* Helpful import-sorting / duplicate detection rules */
      'import/order': ['warn', { 'newlines-between': 'always' }],
      'import/no-duplicates': 'error',
      /* Standard rules */
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-alert': 'warn',
    },
  },

  /* ---------- TypeScript files ---------- */
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      // Stricter unused vars on TS only
      '@typescript-eslint/no-unused-vars': ['off', { ignoreRestSiblings: true }],
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  /* ---------- React & JSX (TSX & JSX) ---------- */
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: './tsconfig.json',
          ecmaVersion: 2022,
          sourceType: 'module',
          ecmaFeatures: { jsx: true },
        },
      },
      rules: {
        // React 17+ JSX transform – no React in scope
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/jsx-uses-vars': 'off',
        // Hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        // A11y best-practices (from jsx-a11y)
        'jsx-a11y/alt-text': 'warn',
        'jsx-a11y/anchor-is-valid': 'warn',
      },
    },
  },

  /* ---------- Prettier ---------- */
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'prettier/prettier': 'error',
    },
  },

  /* ---------- Vitest & Playwright test files ---------- */
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/tests/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // tests can be flexible
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      'no-alert': 'off',
      'react/jsx-no-undef': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'off',
    },
  },
]);

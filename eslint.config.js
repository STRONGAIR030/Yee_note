import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

// 共用的基礎規則
const baseRules = {
  indent: ['error', 2],
  quotes: ['error', 'single', { avoidEscape: true }],
  semi: ['error', 'always'],
  'comma-dangle': ['error', 'always-multiline'],
  'import/order': ['error', { 'newlines-between': 'always' }],
  '@typescript-eslint/no-unused-vars': 'warn',
};

export default tseslint.config(
  // 基礎配置
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 忽略配置
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },

  // 全局設定
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
    },
    rules: baseRules,
  },

  // Web 子專案 (React)
  {
    files: ['apps/web/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...baseRules,
      // React 專屬規則
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // Server 子專案 (Node.js)
  {
    files: ['apps/server/**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...baseRules,
      // Node.js 專屬規則
      'no-console': 'off',
    },
  },
);

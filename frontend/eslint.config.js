import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  { ignores: ['dist', 'vite.config.js'] },
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.jest },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    settings: {
      react: { version: '19.2.0' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.mjs', '.cjs'],
          moduleDirectory: ['node_modules'],
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/display-name': 'off',
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'warn',

      'comma-dangle': ['error', 'only-multiline'],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      eqeqeq: 'error',
      'import/no-unresolved': 'error',
      'import/extensions': ['error', 'always', { js: 'never', jsx: 'never', mjs: 'never' }],
      'import/no-duplicates': 'warn',
    },
  },
  {
    files: ['**/*.jsx'],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],
    },
  },
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}', 'jest.setup.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$', argsIgnorePattern: '^_' }],
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/__mocks__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['jest.setup.js', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        global: 'readonly',
      },
    },
  },
];

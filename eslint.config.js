import js from '@eslint/js';
import globals from 'globals';
import json from '@eslint/json';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginJest from 'eslint-plugin-jest';

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.spec.js', '**/*.test.js', '**/__tests__/**/*.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      ...pluginJest.configs['flat/recommended'].rules,
    },
  },
  { files: ['**/*.json'], plugins: { json }, language: 'json/json' },
  { files: ['**/*.css'], plugins: { css }, language: 'css/css' },
  pluginPrettier,
]);

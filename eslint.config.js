import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
	js.configs.recommended,
	...sveltePlugin.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: tsParser,
			parserOptions: {
				extraFileExtensions: ['.svelte'],
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			'no-tabs': 'off',
			indent: ['error', 'tab'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'comma-dangle': ['error', 'always-multiline'],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'import/no-unresolved': 'off',
			'import/extensions': 'off',
			'no-undef': 'off',
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: sveltePlugin.parser,
			parserOptions: {
				parser: tsParser,
			},
		},
	},
	{
		ignores: ['.svelte-kit/', 'build/', 'node_modules/'],
	},
];

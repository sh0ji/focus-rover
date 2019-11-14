module.exports = {
    extends: [
        'airbnb-base',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        indent: 'off',
        'no-tabs': 'off',
        'lines-between-class-members': [
            'error',
            'always',
            {
                exceptAfterSingleLine: true,
            },
        ],
        '@typescript-eslint/indent': ['error', 'tab'],
        '@typescript-eslint/no-empty-interface': 'off',
	},
	env: {
		browser: true,
	},
};

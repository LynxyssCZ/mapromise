module.exports = {
	extends: [
		'plugin:jest/recommended',
		'standard',
	],
	rules: {
		'camelcase': ['error', {'properties': 'never', 'ignoreDestructuring': true}],
		'comma-dangle': ['error', 'always-multiline'],
		'consistent-return': 'error',
		'indent': ['error', 'tab', {'SwitchCase': 1, 'MemberExpression': 'off'}],
		'jsx-quotes': ['error', 'prefer-single'],
		'max-len': ['error', 160, 4],
		'no-else-return': 'error',
		'no-multiple-empty-lines': ['error', {'max': 2, 'maxEOF': 0}],
		'no-tabs': 'off',
		'no-var': 'error',
		'object-curly-spacing': 'off',
		'padded-blocks': 'off',
		'prefer-const': 'error',
		'prefer-object-spread': 'error',
		'radix': 'error',
	},
}

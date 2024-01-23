module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  // plugins: ['react-refresh'],
  rules: {
    // 'react-refresh/only-export-components': 'warn',
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
  },
  // 'eslint.workingDirectories': ['Dir1', 'Dir2'],
  // 'eslint.validate': [
  //   'javascript',
  //   'javascriptreact',
  //   'typescript',
  //   'typescriptreact',
  // ],
};
//  "react/prop-types": [1], I added this line to keep from getting error on prop types
// "no-unused-vars": "warn", I added this line to keep from getting error unused vars

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['worker/**/*.js'],
      env: {
        worker: true,
        es2022: true
      },
      globals: {
        HTMLRewriter: 'readonly',
        caches: 'readonly'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/prop-types': 'off',
    'react/no-is-mounted': 'off',
    'no-useless-escape': 'off',
    'array-callback-return': 'off',
    'no-proto': 'off',
    'no-prototype-builtins': 'off',
    'no-return-assign': 'off',
    'no-sequences': 'off',
    'no-void': 'off',
    'no-unused-expressions': 'off',
    'react/display-name': 'off'
  }
}

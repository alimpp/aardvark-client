module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/ban-ts-comment': 'off', // Remove on ts-ignore fix
    '@typescript-eslint/ban-types': 'off', // Remove on type fix
    "@typescript-eslint/explicit-module-boundary-types": "off",
    '@typescript-eslint/member-delimiter-style': ['error',
      {
        multiline: {
          delimiter: 'none'
        },
        singleline: {
          delimiter: 'comma'
        }
      }
    ],
    '@typescript-eslint/naming-convention': [
      "error",
      {
        selector: "class",
        format: ["PascalCase"]
      }
    ],
    'typescript-eslint/interface-name-prefix': 0,
    'vue/match-component-file-name': ["error", {
      extensions: ["vue"],
      shouldMatchCase: true
    }],
    'space-before-function-paren': ['error', 'never'],
    'vue/array-bracket-spacing': "error",
    'vue/arrow-spacing': "error",
    'vue/block-spacing': "error",
    'vue/brace-style': "error",
    'vue/camelcase': "error",
    'vue/comma-dangle': "error",
    'vue/component-name-in-template-casing': ["error", "PascalCase", {
      registeredComponentsOnly: true,
      ignores: []
    }],
    'vue/eqeqeq': "error",
    'vue/key-spacing': "error",
    'vue/object-curly-spacing': "error"
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    },
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx', '*.vue'],
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}

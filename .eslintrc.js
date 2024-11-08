module.exports = {
  env: {
    es2021: true,
    node: true,
  },

  // Add the necessary extensions.
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": ["warn", { allow: ["error"] }],
    "no-underscore-dangle": ["warn", { allow: ["_id", "_itemId", "_userId"] }],
    "max-classes-per-file": 0,
    "consistent-return": 0,
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};

module.exports = {
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    // 'airbnb',
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "i18next"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "off",
    "no-use-before-define": "off",
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".tsx"] },
    ],
    "react/jsx-indent": "off",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "react/jsx-no-literals": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-empty-pattern": "off",
    "react/display-name": "off",
    "react/no-find-dom-node": "off",
    "i18next/no-literal-string": "off",
    "react/no-unknown-property": [
      2,
      {
        ignore: ["jsx", "global"],
      },
    ],
  },
  globals: {
    React: "writable",
  },
};

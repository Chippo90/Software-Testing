// .eslintrc.cjs
module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2025,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    requireConfigFile: false,
  },
  plugins: ["react"],
  extends: ["eslint:recommended", "plugin:react/recommended"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};

module.exports = {
  extends: [
    "next",
    "turbo",
    "prettier",
    "eslint:recommended",
    "plugin:baseui/recommended"
  ],
  rules: {
    '@next/next/no-html-link-for-pages': "off",
    'react/jsx-key': "off"
  },
};

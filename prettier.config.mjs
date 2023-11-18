/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 120,
  proseWrap: "never",
  arrowParens: "always",
  endOfLine: "lf",
  trailingComma: "es5",
  tabWidth: 4,
  singleQuote: true,
  overrides: [
    {
      files: ["**/*.css", "**/*.html", "**/*.svg"],
      options: {
        singleQuote: false,
      },
    },
  ],
};

export default config;

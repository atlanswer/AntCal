/** @type {import("prettier").Config} */
export default {
  trailingComma: "all",
  experimentalTernaries: true,
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  tailwindStylesheet: "./apps/web/src/styles/global.css",
};

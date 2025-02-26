import eslint from "@eslint/js";
// @ts-expect-error No types
import prettier from "eslint-config-prettier";
import turbo from "eslint-config-turbo";
import solid from "eslint-plugin-solid/configs/typescript";
import globals from "globals";
import tsEslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config} */
export default [
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  {
    ...solid,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        globals: { ...globals["shared-node-browser"] },
      },
    },
  },
  { plugins: { turbo: turbo } },
  {
    ignores: [
      "eslint.config.js",
      ".vercel",
      ".turbo",
      ".vinxi",
      "public",
      ".venv",
    ],
  },
  prettier,
];

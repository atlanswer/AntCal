import eslint from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import turbo from "eslint-config-turbo/flat";
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
  ...turbo,
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

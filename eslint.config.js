import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
// @ts-expect-error No type provided
import solid from "eslint-plugin-solid/configs/typescript.js";
import globals from "globals";
import tsEslint from "typescript-eslint";

const ts = tsEslint.configs.recommendedTypeChecked;
const compat = new FlatCompat();
const turbo = compat.config({ extends: ["turbo"] });

export default tsEslint.config(
  // @ts-expect-error I don't know what happened
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ["apps/figure/**/*.{js,ts,tsx}"],
    plugins: { ...ts[0].plugins, ...solid.plugins },
    languageOptions: {
      parser: ts[0].languageOptions.parser,
      sourceType: ts[0].languageOptions.sourceType,
      parserOptions: {
        project: true,
        // @ts-expect-error There's no problem
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals["shared-node-browser"] },
    },
    rules: {
      ...ts[1].rules,
      ...ts[2].rules,
      ...solid.rules,
    },
  },
  {
    files: ["packages/**/*.js"],
    languageOptions: {
      globals: { ...globals.nodeBuiltin },
    },
  },
  ...turbo,
  {
    ignores: [
      "eslint.config.js",
      "**/.vercel",
      "**/.turbo",
      "**/.vinxi",
      "**/public",
      "**/venv",
    ],
  },
  prettier,
);

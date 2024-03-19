// @ts-expect-error No type provided
import { FlatCompat } from "@eslint/eslintrc";
// @ts-expect-error No type provided
import eslint from "@eslint/js";
// @ts-expect-error No type provided
import prettier from "eslint-config-prettier";
// @ts-expect-error No type provided
import solid from "eslint-plugin-solid/configs/typescript.js";
import globals from "globals";
import tsEslint from "typescript-eslint";

// const compat = new FlatCompat({
// baseDirectory: "apps/figure",
// });

const ts = tsEslint.configs.recommendedTypeChecked;

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ["apps/figure/**/*.{js,ts,tsx}"],
    plugins: ts[0].plugins,
    languageOptions: {
      parser: ts[0].languageOptions.parser,
      sourceType: ts[0].languageOptions.sourceType,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals["shared-node-browser"] },
    },
    rules: {
      ...ts[1].rules,
      ...ts[2].rules,
    },
    // ...solid,
    // ...compat.config({ extends: ["turbo"] }),
  },
  {
    files: ["packages/**/*.js"],
    languageOptions: {
      globals: { ...globals.nodeBuiltin },
    },
  },
  {
    ignores: [
      "eslint.config.js",
      "**/.output",
      "**/.turbo",
      "**/.vinxi",
      "**/public",
      "**/venv",
    ],
  },
  prettier,
);

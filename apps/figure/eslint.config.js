// @ts-expect-error No types
import { FlatCompat } from "@eslint/eslintrc";
// @ts-expect-error No types
import eslint from "@eslint/js";
// @ts-expect-error No types
import prettier from "eslint-config-prettier";
// @ts-expect-error No types
import solid from "eslint-plugin-solid/configs/typescript.js";
import globals from "globals";
import tsEslint from "typescript-eslint";

const compat = new FlatCompat();
const turbo = compat.extends("turbo");

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals["shared-node-browser"] },
    },
    ...solid,
  },
  ...turbo,
  {
    ignores: [
      "eslint.config.js",
      ".vercel",
      ".turbo",
      ".vinxi",
      "public",
      "venv",
    ],
  },
  prettier,
);

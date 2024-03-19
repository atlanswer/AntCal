// @ts-expect-error No type provided
import { FlatCompat } from "@eslint/eslintrc";
// @ts-expect-error No type provided
import eslint from "@eslint/js";
// @ts-expect-error No type provided
import prettier from "eslint-config-prettier";
// @ts-expect-error No type provided
import solid from "eslint-plugin-solid/configs/typescript.js";
import tsEslint from "typescript-eslint";

const compat = new FlatCompat();

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  {
    ...solid,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...compat.config({ extends: ["turbo"] }),
  { ignores: ["eslint.config.js"] },
  { ignores: [".output", ".turbo", ".vinxi", "public", "venv"] },
  prettier,
);

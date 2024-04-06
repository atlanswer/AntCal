// @ts-expect-error No types
import { FlatCompat } from "@eslint/eslintrc";
// @ts-expect-error No types
import eslint from "@eslint/js";
// @ts-expect-error No types
import prettier from "eslint-config-prettier";
// @ts-expect-error ESLint can't import module
import solid from "eslint-plugin-solid/configs/typescript.js";
import globals from "globals";
import path from "path";
import tsEslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});
const turbo = compat.extends("turbo");

export default tsEslint.config(
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
      "venv",
    ],
  },
  prettier,
);

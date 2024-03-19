import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  prettier,
);

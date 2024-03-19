/* eslint-disable */
// @ts-nocheck Too early for flat config
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginRelativeTo: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.config({
    root: true,
    env: {
      browser: true,
      esnext: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: true,
      tsconfigRotDir: __dirname,
    },
    plugins: ["@typescript-eslint", "solid"],
    extends: [
      "plugin:@typescript-eslint/recommended-type-checked",
      "plugin:solid/typescript",
      "turbo",
    ],
  }),
  {
    ignores: [".output", ".turbo", ".vinxi", "public", "venv"],
  },
  prettier,
];

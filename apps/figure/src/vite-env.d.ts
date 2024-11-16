/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERCEL_ENV:
    | "production"
    | "preview"
    | "development"
    | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

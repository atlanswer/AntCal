interface ImportMetaEnv {
  readonly VERCEL_ENV: "production" | "preview" | "development" | undefined;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

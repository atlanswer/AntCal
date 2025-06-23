interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string;
  readonly VERCEL_ENV: "production" | "preview" | "development" | undefined;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

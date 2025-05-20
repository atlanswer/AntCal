import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en-US" class="h-full">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Create publication quality figures"
          />
          <link rel="icon" type="image/svg+xml" href="/icon.svg" />
          <link rel="apple-touch-icon" href="/ios/1024.png" />
          <meta name="color-scheme" content="light dark" />
          <meta name="theme-color" content="#ffffff" />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="#000000"
          />
          <link
            rel="manifest"
            type="application/manifest+json"
            href="/app.webmanifest"
          />
          {assets}
        </head>
        <body
          id="app"
          class="flex min-h-full min-w-64 flex-col font-sans antialiased motion-reduce:transition-none"
        >
          <noscript>
            AntCal: You need to enable JavaScript to run this app.
          </noscript>
          {children}
          {scripts}
        </body>
      </html>
    )}
  />
));

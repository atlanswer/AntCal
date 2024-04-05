// @refresh granular
// spell-checker:words sdkn, sdkv

import { DEV } from "solid-js";

declare global {
  interface Window {
    va?: unknown;
    vaq?: unknown[];
  }
}

export default function VercelAnalytics() {
  "use client";
  window.va =
    window.va ||
    function (...params: unknown[]) {
      (window.vaq = window.vaq || []).push(params);
    };
  const scriptElm = document.createElement("script");
  scriptElm.defer = true;
  scriptElm.dataset["sdkn"] = "@vercel/analytics";
  scriptElm.dataset["sdkv"] = "1.1.2";
  if (DEV) {
    scriptElm.src = "https://va.vercel-scripts.com/v1/script.debug.js";
  } else {
    scriptElm.src = "/_vercel/insights/script.js";
    scriptElm.dataset["debug"] = "false";
  }
  document.body.appendChild(scriptElm);

  return <></>;
}

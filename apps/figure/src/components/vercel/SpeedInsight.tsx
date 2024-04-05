// @refresh granular
// spell-checker:words sdkn, sdkv

import { useLocation } from "@solidjs/router";
import { DEV, createEffect } from "solid-js";

declare global {
  interface Window {
    si?: unknown;
    siq?: unknown[];
  }
}

export default function VercelSpeedInsight() {
  "use client";
  window.si =
    window.si ||
    function (...params: unknown[]) {
      (window.siq = window.siq || []).push(params);
    };
  const scriptElm = document.createElement("script");
  scriptElm.defer = true;
  scriptElm.dataset["sdkn"] = "@vercel/speed-insights";
  scriptElm.dataset["sdkv"] = "1.0.6";
  if (DEV) {
    scriptElm.src =
      "https://va.vercel-scripts.com/v1/speed-insights/script.debug.js";
  } else {
    scriptElm.src = "/_vercel/speed-insights/script.js";
    scriptElm.dataset["debug"] = "false";
  }
  document.body.appendChild(scriptElm);

  const location = useLocation();

  createEffect(() => {
    scriptElm.dataset["route"] = location.pathname;
  });

  return <></>;
}

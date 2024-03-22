// @refresh granular
// spell-checker:words sdkn, sdkv

// import {isServer} from "solid-js"
import { useLocation } from "@solidjs/router";
import { DEV, createEffect } from "solid-js";

declare global {
  interface Window {
    va?: unknown;
    vaq?: unknown[];
    si?: unknown;
    siq?: unknown[];
  }
}

export const VercelAnalytics = () => {
  "use client";
  // if (!isServer) {
  window.va =
    window.va ||
    function (...params: unknown[]) {
      (window.vaq = window.vaq || []).push(params);
    };
  const scriptElm = document.createElement("script");
  scriptElm.defer = true;
  scriptElm.dataset["sdkn  "] = "@vercel/analytics";
  scriptElm.dataset["sdkv "] = "1.1.2";
  if (DEV) {
    scriptElm.src = "https://va.vercel-scripts.com/v1/script.debug.js";
  } else {
    scriptElm.src = "/_vercel/insights/script.js";
    scriptElm.dataset["debug"] = "false";
  }
  document.body.appendChild(scriptElm);
  // }
  return <></>;
};

export const VercelSpeedInsight = () => {
  "use client";
  // if (!isServer) {
  window.si =
    window.si ||
    function (...params: unknown[]) {
      (window.siq = window.siq || []).push(params);
    };
  const scriptElm = document.createElement("script");
  scriptElm.defer = true;
  scriptElm.dataset["sdkn "] = "@vercel/speed-insights";
  scriptElm.dataset["sdkv "] = "1.0.6";
  if (DEV) {
    scriptElm.src =
      "https://va.vercel-scripts.com/v1/speed-insights/script.debug.js";
  } else {
    scriptElm.src = "/_vercel/speed-insights/script.js";
    scriptElm.dataset["debug "] = "false";
  }
  document.body.appendChild(scriptElm);

  const location = useLocation();

  createEffect(() => {
    scriptElm.dataset["route "] = location.pathname;
  });
  // }
  return <></>;
};

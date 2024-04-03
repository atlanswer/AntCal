// @refresh granular

import { createRenderEffect, createSignal } from "solid-js";
import { isServer } from "solid-js/web";
import { z } from "zod";

const THEME_STORAGE_KEY = "theme";

const zTheme = z.enum(["System", "Light", "Dark"]).catch("System");
type Theme = z.infer<typeof zTheme>;

const getLocalTheme = (): Theme => {
  if (isServer) {
    return "System";
  }

  return zTheme.parse(localStorage.getItem(THEME_STORAGE_KEY));
};

const isPerferDarkColorScheme = (): boolean => {
  if (isServer) {
    return true;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const [theme, setTheme] = createSignal<Theme>(getLocalTheme());

createRenderEffect(() => {});

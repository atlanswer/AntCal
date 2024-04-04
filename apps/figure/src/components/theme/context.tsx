// @refresh granular

import { createSignal } from "solid-js";
import { isServer } from "solid-js/web";
import { z } from "zod";

const THEME_STORAGE_KEY = "theme";

const zTheme = z.enum(["system", "light", "dark"]).catch("system");
type Theme = z.infer<typeof zTheme>;

const getLocalTheme = (): Theme => {
  if (isServer) {
    return "system";
  }

  return zTheme.parse(localStorage.getItem(THEME_STORAGE_KEY));
};

export const [theme, setTheme] = createSignal<Theme>(getLocalTheme());

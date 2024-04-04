// @refresh granular

import { createSignal } from "solid-js";
import { z } from "zod";

export const THEME_STORAGE_KEY = "theme";

export const zTheme = z.enum(["system", "light", "dark"]).catch("system");
type Theme = z.infer<typeof zTheme>;

export const [theme, setTheme] = createSignal<Theme>("system");

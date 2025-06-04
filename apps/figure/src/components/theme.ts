import { type } from "arktype";

const Theme = type.enumerated("system", "light", "dark");
export type Theme = typeof Theme.infer;

export function getLocalTheme(): Theme {
  const localTheme = localStorage.getItem("theme");

  const theme = Theme(localTheme);

  if (theme instanceof type.errors) {
    localStorage.setItem("theme", "system");
    return "system";
  }

  return theme;
}

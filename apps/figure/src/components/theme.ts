import * as v from "valibot";

const themeSchema = v.fallback(
  v.picklist(["system", "light", "dark"]),
  "system",
);

export function getLocalTheme() {
  const localTheme = localStorage.getItem("theme");

  const parsedTheme = v.parse(themeSchema, localTheme);
  localStorage.setItem("theme", parsedTheme);

  return parsedTheme;
}

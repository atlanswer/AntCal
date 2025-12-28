import Desktop from "components/icons/Desktop";
import Moon from "components/icons/Moon";
import Sun from "components/icons/Sun";
import { getLocalTheme } from "components/theme";
import { createEffect, createSignal, Match, Switch } from "solid-js";

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal(getLocalTheme());

  createEffect(() => {
    localStorage.setItem("theme", theme());
  });

  return (
    <button
      type="button"
      title="Switch Theme"
      aria-label="Switch light/dark theme"
      class="h-8 w-8 cursor-pointer rounded p-1 text-neutral-500 hover:text-neutral-700 focus-visible:ring focus-visible:outline-none active:text-neutral-700 dark:hover:text-neutral-300 active:dark:text-neutral-300"
      onClick={() => {
        const html = document.documentElement;
        const colorSchemeMeta = document.querySelector(
          'meta[name="color-scheme"]',
        );
        const preferDark = globalThis.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;

        switch (theme()) {
          case "light":
            if (preferDark) {
              setTheme("system");
            } else {
              setTheme("dark");
            }
            html.classList.add("dark");
            colorSchemeMeta?.setAttribute("content", "dark");
            return;
          case "dark":
            if (preferDark) {
              setTheme("light");
            } else {
              setTheme("system");
            }
            html.classList.remove("dark");
            colorSchemeMeta?.setAttribute("content", "light");
            return;
          default:
            if (preferDark) {
              setTheme("light");
              html.classList.remove("dark");
              colorSchemeMeta?.setAttribute("content", "light");
            } else {
              setTheme("dark");
              html.classList.add("dark");
              colorSchemeMeta?.setAttribute("content", "dark");
            }
        }
      }}
    >
      <Switch>
        <Match when={theme() === "system"}>
          <Desktop />
        </Match>
        <Match when={theme() === "light"}>
          <Sun />
        </Match>
        <Match when={theme() === "dark"}>
          <Moon />
        </Match>
      </Switch>
    </button>
  );
}

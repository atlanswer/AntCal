import { Match, Switch } from "solid-js";
import { isServer } from "solid-js/web";
import { DarkIcon } from "~/components/icons/Dark";
import { LightIcon } from "~/components/icons/Light";
import { useTheme } from "~/components/theme/context";

export const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  const IconSystem = () => (
    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m0-1.5v-17a8.5 8.5 0 0 1 0 17"
      />
    </svg>
  );

  return (
    <button
      title="Switch theme"
      class="h-8 w-8 rounded p-1 text-neutral-500 hover:text-neutral-700 focus-visible:ring focus-visible:outline-none dark:hover:text-neutral-300"
      onClick={() => {
        if (isServer) {
          return;
        }
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setTheme((prev) => {
          switch (prev) {
            case "system":
              return prefersDark ? "light" : "dark";
            case "light":
              return prefersDark ? "system" : "dark";
            case "dark":
              return prefersDark ? "light" : "system";
          }
        });
      }}
      aria-label="Toggle light/dark theme"
    >
      <Switch>
        <Match when={theme() === "system"}>
          <IconSystem />
        </Match>
        <Match when={theme() === "light"}>
          <LightIcon />
        </Match>
        <Match when={theme() === "dark"}>
          <DarkIcon />
        </Match>
      </Switch>
    </button>
  );
};

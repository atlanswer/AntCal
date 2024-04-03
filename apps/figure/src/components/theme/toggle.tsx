// @refresh granular

import { Switch, Match } from "solid-js";

export const ThemeToggle = () => {
  //   const [theme, setTheme] = useTheme();

  //   const toggleTheme = () => {
  //     const systemTheme =
  //       window.matchMedia("(prefers-color-scheme: dark)").matches ?
  //         "dark"
  //       : "light";
  //     switch (theme()) {
  //       case "light":
  //         setTheme(systemTheme === "light" ? "dark" : "system");
  //         break;
  //       case "dark":
  //         setTheme(systemTheme === "light" ? "system" : "light");
  //         break;
  //       case "system":
  //         setTheme(systemTheme === "light" ? "dark" : "light");
  //     }
  //   };

  const IconLight = () => (
    <svg
      class="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    </svg>
  );

  const IconDark = () => (
    <svg
      class="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fill-rule="evenodd"
        d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
        clip-rule="evenodd"
      />
    </svg>
  );

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
      class="h-8 w-8 rounded p-1 text-neutral-500 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring dark:hover:text-neutral-300"
      //   onClick={toggleTheme}
      aria-label="Toggle light/dark theme"
    >
      {/* <Switch> */}
      {/* <Match when={theme() === "system"}> */}
      <IconSystem />
      {/* </Match> */}
      {/* <Match when={theme() === "light"}> */}
      {/* <IconLight /> */}
      {/* </Match> */}
      {/* <Match when={theme() === "dark"}> */}
      {/* <IconDark /> */}
      {/* </Match> */}
      {/* </Switch> */}
    </button>
  );
};

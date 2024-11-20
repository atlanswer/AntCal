import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
  type ParentComponent,
} from "solid-js";
import { isServer } from "solid-js/web";
import { z } from "zod";
import ssrScript from "~/components/theme/ssr?raw";

const THEME_STORAGE_KEY = "theme";

const zTheme = z.enum(["system", "light", "dark"]).catch("system");
type Theme = z.infer<typeof zTheme>;

const [theme, setTheme] = createSignal<Theme>("system");

const ThemeContext = createContext<ReturnType<typeof createSignal<Theme>>>();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("`useTheme`: no context provider.");
  }
  return context;
};

export const ThemeProvider: ParentComponent = (props) => {
  if (!isServer) {
    setTheme(zTheme.parse(localStorage.getItem(THEME_STORAGE_KEY)));

    const matchPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const syncPrefersColorScheme = () =>
      setPrefersDark(matchPrefersDark.matches ? true : false);

    const [prefersDark, setPrefersDark] = createSignal<boolean>(
      matchPrefersDark.matches,
    );

    createEffect(() => {
      localStorage.setItem(THEME_STORAGE_KEY, theme());
    });

    createEffect(() => {
      const body = document.body;
      switch (theme()) {
        case "system":
          if (prefersDark()) {
            body.classList.add("dark");
          } else {
            body.classList.remove("dark");
          }
          break;
        case "light":
          body.classList.remove("dark");
          break;
        case "dark":
          body.classList.add("dark");
          break;
      }
    });

    createEffect(() => {
      if (theme() === "system") {
        matchPrefersDark.addEventListener("change", syncPrefersColorScheme);
      } else {
        matchPrefersDark.removeEventListener("change", syncPrefersColorScheme);
      }
    });

    onCleanup(() =>
      matchPrefersDark.removeEventListener("change", syncPrefersColorScheme),
    );
  }

  return (
    <>
      <script>{ssrScript}</script>
      <ThemeContext.Provider value={[theme, setTheme]}>
        {props.children}
      </ThemeContext.Provider>
    </>
  );
};

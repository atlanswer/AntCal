import { A } from "@solidjs/router";
import { For } from "solid-js";
import { ThemeToggle } from "~/components/theme";

const Navigator = () => {
  const routes: { route: string; name: string }[] = [
    {
      name: "Pattern",
      route: "/",
    },
    {
      name: "Report",
      route: "/report",
    },
    {
      name: "Docs",
      route: "/docs",
    },
    {
      name: "About",
      route: "/about",
    },
  ];

  return (
    <nav class="flex flex-1 sm:place-content-center">
      <span class="inline-block [&>:not(:first-child)]:ml-6">
        <For each={routes}>
          {(route) => (
            <A
              href={route.route}
              class="box-border inline-block border-b-2 border-transparent px-1 pt-4 pb-[calc(1rem-2px)] text-xl font-semibold focus-visible:ring focus-visible:outline-none [&.active]:border-sky-500 [&.inactive]:hover:border-neutral-300 dark:[&.inactive]:hover:border-neutral-700"
              end
            >
              {route.name}
            </A>
          )}
        </For>
      </span>
    </nav>
  );
};

export const Header = () => (
  <header class="sticky top-0 z-10 place-content-center bg-white px-8 text-black shadow dark:border-neutral-900 dark:bg-black dark:text-white">
    <div class="mx-auto flex max-w-screen-xl place-content-between place-items-center gap-8">
      <span class="hidden w-8 sm:inline" />
      <Navigator />
      <ThemeToggle />
    </div>
  </header>
);

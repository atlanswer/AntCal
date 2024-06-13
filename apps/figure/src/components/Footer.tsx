// @refresh granular

import { version } from "package.json";
import { BeakerIcon } from "~/components/icons/Beaker";
import { BoltIcon } from "~/components/icons/Bolt";
import { GitHubIcon } from "~/components/icons/GitHub";

export const Footer = () => {
  // const IconTime = () => (
  //   <svg
  //     class="h-5 w-5"
  //     xmlns="http://www.w3.org/2000/svg"
  //     fill="currentColor"
  //     viewBox="0 0 24 24"
  //   >
  //     <path
  //       fill-rule="evenodd"
  //       d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
  //       clip-rule="evenodd"
  //     />
  //   </svg>
  // );

  // const [avgTime] = useDrawPerf();

  return (
    <footer class="border-t border-neutral-300 bg-neutral-200 p-8 text-black dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
      <div class="mx-auto flex max-w-screen-xl flex-col gap-4 sm:flex-row sm:gap-8">
        <span>
          Built by
          <span> </span>
          <a
            href="https://github.com/atlanswer"
            target="_blank"
            class="font-medium underline underline-offset-4"
          >
            @atlanswer
          </a>
        </span>
        <a
          href="https://dev.antcal.atlanswer.com"
          target="_blank"
          class="flex place-items-center gap-1"
        >
          <BeakerIcon />
          <span class="underline underline-offset-4">Preview Build</span>
        </a>
        <a
          href="https://status.atlanswer.com"
          target="_blank"
          class="flex place-items-center gap-1"
        >
          <BoltIcon />
          <span class="underline underline-offset-4">Status</span>
        </a>
        <span class="flex place-items-center gap-1">
          {/* <IconTime /> */}
          {/* <span>{avgTime().toFixed()} ms</span> */}
          <span>
            <code>API_URL: {import.meta.env["VITE_API_URL"]}</code>
          </span>
        </span>
        <span class="flex place-items-center gap-1.5 sm:ml-auto">
          <span>v{version}</span>
          <a
            href="https://github.com/atlanswer/AntCal"
            target="_blank"
            class="flex place-items-center gap-1.5"
          >
            <GitHubIcon />
            <span class="underline underline-offset-4">Source</span>
          </a>
        </span>
      </div>
    </footer>
  );
};

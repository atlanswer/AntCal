// @refresh granular

import { version } from "package.json";
// import { useDrawPerf } from "~/components/contexts/draw-perf";

export const Footer = () => {
  const IconStatus = () => (
    <svg
      class="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fill-rule="evenodd"
        d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const IconGitHub = () => (
    <svg
      class="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fill-rule="evenodd"
        d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
        clip-rule="evenodd"
      />
    </svg>
  );

  const IconTime = () => (
    <svg
      class="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fill-rule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
        clip-rule="evenodd"
      />
    </svg>
  );

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
          href="https://status.atlanswer.com"
          target="_blank"
          class="flex place-items-center gap-1"
        >
          <IconStatus />
          <span class="underline underline-offset-4">Status</span>
        </a>
        <span class="flex place-items-center gap-1">
          <IconTime />
          {/* <span>{avgTime().toFixed()} ms</span> */}
        </span>
        <span class="flex place-items-center gap-1.5 sm:ml-auto">
          <span>v{version}</span>
          <a
            href="https://github.com/atlanswer/figure"
            target="_blank"
            class="flex place-items-center gap-1.5"
          >
            <IconGitHub />
            <span class="underline underline-offset-4">Source</span>
          </a>
        </span>
      </div>
    </footer>
  );
};

import { Title } from "@solidjs/meta";
import { createUniqueId } from "solid-js";

export default function Report() {
  return (
    <div class="flex flex-col place-items-center divide-y-2 divide-neutral-200 px-4 py-4 sm:px-6 lg:px-8 dark:divide-neutral-800">
      <Title>Report | AntCal</Title>
      <article class="prose dark:prose-invert mt-16 py-8">
        <p>
          Create publication quality reports from data files. Work in progress!
        </p>
      </article>
      <FileUpload />
    </div>
  );
}

const FileUpload = () => {
  const inputId = createUniqueId();
  return (
    <div class="grid max-w-sm grid-flow-row gap-1 py-8 text-black dark:text-white">
      <label for={inputId} class="font-medium">
        Data Files
      </label>
      <input
        id={inputId}
        type="file"
        class="rounded bg-sky-500 px-3 py-1 text-white shadow file:border-none file:bg-transparent file:font-medium file:text-white hover:bg-sky-700 focus-visible:outline-none focus-visible:ring"
      />
    </div>
  );
};

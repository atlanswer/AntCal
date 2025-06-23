import type { Source } from "components/figure/context";
import { Suspense, type Component } from "solid-js";

export const SourcePreview: Component<{ sources: Source[] }> = () => {
  // const [sourcesPreviewData] = createResource(
  // () => JSON.stringify(props.sources),
  // async () => {
  //   const t_start = Date.now();

  //   return `data:image/svg+xml,${encodeURIComponent(svgData)}`;
  // },
  // () => "Source Preview is Under Construction",
  // );

  return (
    <figure class="flex h-44 w-44 place-content-center place-items-center rounded-md bg-neutral-100 text-black shadow-md outline-1 outline-neutral-500 dark:bg-neutral-800 dark:text-white dark:outline">
      <Suspense fallback={<SourcePreviewLoading />}>
        {/* <img
          width="176"
          height="176"
          class="rounded-md"
          src={sourcesPreviewData.latest ?? ""}
          alt="Source Preview"
        /> */}
        <p class="text-center font-semibold">
          Source Preview is
          <br />
          Under Construction
        </p>
      </Suspense>
    </figure>
  );
};

export const SourcePreviewLoading = () => (
  <div class="flex place-content-center gap-2 p-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-6 w-6 animate-spin"
    >
      <path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8" />
    </svg>
    <span class="font-semibold">Creating source preview...</span>
  </div>
);

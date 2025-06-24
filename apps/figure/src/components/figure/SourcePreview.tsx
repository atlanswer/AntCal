import type { Source } from "components/figure/context";
import { createResource, Suspense, untrack, type Component } from "solid-js";

export const SourcePreview: Component<{ sources: Source[] }> = (props) => {
  const [sourcesPreviewData] = createResource(
    () => JSON.stringify(props.sources),
    async () => {
      const sources = untrack(() => props.sources);

      const query = new URLSearchParams({
        src: encodeURIComponent(JSON.stringify(sources)),
      });

      const url = new URL(
        `${import.meta.env.PUBLIC_API_URL}/source-preview?${query.toString()}`,
      );

      const res = await fetch(url);

      if (res.ok) {
        return `data:image/svg+xml,${encodeURIComponent(await res.text())}`;
      } else {
        throw new Error(
          `Error ploting source preview: API response with status code ${res.status}.`,
        );
      }
    },
  );

  return (
    <figure class="flex h-[252px] w-[252px] place-content-center place-items-center rounded-md bg-neutral-100 shadow-md dark:bg-neutral-800">
      <Suspense fallback={<SourcePreviewLoading />}>
        <img
          width="252"
          height="252"
          class="rounded-md"
          src={sourcesPreviewData.latest ?? ""}
          alt="Source Preview"
        />
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

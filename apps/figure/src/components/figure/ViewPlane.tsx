// @refresh granular
// spell-checker:words HPBW

import { Show, Suspense, createResource, type Component } from "solid-js";
import type { CutPlane, ViewPlaneConfig } from "~/components/figure/context";

export const ViewPlane: Component<ViewPlaneConfig> = (props) => {
  const [viewPlaneData] = createResource(
    // TODO: optimize here
    () => [props.isDb, props.isGainTotal, JSON.stringify(props.sources)],
    async () => {
      const res = await fetch(`${import.meta.env["VITE_API_URL"]}/blank`);
      const svgData = await res.text();
      return [
        123,
        // maxD,
        456,
        // hpbw,
        `data:image/svg+xml,${encodeURIComponent(svgData)}`,
      ] as const;
    },
  );

  const cutPlaneVar: { [K in CutPlane]: string } = {
    XZ: "θ",
    YZ: "θ",
    XY: "ϕ",
  };

  return (
    <div class="flex flex-col gap-2 rounded bg-neutral-100 p-3 text-black shadow-md dark:bg-neutral-800 dark:text-white dark:shadow-none">
      <div class="flex place-content-between gap-2">
        <span class="text-lg">
          <em>{props.cutPlane}</em>-Plane<span> </span>(
          <em>{cutPlaneVar[props.cutPlane]}</em>)
        </span>
        <Show when={viewPlaneData.loading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="h-6 w-6 animate-spin"
          >
            <path
              fill="currentColor"
              d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8"
            />
          </svg>
        </Show>
      </div>
      <div class="flex place-content-between gap-4">
        <span>Max Direction: {viewPlaneData.latest?.[0] ?? "-"}°</span>
        <span>HPBW: {viewPlaneData.latest?.[1] ?? "-"}°</span>
      </div>
      <div class="flex h-[252px] w-[252px] flex-wrap place-content-center rounded outline outline-1 outline-neutral-100">
        <Suspense fallback={<ViewPlaneLoading />}>
          <img
            width="252"
            height="252"
            class="rounded"
            src={viewPlaneData.latest?.[2] ?? ""}
            alt={`${props.cutPlane} Plane`}
          />
        </Suspense>
      </div>
    </div>
  );
};

export const ViewPlaneLoading = () => (
  <div class="flex place-content-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-6 w-6 animate-spin"
    >
      <path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8" />
    </svg>
    <span>Creating figure...</span>
  </div>
);

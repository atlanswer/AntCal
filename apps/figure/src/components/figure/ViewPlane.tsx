// @refresh granular
// spell-checker:words HPBW

import {
  Show,
  Suspense,
  createResource,
  untrack,
  type Component,
} from "solid-js";
import { z } from "zod";
import {
  useFigureConfigs,
  type CutPlane,
  type ViewPlaneConfig,
} from "~/components/figure/context";

const zFigureWithDetail = z.object({
  figData: z.string(),
  hpbw: z.number(),
  maxD: z.number(),
});

type FigureWithDetail = z.infer<typeof zFigureWithDetail>;

export const ViewPlane: Component<{ cutPlane: CutPlane; figIdx: number }> = (
  props,
) => {
  const [figureConfigs] = useFigureConfigs();

  const figureConfig = () => {
    const maybeFigureConfig = figureConfigs[props.figIdx];
    if (maybeFigureConfig === undefined) {
      throw new Error("`figureConfig` is undefined.");
    }
    return maybeFigureConfig;
  };

  const [viewPlaneData] = createResource(
    // TODO: optimize here
    () => {
      return [
        figureConfig().isDb,
        figureConfig().isGainTotal,
        JSON.stringify(figureConfig().sources),
      ];
    },
    async () => {
      const viewPlaneConfig = untrack(
        () =>
          ({
            cutPlane: props.cutPlane,
            isDb: figureConfig().isDb,
            isGainTotal: figureConfig().isGainTotal,
            sources: figureConfig().sources,
          }) satisfies ViewPlaneConfig,
      );
      const query = new URLSearchParams({
        fig: encodeURIComponent(JSON.stringify(viewPlaneConfig)),
      });
      const res = await fetch(
        `${import.meta.env["VITE_API_URL"]}/figure-with-detail?${query.toString()}`,
      );
      if (res.ok) {
        const figureWithDetail = zFigureWithDetail.parse(await res.json());
        return {
          maxD: figureWithDetail.maxD,
          hpbw: figureWithDetail.hpbw,
          figData: `data:image/svg+xml,${encodeURIComponent(figureWithDetail.figData)}`,
        } satisfies FigureWithDetail;
      } else {
        throw new Error(
          `Error ploting figure: API response with status code ${res.status}.`,
        );
      }
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
        <Suspense>
          <span>Max Direction: {viewPlaneData.latest?.maxD ?? "-"}°</span>
          <span>HPBW: {viewPlaneData.latest?.hpbw ?? "-"}°</span>
        </Suspense>
      </div>
      <div class="flex h-[252px] w-[252px] flex-wrap place-content-center rounded outline outline-1 outline-neutral-100">
        <Suspense fallback={<ViewPlaneLoading />}>
          <img
            width="252"
            height="252"
            class="rounded"
            src={viewPlaneData.latest?.figData ?? ""}
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

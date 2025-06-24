// spell-checker: words hpbw

import {
  useFigureArrayConf,
  type Plane,
  type PlaneConf,
} from "components/figure/context";
import {
  Show,
  Suspense,
  createResource,
  untrack,
  type Component,
} from "solid-js";
import { z } from "zod";

const zFigureWithDetail = z.object({
  figData: z.string(),
  hpbw: z.number(),
  maxD: z.number(),
});
type FigureWithDetail = z.infer<typeof zFigureWithDetail>;

export const PlaneCard: Component<{ plane: Plane; figIdx: number }> = (
  props,
) => {
  const [figureConfigs] = useFigureArrayConf();

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
        figureConfig().db,
        figureConfig().gainTotal,
        JSON.stringify(figureConfig().sources),
      ];
    },
    async () => {
      const viewPlaneConfig = untrack(
        () =>
          ({
            sources: figureConfig().sources,
            plane: props.plane,
            db: figureConfig().db,
            gainTotal: figureConfig().gainTotal,
            dbMin: -30,
            dbMax: 10,
            linMin: 0,
            axisStepDeg: 1,
          }) satisfies PlaneConf,
      );
      const query = new URLSearchParams({
        fig: encodeURIComponent(JSON.stringify(viewPlaneConfig)),
      });
      const res = await fetch(
        `${import.meta.env.PUBLIC_API_URL}/figure?${query.toString()}`,
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

  const cutPlaneVar: { [K in Plane]: string } = {
    XZ: "θ",
    YZ: "θ",
    XY: "ϕ",
  };

  return (
    <div class="flex flex-col gap-2 rounded bg-neutral-100 p-3 shadow-md dark:bg-neutral-800 dark:shadow-none">
      <div class="flex place-content-between gap-2">
        <span class="text-lg">
          <em>{props.plane}</em>-Plane<span> </span>(
          <em>{cutPlaneVar[props.plane]}</em>)
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
      <div class="flex h-[252px] w-[252px] flex-wrap place-content-center rounded outline-1 outline-neutral-100">
        <Suspense fallback={<ViewPlaneLoading />}>
          <img
            width="252"
            height="252"
            class="rounded"
            src={viewPlaneData.latest?.figData ?? ""}
            alt={`${props.plane} Plane`}
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

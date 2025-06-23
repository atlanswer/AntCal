import { PlaneCard } from "components/figure/Plane";
import { SourcesPanel } from "components/figure/SourcePanel";
import { SourcePreview } from "components/figure/SourcePreview";
import { useFigureArrayConf, type FigureConf } from "components/figure/context";
import PencilSquare from "components/icons/PencilSquare";
import XCircle from "components/icons/XCircle";
import { ErrorBoundary, Show, type Accessor, type Component } from "solid-js";
import { produce } from "solid-js/store";

export const FigureSection: Component<{
  figureConfig: Accessor<FigureConf>;
  idx: number;
}> = (props) => {
  const [figureConfigs, setFigureConfigs] = useFigureArrayConf();

  return (
    <section class="flex flex-col place-items-center gap-4 py-8">
      <figure class="flex max-w-full flex-col gap-2">
        <figcaption class="flex place-content-between place-items-center gap-4">
          <div class="flex flex-wrap place-items-center gap-4">
            <div class="relative last:right-0">
              <input
                type="text"
                name="Figure Title"
                placeholder="Figure Title"
                class="w-72 max-w-full rounded bg-neutral-100 px-2 py-1 pr-10 text-2xl font-semibold text-black shadow focus-visible:ring focus-visible:outline-none dark:bg-neutral-800 dark:text-white"
                value={props.figureConfig().title}
                onChange={(event) =>
                  setFigureConfigs(props.idx, "title", event.target.value)
                }
              />
              <div class="absolute top-2 right-2">
                <PencilSquare />
              </div>
            </div>
            <div
              title="Switch axes scale"
              class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-100 p-1 text-neutral-500 shadow dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white"
            >
              <button
                class="rounded px-2 whitespace-nowrap"
                classList={{ active: props.figureConfig().db }}
                type="button"
                onClick={() => setFigureConfigs(props.idx, "db", true)}
              >
                dB
              </button>
              <button
                class="rounded px-2 whitespace-nowrap"
                classList={{ active: !props.figureConfig().db }}
                type="button"
                onClick={() => setFigureConfigs(props.idx, "db", false)}
              >
                Linear
              </button>
            </div>
            <div
              title="Switch gain type"
              class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-100 p-1 text-neutral-500 shadow dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white"
            >
              <button
                class="rounded px-2 whitespace-nowrap"
                classList={{ active: !props.figureConfig().gainTotal }}
                type="button"
                onClick={() => setFigureConfigs(props.idx, "gainTotal", false)}
              >
                Gain <em>θ</em>/<em>ϕ</em>
              </button>
              <button
                class="rounded px-2 whitespace-nowrap"
                classList={{ active: props.figureConfig().gainTotal }}
                type="button"
                onClick={() => setFigureConfigs(props.idx, "gainTotal", true)}
              >
                Gain Total
              </button>
            </div>
          </div>
          <Show when={figureConfigs.length > 1}>
            <button
              title="Remove figure"
              class="ml-auto text-neutral-500 hover:text-rose-500"
              type="button"
              onClick={() =>
                setFigureConfigs(
                  produce((figureConfigs) =>
                    figureConfigs.splice(props.idx, 1),
                  ),
                )
              }
            >
              <XCircle />
            </button>
          </Show>
        </figcaption>
        <div class="grid grid-flow-col place-items-center gap-4 overflow-x-auto rounded py-2 font-semibold">
          <ErrorBoundary
            fallback={(err: { toString: () => string }) => (
              <div class="rounded bg-red-500 p-4 text-center text-white">
                <p>{err.toString()}</p>
                <p>Please try again by refreshing.</p>
              </div>
            )}
          >
            <PlaneCard plane="YZ" figIdx={props.idx} />
            <PlaneCard plane="XZ" figIdx={props.idx} />
            <PlaneCard plane="XY" figIdx={props.idx} />
            <SourcePreview sources={props.figureConfig().sources} />
          </ErrorBoundary>
        </div>
        <figcaption class="flex flex-wrap place-content-center place-items-center gap-8 text-black dark:text-white">
          <Show
            when={props.figureConfig().gainTotal}
            fallback={
              <>
                <span class="before:inline-block before:h-1 before:w-12 before:rounded before:bg-[#1f77b4] before:align-middle">
                  <span> </span>Gain <em>θ</em>
                </span>
                <span class="before:inline-block before:h-1 before:w-12 before:rounded before:bg-[#ff7f0e] before:align-middle">
                  <span> </span>Gain <em>ϕ</em>
                </span>
              </>
            }
          >
            <span class="before:inline-block before:h-1 before:w-12 before:rounded before:bg-[#1f77b4] before:align-middle">
              <span> </span>Gain Total
            </span>
          </Show>
        </figcaption>
      </figure>
      <SourcesPanel sources={props.figureConfig().sources} idx={props.idx} />
    </section>
  );
};

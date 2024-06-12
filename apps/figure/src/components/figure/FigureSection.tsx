import { ErrorBoundary, Show, type Accessor, type Component } from "solid-js";
import { produce } from "solid-js/store";
import { SourcesPanel } from "~/components/figure/SourcePanel";
import { ViewPlane } from "~/components/figure/ViewPlane";
import {
  useFigureConfigs,
  type FigureConfig,
} from "~/components/figure/context";
import { EditIcon } from "~/components/icons/Edit";
import { RemoveIcon } from "~/components/icons/Remove";

export const FigureSection: Component<{
  figureConfig: Accessor<FigureConfig>;
  idx: number;
}> = (props) => {
  const [figureConfigs, setFigureConfigs] = useFigureConfigs();

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
                class="w-72 max-w-full rounded bg-neutral-100 px-2 py-1 pr-10 text-2xl font-semibold text-black shadow focus-visible:outline-none focus-visible:ring dark:bg-neutral-800 dark:text-white"
                value={props.figureConfig().title}
                onChange={(event) =>
                  setFigureConfigs(props.idx, "title", event.target.value)
                }
              />
              <EditIcon class="absolute right-2 top-2" />
            </div>
            <div
              title="Switch axes scale"
              class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-100 p-1 text-neutral-500 shadow dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white"
            >
              <button
                class="whitespace-nowrap rounded px-2"
                classList={{ active: props.figureConfig().isDb }}
                onClick={() => setFigureConfigs(props.idx, "isDb", true)}
              >
                dB
              </button>
              <button
                class="whitespace-nowrap rounded px-2"
                classList={{ active: !props.figureConfig().isDb }}
                onClick={() => setFigureConfigs(props.idx, "isDb", false)}
              >
                Linear
              </button>
            </div>
            <div
              title="Switch gain type"
              class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-100 p-1 text-neutral-500 shadow dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white"
            >
              <button
                class="whitespace-nowrap rounded px-2"
                classList={{ active: !props.figureConfig().isGainTotal }}
                onClick={() =>
                  setFigureConfigs(props.idx, "isGainTotal", false)
                }
              >
                Gain <em>θ</em>/<em>ϕ</em>
              </button>
              <button
                class="whitespace-nowrap rounded px-2"
                classList={{ active: props.figureConfig().isGainTotal }}
                onClick={() => setFigureConfigs(props.idx, "isGainTotal", true)}
              >
                Gain Total
              </button>
            </div>
          </div>
          <Show when={figureConfigs.length > 1}>
            <button
              title="Remove figure"
              class="ml-auto text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              onClick={() =>
                setFigureConfigs(
                  produce((figureConfigs) =>
                    figureConfigs.splice(props.idx, 1),
                  ),
                )
              }
            >
              <RemoveIcon />
            </button>
          </Show>
        </figcaption>
        <div class="grid grid-flow-col place-items-center gap-4 overflow-x-auto rounded py-2 font-semibold">
          <ErrorBoundary
            fallback={(err: { toString: () => string }) => (
              <p class="text-red-500">{err.toString()}</p>
            )}
          >
            <ViewPlane cutPlane="YZ" figIdx={props.idx} />
            <ViewPlane cutPlane="XZ" figIdx={props.idx} />
            <ViewPlane cutPlane="XY" figIdx={props.idx} />
          </ErrorBoundary>
        </div>
        <figcaption class="flex flex-wrap place-content-center place-items-center gap-8 text-black dark:text-white">
          <Show
            when={props.figureConfig().isGainTotal}
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

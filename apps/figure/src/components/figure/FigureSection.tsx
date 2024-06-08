import { Show, type Accessor, type Component } from "solid-js";
import { useFigureConfigs, type FigureConfig } from "./context";
import { produce } from "solid-js/store";

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
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="absolute left-2 top-2 h-6 w-6 fill-neutral-500"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
              </svg>
              <input
                type="text"
                name="Figure Title"
                placeholder="Figure Title"
                class="w-72 max-w-full rounded bg-neutral-100 px-2 py-1 pl-10 text-2xl font-semibold text-black shadow focus-visible:outline-none focus-visible:ring dark:bg-neutral-800 dark:text-white"
                value={props.figureConfig().title}
                onChange={(event) =>
                  setFigureConfigs(props.idx, "title", event.target.value)
                }
              />
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-8 w-8"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.515 10.674a1.875 1.875 0 0 0 0 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374ZM12.53 9.22a.75.75 0 1 0-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L15.31 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </Show>
        </figcaption>
        <div class="grid grid-flow-col place-items-center gap-4 overflow-x-auto rounded py-2 font-semibold">
          {/* <ViewPlane cutPlane="YZ" {...props.figureConfig} /> */}
          {/* <ViewPlane cutPlane="XZ" {...props.figureConfig} /> */}
          {/* <ViewPlane cutPlane="XY" {...props.figureConfig} /> */}
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
      {/* <SourcesPanel
        idx={props.idx}
      /> */}
    </section>
  );
};

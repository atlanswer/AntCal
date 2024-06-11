import { Show, type Accessor, type Component } from "solid-js";
import { produce } from "solid-js/store";
import { useFigureConfigs, type Source } from "~/components/figure/context";
import { MinusIcon } from "~/components/icons/Minus";

export const SourceCard: Component<{
  source: Accessor<Source>;
  figIdx: number;
  srcIdx: number;
}> = (props) => {
  const [figureConfigs, setFigureConfigs] = useFigureConfigs();

  const sources = () => figureConfigs[props.figIdx]?.sources;

  return (
    <div class="flex h-44 flex-col place-content-between rounded-lg bg-neutral-100 p-3 text-neutral-900 shadow-md outline-1 outline-neutral-500 dark:bg-black dark:text-neutral-100 dark:outline">
      <div class="grid grid-flow-col place-content-between place-items-center gap-3">
        <span class="flex place-items-center gap-2">
          <span class="rounded bg-neutral-500 px-2 text-white">
            {props.srcIdx + 1}
          </span>
          <span class="w-fit text-lg font-semibold">
            {props.source().type}-dipole
          </span>
        </span>
        <span class="flex place-items-center gap-2">
          <span class="grid grid-cols-2 place-content-center place-items-stretch rounded bg-neutral-200 p-1 font-bold text-neutral-500 dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white">
            <button
              class="whitespace-nowrap rounded px-2"
              classList={{ active: props.source().type === "E" }}
              onClick={() =>
                setFigureConfigs(
                  props.figIdx,
                  "sources",
                  props.srcIdx,
                  "type",
                  "E",
                )
              }
            >
              J
            </button>
            <button
              class="whitespace-nowrap rounded px-2"
              classList={{ active: props.source().type === "M" }}
              onClick={() =>
                setFigureConfigs(
                  props.figIdx,
                  "sources",
                  props.srcIdx,
                  "type",
                  "M",
                )
              }
            >
              M
            </button>
          </span>
          <Show when={(sources()?.length ?? 0) > 1}>
            <button
              aria-label="Remove source"
              class="rounded bg-neutral-500 text-white hover:bg-sky-500"
              onClick={() =>
                setFigureConfigs(
                  props.figIdx,
                  "sources",
                  produce((sources) => sources.splice(props.srcIdx, 1)),
                )
              }
            >
              <MinusIcon />
            </button>
          </Show>
        </span>
      </div>
      <form
        class="flex flex-col gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        {/* <DirectionSelector
          direction={props.source.direction}
          setFigureConfigs={props.setFigureConfigs}
          figIdx={props.figIdx}
          srcIdx={props.srcIdx}
        />
        <ValueSelector
          type="amplitude"
          value={props.source["amplitude"]}
          setFigureConfigs={props.setFigureConfigs}
          figIdx={props.figIdx}
          srcIdx={props.srcIdx}
        />
        <ValueSelector
          type="phase"
          value={props.source["phase"]}
          setFigureConfigs={props.setFigureConfigs}
          figIdx={props.figIdx}
          srcIdx={props.srcIdx}
        /> */}
      </form>
    </div>
  );
};

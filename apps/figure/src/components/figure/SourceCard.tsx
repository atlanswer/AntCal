import {
  Index,
  Show,
  createUniqueId,
  type Accessor,
  type Component,
} from "solid-js";
import { produce } from "solid-js/store";
import { useFigureConfigs, type Source } from "~/components/figure/context";
import { DownArrow } from "~/components/icons/Down";
import { MinusIcon } from "~/components/icons/Minus";
import { UpArrow } from "~/components/icons/Up";

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
        <DirectionSelector figIdx={props.figIdx} srcIdx={props.srcIdx} />
        <ValueSelector
          type="amplitude"
          figIdx={props.figIdx}
          srcIdx={props.srcIdx}
        />
        <ValueSelector
          type="phase"
          figIdx={props.figIdx}
          srcIdx={props.srcIdx}
        />
      </form>
    </div>
  );
};

const DirectionSelector: Component<{
  figIdx: number;
  srcIdx: number;
}> = (props) => {
  const directions: Source["direction"][] = ["X", "Y", "Z"] as const;

  const [figureConfigs, setFigureConfigs] = useFigureConfigs();

  return (
    <div class="flex place-content-between place-items-center gap-2">
      <span class="text-sm">Direction</span>
      <span class="flex place-items-center gap-2">
        <span class="place-content-center place-items-stretch rounded bg-neutral-200 p-1 font-bold text-neutral-500 dark:bg-neutral-800 [&>.active]:bg-sky-500 [&>.active]:text-white">
          <Index each={directions}>
            {(direction) => (
              <button
                class="whitespace-nowrap rounded px-4"
                classList={{
                  active:
                    figureConfigs[props.figIdx]?.sources[props.srcIdx]
                      ?.direction === direction(),
                }}
                onClick={() =>
                  setFigureConfigs(
                    props.figIdx,
                    "sources",
                    props.srcIdx,
                    "direction",
                    direction,
                  )
                }
              >
                {direction()}
              </button>
            )}
          </Index>
        </span>
      </span>
    </div>
  );
};

const ValueSelector: Component<{
  type: "amplitude" | "phase";
  figIdx: number;
  srcIdx: number;
}> = (props) => {
  const [figureConfigs, setFigureConfigs] = useFigureConfigs();
  const source = () => {
    const maybeSource = figureConfigs[props.figIdx]?.sources[props.srcIdx];
    if (maybeSource === undefined) {
      throw new Error("`source` is undefined.");
    }
    return maybeSource;
  };

  const inputId = createUniqueId();
  const displayType = () => props.type[0]?.toUpperCase() + props.type.slice(1);

  const amplitudeDown = (amp: number) => {
    const step = 0.1;
    const res = amp - step;
    return res >= 0 ? res : 0;
  };
  const amplitudeUp = (amp: number) => {
    const step = 0.1;
    return amp + step;
  };

  const phaseDown = (phase: number) => {
    const step = 1;
    const res = phase - step;
    return res >= 0 ? res : 359;
  };
  const phaseUp = (phase: number) => {
    const step = 1;
    const res = phase + step;
    return res > 359 ? 0 : res;
  };

  return (
    <div class="flex place-content-between place-items-center gap-2">
      <label for={inputId} class="text-sm">
        {displayType()}
      </label>
      <div class="flex">
        <button
          type="button"
          aria-label="Decrease value"
          class="rounded-s border border-neutral-500 px-1"
          onClick={() =>
            setFigureConfigs(
              props.figIdx,
              "sources",
              props.srcIdx,
              props.type,
              props.type === "amplitude" ?
                amplitudeDown(source().amplitude)
              : phaseDown(source().phase),
            )
          }
        >
          <DownArrow />
        </button>
        <input
          id={inputId}
          value={
            props.type === "amplitude" ?
              source().amplitude.toFixed(2)
            : source().phase.toFixed()
          }
          type="number"
          min="0"
          max="359"
          step={props.type === "amplitude" ? "0.01" : "1"}
          class="w-16 border border-x-0 border-neutral-500 bg-transparent text-center focus-visible:outline-none"
          required
          onChange={(event) =>
            setFigureConfigs(
              props.figIdx,
              "sources",
              props.srcIdx,
              props.type,
              +event.target.value,
            )
          }
        />
        <button
          type="button"
          aria-label="Increase value"
          class="rounded-e border border-neutral-500 px-1"
          onClick={() =>
            setFigureConfigs(
              props.figIdx,
              "sources",
              props.srcIdx,
              props.type,
              props.type === "amplitude" ?
                amplitudeUp(source().amplitude)
              : phaseUp(source().phase),
            )
          }
        >
          <UpArrow />
        </button>
      </div>
    </div>
  );
};

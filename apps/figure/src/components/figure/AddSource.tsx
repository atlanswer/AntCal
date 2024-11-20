import type { Component } from "solid-js";
import { useFigureConfigs, type Source } from "~/components/figure/context";
import { AddIcon } from "~/components/icons/Add";

export const AddSource: Component<{
  idx: number;
}> = (props) => {
  const [, setFigureConfigs] = useFigureConfigs();

  const addSource = () => {
    setFigureConfigs(props.idx, "sources", (sources) => [
      ...sources,
      {
        type: "M",
        direction: "X",
        amplitude: 1,
        phase: 0,
        lpwl: 0.5,
      } satisfies Source,
    ]);
  };

  return (
    <button
      title="Add new source"
      class="rounded bg-sky-500 px-4 py-1 text-white shadow hover:bg-sky-700"
      type="button"
      onClick={addSource}
    >
      <AddIcon />
    </button>
  );
};

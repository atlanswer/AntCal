import { useFigureArrayConf, type Source } from "components/figure/context";
import Plus from "components/icons/Plus";
import type { Component } from "solid-js";

export const AddSource: Component<{
  idx: number;
}> = (props) => {
  const [, setFigureConfigs] = useFigureArrayConf();

  const addSource = () => {
    setFigureConfigs(props.idx, "sources", (sources) => [
      ...sources,
      {
        type: "E",
        orientation: {
          theta: 0,
          phi: 0,
        },
        amplitude: 1,
        phase: 0,
        length: 0.5,
      } satisfies Source,
    ]);
  };

  return (
    <button
      title="Add new source"
      class="flex gap-1 rounded bg-sky-500 px-4 py-2 text-white shadow hover:bg-sky-700"
      type="button"
      onClick={addSource}
    >
      <Plus />
      <span>New Source</span>
    </button>
  );
};

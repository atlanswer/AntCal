import {
  figureConfArrayDefault,
  useFigureArrayConf,
} from "components/figure/context";
import Plus from "components/icons/Plus";
import type { Component } from "solid-js";

export const AddFigure: Component = () => {
  const [figureConfigs, setFigureConfigs] = useFigureArrayConf();

  return (
    <button
      title="Add new figure"
      class="mt-4 mb-12 flex gap-1 place-self-center rounded border-none bg-sky-500 px-4 py-2 text-white shadow hover:bg-sky-700"
      onClick={() =>
        setFigureConfigs(figureConfigs.length, figureConfArrayDefault[1])
      }
    >
      <Plus />
      <span>New Figure</span>
    </button>
  );
};

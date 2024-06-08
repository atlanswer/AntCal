import type { Component } from "solid-js";
import {
  figureConfigsDefault,
  useFigureConfigs,
} from "~/components/figure/context";

export const AddFigure: Component = () => {
  const [figureConfigs, setFigureConfigs] = useFigureConfigs();

  return (
    <button
      title="Add new figure"
      class="mb-12 mt-4 flex gap-1 place-self-center rounded border-none bg-sky-500 px-4 py-2 text-white shadow hover:bg-sky-700"
      onClick={() =>
        setFigureConfigs(figureConfigs.length, figureConfigsDefault[1])
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="h-6 w-6"
      >
        <path
          fill-rule="evenodd"
          d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="h-6 w-6"
      >
        <path
          fill-rule="evenodd"
          d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
          clip-rule="evenodd"
        />
        <path
          fill-rule="evenodd"
          d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  );
};

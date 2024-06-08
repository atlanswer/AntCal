// @refresh granular

import { Title } from "@solidjs/meta";
import { useSearchParams } from "@solidjs/router";
import { createEffect, on, type Component } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import {
  FigureConfigs,
  FigureConfigsProvider,
  useFigureConfigs,
  zFigureConfigs,
} from "~/components/figure/context";

const FIGURE_CONFIGS_STORAGE_KEY = "figure-configs";

const figureConfigsDefault = [
  {
    title: "ME-Dipole",
    isDb: true,
    isGainTotal: false,
    sources: [
      { type: "E", direction: "Y", amplitude: 1, phase: 0 },
      { type: "M", direction: "X", amplitude: 1, phase: 0 },
    ],
  },
  {
    title: "E-Dipole",
    isDb: true,
    isGainTotal: false,
    sources: [{ type: "E", direction: "Z", amplitude: 1, phase: 0 }],
  },
  {
    title: "M-Dipole",
    isDb: true,
    isGainTotal: false,
    sources: [{ type: "M", direction: "Z", amplitude: 1, phase: 0 }],
  },
] as const satisfies FigureConfigs;

const convertStringToFigureConfigs = (
  figureConfigsString: string,
): FigureConfigs => {
  let figureConfigs: unknown;
  try {
    figureConfigs = JSON.parse(figureConfigsString);
  } catch {
    return figureConfigsDefault;
  }
  let parsedFigureConfigs: FigureConfigs;
  try {
    parsedFigureConfigs = zFigureConfigs.parse(figureConfigs);
  } catch {
    return figureConfigsDefault;
  }
  return parsedFigureConfigs;
};

const getFigureConfigsFromSearchParameters = (): FigureConfigs | null => {
  const [searchParams, setSearchParams] = useSearchParams();
  const encodedFigureConfigs = searchParams["figureConfigs"];

  if (!encodedFigureConfigs) return null;

  const figureConfigsString = decodeURIComponent(encodedFigureConfigs);

  setSearchParams({ ...searchParams, figureConfigs: null });

  return convertStringToFigureConfigs(figureConfigsString);
};

const getFigureConfigsFromLocalStorage = (): FigureConfigs => {
  if (isServer) return figureConfigsDefault;

  const figureConfigsString = localStorage.getItem(FIGURE_CONFIGS_STORAGE_KEY);

  if (figureConfigsString === null) return figureConfigsDefault;

  return convertStringToFigureConfigs(figureConfigsString);
};

const AddFigure: Component = () => {
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

export default function () {
  const [figureConfigs, setFigureConfigs] = createStore<FigureConfigs>(
    getFigureConfigsFromSearchParameters() ??
      getFigureConfigsFromLocalStorage(),
  );

  const stringifiedFigureConfigs = () => JSON.stringify(figureConfigs);

  createEffect(
    on(
      () => JSON.stringify(figureConfigs),
      () =>
        localStorage.setItem(
          FIGURE_CONFIGS_STORAGE_KEY,
          stringifiedFigureConfigs(),
        ),
    ),
  );

  return (
    <>
      <Title>Figure | AntCal</Title>
      <FigureConfigsProvider
        figureConfigs={figureConfigs}
        setFigureConfigs={setFigureConfigs}
      >
        <p>{JSON.stringify(figureConfigs)}</p>
        <AddFigure />
      </FigureConfigsProvider>
    </>
  );
}

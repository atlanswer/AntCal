// @refresh granular

import { Title } from "@solidjs/meta";
import { useSearchParams } from "@solidjs/router";
import { Index, createEffect, on, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { AddFigure } from "~/components/figure/AddFigure";
import { FigureSection } from "~/components/figure/FigureSection";
import {
  FigureConfigs,
  FigureConfigsProvider,
  figureConfigsDefault,
  zFigureConfigs,
} from "~/components/figure/context";

const FIGURE_CONFIGS_STORAGE_KEY = "figure-configs";

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

export default function () {
  const [figureConfigs, setFigureConfigs] = createStore<FigureConfigs>([]);

  onMount(() => {
    setFigureConfigs(
      getFigureConfigsFromSearchParameters() ??
        getFigureConfigsFromLocalStorage(),
    );
  });

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
      <Title>New Figure | AntCal</Title>
      <FigureConfigsProvider
        figureConfigs={figureConfigs}
        setFigureConfigs={setFigureConfigs}
      >
        <div class="grid grid-cols-1 place-content-stretch divide-y-2 divide-neutral-200 px-4 sm:px-6 lg:px-8 dark:divide-neutral-800">
          <Index each={figureConfigs}>
            {(figureConfig, idx) => (
              <FigureSection figureConfig={figureConfig} idx={idx} />
            )}
          </Index>
          <AddFigure />
        </div>
      </FigureConfigsProvider>
    </>
  );
}

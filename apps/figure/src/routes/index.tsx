import { Title } from "@solidjs/meta";
import { useSearchParams } from "@solidjs/router";
import { Index, createEffect, on, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import { AddFigure } from "~/components/figure/AddFigure";
import { FigureSection } from "~/components/figure/FigureSection";
import {
  FigureArrayConf,
  FigureArrayConfProvider,
  figureConfArrayDefault,
  zFigureArrayConf,
} from "~/components/figure/context";

const FIGURE_CONFIGS_STORAGE_KEY = "figure-configs";

const convertStringToFigureConfigs = (
  figureConfigsString: string,
): FigureArrayConf => {
  let figureConfigs: unknown;
  try {
    figureConfigs = JSON.parse(figureConfigsString);
  } catch {
    return figureConfArrayDefault;
  }
  let parsedFigureConfigs: FigureArrayConf;
  try {
    parsedFigureConfigs = zFigureArrayConf.parse(figureConfigs);
  } catch {
    return figureConfArrayDefault;
  }
  return parsedFigureConfigs;
};

const getFigureConfigsFromSearchParameters = (): FigureArrayConf | null => {
  const [searchParams, setSearchParams] = useSearchParams();
  const encodedFigureConfigs = searchParams["figureConfigs"];

  if (!encodedFigureConfigs || encodedFigureConfigs instanceof Array) {
    return null;
  }

  const figureConfigsString = decodeURIComponent(encodedFigureConfigs);

  setSearchParams({ ...searchParams, figureConfigs: null });

  return convertStringToFigureConfigs(figureConfigsString);
};

const getFigureConfigsFromLocalStorage = (): FigureArrayConf => {
  if (isServer) return figureConfArrayDefault;

  const figureConfigsString = localStorage.getItem(FIGURE_CONFIGS_STORAGE_KEY);

  if (figureConfigsString === null) return figureConfArrayDefault;

  return convertStringToFigureConfigs(figureConfigsString);
};

export default function () {
  const [figureConfigs, setFigureConfigs] = createStore<FigureArrayConf>([]);

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
      <Title>Figure | AntCal</Title>
      <FigureArrayConfProvider
        figureArrayConf={figureConfigs}
        setFigureArrayConf={setFigureConfigs}
      >
        <div class="grid grid-cols-1 place-content-stretch divide-y-2 divide-neutral-200 px-4 sm:px-6 lg:px-8 dark:divide-neutral-800">
          <Index each={figureConfigs}>
            {(figureConfig, idx) => (
              <FigureSection figureConfig={figureConfig} idx={idx} />
            )}
          </Index>
          <AddFigure />
        </div>
      </FigureArrayConfProvider>
    </>
  );
}

import { MetaProvider, Title } from "@solidjs/meta";
import ErrorPage from "components/ErrorPage";
import { AddFigure } from "components/figure/AddFigure";
import { FigureSection } from "components/figure/FigureSection";
import {
  type FigureArrayConf,
  FigureArrayConfProvider,
  figureConfArrayDefault,
  zFigureArrayConf,
} from "components/figure/context";
import { ErrorBoundary, Index, createEffect, on, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";

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

const getFigureConfigsFromLocalStorage = (): FigureArrayConf => {
  if (isServer) return figureConfArrayDefault;

  const figureConfigsString = localStorage.getItem(FIGURE_CONFIGS_STORAGE_KEY);

  if (figureConfigsString === null) return figureConfArrayDefault;

  return convertStringToFigureConfigs(figureConfigsString);
};

export default function () {
  const [figureConfigs, setFigureConfigs] = createStore<FigureArrayConf>([]);

  onMount(() => {
    setFigureConfigs(getFigureConfigsFromLocalStorage());
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
    <MetaProvider>
      <ErrorBoundary fallback={ErrorPage}>
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
      </ErrorBoundary>
    </MetaProvider>
  );
}

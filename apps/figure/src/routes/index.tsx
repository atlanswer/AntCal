// @refresh granular

import { Title } from "@solidjs/meta";
import { useSearchParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { isServer } from "solid-js/web";
import {
  FigureConfigs,
  FigureConfigsProvider,
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

export default function () {
  const [figureConfigs, setFigureConfigs] = createStore<FigureConfigs>(
    getFigureConfigsFromSearchParameters() ??
      getFigureConfigsFromLocalStorage(),
  );

  const stringifiedFigureConfigs = () => JSON.stringify(unwrap(figureConfigs));

  createEffect(() =>
    localStorage.setItem(
      FIGURE_CONFIGS_STORAGE_KEY,
      stringifiedFigureConfigs(),
    ),
  );

  return (
    <>
      <Title>Figure | AntCal</Title>
      <p>{JSON.stringify(figureConfigs)}</p>
      <p>{encodeURI(JSON.stringify(figureConfigs))}</p>
      <FigureConfigsProvider
        figureConfigs={figureConfigs}
        setFigureConfigs={setFigureConfigs}
      >
        <p>FigureConfigs</p>
      </FigureConfigsProvider>
    </>
  );
}

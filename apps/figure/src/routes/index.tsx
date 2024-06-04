// @refresh granular

import { Title } from "@solidjs/meta";
import { FigureConfigs, zFigureConfigs } from "~/components/figure/context";

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

const getFigureConfigsFromLocalStorage = (): FigureConfigs => {
  const figureConfigsString = localStorage.getItem(FIGURE_CONFIGS_STORAGE_KEY);
  if (figureConfigsString === null) return figureConfigsDefault;
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

export default function Home() {
  return (
    <>
      <Title>Figure | AntCal</Title>
      <p>Base URL: {import.meta.env.BASE_URL}</p>
      <p>Mode: {import.meta.env.MODE}</p>
      <p>API_URL: {import.meta.env["VITE_API_URL"]}</p>
    </>
  );
}

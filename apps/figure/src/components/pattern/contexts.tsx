import { createStore } from "solid-js/store";
import type { Vec3 } from "src/math/linearAlgebra";

export type Coordinate = { theta: number; phi: number };

export type Source = {
  type: "J" | "M";
  length: number;
  amplitude: number;
  phase: number;
  orientation: Coordinate;
  position: Vec3;
};

export type LinearArray = {
  type: "J" | "M";
  length: number;
  amplitude: number;
  startingPhase: number;
  deltaPhase: number;
  startingOrientation: Coordinate;
  startingPosition: Vec3;
  deltaPosition: Vec3;
};

export type FigureSettings = {
  normalization: "off" | "global" | "plane";
  dB: boolean;
  split: boolean;
  resolution: number;
};

export const defaultFigureSettings: FigureSettings = {
  normalization: "global",
  dB: true,
  split: true,
  resolution: 1,
};

export type Analysis = {
  sources: Source[];
  settings: FigureSettings;
};

export const halfWaveEDipole: Analysis = {
  sources: [
    {
      type: "J",
      length: 0.5,
      amplitude: 1,
      phase: 0,
      orientation: { theta: 0.5, phi: 0.5 },
      position: [0, 0, 0],
    },
  ],
  settings: structuredClone(defaultFigureSettings),
};

export const halfWaveMDipole: Analysis = {
  sources: [
    {
      type: "M",
      length: 0.5,
      amplitude: 1,
      phase: 0,
      orientation: { theta: 0.5, phi: 0 },
      position: [0, 0, 0],
    },
  ],
  settings: structuredClone(defaultFigureSettings),
};

export const mEDipole: Analysis = structuredClone({
  sources: [...halfWaveEDipole.sources, ...halfWaveMDipole.sources],
  settings: defaultFigureSettings,
});

export const analysesDefault: Analysis[] = structuredClone([
  mEDipole,
  halfWaveEDipole,
  halfWaveMDipole,
]);

export const [analyses, setAnalyses] = createStore(analysesDefault);

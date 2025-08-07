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

export const halfWaveEDipole: Source = {
  type: "J",
  length: 0.5,
  amplitude: 1,
  phase: 0,
  orientation: { theta: 0.5, phi: 0.5 },
  position: [0, 0, 0],
};

export const halfWaveMDipole: Source = {
  type: "M",
  length: 0.5,
  amplitude: 1,
  phase: 0,
  orientation: { theta: 0.5, phi: 0 },
  position: [0, 0, 0],
};

export const mEDipole: Source[] = structuredClone([
  halfWaveEDipole,
  halfWaveMDipole,
]);

export const configsDefault: Source[][] = structuredClone([
  mEDipole,
  [halfWaveEDipole],
  [halfWaveMDipole],
]);

export const [configs, setConfigs] = createStore(configsDefault);

import { createStore } from "solid-js/store";

export type Coordinate = { theta: number; phi: number };
export type Phasor = { amplitude: number; phase: number };

export type Source = {
  type: "J" | "M";
  length: number;
  orientation: Coordinate;
  position: {
    x: number;
    y: number;
    z: number;
  };
};

export const halfWaveEDipole: Source = {
  type: "J",
  length: 0.5,
  orientation: { theta: 0.5, phi: 0.5 },
  position: { x: 0, y: 0, z: 0 },
};

export const halfWaveMDipole: Source = {
  type: "M",
  length: 0.5,
  orientation: { theta: 0.5, phi: 0 },
  position: { x: 0, y: 0, z: 0 },
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

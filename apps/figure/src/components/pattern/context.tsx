import { createStore } from "solid-js/store";

export type Source = {
  type: "J" | "M";
  length: number;
  orientation: {
    theta: number;
    phi: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
  };
};

export const halfWaveEDipole: Source[] = [
  {
    type: "J",
    length: 0.5,
    orientation: { theta: 0.5, phi: 0.5 },
    position: { x: 0, y: 0, z: 0 },
  },
];

export const halfWaveMDipole: Source[] = [
  {
    type: "M",
    length: 0.5,
    orientation: { theta: 0.5, phi: 0 },
    position: { x: 0, y: 0, z: 0 },
  },
];

export const mEDipole: Source[] = [...halfWaveEDipole, ...halfWaveMDipole];

export const configsDefault: Source[][] = [
  mEDipole,
  halfWaveEDipole,
  halfWaveMDipole,
];

export const [configs, setConfigs] = createStore(configsDefault);

export type ObservationPoint = { theta: number; phi: number };

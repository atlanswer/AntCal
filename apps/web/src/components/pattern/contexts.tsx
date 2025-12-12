import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import * as v from "valibot";
import { vec3Schema } from "src/math/linearAlgebra";

const coordinateSchema = v.object({
  theta: v.number(),
  phi: v.number(),
});
export type Coordinate = v.InferOutput<typeof coordinateSchema>;

const sourceSchema = v.object({
  type: v.union([v.literal("J"), v.literal("M")]),
  length: v.number(),
  amplitude: v.number(),
  phase: v.number(),
  orientation: coordinateSchema,
  position: vec3Schema,
});
export type Source = v.InferOutput<typeof sourceSchema>;

const figureSettingsSchema = v.object({
  normalization: v.union([
    v.literal("off"),
    v.literal("global"),
    v.literal("plane"),
  ]),
  dB: v.boolean(),
  split: v.boolean(),
  resolution: v.number(),
});
export type FigureSettings = v.InferOutput<typeof figureSettingsSchema>;

const analysisSchema = v.object({
  sources: v.array(sourceSchema),
  settings: figureSettingsSchema,
});
export type Analysis = v.InferOutput<typeof analysisSchema>;

const analysesSchema = v.array(analysisSchema);

export const defaultFigureSettings: FigureSettings = {
  normalization: "global",
  dB: true,
  split: true,
  resolution: 1,
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

const STORAGE_KEY = "antcal-pattern-analyses";

const loadAnalyses = (): Analysis[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(analysesDefault);

    const parsed = JSON.parse(saved);
    const result = v.safeParse(analysesSchema, parsed);

    return result.success ? result.output : structuredClone(analysesDefault);
  } catch {
    return structuredClone(analysesDefault);
  }
};

export const [analyses, setAnalyses] = createStore(loadAnalyses());

createEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  } catch {
    // Silently fail if storage is full or unavailable
  }
});

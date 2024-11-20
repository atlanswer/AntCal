import {
  createContext,
  untrack,
  useContext,
  type ParentComponent,
} from "solid-js";
import type { SetStoreFunction, Store, createStore } from "solid-js/store";
import { z } from "zod";

export const zSource = z.object({
  type: z.enum(["E", "M"]),
  direction: z.enum(["+X", "+Y", "+Z"]),
  amplitude: z.number().nonnegative(),
  phase: z.number().nonnegative().max(359),
  lpwl: z.number().nonnegative(),
});
export type Source = z.infer<typeof zSource>;

export const zCutPlane = z.enum(["XZ", "YZ", "XY"]);
export type CutPlane = z.infer<typeof zCutPlane>;

export const zViewPlaneConfig = z.object({
  cutPlane: z.array(zCutPlane),
  isDb: z.boolean(),
  isGainTotal: z.boolean(),
  sources: z.array(zSource),
});
export type ViewPlaneConfig = z.infer<typeof zViewPlaneConfig>;

export const zFigureConfig = zViewPlaneConfig.extend({ title: z.string() });
export type FigureConfig = z.infer<typeof zFigureConfig>;
export const zFigureConfigs = z.array(zFigureConfig);
export type FigureConfigs = z.infer<typeof zFigureConfigs>;

export const figureConfigsDefault = [
  {
    isDb: true,
    isGainTotal: false,
    sources: [
      { type: "E", direction: "+Y", amplitude: 1, phase: 0, lpwl: 0.5 },
      { type: "M", direction: "+X", amplitude: 1, phase: 0, lpwl: 0.5 },
    ],
    cutPlane: ["YZ", "XZ", "XY"],
    title: "ME-Dipole",
  },
  {
    isDb: true,
    isGainTotal: false,
    sources: [
      { type: "E", direction: "+Z", amplitude: 1, phase: 0, lpwl: 0.5 },
    ],
    cutPlane: ["YZ", "XZ", "XY"],
    title: "E-Dipole",
  },
  {
    isDb: true,
    isGainTotal: false,
    sources: [
      { type: "M", direction: "+Z", amplitude: 1, phase: 0, lpwl: 0.5 },
    ],
    cutPlane: ["YZ", "XZ", "XY"],
    title: "M-Dipole",
  },
] as const satisfies FigureConfigs;

const figureConfigsContext =
  createContext<ReturnType<typeof createStore<FigureConfigs>>>();

export const useFigureConfigs = (): ReturnType<
  typeof createStore<FigureConfigs>
> => {
  const context = useContext(figureConfigsContext);

  if (!context) {
    throw new Error("`figureConfigsContext` not provided.");
  }

  return context;
};

export const FigureConfigsProvider: ParentComponent<{
  figureConfigs: Store<FigureConfigs>;
  setFigureConfigs: SetStoreFunction<FigureConfigs>;
}> = (props) => {
  const figureConfigs = untrack(() => props.figureConfigs);
  const setFigureConfigs = untrack(() => props.setFigureConfigs);

  return (
    <figureConfigsContext.Provider value={[figureConfigs, setFigureConfigs]}>
      {props.children}
    </figureConfigsContext.Provider>
  );
};

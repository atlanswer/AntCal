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
  lpwl: z.number().nonnegative(),
  direction: z.enum(["+X", "+Y", "+Z"]),
  amplitude: z.number().nonnegative(),
  phase: z.number().nonnegative().max(359),
});
export type Source = z.infer<typeof zSource>;

export const zPlane = z.enum(["XZ", "YZ", "XY"]);
export type Plane = z.infer<typeof zPlane>;

export const zPlaneConf = z.object({
  sources: z.array(zSource),
  plane: zPlane,
  db: z.boolean(),
  gainTotal: z.boolean(),
  dbMin: z.number().default(10),
  dbMax: z.number().default(-30),
  linMin: z.number().default(0),
  axisStepDeg: z.number().default(1),
});
export type PlaneConf = z.infer<typeof zPlaneConf>;

export const zFigureConf = zPlaneConf
  .extend({ title: z.string() })
  .omit({ plane: true });
export type FigureConf = z.infer<typeof zFigureConf>;
export const zFigureArrayConf = z.array(zFigureConf);
export type FigureArrayConf = z.infer<typeof zFigureArrayConf>;

export const figureConfArrayDefault = [
  {
    title: "ME-Dipole",
    sources: [
      {
        type: "E",
        lpwl: 0.5,
        direction: "+Y",
        amplitude: 1,
        phase: 0,
      },
      {
        type: "M",
        lpwl: 0.5,
        direction: "+X",
        amplitude: 1,
        phase: 0,
      },
    ],
    db: true,
    gainTotal: false,
    dbMin: -30,
    dbMax: 10,
    linMin: 0,
    axisStepDeg: 1,
  },
  {
    title: "E-Dipole",
    sources: [
      {
        type: "E",
        lpwl: 0.5,
        direction: "+Z",
        amplitude: 1,
        phase: 0,
      },
    ],
    db: true,
    gainTotal: false,
    dbMin: -30,
    dbMax: 10,
    linMin: 0,
    axisStepDeg: 1,
  },
  {
    title: "M-Dipole",
    sources: [
      {
        type: "M",
        lpwl: 0.5,
        direction: "+Z",
        amplitude: 1,
        phase: 0,
      },
    ],
    db: true,
    gainTotal: false,
    dbMin: -30,
    dbMax: 10,
    linMin: 0,
    axisStepDeg: 1,
  },
] as const satisfies FigureArrayConf;

const figureArrayConfContext =
  createContext<ReturnType<typeof createStore<FigureArrayConf>>>();

export const useFigureArrayConf = (): ReturnType<
  typeof createStore<FigureArrayConf>
> => {
  const context = useContext(figureArrayConfContext);

  if (!context) {
    throw new Error("`figureArrayConfContext` not provided.");
  }

  return context;
};

export const FigureArrayConfProvider: ParentComponent<{
  figureArrayConf: Store<FigureArrayConf>;
  setFigureArrayConf: SetStoreFunction<FigureArrayConf>;
}> = (props) => {
  const figureArrayConf = untrack(() => props.figureArrayConf);
  const setFigureArrayConf = untrack(() => props.setFigureArrayConf);

  return (
    <figureArrayConfContext.Provider
      value={[figureArrayConf, setFigureArrayConf]}
    >
      {props.children}
    </figureArrayConfContext.Provider>
  );
};

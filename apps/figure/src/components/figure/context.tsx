// @refresh granular

import { z } from "zod";

export const zSource = z.object({
  type: z.enum(["E", "M"]),
  direction: z.enum(["X", "Y", "Z"]),
  amplitude: z.number().nonnegative(),
  phase: z.number().nonnegative().max(359),
});
export type Source = z.infer<typeof zSource>;

export const zCutPlane = z.enum(["XZ", "YZ", "XY"]);
export type CutPlane = z.infer<typeof zCutPlane>;

export const zViewPlaneConfig = z.object({
  cutPlane: zCutPlane,
  isDb: z.boolean(),
  isGainTotal: z.boolean(),
  sources: z.array(zSource),
});
export type ViewPlaneConfig = z.infer<typeof zViewPlaneConfig>;

export const zFigureConfig = zViewPlaneConfig
  .omit({ cutPlane: true })
  .extend({ title: z.string() });
export type FigureConfig = z.infer<typeof zFigureConfig>;
export const zFigureConfigs = z.array(zFigureConfig);
export type FigureConfigs = z.infer<typeof zFigureConfigs>;

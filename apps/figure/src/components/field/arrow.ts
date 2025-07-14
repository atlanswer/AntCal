import {
  addVec3,
  crossProdVec3,
  getUnitVec3,
  sclMulVec3,
  type Vec3,
} from "components/field/linearAlgebra";
import type * as d3d from "d3-3d";

const ARROW_SCALE = 0.04;
const ARROW_LEN = 0.724;
const ARROW_WID = 0.362;
const ARROW_INSET = 0.07;

export function createArrow(
  u: Vec3,
  scale: number,
  n: Vec3,
  rotArrowRad: number,
  align: "middle" | "start" | "end" = "middle",
  hasTail: boolean = true,
): d3d.Polygon3DInput {
  const v: Vec3 = [u[0] * scale, u[1] * scale, u[2] * scale];

  const [b1] = getUnitVec3(crossProdVec3(n, u));
  const [b2] = getUnitVec3(crossProdVec3(u, b1));

  const w = addVec3(
    sclMulVec3(b1, Math.cos(rotArrowRad) * scale),
    sclMulVec3(b2, Math.sin(rotArrowRad) * scale),
  );

  const p1: d3d.Point3DInput = {
    x: v[0] * ARROW_INSET,
    y: v[1] * ARROW_INSET,
    z: v[2] * ARROW_INSET,
  };
  const p2: d3d.Point3DInput = {
    x: (-w[0] * ARROW_WID) / 2,
    y: (-w[1] * ARROW_WID) / 2,
    z: (-w[2] * ARROW_WID) / 2,
  };
  const p3: d3d.Point3DInput = {
    x: v[0] * ARROW_LEN,
    y: v[1] * ARROW_LEN,
    z: v[2] * ARROW_LEN,
  };
  const p4: d3d.Point3DInput = {
    x: (w[0] * ARROW_WID) / 2,
    y: (w[1] * ARROW_WID) / 2,
    z: (w[2] * ARROW_WID) / 2,
  };

  return [p1, p2, p3, p4];
}

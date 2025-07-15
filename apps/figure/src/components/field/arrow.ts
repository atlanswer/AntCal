import {
  addVec3,
  crossProdVec3,
  getUnitVec3,
  sclMulVec3,
  type Vec3,
} from "components/field/linearAlgebra";
import type * as d3d from "d3-3d";

const ARROW_LEN = 0.724;
const ARROW_WID = 0.362;
const ARROW_INSET = 0.07;

export function createArrow(
  start: Vec3,
  unit: Vec3,
  scale: number,
  normal: Vec3,
  rotArrowRad: number,
  align: "middle" | "start" | "end" = "middle",
  hasTail: boolean = true,
): d3d.Polygon3DInput {
  const v: Vec3 = [unit[0] * scale, unit[1] * scale, unit[2] * scale];
  const ofsValues: { [key in typeof align]: number } = {
    start: 0.5,
    middle: 0,
    end: -1,
  };
  const ofs: Vec3 = sclMulVec3(v, ofsValues[align] * ARROW_LEN);

  const [b1] = getUnitVec3(crossProdVec3(normal, unit));
  const [b2] = getUnitVec3(crossProdVec3(unit, b1));

  const w = addVec3(
    sclMulVec3(b1, Math.cos(rotArrowRad) * scale),
    sclMulVec3(b2, Math.sin(rotArrowRad) * scale),
  );

  const p1: Vec3 = addVec3(addVec3(sclMulVec3(v, ARROW_INSET), start), ofs);
  const p2: Vec3 = addVec3(addVec3(sclMulVec3(w, -ARROW_WID / 2), start), ofs);
  const p3: Vec3 = addVec3(addVec3(sclMulVec3(v, ARROW_LEN), start), ofs);
  const p4: Vec3 = addVec3(addVec3(sclMulVec3(w, ARROW_WID / 2), start), ofs);

  const res: d3d.Polygon3DInput = [
    { x: p1[0], y: p1[1], z: p1[2] },
    { x: p2[0], y: p2[1], z: p2[2] },
    { x: p3[0], y: p3[1], z: p3[2] },
    { x: p4[0], y: p4[1], z: p4[2] },
  ];

  if (hasTail) {
    const p5 = p1;
    const p6: Vec3 = addVec3(
      addVec3(sclMulVec3(v, -ARROW_LEN / 2), start),
      ofs,
    );

    res.push(
      { x: p5[0], y: p5[1], z: p5[2] },
      { x: p6[0], y: p6[1], z: p6[2] },
    );
  }

  return res;
}

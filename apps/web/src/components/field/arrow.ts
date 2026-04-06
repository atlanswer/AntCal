import {
  addVec3,
  crossProdVec3,
  getUnitVec3,
  sclMulVec3,
  type Vec3,
} from "~/src/math/linearAlgebra";

type PlotPoint = {
  x: number;
  y: number;
  z: number;
};

type PlotPolygon = PlotPoint[];

const ARROW_LEN = 0.724;
const ARROW_WID = 0.362;
const ARROW_INSET = 0.07;
const ALIGN_OFFSETS = {
  start: 0.5,
  middle: 0,
  end: -1,
} as const;

function toPlotPoint([x, y, z]: Vec3): PlotPoint {
  return { x, y, z };
}

export function createArrow(
  start: Vec3,
  unit: Vec3,
  scale: number,
  normal: Vec3,
  rotArrowRad: number,
  align: "middle" | "start" | "end" = "middle",
  hasTail: boolean = true,
  tailLen: number = 0.5,
  tailWidth: number = 0.04,
): PlotPolygon {
  const v = sclMulVec3(unit, scale);
  const base = addVec3(start, sclMulVec3(v, ALIGN_OFFSETS[align] * ARROW_LEN));

  const [b1] = getUnitVec3(crossProdVec3(normal, unit));
  const [b2] = getUnitVec3(crossProdVec3(unit, b1));

  const widthVec = addVec3(
    sclMulVec3(b1, Math.cos(rotArrowRad) * scale),
    sclMulVec3(b2, Math.sin(rotArrowRad) * scale),
  );
  const headInset = sclMulVec3(v, ARROW_INSET);
  const headTip = sclMulVec3(v, ARROW_LEN);
  const headHalfWidth = sclMulVec3(widthVec, ARROW_WID / 2);
  const shaftHalfWidth = sclMulVec3(
    widthVec,
    Math.min(tailWidth, ARROW_WID) / 2,
  );

  const headBase = addVec3(base, headInset);
  const tip = addVec3(base, headTip);
  const headLeft = addVec3(base, sclMulVec3(headHalfWidth, -1));
  const headRight = addVec3(base, headHalfWidth);

  if (!hasTail || tailLen <= 0 || tailWidth <= 0) {
    return [
      toPlotPoint(headBase),
      toPlotPoint(headLeft),
      toPlotPoint(tip),
      toPlotPoint(headRight),
    ];
  }

  const tailBase = addVec3(base, sclMulVec3(v, -ARROW_LEN * tailLen));
  const tailLeft = addVec3(tailBase, sclMulVec3(shaftHalfWidth, -1));
  const shaftLeft = addVec3(headBase, sclMulVec3(shaftHalfWidth, -1));
  const shaftRight = addVec3(headBase, shaftHalfWidth);
  const tailRight = addVec3(tailBase, shaftHalfWidth);

  return [
    toPlotPoint(tailLeft),
    toPlotPoint(shaftLeft),
    toPlotPoint(headLeft),
    toPlotPoint(tip),
    toPlotPoint(headRight),
    toPlotPoint(shaftRight),
    toPlotPoint(tailRight),
  ];
}

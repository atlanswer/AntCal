export type Vec3 = [number, number, number];
export type Vec6 = [number, number, number, number, number, number];

export type Vec3Array = Vec3[];
export type Vec6Array = Vec6[];

export function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sclMulVec3(v: Vec3, a: number): Vec3 {
  return [v[0] * a, v[1] * a, v[2] * a];
}

export function getUnitVec3(v: Vec3): [u: Vec3, a: number] {
  const a = getVec3L2(v);
  const u: Vec3 = [v[0] / a, v[1] / a, v[2] / a];

  return [u, a];
}

export function getVec3L2(v: Vec3): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

export function getVec6L2(v: Vec6): number {
  return Math.sqrt(v[3] * v[3] + v[4] * v[4] + v[5] * v[5]);
}

export function crossProdVec3(a: Vec3, b: Vec3): Vec3 {
  const i = a[1] * b[2] - b[1] * a[2];
  const j = -(a[0] * b[2] - b[0] * a[2]);
  const k = a[0] * b[1] - b[0] * a[1];

  return [i, j, k];
}

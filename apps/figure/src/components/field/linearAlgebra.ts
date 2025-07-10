export type Vector3 = [number, number, number];
export type Vector6 = [number, number, number, number, number, number];

export type Vector6Array = Vector6[];

export function getVector3L2(v: Vector3): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

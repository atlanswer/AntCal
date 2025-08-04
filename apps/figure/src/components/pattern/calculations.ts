import type { Coordinate, Phasor } from "components/pattern/context";
import type { Vec3 } from "src/math/linearAlgebra";

export function unitVecTheta(coordinate: { theta: number; phi: number }): Vec3 {
  const { theta, phi } = coordinate;

  const x = Math.cos(theta) * Math.cos(phi);
  const y = Math.cos(theta) * Math.sin(phi);
  const z = -Math.sin(theta);

  return [x, y, z];
}

export function unitVecPhi(coordinate: { _: number; phi: number }): Vec3 {
  const { phi } = coordinate;

  const x = -Math.sin(phi);
  const y = Math.cos(phi);

  return [x, y, 0];
}

export function rotateCoordinate(
  v: Coordinate,
  theta0: number,
  phi0: number,
): Coordinate {
  const x =
    Math.cos(theta0) * Math.sin(v.theta) * Math.cos(v.phi - phi0) -
    Math.sin(theta0) * Math.cos(v.theta);
  const y = Math.sin(v.theta) * Math.sin(v.phi - phi0);
  let z =
    Math.sin(theta0) * Math.sin(v.theta) * Math.cos(v.phi - phi0) +
    Math.cos(theta0) * Math.cos(v.theta);

  z = z > 1 ? 1 : z;
  z = z < -1 ? -1 : z;

  const eps = 1e-10;

  return {
    theta: Math.acos(z),
    phi: Math.abs(x) < eps && Math.abs(y) < eps ? 0 : Math.atan2(y, x),
  };
}

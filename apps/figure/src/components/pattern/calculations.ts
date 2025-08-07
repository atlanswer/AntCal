import type { Coordinate } from "components/pattern/context";
import type { Phasor } from "src/math/phasor";
import type { Vec3 } from "src/math/linearAlgebra";

export function unitVecTheta(coordinate: Coordinate): Vec3 {
  const { theta, phi } = coordinate;

  const x = Math.cos(theta) * Math.cos(phi);
  const y = Math.cos(theta) * Math.sin(phi);
  const z = -Math.sin(theta);

  return [x, y, z];
}

export function unitVecPhi(coordinate: Coordinate): Vec3 {
  const { phi } = coordinate;

  const x = -Math.sin(phi);
  const y = Math.cos(phi);

  return [x, y, 0];
}

export function spherical2Cartesian(coordinate: Coordinate): Vec3 {
  const { theta, phi } = coordinate;

  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  return [x, y, z];
}

export function rollBackCoordinate(
  v: Coordinate,
  rotation: Coordinate,
): Coordinate {
  const theta0 = rotation.theta;
  const phi0 = rotation.phi;

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

export function rotateVec3(v: Vec3, rotation: Coordinate): Vec3 {
  const [x, y, z] = v;
  const theta0 = rotation.theta;
  const phi0 = rotation.phi;

  const xp =
    Math.cos(theta0) * Math.cos(phi0) * x +
    Math.sin(theta0) * Math.cos(phi0) * z -
    Math.sin(phi0) * y;
  const yp =
    Math.cos(theta0) * Math.sin(phi0) * x +
    Math.sin(theta0) * Math.sin(phi0) * z +
    Math.cos(phi0) * y;
  const zp = -Math.sin(theta0) * x + Math.cos(theta0) * z;

  return [xp, yp, zp];
}

export function rollbackVec3(v: Vec3, rotation: Coordinate): Vec3 {
  const [xp, yp, zp] = v;
  const theta0 = rotation.theta;
  const phi0 = rotation.phi;

  const x =
    Math.cos(theta0) * Math.cos(phi0) * xp +
    Math.cos(theta0) * Math.sin(phi0) * yp -
    Math.sin(theta0) * zp;
  const y = -Math.sin(phi0) * xp + Math.cos(phi0) * yp;
  const z =
    Math.sin(theta0) * Math.cos(phi0) * xp +
    Math.sin(theta0) * Math.sin(phi0) * yp +
    Math.cos(theta0) * zp;

  return [x, y, z];
}

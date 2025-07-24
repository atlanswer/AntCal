import type { Coordinate, Phasor } from "components/pattern/context";

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

export function verticalEDipole(
  L: number,
  theta: number,
  _: any = undefined,
): number {
  return (
    (Math.cos(Math.PI * L * Math.cos(theta)) - Math.cos(Math.PI * L)) /
    Math.sin(theta)
  );
}

export function verticalMDipole(theta: number, _: any): number {
  return 1;
}

import type { Coordinate, Phasor } from "components/pattern/context";

export function rotateCoordinate(
  v: Coordinate,
  theta0: number,
  phi0: number,
): Coordinate {
  return {
    theta: Math.acos(
      Math.sin(theta0) * Math.sin(v.theta) * Math.cos(v.phi - phi0) +
        Math.cos(theta0) * Math.cos(v.theta),
    ),
    phi: Math.atan2(
      Math.sin(v.theta) * Math.sin(v.phi - phi0),
      Math.cos(theta0) * Math.sin(v.theta) * Math.cos(v.phi - phi0) -
        Math.sin(theta0) * Math.cos(v.theta),
    ),
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

export function verticalMDipole(theta: number, _: any = undefined): number {
  return 1;
}

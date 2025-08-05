import type { Coordinate } from "components/pattern/context";

export function verticalEDipole(
  coordinate: Coordinate,
  L: number = 0.5,
): number {
  const { theta } = coordinate;

  const numerator =
    Math.cos(Math.PI * L * Math.cos(theta)) - Math.cos(Math.PI * L);
  const denominator = Math.sin(theta);

  return denominator === 0 ? 0 : numerator / denominator;
}

export function verticalMDipole(coordinate: Coordinate): number {
  const { theta } = coordinate;

  return Math.sin(theta);
}

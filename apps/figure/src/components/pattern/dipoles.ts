export function verticalEDipole(L: number, theta: number, _: any): number {
  return (
    (Math.cos(Math.PI * L * Math.cos(theta)) - Math.cos(Math.PI * L)) /
    Math.sin(theta)
  );
}

export function verticalMDipole(theta: number, _: any): number {
  return Math.sin(theta);
}

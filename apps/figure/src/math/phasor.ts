export type Phasor = [number, number];

export function addPhasor(a: Phasor, b: Phasor): Phasor {
  const [a1, theta1] = a;
  const [a2, theta2] = b;

  const x = a1 * Math.cos(theta1) + a2 * Math.cos(theta2);
  const y = a1 * Math.sin(theta1) + a2 * Math.sin(theta2);

  const a3 = Math.hypot(x, y);
  const theta3 = a3 === 0 ? 0 : Math.atan2(y, x);

  return [a3, theta3];
}

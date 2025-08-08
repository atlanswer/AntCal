export type Phasor = { amplitude: number; phase: number };

export function addPhasor(a: Phasor, b: Phasor): Phasor {
  const a1 = a.amplitude;
  const theta1 = a.phase;
  const a2 = b.amplitude;
  const theta2 = b.phase;

  const a3 = Math.sqrt(
    a1 * a1 + a2 * a2 + 2 * a1 * a2 * Math.cos(theta1 - theta2),
  );
  const theta3 = Math.atan2(
    a1 * Math.sin(theta1) + a2 * Math.sin(theta2),
    a1 * Math.cos(theta1) + a2 * Math.cos(theta2),
  );

  return { amplitude: a3, phase: theta3 };
}

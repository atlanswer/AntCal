import { describe, expect, test } from "bun:test";
import { addPhasor } from "src/math/phasor";

describe("Phasor", () => {
  describe("Addition", () => {
    test("0 + 0", () => {
      const { amplitude, phase } = addPhasor(
        { amplitude: 0, phase: 0 },
        { amplitude: 0, phase: 0 },
      );
      expect(amplitude).toBeCloseTo(0);
      expect(phase).toBeCloseTo(0);
    });
    test("1 + (-1))", () => {
      const { amplitude, phase } = addPhasor(
        { amplitude: 1, phase: 0 },
        { amplitude: 1, phase: Math.PI },
      );
      expect(amplitude).toBeCloseTo(0);
      expect(phase).toBeCloseTo(0);
    });
    test("i + (-i))", () => {
      const { amplitude, phase } = addPhasor(
        { amplitude: 1, phase: Math.PI / 2 },
        { amplitude: 1, phase: Math.PI / 2 + Math.PI },
      );
      expect(amplitude).toBeCloseTo(0);
      expect(phase).toBeCloseTo(-Math.PI / 2);
    });
    test("1 + i", () => {
      const { amplitude, phase } = addPhasor(
        { amplitude: 1, phase: 0 },
        { amplitude: 1, phase: Math.PI / 2 },
      );
      expect(amplitude).toBeCloseTo(Math.sqrt(2));
      expect(phase).toBeCloseTo(Math.PI / 4);
    });
    test("Vertical", () => {
      const { amplitude, phase } = addPhasor(
        { amplitude: 1, phase: Math.PI / 4 },
        { amplitude: 1, phase: (Math.PI / 4) * 3 },
      );
      expect(amplitude).toBeCloseTo(Math.sqrt(2));
      expect(phase).toBeCloseTo(Math.PI / 2);
    });
  });
});

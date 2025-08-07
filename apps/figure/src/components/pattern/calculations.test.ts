import { describe, expect, test } from "bun:test";
import {
  rollBackCoordinate,
  rollbackVec3,
  rotateVec3,
  unitVecTheta,
} from "components/pattern/calculations";
import type { Coordinate } from "components/pattern/contexts";
import type { Vec3 } from "src/math/linearAlgebra";

describe("Unit Vectors", () => {
  describe("Theta", () => {
    test("North Pole", () => {
      const [x, y, z] = unitVecTheta({ theta: 0, phi: 0 });
      expect(x).toBeCloseTo(1);
      expect(y).toBeCloseTo(0);
      expect(z).toBeCloseTo(0);
    });
    test("Front", () => {
      const [x, y, z] = unitVecTheta({ theta: 0.5 * Math.PI, phi: 0 });
      expect(x).toBeCloseTo(0);
      expect(y).toBeCloseTo(0);
      expect(z).toBeCloseTo(-1);
    });
    test("Front Half", () => {
      const [x, y, z] = unitVecTheta({ theta: 0.25 * Math.PI, phi: 0 });
      expect(x).toBeCloseTo(Math.sqrt(2) / 2);
      expect(y).toBeCloseTo(0);
      expect(z).toBeCloseTo(-Math.sqrt(2) / 2);
    });
  });
});

describe("Coordinate Rotation", () => {
  describe("No Rotation", () => {
    test("Case 1", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: 0 },
        { theta: 0, phi: 0 },
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(0);
    });
    test("Case 2", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 4, phi: Math.PI / 3 },
        { theta: 0, phi: 0 },
      );
      expect(theta).toBeCloseTo(Math.PI / 4);
      expect(phi).toBeCloseTo(Math.PI / 3);
    });
  });

  describe("Pure ϕ-Rotation", () => {
    test("Case 1", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: 0 },
        { theta: 0, phi: Math.PI / 2 },
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(-Math.PI / 2);
    });
    test("Case 2", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: Math.PI / 2 },
        { theta: 0, phi: Math.PI / 2 },
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(0);
    });
  });

  describe("Pure θ-Rotation", () => {
    test("Original North Pole", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: 0, phi: 0 },
        { theta: Math.PI / 2, phi: 0 },
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(Math.PI);
    });
    test("Test 2", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: 0 },
        { theta: Math.PI / 2, phi: 0 },
      );
      expect(theta).toBeCloseTo(0);
      expect(phi).toBeCloseTo(0);
    });
  });

  describe("Combined Rotation", () => {
    test("Original North Pole", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: 0, phi: 0 },
        { theta: Math.PI / 2, phi: Math.PI / 2 },
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(-Math.PI);
    });
    test("New North Pole", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: Math.PI / 2 },
        { theta: Math.PI / 2, phi: Math.PI / 2 },
      );
      expect(theta).toBeCloseTo(0);
      expect(phi).toBeCloseTo(0);
    });
  });

  describe("General Rotation", () => {
    test("Case 1", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: 0, phi: 0 },
        { theta: Math.PI / 3, phi: Math.PI / 4 },
      );
      expect(theta).toBeCloseTo(Math.PI / 3);
      expect(phi).toBeCloseTo(-Math.PI);
    });
    test("Case 2", () => {});
    test("Case 3", () => {});
  });
});

describe("Vec3 Rotation", () => {
  test("No rotation", () => {
    const [x, y, z] = rollbackVec3([1, 0, 0], { theta: 0, phi: 0 });
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("Pure phi rotation", () => {
    const [x, y, z] = rollbackVec3([0, 1, 0], { theta: 0, phi: Math.PI / 2 });
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("Pure theta rotation", () => {
    const [x, y, z] = rollbackVec3([0, 0, -1], { theta: Math.PI / 2, phi: 0 });
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("Combined rotation", () => {
    const [x, y, z] = rollbackVec3([0, 0, -1], {
      theta: Math.PI / 2,
      phi: Math.PI / 2,
    });
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("General Rotation", () => {
    const [x, y, z] = rollbackVec3(
      [Math.sqrt(2) / 4, Math.sqrt(2) / 4, -Math.sqrt(3) / 2],
      { theta: Math.PI / 3, phi: Math.PI / 4 },
    );
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("Back and forth", () => {
    const start: Vec3 = [1, 0, 0];
    const rotation: Coordinate = { theta: 0.25 * Math.PI, phi: 0 };
    const rollback = rollbackVec3(start, rotation);
    const [x, y, z] = rotateVec3(rollback, rotation);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
});

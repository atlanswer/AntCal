import { test, expect, describe } from "bun:test";
import {
  rollBackCoordinate,
  rollbackVec3,
} from "components/pattern/calculations";

describe("Coordinate Rotation", () => {
  describe("No Rotation", () => {
    test("Case 1", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: 0 },
        0,
        0,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(0);
    });
    test("Case 2", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 4, phi: Math.PI / 3 },
        0,
        0,
      );
      expect(theta).toBeCloseTo(Math.PI / 4);
      expect(phi).toBeCloseTo(Math.PI / 3);
    });
  });

  describe("Pure ϕ-Rotation", () => {
    test("Case 1", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: 0 },
        0,
        Math.PI / 2,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(-Math.PI / 2);
    });
    test("Case 2", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: Math.PI / 2 },
        0,
        Math.PI / 2,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(0);
    });
  });

  describe("Pure θ-Rotation", () => {
    test("Original North Pole", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: 0, phi: 0 },
        Math.PI / 2,
        0,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(Math.PI);
    });
    test("Test 2", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: 0 },
        Math.PI / 2,
        0,
      );
      expect(theta).toBeCloseTo(0);
      expect(phi).toBeCloseTo(0);
    });
  });

  describe("Combined Rotation", () => {
    test("Original North Pole", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: 0, phi: 0 },
        Math.PI / 2,
        Math.PI / 2,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(-Math.PI);
    });
    test("New North Pole", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: Math.PI / 2, phi: Math.PI / 2 },
        Math.PI / 2,
        Math.PI / 2,
      );
      expect(theta).toBeCloseTo(0);
      expect(phi).toBeCloseTo(0);
    });
  });

  describe("General Rotation", () => {
    test("Case 1", () => {
      const { theta, phi } = rollBackCoordinate(
        { theta: 0, phi: 0 },
        Math.PI / 3,
        Math.PI / 4,
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
    const [x, y, z] = rollbackVec3([1, 0, 0], 0, 0);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("Pure phi rotation", () => {
    const [x, y, z] = rollbackVec3([0, 1, 0], 0, Math.PI / 2);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("Pure theta rotation", () => {
    const [x, y, z] = rollbackVec3([0, 0, -1], Math.PI / 2, 0);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("Combined rotation", () => {
    const [x, y, z] = rollbackVec3([0, 0, -1], Math.PI / 2, Math.PI / 2);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
  test("General Rotation", () => {
    const [x, y, z] = rollbackVec3(
      [Math.sqrt(2) / 4, Math.sqrt(2) / 4, -Math.sqrt(3) / 2],
      Math.PI / 3,
      Math.PI / 4,
    );
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });
});

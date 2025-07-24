import { test, expect, describe } from "bun:test";
import { rotateCoordinate } from "components/pattern/calculations";

describe("Coordinate Rotation", () => {
  describe("No Rotation", () => {
    test("Test 1", () => {
      const { theta, phi } = rotateCoordinate(
        { theta: Math.PI / 2, phi: 0 },
        0,
        0,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(0);
    });
    test("Test 2", () => {
      const { theta, phi } = rotateCoordinate(
        { theta: Math.PI / 4, phi: Math.PI / 3 },
        0,
        0,
      );
      expect(theta).toBeCloseTo(Math.PI / 4);
      expect(phi).toBeCloseTo(Math.PI / 3);
    });
  });

  describe("Pure ϕ-Rotation", () => {
    test("Test 1", () => {
      const { theta, phi } = rotateCoordinate(
        { theta: Math.PI / 2, phi: 0 },
        0,
        Math.PI / 2,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(-Math.PI / 2);
    });
    test("Test 2", () => {
      const { theta, phi } = rotateCoordinate(
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
      const { theta, phi } = rotateCoordinate(
        { theta: 0, phi: 0 },
        Math.PI / 2,
        0,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(Math.PI);
    });
    test("Test 2", () => {
      const { theta, phi } = rotateCoordinate(
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
      const { theta, phi } = rotateCoordinate(
        { theta: 0, phi: 0 },
        Math.PI / 2,
        Math.PI / 2,
      );
      expect(theta).toBeCloseTo(Math.PI / 2);
      expect(phi).toBeCloseTo(-Math.PI);
    });
    test("New North Pole", () => {
      const { theta, phi } = rotateCoordinate(
        { theta: Math.PI / 2, phi: Math.PI / 2 },
        Math.PI / 2,
        Math.PI / 2,
      );
      expect(theta).toBeCloseTo(0);
      expect(phi).toBeCloseTo(0);
    });
  });
});

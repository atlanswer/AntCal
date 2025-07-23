import { test, expect, describe } from "bun:test";
import { rotateCoordinate } from "components/pattern/calculations";

describe("Coordinate Rotation", () => {
  test("No Rotation", () => {
    const { theta, phi } = rotateCoordinate(
      { theta: Math.PI / 2, phi: Math.PI / 3 },
      0,
      0,
    );
    expect(theta).toBeCloseTo(Math.PI / 2);
    expect(phi).toBeCloseTo(Math.PI / 3);
  });
  test("Original North Pole", () => {
    const { theta, phi } = rotateCoordinate(
      { theta: 0, phi: 0 },
      Math.PI / 3,
      Math.PI / 4,
    );
    expect(theta).toBeCloseTo(Math.PI / 3);
    expect(phi).toBeCloseTo(-Math.PI);
  });
  test("New North Pole", () => {
    const { theta, phi } = rotateCoordinate(
      { theta: Math.PI / 3, phi: Math.PI / 4 },
      Math.PI / 3,
      Math.PI / 4,
    );
    expect(theta).toBeCloseTo(0);
    expect(phi).toBeCloseTo(0);
  });
  test("Pure Longitude Rotation", () => {
    const { theta, phi } = rotateCoordinate(
      { theta: Math.PI / 2, phi: 0 },
      0,
      Math.PI / 2,
    );
    expect(theta).toBeCloseTo(Math.PI / 2);
    expect(phi).toBeCloseTo(-Math.PI / 2);
  });
  test("Original South Pole", () => {
    const { theta, phi } = rotateCoordinate(
      { theta: Math.PI, phi: 0 },
      Math.PI / 2,
      0,
    );
    expect(theta).toBeCloseTo(Math.PI / 2);
    expect(phi).toBeCloseTo(0);
  });
  test("New South Pole", () => {
    const { theta, phi } = rotateCoordinate(
      { theta: (Math.PI / 3) * 2, phi: (Math.PI / 4) * 5 },
      Math.PI / 3,
      Math.PI / 4,
    );
    expect(theta).toBeCloseTo(Math.PI);
    expect(phi).toBeCloseTo((Math.PI / 2) * 3);
  });
  test("Equator Point After 90° Tilt", () => {
    const { theta, phi } = rotateCoordinate(
      { theta: Math.PI / 2, phi: Math.PI / 2 },
      Math.PI / 2,
      0,
    );
    expect(theta).toBeCloseTo(Math.PI / 2);
    expect(phi).toBeCloseTo(Math.PI / 2);
  });
});

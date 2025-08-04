import { expect, test, describe } from "bun:test";
import type { Vec3 } from "src/math/linearAlgebra";
import { crossProdVec3 } from "src/math/linearAlgebra";

describe("Linear Algrbra", async () => {
  describe("Cross Product", () => {
    test("Example", () => {
      const a: Vec3 = [2, 3, 4];
      const b: Vec3 = [5, 6, 7];

      expect(crossProdVec3(a, b)).toEqual([-3, 6, -3]);
    });

    test("Right hand Catesian system", () => {
      const x: Vec3 = [1, 0, 0];
      const y: Vec3 = [0, 1, 0];
      const z: Vec3 = [0, -0, 1];

      expect(crossProdVec3(x, y)).toEqual(z);
    });

    test("Overlapping", () => {
      const a: Vec3 = [1, 0, 0];
      const b: Vec3 = [1, 0, 0];

      expect(crossProdVec3(a, b)).toEqual([0, -0, 0]);
    });
  });
});

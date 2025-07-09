import { parseFld } from "components/field/fldParser";
import { expect, test, describe } from "bun:test";

describe(".fld Parser", async () => {
  // const ExampleScalarGrid = await Bun.file(
  //   `C:\\Users\\Atlanswer\\OneDrive - 中山大学\\scalar_grid.fld`,
  // ).text();
  const ExampleVectorGrid = await Bun.file(
    `C:\\Users\\Atlanswer\\OneDrive - 中山大学\\vector_grid.fld`,
  ).text();
  // const ExampleVectorGeo = await Bun.file(
  //   `C:\\Users\\Atlanswer\\OneDrive - 中山大学\\vector_geo.fld`,
  // ).text();

  test("Vector Grid", () => {
    expect(parseFld(ExampleVectorGrid)).toBeArray();
  });
});

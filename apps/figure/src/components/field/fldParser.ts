import {
  type Vector6Array,
  type Vector6,
  getVector3L2,
} from "components/field/linearAlgebra";

function* genLines(text: string) {
  const lines = text.split("\n");
  for (const line of lines) {
    yield line;
  }
}

// function parseGridDimension(line: string) {}

// function parseDataDescription(line: string) {}

function parseElementNumber(line: string): number {
  const numPart = line.trim().split(" ").pop();
  return parseInt(numPart ?? "NaN");
}

function parseVector(line: string): Vector6 | undefined {
  const parsed = line
    .trim()
    .split(/\s+/)
    .map((s) => parseFloat(s));

  if (parsed.length !== 6 || parsed.some(Number.isNaN)) {
    return;
  }

  return parsed as Vector6;
}

export function parseFld(
  text: string,
): [Vector6Array, number, number, number, number, number, number, number] {
  const vField: Vector6Array = [];
  let xMin = Infinity,
    yMin = Infinity,
    zMin = Infinity,
    xMax = -Infinity,
    yMax = -Infinity,
    zMax = -Infinity,
    vMax = 0;

  for (const line of genLines(text)) {
    if (line.trim() === "") {
      continue;
    }
    if (line.startsWith("Grid Output")) {
      // parseGridDimension(line);
      continue;
    }
    if (line.includes(`"`)) {
      // parseDataDescription(line);
      continue;
    }
    if (line.startsWith("NumElems")) {
      parseElementNumber(line);
      continue;
    }
    if (/^-?\d/.test(line)) {
      const res = parseVector(line);
      if (res === undefined) {
        continue;
      }

      if (res[0] < xMin) {
        xMin = res[0];
      }
      if (res[0] > xMax) {
        xMax = res[0];
      }
      if (res[1] < yMin) {
        yMin = res[1];
      }
      if (res[1] > yMax) {
        yMax = res[1];
      }
      if (res[2] < zMin) {
        zMin = res[2];
      }
      if (res[2] > zMax) {
        zMax = res[2];
      }

      const vLen = getVector3L2([res[3], res[4], res[5]]);
      if (vLen > vMax) {
        vMax = vLen;
      }

      vField.push(res);
      continue;
    }

    console.error("Unrecognized line:");
    console.error(line);
  }

  return [
    vField,
    xMin,
    yMin,
    zMin,
    xMax - xMin,
    yMax - yMin,
    zMax - zMin,
    vMax,
  ];
}

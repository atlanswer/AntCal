import { setErrBadge } from "components/field/contexts";
import {
  type Vector6,
  type Vector6Array,
  getVector6L2,
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

  if (parsed.length !== 6) {
    setErrBadge({
      err: "Unexpected Vector Shape",
      detail: "Currently, only vectors with a length of 6 are supported.",
    });

    return;
  }

  if (parsed.length !== 6 || parsed.some(Number.isNaN)) return;

  return parsed as Vector6;
}

export function parseFld(text: string) {
  const vs: Vector6Array = [];
  const stats = {
    xMin: Infinity,
    yMin: Infinity,
    zMin: Infinity,
    xMax: -Infinity,
    yMax: -Infinity,
    zMax: -Infinity,
    xSpan: 0,
    ySpan: 0,
    zSpan: 0,
    vLenMin: Infinity,
    vLenMax: 0,
  };

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

      if (res[0] < stats.xMin) {
        stats.xMin = res[0];
      }
      if (res[0] > stats.xMax) {
        stats.xMax = res[0];
      }
      if (res[1] < stats.yMin) {
        stats.yMin = res[1];
      }
      if (res[1] > stats.yMax) {
        stats.yMax = res[1];
      }
      if (res[2] < stats.zMin) {
        stats.zMin = res[2];
      }
      if (res[2] > stats.zMax) {
        stats.zMax = res[2];
      }

      const vLen = getVector6L2(res);
      if (vLen > stats.vLenMax) {
        stats.vLenMax = vLen;
      }

      vs.push(res);

      continue;
    }

    console.error("Unrecognized line:");
    console.error(line);
  }

  return {
    vectors: vs,
    stats: stats,
  };
}

import { setErrBadge } from "components/field/contexts";
import {
  type Vec3,
  type Vec6,
  getUnitVec3,
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

function parseVector(line: string): Vec6 | undefined {
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

  return parsed as Vec6;
}

export function parseFld(text: string) {
  /** Vecter starting positions */
  const starts: Vec3[] = [];
  /** Unit vectors */
  const units: Vec3[] = [];
  /** Vector lengths */
  const lens: number[] = [];
  /** Vector stats */
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
      const v6 = parseVector(line);
      if (v6 === undefined) {
        continue;
      }

      // Fix for right handed system
      const temp1 = v6[1];
      v6[1] = v6[0];
      v6[0] = temp1;
      const temp2 = v6[4];
      v6[4] = v6[3];
      v6[3] = temp2;

      if (v6[0] < stats.xMin) {
        stats.xMin = v6[0];
      }
      if (v6[0] > stats.xMax) {
        stats.xMax = v6[0];
      }
      if (v6[1] < stats.yMin) {
        stats.yMin = v6[1];
      }
      if (v6[1] > stats.yMax) {
        stats.yMax = v6[1];
      }
      if (v6[2] < stats.zMin) {
        stats.zMin = v6[2];
      }
      if (v6[2] > stats.zMax) {
        stats.zMax = v6[2];
      }

      const start: Vec3 = [v6[0], v6[1], v6[2]];
      const v3: Vec3 = [v6[3], v6[4], v6[5]];
      const [unit, len] = getUnitVec3(v3);

      if (len < stats.vLenMin) {
        stats.vLenMin = len;
      }
      if (len > stats.vLenMax) {
        stats.vLenMax = len;
      }

      starts.push(start);
      units.push(unit);
      lens.push(len);

      continue;
    }

    console.error("Unrecognized line:");
    console.error(line);
  }

  stats.xSpan = stats.xMax - stats.xMin;
  stats.ySpan = stats.yMax - stats.yMin;
  stats.zSpan = stats.zMax - stats.zMin;

  const xStart = -stats.xSpan / 2;
  const yStart = -stats.ySpan / 2;
  const zStart = -stats.zSpan / 2;

  // Normalize staring positions
  for (let i = 0; i < starts.length; i++) {
    const s = starts[i]!;
    s[0] = xStart + s[0] - stats.xMin;
    s[1] = yStart + s[1] - stats.yMin;
    s[2] = zStart + s[2] - stats.zMin;
    starts[i] = s;
  }

  return {
    starts,
    units,
    lens,
    stats,
  };
}

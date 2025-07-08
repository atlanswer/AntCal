type ScalarArray = { x: number; y: number; z: number; value: number }[];
type VectorArray = {
  x: number;
  y: number;
  z: number;
  u: number;
  v: number;
  w: number;
}[];

function* genLines(text: string) {
  const lines = text.split("\n");
  for (const line of lines) {
    yield line;
  }
}

function parseGridDimension(line: string) {}

function parseDataDescription(line: string) {}

function parseElementNumber(line: string): number {
  const numPart = line.trim().split(" ").pop();
  return parseInt(numPart ?? "NaN");
}

export function parseFld(text: string) {
  for (const line of genLines(text)) {
    if (line.startsWith("Grid Output")) {
      parseGridDimension(line);
      continue;
    }
    if (line.includes(`"`)) {
      parseDataDescription(line);
    }
    if (line.startsWith("NumElems")) {
      parseElementNumber(line);
    }

    console.error("Unrecognized lines:");
    console.log(line);
  }
}

function* genLines(text: string) {
  const lines = text.split("\n");
  for (const line of lines) {
    yield line;
  }
}

function parseGridInfo(line: string) {}

export function parseFld(text: string) {
  for (const line of genLines(text)) {
    if (line.startsWith("Grid Output")) {
      parseGridInfo(line);
    }
  }
}

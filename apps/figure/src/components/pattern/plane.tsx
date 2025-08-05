import { configs } from "components/pattern/context";
import type { Coordinate } from "components/pattern/context";
import { createEffect } from "solid-js";
import * as d3 from "d3";
import { verticalEDipole, verticalMDipole } from "components/pattern/dipoles";
import type { Accessor } from "solid-js";

export default function (props: {
  cIdx: Accessor<number>;
  title: string;
  points: Coordinate[];
}) {
  let svgRef: SVGSVGElement | undefined;

  const DPI = 72;
  const widthIn = 3.5 / 2;
  const heightIn = 3.5 / 2;
  const width = widthIn * DPI;
  const height = heightIn * DPI;
  const padding = 10;
  const rMax = width / 2 - padding;

  const sources = () => configs[props.cIdx()];
  const source = () => sources()![0];
  const eField = () => {
    switch (source()?.type) {
      case "J":
        return props.points.map((point) =>
          verticalEDipole(point, source()?.length),
        );
      case "M":
        return props.points.map((point) => verticalMDipole(point));
      default:
        throw new Error(`Unknown source type: ${source()?.type}`);
    }
  };
  const radiation = () => {
    const e = eField();
    return e.map((d) => d * d);
  };
  const traceData: () => [number, number][] = () =>
    radiation().map((d, i) => [(i / 180) * Math.PI, d * rMax]);

  function draw() {
    const svg = d3.select(svgRef!);

    const grid = svg
      .selectAll("g.grid")
      .data([null])
      .join("g")
      .classed("grid", true)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

    // Circle grid
    const cg = grid
      .selectAll("g.circle")
      .data([null])
      .join("g")
      .classed("circle", true);
    cg.selectAll("circle")
      .data(d3.range(5).map((d) => (d / 4) * rMax))
      .join("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (data) => data)
      .attr("fill", "none")
      .attr("stroke", "oklch(55.6% 0 0)")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2");
    // Angle grid
    const ag = grid
      .selectAll("g.angle")
      .data([null])
      .join("g")
      .classed("angle", true);
    const angleLine = d3.lineRadial();
    ag.selectAll("path")
      .data(d3.range(8).map((d) => (d * Math.PI) / 4))
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "oklch(55.6% 0 0)")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2")
      .attr("d", (d) =>
        angleLine([
          [0, 0],
          [d, rMax],
        ]),
      );

    // Traces
    const tg = svg
      .selectAll("g.traces")
      .data([null])
      .join("g")
      .classed("traces", true);
    tg.selectAll("path")
      .data([traceData()])
      .join("path")
      .attr("fill", "none")
      .attr("stroke", d3.schemeCategory10[0]!)
      .attr("stroke-width", 1)
      .attr("d", angleLine);
  }

  createEffect(() => draw());

  return (
    <div>
      <p>{props.title}</p>
      <div class="rounded outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
          viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          class="h-full w-full"
        ></svg>
      </div>
    </div>
  );
}

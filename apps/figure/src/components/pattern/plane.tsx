import { configs } from "components/pattern/context";
import type { Coordinate } from "components/pattern/context";
import { createEffect } from "solid-js";
import * as d3 from "d3";

export default function (props: { title: string; points: Coordinate[] }) {
  let svgRef: SVGSVGElement | undefined;

  const DPI = 72;
  const widthIn = 3.5 / 2;
  const heightIn = 3.5 / 2;
  const width = widthIn * DPI;
  const height = heightIn * DPI;

  function draw() {
    const svg = d3.select(svgRef!);

    const grid = svg
      .selectAll("g.grid")
      .data([null])
      .join("g")
      .classed("grid", true)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

    // Radial grid
    // Spherical grid
    grid.selectAll("g.r").data([null]).join("g").classed("r", true);
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

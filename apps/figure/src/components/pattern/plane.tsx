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
  const padding = 10;

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
      .data(d3.range(5).map((d) => (d / 4) * (width / 2 - padding)))
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
          [d, width / 2 - padding],
        ]),
      );
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

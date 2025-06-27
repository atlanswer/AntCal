import { onMount } from "solid-js";
import * as d3 from "d3";
import * as d3d from "d3-3d";

export default function Field() {
  let svgRef: SVGSVGElement | undefined;

  const DPI = 72;
  const width = DPI * 3.5;
  const height = DPI * 3.5;
  const scale = 30;

  const origin: d3d.Coordinate2D = { x: width / 2, y: height / 2 };
  const rotateX = Math.PI / 4;
  const rotateY = 0;
  const rotateZ = Math.PI / 4;

  const points3d = d3d
    .points3D()
    .origin(origin)
    .scale(scale)
    .rotateX(rotateX)
    .rotateY(rotateY)
    .rotateZ(rotateZ);
  const axes = d3d
    .lineStrips3D()
    .origin(origin)
    .scale(scale)
    .rotateX(rotateX)
    .rotateY(rotateY)
    .rotateZ(rotateZ);

  const points: d3d.Point3DInput[] = [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
  ];
  const pointsData = points3d(points);

  const xTicks: d3d.Point3DInput[] = d3
    .range(6)
    .map((x) => ({ x: x, y: 0, z: 0 }));
  const yTicks: d3d.Point3DInput[] = d3
    .range(6)
    .map((y) => ({ x: 0, y: y, z: 0 }));
  const zTicks: d3d.Point3DInput[] = d3
    .range(6)
    .map((z) => ({ x: 0, y: 0, z: z }));
  const ticks = [xTicks, yTicks, zTicks];
  // @ts-expect-error
  const axesData = axes(ticks);

  function draw() {
    const svg = d3.select(svgRef!);

    const axesGroup = svg.append("g");
    axesGroup
      .selectAll("path")
      .data(axesData)
      .join("path") // @ts-expect-error
      .attr("d", axes.draw)
      .attr("class", "stroke-black dark:stroke-white");
    axesGroup
      .selectAll("g")
      .data(axesData)
      .join("g")
      .selectAll("text")
      .data((d) => d)
      .join("text")
      .attr("class", "fill-black dark:fill-white")
      // @ts-expect-error
      .attr("x", (d) => d.projected.x)
      // @ts-expect-error
      .attr("y", (d) => d.projected.y)
      .text((d) => {
        // @ts-expect-error
        return Math.max(d.x, d.y, d.z);
      });

    svg
      .append("g")
      .selectAll("circle")
      .data(pointsData)
      .join("circle")
      .attr("cx", (d) => d.projected.x)
      .attr("cy", (d) => d.projected.y)
      .attr("r", 3)
      .attr("class", "fill-blue-500");
  }

  onMount(() => draw());

  return (
    <div class="w-1/2 rounded outline">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        class="h-full w-full"
      />
    </div>
  );
}

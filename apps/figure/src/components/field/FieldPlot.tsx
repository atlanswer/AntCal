import * as d3 from "d3";
import * as d3d from "d3-3d";
import { createEffect, createSignal, createUniqueId, onMount } from "solid-js";

export default function Field() {
  let svgRef: SVGSVGElement | undefined;

  const DPI = 72;
  const width = DPI * 3.5;
  const height = DPI * 3.5;

  const origin: d3d.Coordinate2D = { x: width / 2, y: height / 2 };
  const scaleInputId = createUniqueId();
  const [scale, setScale] = createSignal(30);
  const [rotateX, setRotateX] = createSignal(Math.PI / 4);
  const [rotateY, setRotateY] = createSignal(0);
  const [rotateZ, setRotateZ] = createSignal(Math.PI / 4);

  const sensitivity = Math.PI / 230;

  const points3d = d3d.points3D().origin(origin);
  const axes = d3d.lineStrips3D().origin(origin);

  const points: d3d.Point3DInput[] = [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
  ];

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

  function draw() {
    const pointsData = points3d
      .scale(scale())
      .rotateX(rotateX())
      .rotateY(rotateY())
      .rotateZ(rotateZ())(points);

    const axesData = axes
      .scale(scale())
      .rotateX(rotateX())
      .rotateY(rotateY())
      // @ts-expect-error
      .rotateZ(rotateZ())(ticks);

    const svg = d3.select(svgRef!);

    const axesGroup = svg
      .selectAll("g.axes-group")
      .data([null])
      .join("g")
      .attr("class", "axes-group");
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
      .selectAll("g.points-group")
      .data([null])
      .join("g")
      .attr("class", "points-group")
      .selectAll("circle")
      .data(pointsData)
      .join("circle")
      .attr("cx", (d) => d.projected.x)
      .attr("cy", (d) => d.projected.y)
      .attr("r", 3)
      .attr("class", "fill-blue-500");
  }

  const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", ({ transform }) => {
    setScale(transform.k);
  });

  createEffect(() => {
    d3.select(svgRef!).call(zoom.scaleTo, scale());
  });

  onMount(() => {
    d3.select(svgRef!).call(zoom);
  });

  createEffect(() => draw());

  return (
    <>
      <div>
        <label for={scaleInputId}>Scale: </label>
        <input
          type="number"
          required
          id={scaleInputId}
          name="Scale"
          min="1"
          value={scale()}
          onChange={(event) => {
            setScale(event.target.valueAsNumber);
          }}
        />
      </div>
      <div class="w-full max-w-xl rounded bg-white outline dark:bg-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          class="h-full w-full"
        />
      </div>
    </>
  );
}

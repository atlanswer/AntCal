import { createArrow } from "components/field/arrow";
import { rainbowDark } from "components/field/colorScheme";
import { errBadge, setErrBadge, setFilename } from "components/field/contexts";
import { parseFld } from "components/field/fldParser";
import { type Vec3 } from "components/field/linearAlgebra";
import SVGDownload from "components/field/SVGDownload";
import * as d3 from "d3";
import * as d3d from "d3-3d";
import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";

const startsDefault: Vec3[] = [];
const unitsDefault: Vec3[] = [];
const lensDefault: number[] = [];

for (let i = -4; i <= 4; i++) {
  for (let j = -4; j <= 4; j++) {
    for (let k = -1; k <= 1; k++) {
      startsDefault.push([i, j, k]);
      unitsDefault.push([
        Math.sin(((i / 4) * Math.PI) / 2),
        Math.sin(((j / 4) * Math.PI) / 2),
        1,
      ]);
      lensDefault.push(
        Math.cos(
          (((Math.abs(i) * Math.abs(i) + Math.abs(j) * Math.abs(j)) / 20) *
            Math.PI) /
            2,
        ),
      );
    }
  }
}

const [starts, setStarts] = createSignal<Vec3[]>(startsDefault);
const [units, setUnits] = createSignal<Vec3[]>(unitsDefault);
const [lens, setLens] = createSignal<number[]>(lensDefault);

const [stats, setStats] = createStore({
  xSpan: 8,
  ySpan: 8,
  zSpan: 6,
  vLenMin: 0,
  vLenMax: 1,
});

export default function Field() {
  let svgRef: SVGSVGElement | undefined;

  const DPI = 72;
  /** Figure width is fixed to 3.5 in */
  const widthInPoints = DPI * 3.5;
  const [height, setHeight] = createSignal(3.5);
  const heightInPoints = () => height() * DPI;
  const origin: () => d3d.Coordinate2D = () => ({
    x: widthInPoints / 2,
    y: heightInPoints() / 2,
  });

  let defaultScale = 30;
  const [scale, setScale] = createSignal(defaultScale);

  const rotXDefault = Math.atan(Math.sqrt(2)) / Math.PI;
  const rotZDefault = 1 / 4;
  const [rotX, setRotX] = createSignal(rotXDefault);
  const rotXRad = () => rotX() * Math.PI;
  const [rotY, _] = createSignal(0);
  const rotYRad = () => rotY() * Math.PI;
  const [rotZ, setRotZ] = createSignal(rotZDefault);
  const rotZRad = () => rotZ() * Math.PI;

  let defaultZoomSens = 10;
  const [zoomSens, setZoomSens] = createSignal(defaultZoomSens);
  const rotSens = 1 / 180;
  const [rotArrow, setRotArrow] = createSignal(0);
  const rotArrowRad = () => rotArrow() * Math.PI;
  const [vScale, setVScale] = createSignal(1);

  const [axesEnabled, setAxesEnabled] = createSignal(true);
  const [arrowTail, setArrowTail] = createSignal(true);
  const [arrowAlign, setArrowAlign] = createSignal<"start" | "middle" | "end">(
    "middle",
  );
  const [mapSize, setMapSize] = createSignal(true);
  const [arrowTailLen, setArrowTailLen] = createSignal(0.5);

  const [vLenMin, setVLenMin] = createSignal(0);
  const [vLenMax, setVLenMax] = createSignal(0);

  // Set proper scale and zoom sensitivity
  createEffect(() => {
    const spanMax = Math.max(stats.xSpan, stats.ySpan, stats.zSpan);
    const newScale = Math.floor((widthInPoints / spanMax) * 0.9);
    setScale(newScale);
    defaultScale = newScale;
    setZoomSens(Math.floor(newScale / 3));
    defaultZoomSens = 10;
  });

  // Set vector length scale
  createEffect(() => {
    if (starts().length < 2) return;
    const v0 = starts()[0]!;
    const v1 = starts()[1]!;
    const diff = Math.max(
      Math.abs(v1[0] - v0[0]),
      Math.abs(v1[1] - v0[1]),
      Math.abs(v1[2] - v0[2]),
    );
    setVScale(diff / stats.vLenMax);
  });

  // Update vector length range
  createEffect(() => setVLenMin(stats.vLenMin));
  createEffect(() => setVLenMax(stats.vLenMax));

  const viewX = () => Math.sin(rotZRad()) * Math.sin(rotXRad());
  const viewY = () => Math.cos(rotZRad()) * Math.sin(rotXRad());
  const viewZ = () => Math.cos(rotXRad());
  /** Unit vector that is the normal vector of the screen */
  const vView = () => [viewX(), viewY(), viewZ()] as Vec3;

  const polygons: () => {
    arrows: d3d.Polygon3DInput[];
    tails: d3d.Point3DInput[][];
  } = createMemo(() => {
    const arrows: d3d.Polygon3DInput[] = [];
    const tails: d3d.Point3DInput[][] = [];

    for (let i = 0; i < starts().length; i++) {
      let len = mapSize() ? lens()[i]! : (vLenMax() + vLenMin()) / 2;
      len = len < vLenMin() ? vLenMin() : len;
      len = len > vLenMax() ? vLenMax() : len;

      const [arrow, tail] = createArrow(
        starts()[i]!,
        units()[i]!,
        len * vScale(),
        vView(),
        rotArrowRad(),
        arrowAlign(),
        arrowTail(),
        arrowTailLen(),
      );

      arrows.push(arrow);
      if (tail) {
        tails.push(tail);
      }
    }
    return { arrows, tails };
  });

  const xAxisRange = () => d3.nice(-stats.xSpan / 2, stats.xSpan / 2, 5);
  const xAxisTicks: () => d3d.Point3DInput[] = () =>
    d3.ticks(...xAxisRange(), 5).map((x) => ({ x: x, y: 0, z: 0 }));
  const yAxisRange = () => d3.nice(-stats.ySpan / 2, stats.ySpan / 2, 5);
  const yAxisTicks: () => d3d.Point3DInput[] = () =>
    d3.ticks(...yAxisRange(), 5).map((y) => ({ x: 0, y: y, z: 0 }));
  const zAxisRange = () => d3.nice(-stats.zSpan / 2, stats.zSpan / 2, 5);
  const zAxisTicks: () => d3d.Point3DInput[] = () =>
    d3.ticks(...zAxisRange(), 5).map((z) => ({ x: 0, y: 0, z: z }));

  const f = d3.format(".2s");

  const line3d = d3d.lines3D();
  const poly3d = d3d.polygons3D();
  const axis3d = d3d.lineStrips3D();

  function draw() {
    const { arrows, tails } = polygons();

    const arrowsData = poly3d
      .origin(origin())
      .scale(scale())
      .rotateX(rotXRad())
      .rotateY(rotYRad())
      .rotateZ(rotZRad())(arrows);

    const tailsData = line3d
      .origin(origin())
      .scale(scale())
      .rotateX(rotXRad())
      .rotateY(rotYRad())
      // @ts-expect-error
      .rotateZ(rotZRad())(tails);

    const axesData = axis3d
      .origin(origin())
      .scale(scale())
      .rotateX(rotXRad())
      .rotateY(rotYRad())
      .rotateZ(rotZRad())([
      // @ts-expect-error
      xAxisTicks(),
      // @ts-expect-error
      yAxisTicks(),
      // @ts-expect-error
      zAxisTicks(),
    ]) as unknown as [d3d.Point3D[], d3d.Point3D[], d3d.Point3D[]];

    const g = d3.select(svgRef!).selectAll("g").data([null]).join("g");

    // Axes
    g.selectAll("path.x-axis")
      .data(axesEnabled() ? axesData : [])
      .join("path")
      .classed("x-axis", true)
      // @ts-expect-error
      .attr("d", axis3d.draw)
      .attr("stroke", "black")
      .attr("stroke-width", 0.2)
      .classed("stroke-black dark:stroke-white", true)
      .classed("d3-3d", true);

    const axisEnds = axesData.map((axis) => axis.at(-1)!);

    // Axis end text
    g.selectAll("text.axis-text")
      .data(axesEnabled() ? axisEnds : [])
      .join("text")
      .classed("axis-text", true)
      .attr("font-family", "Times New Roman")
      .attr("font-style", "italic")
      .attr("font-size", "10pt")
      .attr("dominant-baseline", "middle")
      .classed("fill-black dark:fill-white", true)
      .attr("x", (d) => d.projected.x)
      .attr("y", (d) => d.projected.y)
      .text(
        (d) =>
          ({ x: "y", y: "x", z: "z" })[
            (["x", "y", "z"] as const).find((k) => d[k] !== 0)!
          ],
      );

    // Axis ticks
    g.selectAll("g.axis-ticks")
      .data(axesEnabled() ? axesData : [])
      .join("g")
      .classed("axis-ticks", true)
      .selectAll("text.axis-ticks")
      .data((d) => d.slice(0, -1))
      .join("text")
      .classed("axis-ticks", true)
      .attr("x", (d) => d.projected.x)
      .attr("y", (d) => d.projected.y)
      .attr("font-family", "Arial")
      .attr("font-size", "4pt")
      .classed("fill-black dark:fill-white", true)
      .text((d) => f([d.x, d.y, d.z].find((v) => v !== 0) ?? 0));

    // Vector arrows
    g.selectAll("path.arrow")
      .data(arrowsData)
      .join("path")
      .classed("arrow", true)
      // @ts-expect-error
      .attr("d", poly3d.draw)
      .attr("fill", mapColor)
      .classed("d3-3d", true);

    // Vector tails
    g.selectAll("line.tail")
      .data(tailsData)
      .join("line")
      .classed("tail", true)
      .attr("x1", (d) => (d as unknown as d3d.Point3D[])[0]!.projected.x)
      .attr("y1", (d) => (d as unknown as d3d.Point3D[])[0]!.projected.y)
      .attr("x2", (d) => (d as unknown as d3d.Point3D[])[1]!.projected.x)
      .attr("y2", (d) => (d as unknown as d3d.Point3D[])[1]!.projected.y)
      .attr("stroke", mapColor)
      .classed("d3-3d", true);

    // @ts-expect-error
    g.selectAll(".d3-3d").sort(poly3d.sort);

    // Colorbar
    const colorbar = g
      .selectAll("g.colorbar")
      .data([null])
      .join("g")
      .classed("colorbar", true);
    colorbar
      .selectAll("rect")
      .data([null])
      .join("rect")
      .attr("preserveAspectRatio", "none")
      .attr("x", widthInPoints / 2 - 72 / 2)
      .attr("y", heightInPoints() - 5 - 8)
      .attr("width", 72)
      .attr("height", 8)
      .attr("fill", "url(#mathematica-rainbow-dark)");
    colorbar
      .selectAll("text")
      .data([vLenMin(), vLenMax()])
      .join("text")
      .attr("x", (_, i) => widthInPoints / 2 + 72 * (i - 0.5))
      .attr("y", heightInPoints() - 5 - 8 - 2)
      .attr("text-anchor", "middle")
      .attr("font-family", "Arial")
      .attr("font-size", "4pt")
      .classed("fill-black dark:fill-white", true)
      .text((d) => d);
  }

  function mapColor(_: any, i: number): string {
    const len = lens()[i]!;
    let diff = len - vLenMin();
    diff = diff < 0 ? 0 : diff;

    const step = (vLenMax() - vLenMin()) / 30;
    let idx = Math.floor(diff / step);
    idx = idx > 29 ? 29 : idx;

    return rainbowDark[idx]!;
  }

  // Redraw
  createEffect(() => draw());

  // Pan and zoom
  const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", function (event) {
    batch(() => {
      // Prevent recursion
      if (d3.zoomTransform(svgRef!) === d3.zoomIdentity) return;
      if (!event.sourceEvent) return;

      const { transform } = event;

      switch (event.sourceEvent.type) {
        case "wheel":
          setScale((prev) =>
            parseFloat((prev + (transform.k - 1) * zoomSens()).toFixed(3)),
          );
          break;
        case "mousemove":
          setRotZ((prev) =>
            parseFloat((prev - transform.x * rotSens).toFixed(8)),
          );
          setRotX((prev) =>
            parseFloat((prev - transform.y * rotSens).toFixed(8)),
          );
          break;
        case "touchmove":
          if (transform.k === 1) {
            // Pan
            setRotZ((prev) =>
              parseFloat((prev - transform.x * rotSens).toFixed(8)),
            );
            setRotX((prev) =>
              parseFloat((prev - transform.y * rotSens).toFixed(8)),
            );
          } else {
            // Zoom
            setScale((prev) =>
              parseFloat((prev + (transform.k - 1) * zoomSens()).toFixed(3)),
            );
          }
          break;
      }

      // Reset all
      d3.select(svgRef!).call(zoom.transform, d3.zoomIdentity);
    });
  });

  onMount(() => {
    const svg = d3.select(svgRef!);
    svg.call(zoom).on("dblclick.zoom", () =>
      batch(() => {
        setScale(defaultScale);
        setRotX(rotXDefault);
        setRotZ(rotZDefault);
        // Reset all
        d3.select(svgRef!).call(zoom.transform, d3.zoomIdentity);
      }),
    );
  });

  return (
    <>
      <FileUpload />
      <ErrorBadge />
      <div class="flex max-w-3xl flex-wrap justify-center gap-4 *:rounded *:bg-neutral-300 *:px-2 *:font-mono *:text-sm *:leading-relaxed *:dark:bg-neutral-500">
        <span>Figure Width: 3.5 in</span>
        <span>DPI: {DPI}</span>
        <span>#Vectors: {lens().length === 0 ? "-" : lens().length}</span>
        <span>
          Min Vector Len: {stats.vLenMin === -1 ? "-" : stats.vLenMin}
        </span>
        <span>
          Max Vector Len: {stats.vLenMax === -1 ? "-" : stats.vLenMax}
        </span>
        <span>X span: {stats.xSpan === 0 ? "-" : stats.xSpan} m</span>
        <span>Y span: {stats.ySpan === 0 ? "-" : stats.ySpan} m</span>
        <span>Z span: {stats.zSpan === 0 ? "-" : stats.zSpan} m</span>
      </div>
      <div class="grid w-full max-w-3xl grid-cols-1 grid-rows-1 rounded bg-white outline dark:bg-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
          viewBox={`0 0 ${widthInPoints} ${heightInPoints()}`}
          preserveAspectRatio="xMidYMid meet"
          class="col-start-1 row-start-1 h-full w-full"
        >
          <defs>
            <linearGradient
              id="mathematica-rainbow"
              x1="0"
              x2="1"
              y1="0"
              y2="0"
            >
              <stop offset="0%" stop-color="#781b86" />
              <stop offset="3.448%" stop-color="#641c97" />
              <stop offset="6.896%" stop-color="#4e21ac" />
              <stop offset="10.344%" stop-color="#462eba" />
              <stop offset="13.793%" stop-color="#3f40c6" />
              <stop offset="17.241%" stop-color="#3e52cd" />
              <stop offset="20.689%" stop-color="#4066cf" />
              <stop offset="24.137%" stop-color="#4377cd" />
              <stop offset="27.586%" stop-color="#4886c7" />
              <stop offset="31.034%" stop-color="#4d94bd" />
              <stop offset="34.482%" stop-color="#559eb1" />
              <stop offset="37.931%" stop-color="#5da8a3" />
              <stop offset="41.379%" stop-color="#67ae95" />
              <stop offset="44.827%" stop-color="#72b585" />
              <stop offset="48.275%" stop-color="#7cb878" />
              <stop offset="51.724%" stop-color="#8bbb6a" />
              <stop offset="55.172%" stop-color="#96bd60" />
              <stop offset="58.620%" stop-color="#a5be55" />
              <stop offset="62.068%" stop-color="#b2be4d" />
              <stop offset="65.517%" stop-color="#c0bb47" />
              <stop offset="68.965%" stop-color="#ccb842" />
              <stop offset="72.413%" stop-color="#d6b03e" />
              <stop offset="75.862%" stop-color="#dea83b" />
              <stop offset="79.310%" stop-color="#e39b39" />
              <stop offset="82.758%" stop-color="#e68b35" />
              <stop offset="86.206%" stop-color="#e77a32" />
              <stop offset="89.655%" stop-color="#e4632d" />
              <stop offset="93.103%" stop-color="#e14e2a" />
              <stop offset="96.551%" stop-color="#de3525" />
              <stop offset="100%" stop-color="#db2121" />
            </linearGradient>
            <linearGradient
              id="mathematica-rainbow-dark"
              x1="0"
              x2="1"
              y1="0"
              y2="0"
            >
              <stop offset="0%" stop-color="#3c5793" />
              <stop offset="3.448%" stop-color="#3e5791" />
              <stop offset="6.896%" stop-color="#3f5790" />
              <stop offset="10.344%" stop-color="#40588e" />
              <stop offset="13.793%" stop-color="#425f7e" />
              <stop offset="17.241%" stop-color="#42666f" />
              <stop offset="20.689%" stop-color="#446d60" />
              <stop offset="24.137%" stop-color="#467156" />
              <stop offset="27.586%" stop-color="#48764d" />
              <stop offset="31.034%" stop-color="#4d7c44" />
              <stop offset="34.482%" stop-color="#588342" />
              <stop offset="37.931%" stop-color="#648a3f" />
              <stop offset="41.379%" stop-color="#70923e" />
              <stop offset="44.827%" stop-color="#859d40" />
              <stop offset="48.275%" stop-color="#95a642" />
              <stop offset="51.724%" stop-color="#a9b145" />
              <stop offset="55.172%" stop-color="#b8b848" />
              <stop offset="58.620%" stop-color="#cac14c" />
              <stop offset="62.068%" stop-color="#d3c24e" />
              <stop offset="65.517%" stop-color="#d9be51" />
              <stop offset="68.965%" stop-color="#dfbc53" />
              <stop offset="72.413%" stop-color="#dcad51" />
              <stop offset="75.862%" stop-color="#d69a50" />
              <stop offset="79.310%" stop-color="#d1884e" />
              <stop offset="82.758%" stop-color="#c96f48" />
              <stop offset="86.206%" stop-color="#c25741" />
              <stop offset="89.655%" stop-color="#ba3d3b" />
              <stop offset="93.103%" stop-color="#ba3d3b" />
              <stop offset="96.551%" stop-color="#ba3d3b" />
              <stop offset="100%" stop-color="#ba3d3b" />
            </linearGradient>
          </defs>
        </svg>
        <div class="pointer-events-none col-start-1 row-start-1 flex h-full w-full flex-col items-start justify-between p-4">
          <div class="pointer-events-auto flex w-full gap-4 overflow-scroll *:cursor-pointer *:rounded *:bg-slate-500 *:px-4 *:py-2 *:font-semibold *:text-white *:hover:bg-slate-700">
            <button
              type="button"
              onClick={() =>
                batch(() => {
                  setRotX(rotXDefault);
                  setRotZ(rotZDefault);
                  d3.select(svgRef!).call(zoom.transform, d3.zoomIdentity);
                })
              }
            >
              Isometric
            </button>
            <button
              type="button"
              onClick={() =>
                batch(() => {
                  setRotX(0.5);
                  setRotZ(0);
                  d3.select(svgRef!).call(zoom.transform, d3.zoomIdentity);
                })
              }
            >
              YZ
            </button>
            <button
              type="button"
              onClick={() =>
                batch(() => {
                  setRotX(0.5);
                  setRotZ(-0.5);
                  d3.select(svgRef!).call(zoom.transform, d3.zoomIdentity);
                })
              }
            >
              XZ
            </button>
            <button
              type="button"
              onClick={() =>
                batch(() => {
                  setRotX(0);
                  setRotZ(0);
                  d3.select(svgRef!).call(zoom.transform, d3.zoomIdentity);
                })
              }
            >
              XY
            </button>
          </div>
          <SVGDownload target={svgRef!} />
        </div>
      </div>

      <p>You can zoom and rotate the viewport. Double click to reset.</p>
      <div class="grid w-full max-w-3xl grid-cols-[repeat(auto-fit,_14rem)] justify-items-stretch gap-4">
        <label title="Scale the figure to zoom in and out">
          Scale
          <input
            class="w-full rounded pl-2 outline"
            type="number"
            required
            value={scale()}
            onChange={(event) => setScale(event.target.valueAsNumber)}
          />
        </label>
        <label title="Rotate the figure in the θ direction">
          <em>θ</em> Rotation (π)
          <input
            class="w-full rounded pl-2 outline"
            type="number"
            required
            min="0"
            step="0.01"
            value={rotX()}
            onChange={(event) => setRotX(event.target.valueAsNumber)}
          />
        </label>
        <label title="Rotate the figure around the Z axis">
          <em>ϕ</em> Rotation (π)
          <input
            class="w-full rounded pl-2 outline"
            type="number"
            required
            min="0"
            step="0.01"
            value={rotZ()}
            onChange={(event) => setRotZ(event.target.valueAsNumber)}
          />
        </label>
        <label title="Change the figure height, the width is fixed at 3.5 in">
          Figure Height (in)
          <input
            class="w-full rounded pl-2 outline"
            type="number"
            required
            min="0.5"
            step="0.5"
            value={height()}
            onChange={(event) => setHeight(event.target.valueAsNumber)}
          />
        </label>
        <label class="cursor-pointer" title="Toggle the axes on and off">
          Enable Axes
          <input
            class="block translate-x-1 translate-y-1 scale-150"
            type="checkbox"
            required
            checked
            onChange={(event) => setAxesEnabled(event.target.checked)}
          />
        </label>
        <label class="cursor-pointer" title="Map Vector Size">
          Map Vector Size
          <input
            class="block translate-x-1 translate-y-1 scale-150"
            type="checkbox"
            required
            checked
            onChange={(event) => setMapSize(event.target.checked)}
          />
        </label>
        <label title="Change the size of the vector arrows">
          Vector Arrow Size
          <input
            class="w-full rounded pl-2 outline"
            type="number"
            required
            min="0"
            step="0.1"
            value={vScale()}
            onChange={(event) => setVScale(event.target.valueAsNumber)}
          />
        </label>
        <label title="Limit the minimum length of vectors">
          Min Vector Length
          <input
            class="w-full rounded pl-2 outline"
            type="number"
            required
            min="0"
            step="0.01"
            value={vLenMin()}
            onChange={(event) => setVLenMin(event.target.valueAsNumber)}
          />
        </label>
        <label title="Limit the maximum length of vectors">
          Max Vector Length
          <input
            class="w-full rounded pl-2 outline"
            type="number"
            required
            min="0"
            step="0.01"
            value={vLenMax()}
            onChange={(event) => setVLenMax(event.target.valueAsNumber)}
          />
        </label>
        <label title="Rotate the vector arrows">
          Arrow Rotation:
          <input
            class="w-full"
            type="range"
            required
            min="0"
            max="2"
            step="0.05"
            value={rotArrow()}
            onInput={(event) => setRotArrow(event.target.valueAsNumber)}
          />
        </label>
        <label title="Change the vector arrow placement relating to its staring position">
          Arrow Alignment
          <select
            class="block cursor-pointer rounded px-2 py-0.5 outline"
            required
            onChange={(event) =>
              setArrowAlign(event.target.value as "start" | "middle" | "end")
            }
          >
            <option value="start">Start</option>
            <option value="middle" selected>
              Middle
            </option>
            <option value="end">End</option>
          </select>
        </label>
        <label class="cursor-pointer" title="Include the vector tails or not">
          Include Arrow Tail
          <input
            class="block translate-x-1 translate-y-1 scale-150"
            type="checkbox"
            required
            checked
            onChange={(event) => setArrowTail(event.target.checked)}
          />
        </label>
        <label title="Change the length of the arrow tails">
          Arrow Tail Length
          <input
            class="w-full rounded pl-2 outline"
            type="number"
            min="0"
            step="0.1"
            required
            value={arrowTailLen()}
            onChange={(event) => setArrowTailLen(event.target.valueAsNumber)}
          />
        </label>
      </div>
    </>
  );
}

const FileUpload = () => {
  return (
    <label class="grid grid-cols-1 gap-2">
      <p>
        Upload Field Data (<code>.fld</code>) to visualize
      </p>
      <input
        type="file"
        accept=".fld"
        class="rounded bg-sky-500 px-4 py-2 text-white file:border-y-0 file:border-r file:border-l-0 file:border-solid file:border-r-white file:bg-transparent file:pr-2 file:font-sans file:font-semibold file:text-white hover:bg-sky-700"
        onChange={(event) => {
          setErrBadge(undefined);

          if (event.target.files!.length === 0) {
            setErrBadge({
              err: "No file selected",
              detail: "Select one field file to visualize.",
            });
            return;
          }
          if (event.target.files!.length > 1) {
            setErrBadge({
              err: "Multiple files selected",
              detail: "Only one field file can be visualize at the time.",
            });
            return;
          }

          const uploadedFile = event.target.files![0]!;

          setFilename(uploadedFile.name);

          uploadedFile.text().then((content) => {
            const { starts, units, lens, stats } = parseFld(content);

            batch(() => {
              setStarts(starts);
              setUnits(units);
              setLens(lens);
              setStats(stats);
            });
          });
        }}
      />
    </label>
  );
};

function ErrorBadge() {
  return (
    <Show when={errBadge()}>
      <div class="rounded bg-red-500 p-4 text-white">
        <p class="text-lg font-bold">{errBadge()!.err}</p>
        <p>{errBadge()!.detail}</p>
      </div>
    </Show>
  );
}

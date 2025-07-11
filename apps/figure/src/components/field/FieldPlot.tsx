import { errBadge, setErrBadge } from "components/field/contexts";
import { parseFld } from "components/field/fldParser";
import type { Vector6 } from "components/field/linearAlgebra";
import {
  getVector3L2,
  type Vector6Array,
} from "components/field/linearAlgebra";
import SVGDownload from "components/field/SVGDownload";
import * as d3 from "d3";
import * as d3d from "d3-3d";
import { batch, createEffect, createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

const [vectorArray, setVectorArray] = createSignal<Vector6Array>([]);
const [vectorInfo, setVectorInfo] = createStore({
  xSpan: 0,
  ySpan: 0,
  zSpan: 0,
  maxNorm: 1,
  vLen: 1e-7,
  vMax: 0,
});

export default function Field() {
  let svgRef: SVGSVGElement | undefined;
  let debugTextAreaRef: HTMLTextAreaElement | undefined;

  createEffect(() => {
    if (debugTextAreaRef) {
      debugTextAreaRef.value = `num: ${vectorArray().length} | xSpan: ${vectorInfo.xSpan} | ySpan: ${vectorInfo.ySpan} | zSpan: ${vectorInfo.zSpan} | vMax: ${vectorInfo.vMax}`;
    }
  });

  const DPI = 72;
  const width = DPI * 3.5;
  const height = DPI * 3.5;

  const origin: d3d.Coordinate2D = { x: width / 2, y: height / 2 };
  const defaultScale = 30;
  const [scale, setScale] = createSignal(defaultScale);
  const defaultRotation = 1 / 4;
  const [rotateX, setRotateX] = createSignal(defaultRotation);
  const rotateXRad = () => rotateX() * Math.PI;
  const [rotateY, _] = createSignal(0);
  const rotateYRad = () => rotateY() * Math.PI;
  const [rotateZ, setRotateZ] = createSignal(defaultRotation);
  const rotateZRad = () => rotateZ() * Math.PI;
  const [axesEnabled, setAxesEnabled] = createSignal(true);

  createEffect(() => {
    const dimMax = Math.max(
      vectorInfo.xSpan,
      vectorInfo.ySpan,
      vectorInfo.zSpan,
    );
    if (dimMax === 0) {
      setScale(30);
      setZoomSens(10);
      return;
    }
    const newScale = Math.floor(width / dimMax);
    setScale(newScale);
    setZoomSens(Math.floor(newScale / 3));
  });

  const [zoomSens, setZoomSens] = createSignal(10);
  const panSens = 1 / 180;

  const points3d = d3d.points3D().origin(origin);
  const lines3d = d3d.lines3D().origin(origin);
  const poly3d = d3d.polygons3D().origin(origin);
  const axes = d3d.lineStrips3D().origin(origin);

  const points: () => d3d.Point3DInput[] = () => {
    const res: d3d.Point3DInput[] = [];
    for (const v of vectorArray()) {
      res.push({ x: v[0], y: v[1], z: v[2] });
    }
    return res;
  };

  const lines: () => d3d.Line3DInput[] = () => {
    const res: d3d.Line3DInput[] = [];
    for (const v of vectorArray()) {
      // @ts-expect-error
      res.push([
        { x: v[0], y: v[1], z: v[2] },
        {
          x: v[0] + (v[3] * vectorInfo.vLen) / 100,
          y: v[1] + (v[4] * vectorInfo.vLen) / 100,
          z: v[2] + (v[5] * vectorInfo.vLen) / 100,
        },
      ]);
    }
    return res;
  };

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
    // const pointsData = points3d
    //   .scale(scale())
    //   .rotateX(rotateXRad())
    //   .rotateY(rotateYRad())
    //   .rotateZ(rotateZRad())(points());

    const linesData = lines3d
      .scale(scale())
      .rotateX(rotateXRad())
      .rotateY(rotateYRad())
      .rotateZ(rotateZRad())(lines());

    const axesData = axes
      .scale(scale())
      .rotateX(rotateXRad())
      .rotateY(rotateYRad())
      // @ts-expect-error
      .rotateZ(rotateZRad())(ticks);

    const g = d3.select(svgRef!).selectAll("g").data([null]).join("g");

    // Axes
    g.selectAll("path.axes")
      .data(axesEnabled() ? axesData : [])
      .join("path") // @ts-expect-error
      .attr("d", axes.draw)
      .classed("stroke-black dark:stroke-white axes", true)
      .classed("d3-3d", true);

    // Axis text
    g.selectAll("g.axis-text")
      .data(axesEnabled() ? axesData : [])
      .join("g")
      .classed("axis-text", true)
      .classed("font-[Arial]", true)
      .selectAll("text")
      .data((d) => d)
      .join("text")
      .classed("fill-black dark:fill-white", true)
      // @ts-expect-error
      .attr("x", (d) => d.projected.x)
      // @ts-expect-error
      .attr("y", (d) => d.projected.y)
      .text((d) => {
        // @ts-expect-error
        return Math.max(d.x, d.y, d.z);
      });
    // .classed("d3-3d", true);

    // g.selectAll("circle.points")
    //   .data(pointsData)
    //   .join("circle")
    //   .classed("points", true)
    //   .attr("cx", (d) => d.projected.x)
    //   .attr("cy", (d) => d.projected.y)
    //   .attr("r", 3)
    //   .classed("fill-blue-500", true)
    //   .classed("d3-3d", true);

    g.selectAll("line")
      .data(linesData)
      .join("line")
      // @ts-expect-error
      .attr("x1", (d) => d[0].projected.x)
      // @ts-expect-error
      .attr("x2", (d) => d[1].projected.x)
      // @ts-expect-error
      .attr("y1", (d) => d[0].projected.y)
      // @ts-expect-error
      .attr("y2", (d) => d[1].projected.y)
      .classed("stroke-blue-500", true)
      .classed("d3-3d", true)
      .attr("stroke-width", (d) => getVectorLenRank(d) / 30)
      .attr(
        "style",
        (d) => `stroke: var(--color-rainbow-${getVectorLenRank(d)})`,
      );

    // @ts-expect-error
    g.selectAll(".d3-3d").sort(poly3d.sort);
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
          setRotateZ((prev) =>
            parseFloat((prev - transform.x * panSens).toFixed(8)),
          );
          setRotateX((prev) =>
            parseFloat((prev - transform.y * panSens).toFixed(8)),
          );
          break;
        case "touchmove":
          if (transform.k === 1) {
            // Pan
            setRotateZ((prev) =>
              parseFloat((prev - transform.x * panSens).toFixed(8)),
            );
            setRotateX((prev) =>
              parseFloat((prev - transform.y * panSens).toFixed(8)),
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
    svg.call(zoom).on(
      "dblclick.zoom",
      () =>
        batch(() => {
          setScale(defaultScale);
          setRotateX(defaultRotation);
          setRotateZ(defaultRotation);
          // Reset all
          d3.select(svgRef!).call(zoom.transform, d3.zoomIdentity);
        }),
      svg.call(zoom.translateBy, defaultRotation, defaultRotation),
    );
  });

  return (
    <>
      <FileUpload />
      <Show when={import.meta.env.VERCEL_ENV !== "production"}>
        <textarea
          ref={debugTextAreaRef}
          rows="6"
          class="w-full rounded font-mono outline"
        ></textarea>
      </Show>
      <ErrorBadge />
      <div class="grid w-full max-w-xl grid-cols-[repeat(auto-fit,_8rem)] gap-4">
        <label>
          Scale
          <input
            class="w-32 rounded pl-2 outline"
            type="number"
            required
            name="Scale"
            value={scale()}
            onChange={(event) => setScale(event.target.valueAsNumber)}
          />
        </label>
        <label>
          <em>θ</em> Rotation (π)
          <input
            class="w-32 rounded pl-2 outline"
            type="number"
            required
            name="X Rotate"
            min="0"
            step="0.01"
            value={rotateX()}
            onChange={(event) => setRotateX(event.target.valueAsNumber)}
          />
        </label>
        <label>
          <em>ϕ</em> Rotation (π)
          <input
            class="w-32 rounded pl-2 outline"
            type="number"
            required
            name="Z Rotate"
            min="0"
            step="0.01"
            value={rotateZ()}
            onChange={(event) => setRotateZ(event.target.valueAsNumber)}
          />
        </label>
        <label>
          Enable Axes
          <input
            class="block"
            type="checkbox"
            required
            name="Enable Axes"
            checked
            onChange={(event) => setAxesEnabled(event.target.checked)}
          />
        </label>
        <label>
          Max Vector Norm
          <input
            class="w-32 rounded pl-2 outline"
            type="number"
            required
            name="Max Vector Norm"
            min="0"
            step="0.01"
            value={vectorInfo.maxNorm}
            onChange={(event) =>
              setVectorInfo("maxNorm", event.target.valueAsNumber)
            }
          />
        </label>
        <label>
          Vector Length (%)
          <input
            class="w-32 rounded pl-2 outline"
            type="number"
            required
            name="Max Vector Length"
            min="0"
            step="1"
            value={vectorInfo.vLen}
            onChange={(event) =>
              setVectorInfo("vLen", event.target.valueAsNumber)
            }
          />
        </label>
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
      <SVGDownload target={svgRef!} />
    </>
  );
}

const FileUpload = () => {
  return (
    <label class="grid grid-cols-1 gap-2">
      <p>
        Upload Field Data (<code>.fld</code>)
      </p>
      <input
        type="file"
        accept=".fld"
        class="rounded bg-sky-500 px-4 py-2 text-white file:border-y-0 file:border-r file:border-l-0 file:border-solid file:border-r-white file:bg-transparent file:pr-2 file:font-sans file:font-semibold file:text-white hover:bg-sky-700"
        onChange={(event) => {
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
          event.target.files![0]!.text().then((content) => {
            const [vs, xMin, yMin, zMin, xSpan, ySpan, zSpan, vMax] =
              parseFld(content);

            setVectorInfo("xSpan", xSpan);
            setVectorInfo("ySpan", ySpan);
            setVectorInfo("zSpan", zSpan);
            setVectorInfo("vMax", vMax);

            // Position normalization
            const vss: Vector6Array = [];
            for (const v of vs) {
              const x = v[0];
              const y = v[1];
              const z = v[2];
              vss.push([
                -xSpan / 2 + x - xMin,
                -ySpan / 2 + y - yMin,
                -zSpan / 2 + z - zMin,
                v[3],
                v[4],
                v[5],
              ]);
            }
            setVectorArray(vss);
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

function getVectorLenRank(d: d3d.Line3D): number {
  const start = d[0];
  const end = d[1];
  const diff = [
    d[1].rotated.x - d[0].rotated.x,
    d[1].rotated.y - d[0].rotated.y,
    d[1].rotated.z - d[0].rotated.z,
  ];
  const vLen = getVector3L2(diff);
  const unit = 0.000002;
  let rank = Math.floor(vLen / unit);

  if (rank > 29) {
    rank = 29;
  }

  return rank;
}

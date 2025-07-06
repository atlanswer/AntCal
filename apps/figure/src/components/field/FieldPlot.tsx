import * as d3 from "d3";
import * as d3d from "d3-3d";
import { batch, createEffect, createSignal, onMount } from "solid-js";

const [debugText, setDebugText] = createSignal("Debug info");

export default function Field() {
  let svgRef: SVGSVGElement | undefined;

  let debugTextAreaRef: HTMLTextAreaElement | undefined;
  createEffect(() => {
    debugTextAreaRef!.value = debugText();
  });

  const DPI = 72;
  const width = DPI * 3.5;
  const height = DPI * 3.5;

  const origin: d3d.Coordinate2D = { x: width / 2, y: height / 2 };
  const defaultScale = 30;
  const [scale, setScale] = createSignal(defaultScale);
  const defaultRotation = 1 / 4;
  const [rotateX, setRotateX] = createSignal(defaultRotation);
  const [rotateY, _] = createSignal(0);
  const [rotateZ, setRotateZ] = createSignal(defaultRotation);

  const zoomSens = 10;
  const panSens = 1 / 180;

  const points3d = d3d.points3D().origin(origin);
  const triangles3d = d3d.triangles3D().origin(origin);
  const axes = d3d.lineStrips3D().origin(origin);

  const points: d3d.Point3DInput[] = [
    // { x: 0, y: 0, z: 0 },
    // { x: 1, y: 0, z: 0 },
    // { x: 0, y: 1, z: 0 },
    // { x: 0, y: 0, z: 1 },
    // { x: 1, y: 1, z: 1 },
  ];

  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 5; j++) {
      for (let k = 0; k <= 5; k++) {
        points.push({ x: i, y: j, z: k });
      }
    }
  }

  const triangles: d3d.Triangle3DInput[] = [
    [
      { x: -1, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
    ],
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
      .rotateX(rotateX() * Math.PI)
      .rotateY(rotateY() * Math.PI)
      .rotateZ(rotateZ() * Math.PI)(points);

    const trianglesData = triangles3d
      .scale(scale())
      .rotateX(rotateX() * Math.PI)
      .rotateY(rotateY() * Math.PI)
      .rotateZ(rotateZ() * Math.PI)(triangles);

    const axesData = axes
      .scale(scale())
      .rotateX(rotateX() * Math.PI)
      .rotateY(rotateY() * Math.PI)
      // @ts-expect-error
      .rotateZ(rotateZ() * Math.PI)(ticks);

    const g = d3.select(svgRef!).selectAll("g").data([null]).join("g");

    // Axes
    g.selectAll("path.axes")
      .data(axesData)
      .join("path") // @ts-expect-error
      .attr("d", axes.draw)
      .classed("stroke-black dark:stroke-white axes", true)
      .classed("d3-3d", true);

    // Axis text
    g.selectAll("g.axis-text")
      .data(axesData)
      .join("g")
      .classed("axis-text", true)
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

    g.selectAll("circle.points")
      .data(pointsData)
      .join("circle")
      .classed("points", true)
      .attr("cx", (d) => d.projected.x)
      .attr("cy", (d) => d.projected.y)
      .attr("r", 3)
      .classed("fill-blue-500", true)
      .classed("d3-3d", true);

    g.selectAll("path.triangles")
      .data(trianglesData)
      .join("path")
      .classed("triangles", true)
      // @ts-expect-error
      .attr("d", triangles3d.draw)
      .classed("fill-red-500", true)
      .classed("d3-3d", true);

    // @ts-expect-error
    g.selectAll(".d3-3d").sort(points3d.sort);
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
            parseFloat((prev + (transform.k - 1) * zoomSens).toFixed(3)),
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
              parseFloat((prev + (transform.k - 1) * zoomSens).toFixed(3)),
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
      <textarea
        ref={debugTextAreaRef}
        rows="6"
        class="w-full rounded outline"
      ></textarea>
      <div class="grid w-full max-w-xl grid-cols-[repeat(auto-fit,_8rem)] gap-4">
        <label>
          Scale:
          <input
            class="w-32"
            type="number"
            required
            name="Scale"
            min="1"
            size="6"
            value={scale()}
            onChange={(event) => setScale(event.target.valueAsNumber)}
          />
        </label>
        <label>
          <em>θ</em> Rotation:
          <input
            class="w-32"
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
          <em>ϕ</em> Rotation:
          <input
            class="w-32"
            type="number"
            required
            name="Z Rotate"
            min="0"
            step="0.01"
            value={rotateZ()}
            onChange={(event) => setRotateZ(event.target.valueAsNumber)}
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
      Upload Field Data
      <input
        type="file"
        accept=".fld"
        class="rounded bg-sky-500 px-4 py-2 text-white file:border-y-0 file:border-r file:border-l-0 file:border-solid file:border-r-white file:bg-transparent file:pr-2 file:font-sans file:font-semibold file:text-white hover:bg-sky-700"
        onChange={(event) => {
          if (event.target.files!.length === 0) {
            setDebugText("No file selected.");
            return;
          }
          if (event.target.files!.length > 1) {
            setDebugText("Too many files selected.");
            return;
          }
          event.target
            .files![0]!.text()
            .then((content) => setDebugText(content));
        }}
      />
    </label>
  );
};

function SVGDownload(props: { target: SVGSVGElement }) {
  return (
    <button
      type="button"
      class="rounded bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-700"
      onClick={async () => {
        const svg = props.target.cloneNode(true);
        const defs = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "defs",
        );
        svg.insertBefore(defs, svg.firstChild);
        const style = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "style",
        );
        defs.appendChild(style);

        const globalStyleText = (await import("styles/global.css?inline"))
          .default;
        style.textContent = globalStyleText;

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const svgLink = document.createElement("a");
        svgLink.href = svgUrl;
        svgLink.download = "download.svg";
        svgLink.click();

        URL.revokeObjectURL(svgUrl);
      }}
    >
      Download SVG
    </button>
  );
}

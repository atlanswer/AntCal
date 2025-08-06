import { configs } from "components/pattern/context";
import type { Coordinate, Source } from "components/pattern/context";
import { createEffect } from "solid-js";
import * as d3 from "d3";
import { verticalEDipole, verticalMDipole } from "components/pattern/dipoles";
import type { Accessor } from "solid-js";
import {
  rollBackCoordinate,
  rollbackVec3,
  unitVecPhi,
  unitVecTheta,
} from "./calculations";
import { dotProdVec3, type Vec3 } from "src/math/linearAlgebra";

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

  const calculation = () => {
    const sources = configs[props.cIdx()]!;

    const uVecThetaArray = props.points.map((p) => unitVecTheta(p));
    const uVecPhiArray = props.points.map((p) => unitVecPhi(p));

    for (const s of sources) {
      const rotatedCoordinate = props.points.map((p) =>
        rollBackCoordinate(p, s.orientation),
      );

      let eAmp: number[];
      let eDir: Vec3[];

      switch (s.type) {
        case "J":
          eAmp = rotatedCoordinate.map((c) => verticalEDipole(c, s.length));
          eDir = uVecThetaArray;
          break;
        case "M":
          eAmp = rotatedCoordinate.map((c) => verticalMDipole(c));
          eDir = uVecPhiArray;
          break;
      }

      const rotatedEDir = eDir.map((v) => rollbackVec3(v, s.orientation));

      let thetaComp: number[] = [];
      let phiComp: number[] = [];

      for (let i = 0; i < props.points.length; i++) {
        thetaComp.push(dotProdVec3(rotatedEDir[i]!, uVecThetaArray[i]!));
        phiComp.push(dotProdVec3(rotatedEDir[i]!, uVecPhiArray[i]!));
      }
    }
  };

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
      .data([])
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

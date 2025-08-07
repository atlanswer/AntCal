import type { Coordinate } from "components/pattern/context";
import { configs } from "components/pattern/context";
import { verticalEDipole, verticalMDipole } from "components/pattern/dipoles";
import * as d3 from "d3";
import type { Accessor } from "solid-js";
import { createEffect } from "solid-js";
import { dotProdVec3, type Vec3 } from "src/math/linearAlgebra";
import { addPhasor, type Phasor } from "src/math/phasor";
import {
  rollBackCoordinate,
  rollbackVec3,
  spherical2Cartesian,
  unitVecPhi,
  unitVecTheta,
} from "./calculations";

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

    // Initial
    const thetaPhasor1: Phasor[] = props.points.map((_) => ({
      amplitude: 0,
      phase: 0,
    }));
    const phiPhasor1: Phasor[] = props.points.map((_) => ({
      amplitude: 0,
      phase: 0,
    }));

    for (const s of sources) {
      const rotation: Coordinate = {
        theta: s.orientation.theta * Math.PI,
        phi: s.orientation.phi * Math.PI,
      };

      const rotatedCoordinate = props.points.map((p) =>
        rollBackCoordinate(p, rotation),
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

      const rotatedEDir = eDir.map((v) => rollbackVec3(v, rotation));

      const thetaComp: number[] = [];
      const eAmpTheta2: number[] = [];
      const phiComp: number[] = [];
      const eAmpPhi2: number[] = [];

      for (let i = 0; i < props.points.length; i++) {
        thetaComp.push(dotProdVec3(rotatedEDir[i]!, uVecThetaArray[i]!));
        eAmpTheta2.push(eAmp[i]! * thetaComp[i]!);
        phiComp.push(dotProdVec3(rotatedEDir[i]!, uVecPhiArray[i]!));
        eAmpPhi2.push(eAmp[i]! * phiComp[i]!);
      }

      const vecCoordinate: Vec3[] = props.points.map((c) =>
        spherical2Cartesian(c),
      );
      const pathDiff: number[] = vecCoordinate.map((v) =>
        dotProdVec3(v, s.position),
      );
      const phaseDiff: number[] = pathDiff.map((d) => d * 2 * Math.PI);
      const phase2: number[] = phaseDiff.map((p) => s.phase + p);

      const thetaPhasor2: Phasor[] = [];
      const phiPhasor2: Phasor[] = [];

      for (let i = 0; i < props.points.length; i++) {
        thetaPhasor2.push({ amplitude: eAmpTheta2[i]!, phase: phase2[i]! });
        thetaPhasor1[i] = addPhasor(thetaPhasor1[i]!, thetaPhasor2[i]!);
        phiPhasor2.push({ amplitude: eAmpPhi2[i]!, phase: phase2[i]! });
        phiPhasor1[i] = addPhasor(phiPhasor1[i]!, phiPhasor2[i]!);
      }
    }

    // Finishing
    let rIntensityTheta: number[] = thetaPhasor1.map(
      (p) => 10 * Math.log10(p.amplitude * p.amplitude),
    );
    let rIntensityPhi: number[] = phiPhasor1.map(
      (p) => 10 * Math.log10(p.amplitude * p.amplitude),
    );
    const rIntensityThetaMax = Math.max(...rIntensityTheta);
    const rIntensityPhiMax = Math.max(...rIntensityPhi);
    const rIntensityMax = Math.max(rIntensityThetaMax, rIntensityPhiMax);
    rIntensityTheta = rIntensityTheta.map((v) => v - rIntensityMax);
    rIntensityPhi = rIntensityPhi.map((v) => v - rIntensityMax);
    rIntensityTheta = rIntensityTheta.map((v) => (v < -40 ? -40 : v));
    rIntensityPhi = rIntensityPhi.map((v) => (v < -40 ? -40 : v));

    const mapRange = d3.scaleLinear([-40, 0], [0, rMax]);

    const rThetaData: [number, number][] = rIntensityTheta.map((v, i) => [
      (i * Math.PI) / 180,
      mapRange(v),
    ]);
    const rPhiData: [number, number][] = rIntensityPhi.map((v, i) => [
      (i * Math.PI) / 180,
      mapRange(v),
    ]);

    return [rThetaData, rPhiData];
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
      .data(calculation())
      .join("path")
      .attr("fill", "none")
      .attr("stroke", (_, i) => d3.schemeCategory10[i]!)
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

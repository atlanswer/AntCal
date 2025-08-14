import {
  getUnitVecPhi,
  getUnitVecTheta,
  rollBackCoordinate,
  rotateVec3,
  spherical2Cartesian,
} from "components/pattern/calculations";
import { verticalEDipole, verticalMDipole } from "components/pattern/dipoles";
import * as d3 from "d3";
import type { Accessor, JSXElement } from "solid-js";
import { createEffect, createMemo } from "solid-js";
import {
  analyses,
  type Coordinate,
  type Source,
} from "src/components/pattern/contexts";
import { dotProdVec3, type Vec3 } from "src/math/linearAlgebra";
import { addPhasor, type Phasor } from "src/math/phasor";

export default function (props: {
  cIdx: Accessor<number>;
  title: JSXElement;
  coordinates: () => Coordinate[];
  globalMax: Accessor<number>;
  updateGlobalMax: (v: number) => void;
}) {
  let svgRef: SVGSVGElement | undefined;

  const analysis = () => analyses[props.cIdx()]!;

  const DPI = 72;
  const widthIn = 3.5 / 2;
  const heightIn = 3.5 / 2;
  const width = widthIn * DPI;
  const height = heightIn * DPI;
  const padding = 10;
  const rMax = width / 2 - padding;

  const unitVecThetaArray: () => Vec3[] = () =>
    props.coordinates().map((p) => getUnitVecTheta(p));
  const unitVecPhiArray: () => Vec3[] = () =>
    props.coordinates().map((p) => getUnitVecPhi(p));

  const calculation = createMemo(() => {
    console.debug("recalculate");

    const coordinates: Coordinate[] = props.coordinates();
    const sources: Source[] = analyses[props.cIdx()]!.sources;

    const thetaPhasor1: Phasor[] = coordinates.map((_) => [0, 0]);
    const phiPhasor1: Phasor[] = coordinates.map((_) => [0, 0]);

    for (const s of sources) {
      const rotation: Coordinate = {
        theta: s.orientation.theta * Math.PI,
        phi: s.orientation.phi * Math.PI,
      };

      const recoveredCoordinate: Coordinate[] = coordinates.map((p) =>
        rollBackCoordinate(p, rotation),
      );
      const uVecThetaSource: Vec3[] = recoveredCoordinate.map((p) =>
        getUnitVecTheta(p),
      );
      const uVecPhiSource: Vec3[] = recoveredCoordinate.map((p) =>
        getUnitVecPhi(p),
      );

      let eAmp: number[];
      let eDirSource: Vec3[];

      switch (s.type) {
        case "J":
          eAmp = recoveredCoordinate.map(
            (c) => verticalEDipole(c, s.length) * s.amplitude,
          );
          eDirSource = uVecThetaSource;
          break;
        case "M":
          eAmp = recoveredCoordinate.map(
            (c) => verticalMDipole(c) * s.amplitude,
          );
          eDirSource = uVecPhiSource;
          break;
      }

      const eDir = eDirSource.map((v) => rotateVec3(v, rotation));

      const thetaComp: number[] = [];
      const eAmpTheta2: number[] = [];
      const phiComp: number[] = [];
      const eAmpPhi2: number[] = [];

      for (let i = 0; i < coordinates.length; i++) {
        thetaComp.push(dotProdVec3(eDir[i]!, unitVecThetaArray()[i]!));
        phiComp.push(dotProdVec3(eDir[i]!, unitVecPhiArray()[i]!));
      }
      for (let i = 0; i < coordinates.length; i++) {
        eAmpTheta2.push(eAmp[i]! * thetaComp[i]!);
        eAmpPhi2.push(eAmp[i]! * phiComp[i]!);
      }

      const vecObservation: Vec3[] = coordinates.map((c) =>
        spherical2Cartesian(c),
      );
      const pathDiff: number[] = vecObservation.map((v) =>
        dotProdVec3(v, s.position),
      );
      const phaseDiff: number[] = pathDiff.map((d) => d * 2 * Math.PI);
      const phase2: number[] = phaseDiff.map((p) => s.phase * Math.PI + p);

      const thetaPhasor2: Phasor[] = [];
      const phiPhasor2: Phasor[] = [];

      for (let i = 0; i < coordinates.length; i++) {
        let eAmpTheta = eAmpTheta2[i]!;
        let eAmpPhi = eAmpPhi2[i]!;
        let phaseTheta = phase2[i]!;
        let phasePhi = phase2[i]!;

        if (eAmpTheta < 0) {
          eAmpTheta = -eAmpTheta;
          phaseTheta += Math.PI;
        }
        if (eAmpPhi < 0) {
          eAmpPhi = -eAmpPhi;
          phasePhi += Math.PI;
        }

        thetaPhasor2.push([eAmpTheta, phaseTheta]);
        phiPhasor2.push([eAmpPhi, phasePhi]);
      }

      for (let i = 0; i < coordinates.length; i++) {
        thetaPhasor1[i] = addPhasor(thetaPhasor1[i]!, thetaPhasor2[i]!);
        phiPhasor1[i] = addPhasor(phiPhasor1[i]!, phiPhasor2[i]!);
      }
    }

    let eTheta: number[] = thetaPhasor1.map((p) => p[0]);
    let ePhi: number[] = phiPhasor1.map((p) => p[0]);

    return [eTheta, ePhi];
  });

  const tracesData = createMemo(() => {
    console.debug("retrace");

    const [eTheta, ePhi] = calculation();
    const num = Math.floor(360 / analysis().settings.precision);

    if (analysis().settings.dB) {
      const dBRangeMin = -40;
      let rIntensityTheta;
      let rIntensityPhi;
      if (analysis().settings.split) {
        rIntensityTheta = eTheta!.map((v) => 10 * Math.log10(v * v));
        rIntensityPhi = ePhi!.map((v) => 10 * Math.log10(v * v));
      } else {
        rIntensityTheta = [];
        rIntensityPhi = [];
        for (let i = 0; i < eTheta!.length; i++) {
          rIntensityTheta.push(
            10 * Math.log10(eTheta![i]! * eTheta![i]! + ePhi![i]! * ePhi![i]!),
          );
          rIntensityPhi.push(-Infinity);
        }
      }
      const rIntensityMax = Math.max(...rIntensityTheta, ...rIntensityPhi);
      props.updateGlobalMax(rIntensityMax);

      function normalize(v: number): number {
        if (v === -Infinity) return dBRangeMin;

        let res: number;

        if (analysis().settings.normalization === "global") {
          res = v - props.globalMax();
        } else {
          res = v - rIntensityMax;
        }
        return res < dBRangeMin ? dBRangeMin : res;
      }

      const rTheta = rIntensityTheta!.map(normalize);
      const rPhi = rIntensityPhi!.map(normalize);

      const mapRange = d3.scaleLinear([dBRangeMin, 0], [0, rMax]);

      const rThetaData: [number, number][] = rTheta.map((v, i) => [
        (i / num) * 2 * Math.PI,
        mapRange(v),
      ]);
      const rPhiData: [number, number][] = rPhi.map((v, i) => [
        (i / num) * 2 * Math.PI,
        mapRange(v),
      ]);

      return [rThetaData, rPhiData];
    } else {
      let rIntensityTheta;
      let rIntensityPhi;
      if (analysis().settings.split) {
        rIntensityTheta = eTheta!.map((v) => v * v);
        rIntensityPhi = ePhi!.map((v) => v * v);
      } else {
        rIntensityTheta = [];
        rIntensityPhi = [];
        for (let i = 0; i < eTheta!.length; i++) {
          rIntensityTheta.push(
            eTheta![i]! * eTheta![i]! + ePhi![i]! * ePhi![i]!,
          );
          rIntensityPhi.push(0);
        }
      }
      const rIntensityMax = Math.max(...rIntensityTheta, ...rIntensityPhi);
      props.updateGlobalMax(rIntensityMax);

      let mapRange;
      if (analysis().settings.normalization === "global") {
        mapRange = d3.scaleLinear([0, props.globalMax()], [0, rMax]);
      } else {
        mapRange = d3.scaleLinear([0, rIntensityMax], [0, rMax]);
      }

      const rThetaData: [number, number][] = rIntensityTheta!.map((v, i) => [
        (i / num) * 2 * Math.PI,
        mapRange(v),
      ]);
      const rPhiData: [number, number][] = rIntensityPhi!.map((v, i) => [
        (i / num) * 2 * Math.PI,
        mapRange(v),
      ]);

      return [rThetaData, rPhiData];
    }
  });

  function draw() {
    const svg = d3.select(svgRef!);
    const radialLine = d3.lineRadial();

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
    ag.selectAll("path")
      .data(d3.range(8).map((d) => (d * Math.PI) / 4))
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "oklch(55.6% 0 0)")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2")
      .attr("d", (d) =>
        radialLine([
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
      .data(tracesData())
      .join("path")
      .attr("fill", "none")
      .attr("stroke", (_, i) => d3.schemeCategory10[i]!)
      .attr("stroke-width", 1)
      .attr("d", radialLine);
  }

  createEffect(() => draw());

  return (
    <div>
      <p>{props.title}</p>
      <div class="aspect-square w-80 rounded outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
          viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        ></svg>
      </div>
    </div>
  );
}

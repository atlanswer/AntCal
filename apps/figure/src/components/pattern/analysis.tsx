import Plane from "components/pattern/plane";
import * as d3 from "d3";
import { createEffect, onCleanup, type Accessor } from "solid-js";
import { produce } from "solid-js/store";
import {
  debugTraces,
  setConfigs,
  type Coordinate,
} from "src/components/pattern/contexts";
import Sources from "src/components/pattern/sources";
import * as Plot from "@observablehq/plot";

export default function (props: { cIdx: Accessor<number> }) {
  const precision = 1;

  const planePhi0: Coordinate[] = d3
    .range(Math.floor(360 / precision) + 1)
    .map((v) => ({ theta: (v / 180) * Math.PI, phi: v < 180 ? 0 : Math.PI }));
  const planePhi90: Coordinate[] = d3
    .range(Math.round(360 / precision) + 1)
    .map((v) => ({
      theta: (v / 180) * Math.PI,
      phi: v < 180 ? Math.PI / 2 : -Math.PI / 2,
    }));
  const planeTheta90: Coordinate[] = d3
    .range(Math.round(360 / precision + 1))
    .map((v) => ({ theta: 0.5 * Math.PI, phi: (v / 180) * Math.PI }));

  return (
    <div class="w-full rounded p-4 outline">
      <div class="flex gap-1">
        <span>Analysis {props.cIdx() + 1}</span>
        <button
          class="cursor-pointer hover:text-red-500"
          type="button"
          onClick={() =>
            setConfigs(produce((conf) => conf.splice(props.cIdx(), 1)))
          }
        >
          (Remove)
        </button>
      </div>
      <div class="overflow-x-auto">
        <div class="mx-auto flex w-fit gap-4 p-1">
          <DebugPlot data={debugTraces} />
          <Plane cIdx={props.cIdx} title="Φ = 0" coordinates={planePhi0} />
          {
            // <Plane cIdx={props.cIdx} title="Φ = π / 2" coordinates={planePhi90} />
            // <Plane cIdx={props.cIdx} title="θ = π / 2" coordinates={planeTheta90} />
          }
        </div>
      </div>
      <Sources cIdx={props.cIdx} />
    </div>
  );
}

const DebugPlot = (props: { data: Accessor<number[][]> }) => {
  let plotRef: HTMLDivElement | undefined;

  function draw() {
    const plot = Plot.plot({
      height: 360,
      grid: true,
      marks: props
        .data()
        .map((line, i) =>
          Plot.lineY(line, { strokeWidth: 5, stroke: d3.schemeCategory10[i]! }),
        ),
    });
    while (plotRef?.firstChild) {
      plotRef.removeChild(plotRef.firstChild);
    }
    plotRef?.appendChild(plot);
  }

  createEffect(() => draw());

  onCleanup(() => {
    while (plotRef?.firstChild) {
      plotRef.removeChild(plotRef.firstChild);
    }
  });

  return (
    <div>
      <p>Debug</p>
      <div ref={plotRef} class="aspect-video h-80 rounded outline"></div>
    </div>
  );
};

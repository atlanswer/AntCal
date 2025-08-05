import type { Accessor } from "solid-js";
import Sources from "src/components/pattern/sources";
import Plane from "components/pattern/plane";
import type { Coordinate } from "components/pattern/context";
import * as d3 from "d3";

export default function (props: { cIdx: Accessor<number> }) {
  const precision = 1;

  const planePhi0: Coordinate[] = d3
    .range(Math.floor(360 / precision) + 1)
    .map((v) => ({ theta: (v / 180) * Math.PI, phi: 0 }));
  const planePhi90: Coordinate[] = d3
    .range(Math.round(360 / precision) + 1)
    .map((v) => ({ theta: (v / 180) * Math.PI, phi: 0.5 * Math.PI }));
  const planeTheta90: Coordinate[] = d3
    .range(Math.round(360 / precision + 1))
    .map((v) => ({ theta: 0.5 * Math.PI, phi: (v / 180) * Math.PI }));

  return (
    <div class="rounded p-4 outline">
      <p>Analysis {props.cIdx() + 1}</p>
      <div class="flex gap-4 overflow-x-auto p-1">
        <Plane cIdx={props.cIdx} title="Φ = 0°" points={planePhi0} />
        <Plane cIdx={props.cIdx} title="Φ = 90°" points={planePhi90} />
        <Plane cIdx={props.cIdx} title="θ = 90°" points={planeTheta90} />
      </div>
      <Sources cIdx={props.cIdx} />
    </div>
  );
}

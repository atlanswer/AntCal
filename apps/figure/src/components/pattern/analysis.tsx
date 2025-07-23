import type { Accessor } from "solid-js";
import SourcePanel from "components/pattern/sourcePanel";
import Plane from "components/pattern/plane";
import type { Coordinate } from "components/pattern/context";
import * as d3 from "d3";

export default function (props: { idx: Accessor<number> }) {
  const precision = 1;

  const planePhi0: Coordinate[] = d3
    .range(Math.floor(360 / precision) + 1)
    .map((v) => ({ theta: (v / 180) * Math.PI, phi: 0 }));
  const planePhi90: Coordinate[] = d3
    .range(Math.round(360 / precision) + 1)
    .map((v) => ({ theta: (v / 180) * Math.PI, phi: 0.5 }));
  const planeTheta90: Coordinate[] = d3
    .range(Math.round(360 / precision + 1))
    .map((v) => ({ theta: 0.5, phi: (v / 180) * Math.PI }));

  return (
    <div class="rounded p-4 outline">
      <p>Analysis {props.idx() + 1}</p>
      <div class="flex gap-4 overflow-scroll p-1">
        <Plane title="Phi = 0" points={planePhi0} />
        <Plane title="Phi = 90" points={planePhi90} />
        <Plane title="Theta = 90" points={planeTheta90} />
      </div>
      <SourcePanel cIdx={props.idx} />
    </div>
  );
}

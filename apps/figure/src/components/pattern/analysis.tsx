import Plane from "components/pattern/plane";
import * as d3 from "d3";
import { type Accessor } from "solid-js";
import { produce } from "solid-js/store";
import { setConfigs, type Coordinate } from "src/components/pattern/contexts";
import Sources from "src/components/pattern/sources";

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
          <Plane
            cIdx={props.cIdx}
            title={
              <span>
                <em>Φ</em> = 0
              </span>
            }
            coordinates={planePhi0}
          />
          <Plane
            cIdx={props.cIdx}
            title={
              <span>
                <em>Φ</em> = π / 2
              </span>
            }
            coordinates={planePhi90}
          />
          <Plane
            cIdx={props.cIdx}
            title={
              <span>
                <em>θ</em> = π / 2
              </span>
            }
            coordinates={planeTheta90}
          />
        </div>
      </div>
      <div class="mx-auto w-fit">
        <span class="px-2 before:mx-2 before:inline-block before:h-1 before:w-10 before:rounded before:bg-[#1f77b4] before:align-middle">
          <em>θ</em> Component
        </span>
        <span class="px-2 before:mx-2 before:inline-block before:h-1 before:w-10 before:rounded before:bg-[#ff7f0e] before:align-middle">
          <em>ϕ</em> Component
        </span>
      </div>
      <Sources cIdx={props.cIdx} />
    </div>
  );
}

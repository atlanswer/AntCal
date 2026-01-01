import Plane from "components/pattern/plane";
import * as d3 from "d3";
import { createMemo, createSignal, Show, type Accessor } from "solid-js";
import { produce } from "solid-js/store";
import {
  analyses,
  setAnalyses,
  type Coordinate,
} from "src/components/pattern/contexts";
import Sources from "src/components/pattern/sources";

export default function (props: { cIdx: Accessor<number> }) {
  const analysis = () => analyses[props.cIdx()]!;
  const resolution = () => analysis().settings.resolution;
  const nPoints = () => Math.floor(360 / resolution()) + 1;

  const maxQueue: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  const [globalMax, setGlobalMax] = createSignal(-Infinity);

  const updateGlobalMax = (v: number) => {
    maxQueue.push(v);
    maxQueue.shift();
    const maxValue = Math.max(...maxQueue);
    setGlobalMax(maxValue);
  };

  const planePhi0: () => Coordinate[] = createMemo(() => {
    const n = nPoints();
    return d3.range(n).map((v) => ({
      theta:
        v < n / 2 ?
          (v / ((n - 1) / 2)) * Math.PI
        : ((v - (n - 1)) / ((n - 1) / 2)) * -Math.PI,
      phi: v < n / 2 ? 0 : Math.PI,
    }));
  });
  const planePhi90: () => Coordinate[] = createMemo(() => {
    const n = nPoints();
    return d3.range(n).map((v) => ({
      theta:
        v < n / 2 ?
          (v / ((n - 1) / 2)) * Math.PI
        : ((v - (n - 1)) / ((n - 1) / 2)) * -Math.PI,
      phi: v < n / 2 ? Math.PI / 2 : -Math.PI / 2,
    }));
  });
  const planeTheta90: () => Coordinate[] = createMemo(() => {
    const n = nPoints();
    return d3.range(n).map((v) => ({
      theta: Math.PI / 2,
      phi: (v / (n - 1)) * 2 * Math.PI,
    }));
  });

  return (
    <div class="w-full max-w-max rounded bg-slate-100 p-4 outline dark:bg-slate-900">
      <div class="overflow-x-auto p-1">
        <div class="flex w-max gap-x-4 py-2">
          <span>Analysis {props.cIdx() + 1}</span>
          <label class="flex gap-2">
            Normalization
            <select
              class="cursor-pointer rounded pl-2 outline"
              required
              value={analysis().settings.normalization}
              onChange={(event) =>
                setAnalyses(
                  produce(
                    (analyses) =>
                      (analyses[props.cIdx()]!.settings.normalization = event
                        .target.value as "off" | "global" | "plane"),
                  ),
                )
              }
            >
              <option value="global">Global</option>
              <option value="plane">Per Plane</option>
              {
                // <option value="off">Off</option>
              }
            </select>
          </label>
          <label
            class="flex cursor-pointer gap-2"
            title="Display traces in decibel"
          >
            <input
              type="checkbox"
              required
              checked={analysis().settings.dB}
              onChange={(event) =>
                setAnalyses(
                  produce(
                    (analyses) =>
                      (analyses[props.cIdx()]!.settings.dB =
                        event.target.checked),
                  ),
                )
              }
            />
            dB
          </label>
          <label
            class="flex cursor-pointer gap-2"
            title="Split theta and phi components or not"
          >
            <input
              type="checkbox"
              required
              checked={analysis().settings.split}
              onChange={(event) =>
                setAnalyses(
                  produce(
                    (analyses) =>
                      (analyses[props.cIdx()]!.settings.split =
                        event.target.checked),
                  ),
                )
              }
            />
            Split Component
          </label>
          <label class="flex gap-2">
            Angular Resolution (deg)
            <input
              class="w-16 rounded pl-2 outline"
              type="number"
              required
              min="0.1"
              max="360"
              step="0.1"
              value={analysis().settings.resolution}
              onChange={(event) =>
                setAnalyses(
                  produce(
                    (analyses) =>
                      (analyses[props.cIdx()]!.settings.resolution =
                        event.target.valueAsNumber),
                  ),
                )
              }
            />
          </label>
          <button
            class="cursor-pointer rounded px-2 outline hover:bg-red-500"
            type="button"
            onClick={() =>
              setAnalyses(
                produce((analyses) => analyses.splice(props.cIdx(), 1)),
              )
            }
          >
            Remove
          </button>
        </div>
      </div>
      <div class="overflow-x-auto p-1">
        <div class="mx-auto flex w-fit gap-4 p-1">
          <Plane
            cIdx={props.cIdx}
            title={
              <span>
                <var>Φ</var> = 0
              </span>
            }
            primary="θ"
            coordinates={planePhi0}
            globalMax={globalMax}
            updateGlobalMax={updateGlobalMax}
          />
          <Plane
            cIdx={props.cIdx}
            title={
              <span>
                <var>Φ</var> = π / 2
              </span>
            }
            primary="θ"
            coordinates={planePhi90}
            globalMax={globalMax}
            updateGlobalMax={updateGlobalMax}
          />
          <Plane
            cIdx={props.cIdx}
            title={
              <span>
                <var>θ</var> = π / 2
              </span>
            }
            primary="Φ"
            coordinates={planeTheta90}
            globalMax={globalMax}
            updateGlobalMax={updateGlobalMax}
          />
        </div>
      </div>
      <Show when={analysis().settings.split}>
        <div class="mx-auto my-2 w-fit">
          <span class="inline-block px-2 before:mx-2 before:inline-block before:h-1 before:w-10 before:rounded before:bg-[#1f77b4] before:align-middle">
            <var>θ</var> Component
          </span>
          <span class="inline-block px-2 before:mx-2 before:inline-block before:h-1 before:w-10 before:rounded before:bg-[#ff7f0e] before:align-middle">
            <var>ϕ</var> Component
          </span>
        </div>
      </Show>
      <Sources cIdx={props.cIdx} />
    </div>
  );
}

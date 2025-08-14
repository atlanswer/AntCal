import Plane from "components/pattern/plane";
import * as d3 from "d3";
import { createMemo, createSignal, type Accessor } from "solid-js";
import { produce } from "solid-js/store";
import {
  analyses,
  setAnalyses,
  type Coordinate,
} from "src/components/pattern/contexts";
import Sources from "src/components/pattern/sources";

export default function (props: { cIdx: Accessor<number> }) {
  const analysis = () => analyses[props.cIdx()]!;
  const precision = () => analysis().settings.precision;
  const nPoints = () => Math.floor(360 / precision()) + 1;

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
      theta: (v / (n - 1)) * 2 * Math.PI,
      phi: v < n / 2 ? 0 : Math.PI,
    }));
  });
  const planePhi90: () => Coordinate[] = createMemo(() => {
    const n = nPoints();
    return d3.range(n).map((v) => ({
      theta: (v / (n - 1)) * 2 * Math.PI,
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
    <div class="w-full rounded p-4 outline">
      <div class="flex flex-wrap gap-x-4 gap-y-1">
        <span>Analysis {props.cIdx() + 1}</span>
        <label class="flex gap-1">
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
          class="flex cursor-pointer gap-1"
          title="Display traces in decibel"
        >
          dB
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
        </label>
        <label
          class="flex cursor-pointer gap-1"
          title="Split theta and phi components or not"
        >
          Split Component
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
        </label>
        <label class="flex gap-1">
          Angular Precision (deg)
          <input
            class="w-16 rounded pl-2 outline"
            type="number"
            required
            min="0.1"
            max="360"
            step="0.1"
            value={analysis().settings.precision}
            onChange={(event) =>
              setAnalyses(
                produce(
                  (analyses) =>
                    (analyses[props.cIdx()]!.settings.precision =
                      event.target.valueAsNumber),
                ),
              )
            }
          />
        </label>
        <button
          class="cursor-pointer hover:text-red-500"
          type="button"
          onClick={() =>
            setAnalyses(produce((analyses) => analyses.splice(props.cIdx(), 1)))
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
            globalMax={globalMax}
            updateGlobalMax={updateGlobalMax}
          />
          <Plane
            cIdx={props.cIdx}
            title={
              <span>
                <em>Φ</em> = π / 2
              </span>
            }
            coordinates={planePhi90}
            globalMax={globalMax}
            updateGlobalMax={updateGlobalMax}
          />
          <Plane
            cIdx={props.cIdx}
            title={
              <span>
                <em>θ</em> = π / 2
              </span>
            }
            coordinates={planeTheta90}
            globalMax={globalMax}
            updateGlobalMax={updateGlobalMax}
          />
        </div>
      </div>
      {analysis().settings.split && (
        <div class="mx-auto w-fit">
          <span class="px-2 before:mx-2 before:inline-block before:h-1 before:w-10 before:rounded before:bg-[#1f77b4] before:align-middle">
            <em>θ</em> Component
          </span>
          <span class="px-2 before:mx-2 before:inline-block before:h-1 before:w-10 before:rounded before:bg-[#ff7f0e] before:align-middle">
            <em>ϕ</em> Component
          </span>
        </div>
      )}
      <Sources cIdx={props.cIdx} />
    </div>
  );
}

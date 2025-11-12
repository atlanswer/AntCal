import type { Accessor } from "solid-js";
import { For } from "solid-js";
import { produce } from "solid-js/store";
import {
  analyses,
  halfWaveEDipole,
  setAnalyses,
} from "src/components/pattern/contexts";

export default function (props: { cIdx: Accessor<number> }) {
  const sources = () => analyses[props.cIdx()]!.sources;

  return (
    <div>
      <For each={sources()}>
        {(_, sIdx) => <SourceSetter cIdx={props.cIdx} sIdx={sIdx} />}
      </For>
      <button
        class="cursor-pointer hover:text-sky-500"
        type="button"
        title="Add new source"
        onClick={() =>
          setAnalyses(
            produce((analyses) =>
              analyses[props.cIdx()]!.sources.push(
                structuredClone(halfWaveEDipole.sources[0]!),
              ),
            ),
          )
        }
      >
        + Add Source
      </button>
    </div>
  );
}

function SourceSetter(props: {
  cIdx: Accessor<number>;
  sIdx: Accessor<number>;
}) {
  const source = () => analyses[props.cIdx()]!.sources[props.sIdx()]!;

  return (
    <div class="flex flex-wrap gap-x-2 gap-y-1">
      <span class="w-20">Source {props.sIdx() + 1}</span>
      <label class="flex gap-1">
        Type:
        <select
          class="cursor-pointer rounded pl-2 outline"
          required
          value={source().type}
          onChange={(event) =>
            setAnalyses(
              produce(
                (analyses) =>
                  (analyses[props.cIdx()]!.sources[props.sIdx()]!.type = event
                    .target.value as "J" | "M"),
              ),
            )
          }
        >
          <option value="J">J</option>
          <option value="M">M</option>
        </select>
      </label>
      {source().type === "J" && (
        <label class="flex gap-1">
          <span>
            Length (×<var>λ</var>):
          </span>
          <input
            class="w-16 rounded pl-2 outline"
            type="number"
            required
            aria-required
            min="0"
            step="0.1"
            value={source().length}
            onChange={(event) =>
              setAnalyses(
                produce((analyses) => {
                  if (Number.isFinite(event.target.valueAsNumber)) {
                    analyses[props.cIdx()]!.sources[props.sIdx()]!.length =
                      event.target.valueAsNumber;
                  }
                }),
              )
            }
          />
        </label>
      )}
      <label class="flex gap-1">
        Amplitude:
        <input
          class="w-14 rounded pl-2 outline"
          type="number"
          required
          aria-required
          min="0"
          step="0.1"
          value={source().amplitude}
          onChange={(event) => {
            setAnalyses(
              produce((analyses) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  analyses[props.cIdx()]!.sources[props.sIdx()]!.amplitude =
                    event.target.valueAsNumber;
                }
              }),
            );
          }}
        />
      </label>
      <label class="flex gap-1">
        <span>
          Phase (×<var>π</var>):
        </span>
        <input
          class="w-16 rounded pl-2 outline"
          type="number"
          required
          aria-required
          step="0.5"
          value={source().phase}
          onChange={(event) =>
            setAnalyses(
              produce((analyses) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  analyses[props.cIdx()]!.sources[props.sIdx()]!.phase =
                    event.target.valueAsNumber;
                }
              }),
            )
          }
        />
      </label>
      <span>
        Orientation (×<var>π</var>):
      </span>
      <label class="flex gap-1">
        Theta:
        <input
          class="w-16 rounded pl-2 outline"
          type="number"
          required
          aria-required
          step="0.5"
          value={source().orientation.theta}
          onChange={(event) =>
            setAnalyses(
              produce((analyses) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  analyses[props.cIdx()]!.sources[
                    props.sIdx()
                  ]!.orientation.theta = event.target.valueAsNumber;
                }
              }),
            )
          }
        />
      </label>
      <label class="flex gap-1">
        Phi:
        <input
          class="w-16 rounded pl-2 outline"
          type="number"
          required
          aria-required
          step="0.5"
          value={source().orientation.phi}
          onChange={(event) =>
            setAnalyses(
              produce((analyses) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  analyses[props.cIdx()]!.sources[
                    props.sIdx()
                  ]!.orientation.phi = event.target.valueAsNumber;
                }
              }),
            )
          }
        />
      </label>
      <span>
        Position (×<var>λ</var>):
      </span>
      <label class="flex gap-1">
        x:
        <input
          class="w-16 rounded pl-2 outline"
          type="number"
          required
          aria-required
          step="0.25"
          value={source().position[0]}
          onChange={(event) =>
            setAnalyses(
              produce((analyses) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  analyses[props.cIdx()]!.sources[props.sIdx()]!.position[0] =
                    event.target.valueAsNumber;
                }
              }),
            )
          }
        />
      </label>
      <label class="flex gap-1">
        y:
        <input
          class="w-16 rounded pl-2 outline"
          type="number"
          required
          aria-required
          step="0.25"
          value={source().position[1]}
          onChange={(event) =>
            setAnalyses(
              produce((analyses) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  analyses[props.cIdx()]!.sources[props.sIdx()]!.position[1] =
                    event.target.valueAsNumber;
                }
              }),
            )
          }
        />
      </label>
      <label class="flex gap-1">
        z:
        <input
          class="w-16 rounded pl-2 outline"
          type="number"
          required
          aria-required
          step="0.25"
          value={source().position[2]}
          onChange={(event) =>
            setAnalyses(
              produce((analyses) => {
                if (Number.isFinite(event.target.valueAsNumber)) {
                  analyses[props.cIdx()]!.sources[props.sIdx()]!.position[2] =
                    event.target.valueAsNumber;
                }
              }),
            )
          }
        />
      </label>
      <button
        class="cursor-pointer hover:text-red-500"
        type="button"
        title="Remove this source"
        onClick={() =>
          setAnalyses(
            produce((analyses) =>
              analyses[props.cIdx()]!.sources.splice(props.sIdx(), 1),
            ),
          )
        }
      >
        (Remove)
      </button>
    </div>
  );
}

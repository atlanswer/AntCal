import type { Accessor } from "solid-js";
import { For, Show } from "solid-js";
import { produce } from "solid-js/store";
import {
  analyses,
  halfWaveEDipole,
  setAnalyses,
} from "src/components/pattern/contexts";

export default function (props: { cIdx: Accessor<number> }) {
  const sources = () => analyses[props.cIdx()]!.sources;

  return (
    <div class="overflow-x-auto">
      <div class="mx-auto grid w-max grid-cols-[repeat(13,minmax(0,max-content))] gap-2 py-2">
        <For each={sources()}>
          {(_, sIdx) => <SourceSetter cIdx={props.cIdx} sIdx={sIdx} />}
        </For>
        <button
          class="col-span-full mx-1 w-fit cursor-pointer rounded px-2 outline hover:bg-sky-300 dark:hover:bg-sky-700"
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
          Add Source
        </button>
      </div>
    </div>
  );
}

function SourceSetter(props: {
  cIdx: Accessor<number>;
  sIdx: Accessor<number>;
}) {
  const source = () => analyses[props.cIdx()]!.sources[props.sIdx()]!;

  return (
    <div class="col-span-full grid grid-cols-subgrid">
      <span class="text-nowrap">Source {props.sIdx() + 1}</span>
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
      <Show
        when={source().type === "J"}
        fallback={
          <span class="my-auto h-px min-w-12 rounded bg-black dark:bg-white"></span>
        }
      >
        <label class="flex gap-1">
          <span>
            Length (×<var>λ</var>):
          </span>
          <input
            class="w-18 rounded pl-2 outline"
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
      </Show>
      <label class="flex gap-1">
        Amplitude:
        <input
          class="w-16 rounded pl-2 outline"
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
          class="w-18 rounded pl-2 outline"
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
          class="w-18 rounded pl-2 outline"
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
          class="w-18 rounded pl-2 outline"
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
          class="w-18 rounded pl-2 outline"
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
          class="w-18 rounded pl-2 outline"
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
          class="w-18 rounded pl-2 outline"
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
        class="cursor-pointer rounded px-2 outline hover:bg-red-500"
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
        Remove
      </button>
    </div>
  );
}

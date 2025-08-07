import type { Accessor } from "solid-js";
import { For } from "solid-js";
import { produce } from "solid-js/store";
import {
  configs,
  halfWaveEDipole,
  setConfigs,
} from "src/components/pattern/contexts";

export default function (props: { cIdx: Accessor<number> }) {
  return (
    <div>
      <For each={configs[props.cIdx()]}>
        {(_, sIdx) => <SourceSetter cIdx={props.cIdx} sIdx={sIdx} />}
      </For>
      <button
        class="cursor-pointer hover:text-sky-500"
        type="button"
        title="Add new source"
        onClick={() =>
          setConfigs(
            produce((conf) =>
              conf[props.cIdx()]!.push(structuredClone(halfWaveEDipole)),
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
  const source = () => configs[props.cIdx()]![props.sIdx()]!;

  return (
    <div class="flex flex-wrap gap-x-4">
      <span>Source ({props.sIdx() + 1})</span>
      <label class="flex gap-1">
        Type:
        <select
          class="cursor-pointer"
          required
          value={source().type}
          onChange={(event) =>
            setConfigs(
              produce(
                (conf) =>
                  (conf[props.cIdx()]![props.sIdx()]!.type = event.target
                    .value as "J" | "M"),
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
          Length:
          <input
            class="w-16"
            type="number"
            required
            min="0"
            step="0.1"
            value={source().length}
            onChange={(event) =>
              setConfigs(
                produce(
                  (conf) =>
                    (conf[props.cIdx()]![props.sIdx()]!.length =
                      event.target.valueAsNumber),
                ),
              )
            }
          />
        </label>
      )}
      <label class="flex gap-1">
        Amplitude:
        <input
          class="w-16"
          type="number"
          required
          min="0"
          step="0.1"
          value={source().amplitude}
          onChange={(event) =>
            setConfigs(
              produce(
                (conf) =>
                  (conf[props.cIdx()]![props.sIdx()]!.amplitude =
                    event.target.valueAsNumber),
              ),
            )
          }
        />
      </label>
      <label class="flex gap-1">
        Phase:
        <input
          class="w-16"
          type="number"
          required
          step="0.5"
          value={source().phase}
          onChange={(event) =>
            setConfigs(
              produce(
                (conf) =>
                  (conf[props.cIdx()]![props.sIdx()]!.phase =
                    event.target.valueAsNumber),
              ),
            )
          }
        />
      </label>
      <span>Orientation:</span>
      <label class="flex gap-1">
        Theta:
        <input
          class="w-16"
          type="number"
          required
          step="0.5"
          value={source().orientation.theta}
          onChange={(event) =>
            setConfigs(
              produce(
                (conf) =>
                  (conf[props.cIdx()]![props.sIdx()]!.orientation.theta =
                    event.target.valueAsNumber),
              ),
            )
          }
        />
      </label>
      <label class="flex gap-1">
        Phi:
        <input
          class="w-16"
          type="number"
          required
          step="0.5"
          value={source().orientation.phi}
          onChange={(event) =>
            setConfigs(
              produce(
                (conf) =>
                  (conf[props.cIdx()]![props.sIdx()]!.orientation.phi =
                    event.target.valueAsNumber),
              ),
            )
          }
        />
      </label>
      <span>Position:</span>
      <label class="flex gap-1">
        x:
        <input
          class="w-16"
          type="number"
          required
          step="0.5"
          value={source().position[0]}
          onChange={(event) =>
            setConfigs(
              produce(
                (conf) =>
                  (conf[props.cIdx()]![props.sIdx()]!.position[0] =
                    event.target.valueAsNumber),
              ),
            )
          }
        />
      </label>
      <label class="flex gap-1">
        y:
        <input
          class="w-16"
          type="number"
          required
          step="0.5"
          value={source().position[1]}
          onChange={(event) =>
            setConfigs(
              produce(
                (conf) =>
                  (conf[props.cIdx()]![props.sIdx()]!.position[1] =
                    event.target.valueAsNumber),
              ),
            )
          }
        />
      </label>
      <label class="flex gap-1">
        z:
        <input
          class="w-16"
          type="number"
          required
          step="0.5"
          value={source().position[2]}
          onChange={(event) =>
            setConfigs(
              produce(
                (conf) =>
                  (conf[props.cIdx()]![props.sIdx()]!.position[2] =
                    event.target.valueAsNumber),
              ),
            )
          }
        />
      </label>
      <button
        class="cursor-pointer hover:text-red-500"
        type="button"
        title="Remove this source"
        onClick={() =>
          setConfigs(
            produce((conf) => conf[props.cIdx()]!.splice(props.sIdx(), 1)),
          )
        }
      >
        (Remove)
      </button>
    </div>
  );
}

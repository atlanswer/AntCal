import type { Accessor } from "solid-js";
import { configs, setConfigs } from "components/pattern/context";
import { For } from "solid-js";

export default function (props: { cIdx: Accessor<number> }) {
  return (
    <div>
      <For each={configs[props.cIdx()]}>
        {(_, sIdx) => <SourceSetter cIdx={props.cIdx} sIdx={sIdx} />}
      </For>
    </div>
  );
}

function SourceSetter(props: {
  cIdx: Accessor<number>;
  sIdx: Accessor<number>;
}) {
  return (
    <p class="font-mono text-sm">
      {JSON.stringify(configs[props.cIdx()]![props.sIdx()], null, 2)}
    </p>
  );
}

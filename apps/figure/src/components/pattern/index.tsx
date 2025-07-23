import { configs, setConfigs } from "components/pattern/context";
import Analysis from "components/pattern/analysis";
import { For } from "solid-js";

export default function () {
  return (
    <div class="flex flex-col items-center gap-8 p-8">
      <For each={configs}>{(_, idx) => <Analysis idx={idx} />}</For>
    </div>
  );
}

import Analysis from "components/pattern/analysis";
import { For } from "solid-js";
import { produce } from "solid-js/store";
import {
  analyses,
  halfWaveEDipole,
  setAnalyses,
} from "src/components/pattern/contexts";

export default function () {
  return (
    <div class="flex flex-col items-center gap-8 p-8">
      <For each={analyses}>{(_, cIdx) => <Analysis cIdx={cIdx} />}</For>
      <button
        class="cursor-pointer rounded px-4 py-2 outline"
        type="button"
        title="Add new analysis"
        onClick={() => {
          setAnalyses(
            produce((analyses) =>
              analyses.push(structuredClone(halfWaveEDipole)),
            ),
          );
        }}
      >
        New Analysis
      </button>
    </div>
  );
}

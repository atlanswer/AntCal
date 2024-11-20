import { Index, type Component } from "solid-js";
import { AddSource } from "~/components/figure/AddSource";
import type { Source } from "~/components/figure/context";
import { SourceCard } from "~/components/figure/SourceCard";

export const SourcesPanel: Component<{
  sources: Source[];
  idx: number;
}> = (props) => {
  return (
    <div class="flex flex-col place-items-center gap-2">
      <Index each={props.sources}>
        {(source, idx) => (
          <SourceCard source={source} figIdx={props.idx} srcIdx={idx} />
        )}
      </Index>
      <AddSource idx={props.idx} />
    </div>
  );
};

import { AddSource } from "components/figure/AddSource";
import type { Source } from "components/figure/context";
import { SourceItem } from "components/figure/SourceItem";
import { Index, type Component } from "solid-js";

export const SourcesPanel: Component<{
  sources: Source[];
  idx: number;
}> = (props) => {
  return (
    <div class="flex flex-col place-items-center gap-2">
      <Index each={props.sources}>
        {(source, idx) => (
          <SourceItem source={source} figIdx={props.idx} srcIdx={idx} />
        )}
      </Index>
      <AddSource idx={props.idx} />
    </div>
  );
};

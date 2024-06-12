// @refresh granular

import { Index, type Component } from "solid-js";
import { AddSource } from "~/components/figure/AddSource";
import type { Source } from "~/components/figure/context";
import { SourceCard } from "~/components/figure/SourceCard";
import { SourcePreview } from "~/components/figure/SourcePreview";

export const SourcesPanel: Component<{
  sources: Source[];
  idx: number;
}> = (props) => {
  return (
    <div class="flex flex-wrap place-content-center place-items-center gap-4">
      <SourcePreview sources={props.sources} />
      <Index each={props.sources}>
        {(source, idx) => (
          <SourceCard source={source} figIdx={props.idx} srcIdx={idx} />
        )}
      </Index>
      <AddSource idx={props.idx} />
    </div>
  );
};

import * as d3 from "d3";
import { createEffect, createSignal, createUniqueId } from "solid-js";

export default function DemoColorScheme() {
  let pRef: HTMLParagraphElement | undefined;
  const sentenceInputId = createUniqueId();

  const [sentence, setSentence] = createSignal(
    "A list of ten words to explore this scale's domain",
  );

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  createEffect(() => {
    color.domain(sentence().split(/ /));

    d3.select(pRef!)
      .selectAll("span")
      .data(color.domain())
      .join("span")
      .text((d) => d)
      .style("padding", "0.25rem")
      .style("background", (d) => color(d));
  });

  return (
    <div class="flex w-full flex-col gap-4">
      <label for={sentenceInputId}>Enter a sentence:</label>
      <input
        type="text"
        id={sentenceInputId}
        value={sentence()}
        onChange={(event) => setSentence(event.target.value)}
      />
      <p ref={pRef} class="wrap-break-word" />
    </div>
  );
}

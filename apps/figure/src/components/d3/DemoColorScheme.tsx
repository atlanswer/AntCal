import * as d3 from "d3";
import { onMount } from "solid-js";

export default function DemoColorScheme() {
  let pRef: HTMLParagraphElement | undefined;

  onMount(() => {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    color.domain(
      "A list of ten words to explore this scale's domain".split(/ /),
    );

    d3.select(pRef!)
      .selectAll("span")
      .data(color.domain())
      .join("span")
      .text((d) => d)
      .style("padding", "0.25rem")
      .style("background", (d) => color(d));
  });

  return <p ref={pRef} class="w-full break-words" />;
}

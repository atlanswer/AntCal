import { configs } from "components/pattern/context";
import type { ObservationPoint } from "components/pattern/context";

export default function (props: { title: string; points: ObservationPoint[] }) {
  let svgRef: SVGSVGElement | undefined;

  const DPI = 72;
  const width = 3.5 / 2;
  const height = 3.5 / 2;

  return (
    <div>
      <p>{props.title}</p>
      <div class="rounded outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          ref={svgRef}
          viewBox={`0 0 ${width * DPI} ${height * DPI}`}
          preserveAspectRatio="xMidYMid meet"
          class="h-full w-full"
        ></svg>
      </div>
    </div>
  );
}

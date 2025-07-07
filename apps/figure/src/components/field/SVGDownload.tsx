import { setErrBadge } from "components/field/contexts";

export default function SVGDownload(props: {
  target: SVGSVGElement | undefined;
}) {
  return (
    <button
      type="button"
      class="rounded bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-700"
      onClick={async () => {
        if (props.target === undefined) {
          setErrBadge({
            err: "No SVG element found",
            detail:
              "The SVG element reference is invalid, please report this to the author.",
          });
          return;
        }

        const svg = props.target.cloneNode(true);
        const defs = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "defs",
        );
        svg.insertBefore(defs, svg.firstChild);
        const style = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "style",
        );
        defs.appendChild(style);

        const globalStyleText = (await import("styles/global.css?inline"))
          .default;
        style.textContent = globalStyleText;

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);

        const svgLink = document.createElement("a");
        svgLink.href = svgUrl;
        svgLink.download = "download.svg";
        svgLink.click();

        URL.revokeObjectURL(svgUrl);
      }}
    >
      Download SVG
    </button>
  );
}

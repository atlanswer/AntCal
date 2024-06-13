import { DEV } from "solid-js";

export default function VercelSpeedInsight() {
  const src =
    DEV ?
      "https://va.vercel-scripts.com/v1/speed-insights/script.debug.js"
    : "/_vercel/speed-insights/script.js";

  return (
    <>
      <script>
        {
          "window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };"
        }
      </script>
      <script defer src={src} />
    </>
  );
}

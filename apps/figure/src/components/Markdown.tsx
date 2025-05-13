"use server";

import { Link } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { math, mathHtml } from "micromark-extension-math";
import { Suspense } from "solid-js";
import { NoHydration } from "solid-js/web";

export default (props: { md: string }) => {
  const fetchContent = createAsync(() => import(`~/routes/${props.md}.md?raw`));
  const content = () =>
    // eslint-disable-next-line
    fetchContent() ? fetchContent().default : "Fetching Markdown content...";
  return (
    <NoHydration>
      <Suspense fallback={<p>Rendering Markdown content...</p>}>
        <div
          // eslint-disable-next-line solid/no-innerhtml
          innerHTML={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            micromark(content(), {
              allowDangerousHtml: true,
              extensions: [gfm(), math()],
              htmlExtensions: [gfmHtml(), mathHtml()],
            })
          }
        />
        <Link
          href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
          integrity="sha512-fHwaWebuwA7NSF5Qg/af4UeDx9XqUpYpOGgubo3yWu+b2IQR4UeQwbb42Ti7gVAjNtVoI/I9TEoYeu9omwcC6g=="
          type="text/css"
          rel="stylesheet"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </Suspense>
    </NoHydration>
  );
};

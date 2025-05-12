import { Link } from "@solidjs/meta";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { math, mathHtml } from "micromark-extension-math";
import type { Component } from "solid-js";

export const Markdown: Component<{ md: string }> = (props) => {
  return (
    <>
      <div
        // eslint-disable-next-line solid/no-innerhtml
        innerHTML={micromark(props.md, {
          allowDangerousHtml: true,
          extensions: [gfm(), math()],
          htmlExtensions: [gfmHtml(), mathHtml()],
        })}
      />
      <Link
        href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
        integrity="sha512-fHwaWebuwA7NSF5Qg/af4UeDx9XqUpYpOGgubo3yWu+b2IQR4UeQwbb42Ti7gVAjNtVoI/I9TEoYeu9omwcC6g=="
        type="text/css"
        rel="stylesheet"
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
    </>
  );
};

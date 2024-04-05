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
        href="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-y/KaTeX/0.15.2/katex.min.css"
        type="text/css"
        rel="stylesheet"
      />
    </>
  );
};

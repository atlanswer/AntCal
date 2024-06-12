// @refresh granular

import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Markdown } from "~/components/Markdown";
import docsMd from "~/md/docs.md?raw";

export default function Docs() {
  return (
    <article class="prose prose-neutral dark:prose-invert mx-auto max-w-screen-xl px-8 py-16 md:px-16">
      <Title>Docs | AntCal</Title>
      <Suspense fallback={<p>Loading MarkDown...</p>}>
        <Markdown md={docsMd} />
      </Suspense>
    </article>
  );
}

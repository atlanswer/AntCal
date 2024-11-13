// @refresh granular

import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";
import { Markdown } from "~/components/Markdown";
import aboutMd from "~/md/about.md?raw";

export default function About() {
  return (
    <article class="saira-body prose prose-neutral dark:prose-invert prose-headings:saira-header prose-a:saira-button prose-xl mx-auto max-w-screen-xl px-8 py-16 md:px-16">
      <Title>About | AntCal</Title>
      <Suspense fallback={<p>Loading MarkDown...</p>}>
        <Markdown md={aboutMd} />
      </Suspense>
    </article>
  );
}

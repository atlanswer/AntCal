// @refresh granular

import { Title } from "@solidjs/meta";
import { Markdown } from "~/components/Markdown";
import aboutMd from "~/md/about.md?raw";

export default function About() {
  return (
    <article class="prose prose-neutral dark:prose-invert mx-auto max-w-screen-xl px-8 py-16 md:px-16">
      <Title>About | AntCal</Title>
      <Markdown md={aboutMd} />
    </article>
  );
}

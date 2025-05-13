import { Title } from "@solidjs/meta";
import { lazy } from "solid-js";
import { NoHydration } from "solid-js/web";

export default function About() {
  return (
    <article class="prose prose-neutral dark:prose-invert prose-xl mx-auto max-w-screen-xl px-8 py-16 md:px-16">
      <Title>About | AntCal</Title>
      <NoHydration>
        {(() => {
          const Markdown = lazy(() => import("~/components/Markdown"));
          return <Markdown md="about" />;
        })()}
      </NoHydration>
    </article>
  );
}

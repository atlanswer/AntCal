import { Title } from "@solidjs/meta";
import { lazy, Suspense } from "solid-js";
import { NoHydration } from "solid-js/web";

export default function Docs() {
  return (
    <article class="prose prose-neutral dark:prose-invert prose-lg mx-auto max-w-screen-xl px-8 py-16 md:px-16">
      <Title>Docs | AntCal</Title>
      <Suspense fallback={<p>Loading MarkDown...</p>}>
        <NoHydration>
          {(() => {
            const Markdown = lazy(() => import("~/components/Markdown"));
            return <Markdown md="docs" />;
          })()}
        </NoHydration>
      </Suspense>
    </article>
  );
}

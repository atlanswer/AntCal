import { MetaProvider } from "@solidjs/meta";
import { Router, type RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { ErrorBoundary, onMount, Suspense } from "solid-js";
import { isServer } from "solid-js/web";
import "~/app.css";
import { ErrorPage } from "~/components/ErrorPage";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { LoadingPage } from "~/components/LoadingPage";
import { ThemeProvider } from "~/components/theme/context";

const Layout = (props: RouteSectionProps) => {
  if (!isServer) {
    onMount(() => {
      inject();
      injectSpeedInsights();
    });
  }

  return (
    <MetaProvider>
      <ThemeProvider>
        <Header />
        <ErrorBoundary fallback={ErrorPage}>
          <main class="flex-auto">
            <Suspense fallback={LoadingPage}>{props.children}</Suspense>
          </main>
        </ErrorBoundary>
        <Footer />
      </ThemeProvider>
    </MetaProvider>
  );
};

export default function App() {
  return (
    <Router root={Layout}>
      <FileRoutes />
    </Router>
  );
}

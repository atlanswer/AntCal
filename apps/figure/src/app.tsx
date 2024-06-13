// @refresh granular

import { MetaProvider } from "@solidjs/meta";
import { Router, type RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Suspense } from "solid-js";
import "~/app.css";
import { ErrorPage } from "~/components/ErrorPage";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { LoadingPage } from "~/components/LoadingPage";
import { ThemeProvider } from "~/components/theme/context";
import VercelSpeedInsight from "~/components/vercel/SpeedInsight";

const Layout = (props: RouteSectionProps) => {
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
        <VercelSpeedInsight />
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

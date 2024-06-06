// @refresh granular

import { MetaProvider } from "@solidjs/meta";
import { Router, type RouteSectionProps } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "~/app.css";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { ThemeProvider } from "~/components/theme/context";

const Layout = (props: RouteSectionProps) => {
  return (
    <MetaProvider>
      <ThemeProvider>
        <Header />
        <main class="flex-auto">
          <Suspense fallback={<p>Loading...</p>}>{props.children}</Suspense>
        </main>
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

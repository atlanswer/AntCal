// @refresh granular

import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, type ParentComponent } from "solid-js";
import "~/app.css";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

const VercelAnalytics = clientOnly(
  () => import("~/components/vercel/Analytics"),
);

const Layout: ParentComponent = (props) => {
  return (
    <MetaProvider>
      <Header />
      <main class="flex-auto">
        <Suspense>{props.children}</Suspense>
      </main>
      <Footer />
      <VercelAnalytics />
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

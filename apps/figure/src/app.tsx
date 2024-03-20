import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, type ParentComponent } from "solid-js";
import "~/app.css";

const Layout: ParentComponent = (props) => {
  return (
    <MetaProvider>
      <main class="flex-auto">
        <Suspense>{props.children}</Suspense>
      </main>
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

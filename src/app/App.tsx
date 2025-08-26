import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryComponent } from "../shared/components/ErrorBoundaryComponent";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./Provider";
import { router } from "./routes/router";
import { Suspense } from "react";

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorBoundaryComponent}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

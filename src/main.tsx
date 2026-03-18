import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  );
} else {
  document.body.innerHTML = '<div id="root"></div>';
  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  );
}

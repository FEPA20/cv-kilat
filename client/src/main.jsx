import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

function AppLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />

        <p className="mt-4 text-sm font-bold text-slate-700">
          Memuat CV Kilat...
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Menyiapkan halaman Anda
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<AppLoading />}>
      <App />
    </Suspense>
  </StrictMode>
);
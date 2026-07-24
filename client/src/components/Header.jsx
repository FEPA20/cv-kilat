import LogoCVKilat from "./LogoCVKilat";

export default function Header({
  user,
  onLogin,
  onStart,
  onLogout,
  onPricing,
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(90deg,rgba(48,43,18,0.70)_0%,rgba(9,19,38,0.72)_28%,rgba(9,19,38,0.72)_100%)] backdrop-blur-xl">
      {/* Garis atas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-400/70 via-white/20 to-transparent" />

      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-2 px-3 sm:min-h-[88px] sm:gap-4 sm:px-6 lg:px-8">
        {/* =====================================================
            LOGO
        ===================================================== */}
        <button
          type="button"
          className="min-w-0 shrink rounded-xl text-left transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="CV Kilat"
        >
          {/* Logo mobile */}
          <span className="flex items-center gap-2 sm:hidden">
            <img
              src="/favicon.svg?v=2"
              alt=""
              className="h-9 w-9 shrink-0"
            />

            <span className="whitespace-nowrap text-base font-black text-white">
              CV{" "}
              <span className="text-amber-400">
                Kilat
              </span>
            </span>
          </span>

          {/* Logo tablet dan desktop */}
          <span className="hidden sm:block">
            <LogoCVKilat variant="light" />
          </span>
        </button>

        {/* =====================================================
            ACTIONS
        ===================================================== */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* Upgrade hanya tampil setelah login */}
          {user ? (
            <button
              type="button"
              onClick={onPricing}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-indigo-700 px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-indigo-950/25 transition hover:-translate-y-0.5 hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:px-4 sm:text-xs"
            >
              <span aria-hidden="true">
                ♛
              </span>

              <span className="sm:hidden">
                Upgrade
              </span>

              <span className="hidden sm:inline">
                Upgrade Sekarang
              </span>
            </button>
          ) : null}

          {user ? (
            <>
              {/* Dashboard */}
              <button
                type="button"
                onClick={onStart}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-2.5 text-xs font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:px-6 sm:text-sm"
              >
                <span className="sm:hidden">
                  CV Saya
                </span>

                <span className="hidden sm:inline">
                  Dashboard
                </span>
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full bg-amber-400 px-3 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-6 sm:text-sm"
              >
                <span className="sm:hidden">
                  Keluar
                </span>

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>
            </>
          ) : (
            /* Login sebelum pengguna masuk */
            <button
              type="button"
              onClick={onLogin}
              className="rounded-full bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-7 sm:text-sm"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
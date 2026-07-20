import LogoCVKilat from "./LogoCVKilat";

export default function Header({
  user,
  onLogin,
  onStart,
  onLogout,
}) {
  return (
    <header
      className="
        absolute
        inset-x-0
        top-0
        z-50
        border-b
        border-white/10
        bg-[linear-gradient(90deg,rgba(48,43,18,0.70)_0%,rgba(9,19,38,0.72)_28%,rgba(9,19,38,0.72)_100%)]
        backdrop-blur-xl
      "
    >
      {/* SUBTLE TOP HIGHLIGHT */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-400/70 via-white/20 to-transparent" />

      <div className="mx-auto flex min-h-[88px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* LOGO */}
        <button
          type="button"
          className="
            rounded-2xl
            text-left
            transition
            duration-200
            hover:-translate-y-0.5
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-amber-400
            focus-visible:ring-offset-2
            focus-visible:ring-offset-slate-950
          "
          aria-label="CV Kilat"
        >
          <LogoCVKilat variant="light" />
        </button>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                type="button"
                onClick={onStart}
                className="
                  rounded-full
                  border
                  border-white/15
                  bg-white/10
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-black/10
                  backdrop-blur-md
                  transition
                  hover:-translate-y-0.5
                  hover:border-white/25
                  hover:bg-white/15
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-amber-400
                "
              >
                Dashboard
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="
                  rounded-full
                  bg-amber-400
                  px-6
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-950
                  shadow-lg
                  shadow-amber-500/20
                  transition
                  hover:-translate-y-0.5
                  hover:bg-amber-300
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                "
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="
                rounded-full
                bg-amber-400
                px-7
                py-2.5
                text-sm
                font-bold
                text-slate-950
                shadow-lg
                shadow-amber-500/25
                transition
                hover:-translate-y-0.5
                hover:bg-amber-300
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
              "
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
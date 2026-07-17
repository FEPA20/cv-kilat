import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm py-3"
            : "bg-white/70 backdrop-blur-xl py-5"
        }
      `}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <span className="text-yellow-500">⚡</span>
          CV Kilat
        </div>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">

  <a
    href="#"
    className="
      relative
      transition
      hover:text-slate-900
      after:absolute
      after:left-0
      after:-bottom-1
      after:h-[2px]
      after:w-0
      after:bg-yellow-500
      after:transition-all
      after:duration-300
      hover:after:w-full
    "
  >
    Fitur
  </a>

  <a
    href="#"
    className="
      relative
      transition
      hover:text-slate-900
      after:absolute
      after:left-0
      after:-bottom-1
      after:h-[2px]
      after:w-0
      after:bg-yellow-500
      after:transition-all
      after:duration-300
      hover:after:w-full
    "
  >
    Template
  </a>

  <a
    href="#"
    className="
      relative
      transition
      hover:text-slate-900
      after:absolute
      after:left-0
      after:-bottom-1
      after:h-[2px]
      after:w-0
      after:bg-yellow-500
      after:transition-all
      after:duration-300
      hover:after:w-full
    "
  >
    Harga
  </a>

</nav>

        {/* CTA */}
        <button
          className="
            rounded-xl
            bg-yellow-500
            px-5
            py-2
            text-sm
            font-semibold
            text-white
            shadow
            transition-all
            duration-200
            hover:scale-105
            active:scale-95
            hover:bg-yellow-600
          "
        >
          Mulai Gratis
        </button>

      </div>
    </header>
  );
}
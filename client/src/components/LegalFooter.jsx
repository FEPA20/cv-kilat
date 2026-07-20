import { LEGAL_CONFIG } from "../config/legalConfig";

export default function LegalFooter({
  onNavigate = () => {},
  className = "",
}) {
  return (
    <footer
      className={`border-t border-white/10 bg-[#071126] px-6 py-9 text-slate-400 ${className}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-extrabold text-white">
            CV <span className="text-amber-400">Kilat</span>
          </p>
          <p className="mt-1 text-xs">
            CV profesional dalam hitungan menit.
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold"
          aria-label="Tautan legal"
        >
          <FooterButton onClick={() => onNavigate("terms")}>
            Syarat & Ketentuan
          </FooterButton>
          <FooterButton onClick={() => onNavigate("privacy")}>
            Kebijakan Privasi
          </FooterButton>
          <FooterButton onClick={() => onNavigate("cookies")}>
            Kebijakan Cookie
          </FooterButton>
          <FooterButton onClick={() => onNavigate("contact")}>
            Hubungi Kami
          </FooterButton>
        </nav>

        <p className="text-xs">
          © {new Date().getFullYear()} {LEGAL_CONFIG.productName}
        </p>
      </div>
    </footer>
  );
}

function FooterButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      {children}
    </button>
  );
}

import LogoCVKilat from "./LogoCVKilat";
import LegalFooter from "./LegalFooter";
import {
  LEGAL_CONFIG,
  hasIncompleteLegalConfig,
} from "../config/legalConfig";

export default function LegalPageShell({
  eyebrow,
  title,
  description,
  version,
  onBack = () => {},
  onNavigate = () => {},
  children,
}) {
  const incomplete = hasIncompleteLegalConfig();

  return (
    <div className="min-h-screen bg-[#eef6ff] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[78px] max-w-6xl items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Kembali"
          >
            <LogoCVKilat variant="dark" compact />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali
          </button>
        </div>
      </header>

      <main className="px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[30px] bg-[#09152b] px-7 py-10 text-white shadow-[0_25px_80px_rgba(15,23,42,0.16)] sm:px-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-300">
              {eyebrow}
            </p>

            <h1 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Berlaku: {LEGAL_CONFIG.effectiveDate}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Versi: {version}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Terakhir diperbarui: {LEGAL_CONFIG.lastUpdated}
              </span>
            </div>
          </div>

          {incomplete && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
              <strong>Konfigurasi belum final.</strong> Ganti nama pengelola,
              alamat, dan email pada
              <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5">
                src/config/legalConfig.js
              </code>
              sebelum website dipublikasikan.
            </div>
          )}

          <article className="mt-7 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
            {children}
          </article>

          <div className="mt-7 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm leading-6 text-sky-900">
            Dokumen ini merupakan draft operasional produk. Sebelum peluncuran
            komersial, pembayaran, atau pemrosesan data dalam skala besar,
            lakukan peninjauan dengan profesional hukum di Indonesia.
          </div>
        </div>
      </main>

      <LegalFooter onNavigate={onNavigate} />
    </div>
  );
}

export function LegalSection({ number, title, children }) {
  return (
    <section className="border-b border-slate-100 py-7 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-4">
        {number && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-black text-sky-700">
            {number}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-950">
            {title}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalList({ items }) {
  return (
    <ul className="space-y-2.5 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ArrowLeftIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M19 12H5M10 7l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

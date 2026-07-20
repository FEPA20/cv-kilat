export default function HeroSection({ onStart, onLogin }) {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#081326] px-6 pb-20 pt-32 text-white lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-16 h-[480px] w-[480px] rounded-full bg-amber-400/15 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-blue-500/15 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.08fr_0.92fr]">
        {/* ==================================================
            LEFT — STACKED CV VISUAL
        ================================================== */}
        <div className="relative mx-auto flex min-h-[520px] w-full max-w-[650px] items-center justify-center lg:justify-start">
          {/* Decorative badge */}
          <div className="absolute left-0 top-8 z-30 hidden items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 shadow-xl backdrop-blur-md sm:flex">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
              ✓
            </span>

            CV profesional siap digunakan
          </div>

          {/* BACK CARD */}
          <div className="absolute left-[8%] top-[92px] hidden h-[390px] w-[275px] -rotate-[11deg] rounded-[18px] border border-white/10 bg-[#152542] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:block">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-amber-300/20" />

              <div className="space-y-2">
                <div className="h-3 w-28 rounded-full bg-white/80" />
                <div className="h-2 w-20 rounded-full bg-white/25" />
              </div>
            </div>

            <div className="mb-5 h-px bg-white/10" />

            <div className="space-y-3">
              <div className="h-3 w-24 rounded-full bg-amber-300/70" />
              <div className="h-2 w-full rounded-full bg-white/15" />
              <div className="h-2 w-[88%] rounded-full bg-white/15" />
              <div className="h-2 w-[75%] rounded-full bg-white/15" />
            </div>

            <div className="mt-7 space-y-3">
              <div className="h-3 w-20 rounded-full bg-amber-300/70" />
              <div className="h-2 w-full rounded-full bg-white/15" />
              <div className="h-2 w-[82%] rounded-full bg-white/15" />
              <div className="h-2 w-[90%] rounded-full bg-white/15" />
            </div>
          </div>

          {/* MIDDLE CARD */}
          <div className="absolute left-[28%] top-[62px] hidden h-[430px] w-[300px] rotate-[7deg] rounded-[18px] bg-[#f3eee9] p-6 text-slate-900 shadow-[0_30px_90px_rgba(0,0,0,0.40)] sm:block">
            <div className="mb-5 rounded-xl bg-[#ded1c8] p-4">
              <div className="h-4 w-36 rounded-full bg-slate-800" />
              <div className="mt-2 h-2 w-24 rounded-full bg-slate-600/40" />
            </div>

            <div className="grid grid-cols-[0.75fr_1.25fr] gap-4">
              <div className="space-y-4 border-r border-slate-300 pr-4">
                <div>
                  <div className="mb-2 h-2.5 w-16 rounded bg-slate-700" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-slate-300" />
                    <div className="h-1.5 w-[85%] rounded bg-slate-300" />
                    <div className="h-1.5 w-[72%] rounded bg-slate-300" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 h-2.5 w-14 rounded bg-slate-700" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-slate-300" />
                    <div className="h-1.5 w-[76%] rounded bg-slate-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 h-2.5 w-20 rounded bg-slate-700" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-slate-300" />
                    <div className="h-1.5 w-[92%] rounded bg-slate-300" />
                    <div className="h-1.5 w-[80%] rounded bg-slate-300" />
                    <div className="h-1.5 w-[88%] rounded bg-slate-300" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 h-2.5 w-24 rounded bg-slate-700" />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-slate-300" />
                    <div className="h-1.5 w-[84%] rounded bg-slate-300" />
                    <div className="h-1.5 w-[90%] rounded bg-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CV CARD */}
          <div className="relative z-20 w-full max-w-[390px] rounded-[22px] border border-slate-200 bg-white p-7 text-slate-900 shadow-[0_35px_100px_rgba(0,0,0,0.48)] transition duration-500 hover:-translate-y-2 sm:ml-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-500">
                  CV Kilat
                </p>

                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                  Febby Pahlawan
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Warehouse Manager
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-2xl shadow-lg shadow-amber-500/25">
                ⚡
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 border-y border-slate-200 py-3 text-[10px] font-medium text-slate-500">
              <span>febby@email.com</span>
              <span>+62 812 3456 7890</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-900">
                  Profil
                </h3>

                <p className="text-[11px] leading-5 text-slate-600">
                  Warehouse Manager berpengalaman dalam pengelolaan operasional,
                  inventory control, audit, dan pengembangan produktivitas tim.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-900">
                  Pengalaman
                </h3>

                <div className="border-l-2 border-amber-400 pl-4">
                  <div className="flex justify-between gap-3">
                    <p className="text-xs font-bold">
                      Warehouse Manager
                    </p>

                    <span className="text-[9px] font-semibold text-slate-400">
                      2024–Sekarang
                    </span>
                  </div>

                  <p className="mt-1 text-[10px] font-semibold text-amber-600">
                    PT Agres Info Teknologi
                  </p>

                  <ul className="mt-2 space-y-1 text-[10px] leading-4 text-slate-600">
                    <li>• Mengelola operasional warehouse</li>
                    <li>• Meningkatkan akurasi dan produktivitas</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-900">
                  Keahlian
                </h3>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Inventory",
                    "Leadership",
                    "Audit",
                    "Microsoft Office",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-bold text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating ATS badge */}
            <div className="absolute -right-5 top-24 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-xl">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs">
                ✓
              </span>

              <div>
                <p className="text-[9px] font-bold text-slate-800">
                  ATS Friendly
                </p>
                <p className="text-[8px] text-slate-400">
                  Siap dilamar
                </p>
              </div>
            </div>
          </div>

          {/* Floating decoration */}
          <div className="absolute bottom-8 left-5 z-30 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
            <p className="text-xs font-bold text-white">
              5 menit
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              CV siap digunakan
            </p>
          </div>
        </div>

        {/* ==================================================
            RIGHT — CONTENT
        ================================================== */}
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-300">
            <span>⚡</span>
            CV Builder Profesional
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-[64px]">
            Buat CV yang
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              menarik perhatian HR.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
            Isi data sekali, pilih desain terbaik, dan dapatkan CV profesional
            yang siap dikirim dalam hitungan menit.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-7 text-sm font-extrabold text-slate-950 shadow-[0_18px_45px_rgba(245,158,11,0.24)] transition hover:-translate-y-1 hover:from-amber-300 hover:to-yellow-400"
            >
              Buat CV Gratis

              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>

            <button
              type="button"
              onClick={onLogin}
              className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
            >
              Login Akun
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-slate-400 lg:justify-start">
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Tanpa kemampuan desain
            </span>

            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              ATS Friendly
            </span>

            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Preview langsung
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
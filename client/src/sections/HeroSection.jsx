export default function HeroSection({
  onStart = () => {},
  onTemplates,
  onLogin,
}) {
  const handleTemplates = onTemplates || onStart;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(105deg,#f7faff_0%,#f8fbff_45%,#fff9c9_100%)] px-5 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-sky-200/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-28 top-24 h-[440px] w-[440px] rounded-full bg-yellow-300/30 blur-[120px]" />

      <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
        {/* ==================================================
            LEFT CONTENT
        ================================================== */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-yellow-100/90 px-4 py-2 text-sm font-bold text-amber-700 shadow-sm">
            <span className="text-amber-500">⚡</span>
            ATS Friendly
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[1.03] tracking-[-0.055em] text-[#071126] sm:text-6xl lg:text-[76px]">
            Buat CV Profesional
            <span className="block text-[#f5b400]">
              dalam Hitungan Menit.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg lg:text-[20px]">
            Tidak perlu Microsoft Word dan tidak perlu jago desain. Isi data,
            pilih template, lalu CV Kilat membantu menyiapkan CV profesional
            yang siap dikirim ke HR.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#ffc000] px-8 text-base font-extrabold text-slate-950 shadow-[0_16px_35px_rgba(245,180,0,0.24)] transition duration-200 hover:-translate-y-1 hover:bg-[#ffd038]"
            >
              <span className="text-amber-500">⚡</span>
              Buat CV Gratis
            </button>

            <button
              type="button"
              onClick={handleTemplates}
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white/80 px-8 text-base font-bold text-slate-900 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:bg-white"
            >
              Lihat Template
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
            <FeatureCheck text="Tanpa kemampuan desain" />
            <FeatureCheck text="Preview langsung" />
            <FeatureCheck text="Siap diunduh PDF" />
          </div>
        </div>

        {/* ==================================================
            RIGHT — FAKE CV PREVIEW
        ================================================== */}
        <div className="relative mx-auto w-full max-w-[670px]">
          {/* BACK PAPER */}
          <div className="absolute left-[6%] top-[7%] hidden h-[520px] w-[365px] -rotate-[7deg] rounded-[22px] border border-slate-200 bg-white/70 shadow-[0_30px_80px_rgba(15,23,42,0.10)] sm:block">
            <div className="h-full w-full rounded-[22px] bg-[linear-gradient(135deg,rgba(14,165,233,0.06),rgba(255,255,255,0.82))]" />
          </div>

          {/* SECOND PAPER */}
          <div className="absolute right-[1%] top-[3%] hidden h-[540px] w-[380px] rotate-[5deg] rounded-[22px] border border-amber-100 bg-[#fffdf2] shadow-[0_28px_70px_rgba(15,23,42,0.10)] sm:block">
            <div className="absolute left-7 top-8 h-3 w-32 rounded-full bg-amber-200" />
            <div className="absolute left-7 top-16 h-2 w-[75%] rounded-full bg-slate-200" />
            <div className="absolute left-7 top-24 h-2 w-[62%] rounded-full bg-slate-100" />
          </div>

          {/* MAIN CV */}
          <article className="relative z-10 mx-auto overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_35px_90px_rgba(15,23,42,0.18)]">
            {/* TOP ACCENT */}
            <div className="h-2 bg-gradient-to-r from-[#0f4c81] via-sky-500 to-[#ffc000]" />

            <div className="grid min-h-[570px] md:grid-cols-[180px_1fr]">
              {/* SIDEBAR */}
              <aside className="relative bg-[#0f2744] px-6 py-8 text-white">
                <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl" />

                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[26px] border-4 border-white/20 bg-gradient-to-br from-amber-300 to-amber-500 text-3xl font-black text-slate-950 shadow-xl shadow-black/20">
                    FP
                  </div>

                  <div className="mt-7">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
                      Kontak
                    </p>

                    <div className="mt-4 space-y-3 text-[10px] leading-4 text-slate-300">
                      <ContactLine
                        icon={<MailIcon className="h-3.5 w-3.5" />}
                        text="febby@email.com"
                      />
                      <ContactLine
                        icon={<PhoneIcon className="h-3.5 w-3.5" />}
                        text="+62 812 3456 7890"
                      />
                      <ContactLine
                        icon={<LocationIcon className="h-3.5 w-3.5" />}
                        text="Jakarta, Indonesia"
                      />
                    </div>
                  </div>

                  <SidebarSection title="Keahlian">
                    <SkillBar label="Warehouse Operation" value="92%" />
                    <SkillBar label="Inventory Control" value="95%" />
                    <SkillBar label="Leadership" value="88%" />
                    <SkillBar label="Audit Internal" value="84%" />
                  </SidebarSection>

                  <SidebarSection title="Bahasa">
                    <div className="space-y-2.5 text-[10px]">
                      <LanguageRow label="Indonesia" level="Native" />
                      <LanguageRow label="English" level="Intermediate" />
                    </div>
                  </SidebarSection>

                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-300">
                      Kekuatan Utama
                    </p>
                    <p className="mt-2 text-[10px] leading-5 text-slate-300">
                      Problem solving, productivity improvement, dan team
                      development.
                    </p>
                  </div>
                </div>
              </aside>

              {/* MAIN CONTENT */}
              <div className="relative px-7 py-8 sm:px-9">
                <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-bl-[80px] bg-amber-100/70" />

                <header className="relative border-b border-slate-200 pb-6">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-sky-700">
                        Curriculum Vitae
                      </p>

                      <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-[38px]">
                        Febby Pahlawan
                      </h2>

                      <p className="mt-1 text-sm font-extrabold text-[#9a6700]">
                        Warehouse Manager
                      </p>
                    </div>

                    <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-2 text-[10px] font-black text-emerald-700 shadow-sm">
                      <CheckIcon className="h-3.5 w-3.5" />
                      ATS 92
                    </span>
                  </div>
                </header>

                <CvSection title="Profil Profesional">
                  <p className="text-[11px] leading-5 text-slate-600">
                    Warehouse Manager dengan pengalaman lebih dari 5 tahun
                    dalam pengelolaan operasional gudang, inventory control,
                    audit internal, dan pengembangan produktivitas tim.
                    Berorientasi pada akurasi, efisiensi proses, serta
                    pencapaian target operasional.
                  </p>
                </CvSection>

                <CvSection title="Pengalaman Kerja">
                  <TimelineItem
                    title="Warehouse Manager"
                    company="PT Agres Info Teknologi"
                    period="2024 — Sekarang"
                    bullets={[
                      "Mengelola operasional warehouse dan pencapaian KPI tim.",
                      "Meningkatkan produktivitas melalui monitoring dan evaluasi harian.",
                      "Memastikan akurasi stok, kepatuhan SOP, dan pelaksanaan 5R.",
                    ]}
                  />

                  <TimelineItem
                    title="Internal Audit Staff"
                    company="Perusahaan Distribusi Nasional"
                    period="2021 — 2023"
                    bullets={[
                      "Melakukan audit dokumen, stok, dan proses operasional.",
                      "Menyusun temuan serta tindakan perbaikan lintas divisi.",
                    ]}
                    last
                  />
                </CvSection>

                <div className="grid gap-6 border-t border-slate-200 pt-5 sm:grid-cols-2">
                  <div>
                    <SectionLabel>Pendidikan</SectionLabel>
                    <p className="mt-2 text-[11px] font-black text-slate-850">
                      S1 Manajemen
                    </p>
                    <p className="mt-1 text-[10px] text-slate-600">
                      Universitas Indonesia
                    </p>
                    <p className="mt-1 text-[9px] font-semibold text-slate-600">
                      2014 — 2018
                    </p>
                  </div>

                  <div>
                    <SectionLabel>Sertifikasi</SectionLabel>
                    <div className="mt-2 space-y-2">
                      <CertificateRow text="Warehouse Management" />
                      <CertificateRow text="Internal Audit Fundamental" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-600">
                        Pencapaian
                      </p>
                      <p className="mt-1 text-[11px] font-extrabold text-slate-800">
                        Akurasi stok hingga 99,6%
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-lg">
                      📈
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* FLOATING BADGE */}
          <div className="absolute -bottom-5 left-5 z-20 hidden items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.15)] sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <EditIcon className="h-5 w-5" />
            </span>

            <div>
              <p className="text-xs font-black text-slate-900">
                Langsung bisa diedit
              </p>
              <p className="mt-0.5 text-[10px] text-slate-600">
                Ganti data contoh menjadi data Anda
              </p>
            </div>
          </div>

          <div className="absolute -right-3 top-20 z-20 hidden rounded-2xl bg-[#0f2744] px-4 py-3 text-white shadow-xl sm:block">
            <p className="text-[10px] font-black text-amber-300">
              TEMPLATE PROFESIONAL
            </p>
            <p className="mt-1 text-[9px] text-slate-300">
              Preview CV aktif
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CvSection({ title, children }) {
  return (
    <section className="py-5">
      <SectionLabel>{title}</SectionLabel>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#0f4c81]">
      <span className="h-2 w-2 rounded-full bg-[#ffc000]" />
      {children}
    </h3>
  );
}

function TimelineItem({
  title,
  company,
  period,
  bullets,
  last = false,
}) {
  return (
    <div className={`relative pl-5 ${last ? "" : "pb-5"}`}>
      <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#0f4c81] bg-white" />

      {!last && (
        <span className="absolute bottom-0 left-[4px] top-4 w-px bg-slate-200" />
      )}

      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
        <div>
          <p className="text-[11px] font-black text-slate-900">{title}</p>
          <p className="mt-0.5 text-[10px] font-bold text-[#9a6700]">
            {company}
          </p>
        </div>

        <span className="shrink-0 text-[9px] font-bold text-slate-600">
          {period}
        </span>
      </div>

      <ul className="mt-2 space-y-1 text-[9.5px] leading-4 text-slate-600">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="text-sky-500">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactLine({ icon, text }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-amber-300">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function SidebarSection({ title, children }) {
  return (
    <section className="mt-8">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
        {title}
      </p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SkillBar({ label, value }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-3 text-[9px] font-semibold text-slate-300">
        <span>{label}</span>
        <span className="text-slate-300">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
          style={{ width: value }}
        />
      </div>
    </div>
  );
}

function LanguageRow({ label, level }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-300">{label}</span>
      <span className="text-[9px] font-bold text-amber-300">{level}</span>
    </div>
  );
}

function CertificateRow({ text }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckIcon className="h-2.5 w-2.5" />
      </span>
      <span className="text-[9px] font-semibold leading-4 text-slate-600">
        {text}
      </span>
    </div>
  );
}

function FeatureCheck({ text }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckIcon className="h-3 w-3" />
      </span>
      {text}
    </span>
  );
}

function SvgIcon({ children, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function EditIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M13.5 5.5 18.5 10.5M4 20l3.7-.7L19 8a2.1 2.1 0 0 0-3-3L4.7 16.3 4 20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function MailIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function PhoneIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M6.5 3.5 9 8l-2 2c1.4 3 3.9 5.6 7 7l2-2 4.5 2.5-.8 3a2 2 0 0 1-2 1.5C9.2 21.5 2.5 14.8 2 6.3a2 2 0 0 1 1.5-2l3-.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function LocationIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </SvgIcon>
  );
}

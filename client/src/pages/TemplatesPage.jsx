import { useEffect, useMemo, useState } from "react";
import LogoCVKilat from "../components/LogoCVKilat";
import { CV_TEMPLATES } from "../data/cvTemplates";

const CATEGORIES = [
  "Semua",
  ...Array.from(
    new Set(CV_TEMPLATES.map((template) => template.category))
  ),
];

export default function TemplatesPage({
  user = null,
  onBack = () => {},
  onUseTemplate = () => {},
  onStartBlank = () => {},
  onLogin = () => {},
  onDashboard = () => {},
  onLogout = () => {},
}) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return CV_TEMPLATES.filter((template) => {
      const categoryMatch =
        activeCategory === "Semua" ||
        template.category === activeCategory;

      const keywordMatch =
        !keyword ||
        [
          template.name,
          template.category,
          template.description,
          ...(template.tags || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return categoryMatch && keywordMatch;
    });
  }, [activeCategory, search]);

  useEffect(() => {
    if (!selectedTemplate) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedTemplate(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedTemplate]);

  return (
    <div className="min-h-screen bg-[#f4f8fc] text-slate-900">
      <TemplateHeader
        user={user}
        onBack={onBack}
        onLogin={onLogin}
        onDashboard={onDashboard}
        onLogout={onLogout}
      />

      <main>
        <section className="relative overflow-hidden bg-[#09152b] px-5 pb-20 pt-16 text-white sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute -left-32 -top-28 h-[420px] w-[420px] rounded-full bg-amber-400/15 blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-sky-500/15 blur-[130px]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_430px]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-300">
                  <SparkIcon className="h-4 w-4" />
                  {CV_TEMPLATES.length} template CV siap diedit
                </div>

                <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[62px]">
                  Pilih contoh CV.
                  <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Ubah menjadi milik Anda.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  Setiap template sudah berisi data contoh profesional. Gunakan
                  contoh lengkap sebagai panduan atau ambil desainnya saja dan
                  mulai dengan data kosong.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("template-gallery")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-amber-400 px-7 font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
                  >
                    Lihat Template
                    <ArrowDownIcon className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={onStartBlank}
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-7 font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Mulai dari Kosong
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                  <FeatureCheck text="Langsung masuk builder" />
                  <FeatureCheck text="Data contoh dapat diganti" />
                  <FeatureCheck text="Template master tetap aman" />
                </div>
              </div>

              <HeroTemplateStack />
            </div>
          </div>
        </section>

        <section
          id="template-gallery"
          className="px-5 py-16 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sky-600">
                  Galeri Template
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Temukan CV sesuai tujuan karier Anda
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Tersedia {CV_TEMPLATES.length} pilihan untuk berbagai profesi.
                  Klik preview untuk melihat isi contoh, lalu gunakan data
                  contoh lengkap atau ambil desainnya saja.
                </p>
              </div>

              <label className="relative block w-full lg:max-w-sm">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari template atau profesi..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
            </div>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                      active
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {filteredTemplates.length > 0 ? (
              <div className="mt-9 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={() => setSelectedTemplate(template)}
                    onUse={() => setSelectedTemplate(template)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <SearchIcon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                  Template belum ditemukan
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Coba kata kunci lain atau pilih kategori Semua.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white px-5 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            <ProcessCard
              number="01"
              title="Pilih contoh CV"
              text="Lihat data contoh, susunan bagian, warna, dan gaya template."
            />
            <ProcessCard
              number="02"
              title="Gunakan template"
              text="Pilih data contoh lengkap atau desain saja dengan data kosong."
            />
            <ProcessCard
              number="03"
              title="Edit menjadi milik Anda"
              text="Semua data hasil salinan dapat langsung diubah di CV Builder."
            />
          </div>
        </section>
      </main>

      {selectedTemplate && (
        <TemplateActionModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUseSample={() => {
            onUseTemplate(selectedTemplate, "sample");
            setSelectedTemplate(null);
          }}
          onUseDesign={() => {
            onUseTemplate(selectedTemplate, "design");
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}

function TemplateHeader({
  user,
  onBack,
  onLogin,
  onDashboard,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Kembali"
        >
          <LogoCVKilat variant="dark" compact />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:inline-flex"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Kembali
          </button>

          {user ? (
            <>
              <button
                type="button"
                onClick={onDashboard}
                className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function TemplateCard({ template, onPreview, onUse }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(15,23,42,0.12)]">
      <button
        type="button"
        onClick={onPreview}
        className="relative block w-full overflow-hidden bg-[#e8eef5] p-5 text-left"
        aria-label={`Preview ${template.name}`}
      >
        <div className="absolute left-5 top-5 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold text-slate-700 shadow-sm backdrop-blur">
          {template.badge}
        </div>

        <div className="absolute right-5 top-5 z-10 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
          <CheckIcon className="h-3.5 w-3.5" />
          Gratis
        </div>

        <div className="mx-auto w-[82%] origin-bottom transition duration-500 group-hover:scale-[1.025]">
          <CvThumbnail template={template} />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/15 group-hover:opacity-100">
          <span className="rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-slate-900 shadow-xl">
            Lihat Preview
          </span>
        </div>
      </button>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
              {template.category}
            </p>
            <h3 className="mt-2 text-xl font-black text-slate-950">
              {template.name}
            </h3>
          </div>

          <span
            className="mt-1 h-4 w-4 shrink-0 rounded-full ring-4 ring-slate-100"
            style={{ backgroundColor: template.accent }}
          />
        </div>

        <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
          {template.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[0.8fr_1.2fr] gap-3">
          <button
            type="button"
            onClick={onPreview}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={onUse}
            className="group/button inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600"
          >
            Gunakan Template
            <ArrowRightIcon className="h-4 w-4 transition group-hover/button:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function CvThumbnail({ template, large = false }) {
  const data = template.sampleData;
  const fullName = `${data.contact.firstName} ${data.contact.lastName}`;
  const primaryColor = template.design.primaryColor;
  const isAts = template.design.template === "ats";
  const isExecutive = template.design.template === "executive";
  const isMinimal = template.design.template === "minimal";

  return (
    <div
      className={`relative aspect-[210/297] overflow-hidden bg-white text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.18)] ${
        large ? "rounded-lg p-8" : "rounded-md p-5"
      }`}
    >
      {!isAts && !isMinimal && (
        <div
          className="absolute inset-x-0 top-0 h-[4.5%]"
          style={{ backgroundColor: primaryColor }}
        />
      )}

      <div className={`${!isAts && !isMinimal ? "pt-4" : ""}`}>
        <header
          className={`${
            isAts
              ? "border-b border-slate-400 pb-3 text-center"
              : isMinimal
                ? "border-b border-slate-200 pb-3"
                : isExecutive
                  ? "border-b-2 pb-3"
                  : "pb-3"
          }`}
          style={
            isExecutive
              ? { borderColor: primaryColor }
              : undefined
          }
        >
          <p
            className={`font-black tracking-tight ${
              large ? "text-2xl" : "text-[10px]"
            }`}
            style={{ color: isAts || isMinimal ? "#0f172a" : primaryColor }}
          >
            {fullName}
          </p>
          <p
            className={`mt-1 font-semibold text-slate-500 ${
              large ? "text-sm" : "text-[5px]"
            }`}
          >
            {data.contact.desiredJob}
          </p>
          <p
            className={`mt-1.5 text-slate-400 ${
              large ? "text-[10px]" : "text-[4px]"
            }`}
          >
            {data.contact.email} · {data.contact.phone}
          </p>
        </header>

        <ThumbnailSection
          title="PROFIL"
          color={primaryColor}
          large={large}
        >
          <p
            className={`line-clamp-3 leading-relaxed text-slate-500 ${
              large ? "text-[10px]" : "text-[4.2px]"
            }`}
          >
            {data.summary}
          </p>
        </ThumbnailSection>

        <ThumbnailSection
          title="PENGALAMAN"
          color={primaryColor}
          large={large}
        >
          <div className={large ? "space-y-3" : "space-y-1.5"}>
            {data.experiences.slice(0, 2).map((item) => (
              <div key={item.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className={`font-bold text-slate-800 ${
                        large ? "text-[10px]" : "text-[4.6px]"
                      }`}
                    >
                      {item.jobTitle}
                    </p>
                    <p
                      className={`text-slate-500 ${
                        large ? "text-[9px]" : "text-[4px]"
                      }`}
                    >
                      {item.employer}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-slate-400 ${
                      large ? "text-[8px]" : "text-[3.5px]"
                    }`}
                  >
                    {item.startDate?.slice(0, 4)}–
                    {item.current ? "Kini" : item.endDate?.slice(0, 4)}
                  </span>
                </div>
                <div
                  className={`mt-1 rounded-full bg-slate-200 ${
                    large ? "h-1.5 w-[92%]" : "h-[2px] w-[92%]"
                  }`}
                />
                <div
                  className={`mt-1 rounded-full bg-slate-100 ${
                    large ? "h-1.5 w-[78%]" : "h-[2px] w-[78%]"
                  }`}
                />
              </div>
            ))}
          </div>
        </ThumbnailSection>

        <div className={`grid grid-cols-2 ${large ? "gap-6" : "gap-3"}`}>
          <ThumbnailSection
            title="PENDIDIKAN"
            color={primaryColor}
            large={large}
          >
            <p
              className={`font-bold text-slate-700 ${
                large ? "text-[9px]" : "text-[4px]"
              }`}
            >
              {data.education[0]?.degree}
            </p>
            <p
              className={`mt-1 text-slate-400 ${
                large ? "text-[8px]" : "text-[3.5px]"
              }`}
            >
              {data.education[0]?.school}
            </p>
          </ThumbnailSection>

          <ThumbnailSection
            title="KEAHLIAN"
            color={primaryColor}
            large={large}
          >
            <div className="flex flex-wrap gap-1">
              {data.skills.slice(0, 4).map((item) => (
                <span
                  key={item.id}
                  className={`rounded-full bg-slate-100 font-semibold text-slate-500 ${
                    large
                      ? "px-2 py-1 text-[7px]"
                      : "px-1 py-0.5 text-[3.2px]"
                  }`}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </ThumbnailSection>
        </div>
      </div>
    </div>
  );
}

function ThumbnailSection({ title, color, large, children }) {
  return (
    <section className={large ? "mt-5" : "mt-2.5"}>
      <p
        className={`font-black tracking-[0.16em] ${
          large ? "text-[9px]" : "text-[4px]"
        }`}
        style={{ color }}
      >
        {title}
      </p>
      <div className={large ? "mt-2" : "mt-1"}>{children}</div>
    </section>
  );
}

function TemplateActionModal({
  template,
  onClose,
  onUseSample,
  onUseDesign,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/75 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`Gunakan template ${template.name}`}
    >
      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative flex items-center justify-center overflow-hidden bg-[#dfe8f2] p-7 sm:p-10">
          <div
            className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: template.accent }}
          />
          <div className="relative w-full max-w-[420px]">
            <CvThumbnail template={template} large />
          </div>
        </div>

        <div className="relative p-7 sm:p-10">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup"
          >
            ×
          </button>

          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">
            {template.category}
          </p>
          <h2 className="mt-3 pr-10 text-3xl font-black tracking-tight text-slate-950">
            {template.name}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            {template.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={onUseSample}
              className="group w-full rounded-2xl border-2 border-sky-500 bg-sky-50 p-5 text-left transition hover:-translate-y-0.5 hover:bg-sky-100"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                  <DocumentIcon className="h-6 w-6" />
                </span>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-extrabold text-slate-950">
                      Gunakan beserta contoh isi
                    </h3>
                    <ArrowRightIcon className="h-5 w-5 text-sky-600 transition group-hover:translate-x-1" />
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    Nama, ringkasan, pengalaman, pendidikan, dan keahlian contoh
                    ikut disalin. Semua dapat langsung Anda ganti di builder.
                  </p>
                  <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-700 shadow-sm">
                    Direkomendasikan untuk user baru
                  </span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={onUseDesign}
              className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <PaletteIcon className="h-6 w-6" />
                </span>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-extrabold text-slate-950">
                      Gunakan desain saja
                    </h3>
                    <ArrowRightIcon className="h-5 w-5 text-amber-600 transition group-hover:translate-x-1" />
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    Warna, font, dan tipe desain digunakan, tetapi seluruh data
                    pribadi dimulai dalam keadaan kosong.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
            <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Template asli tidak akan berubah. CV Kilat membuat salinan baru
              khusus untuk Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroTemplateStack() {
  return (
    <div className="relative mx-auto hidden h-[460px] w-full max-w-[430px] lg:block">
      <div className="absolute left-0 top-14 h-[350px] w-[245px] -rotate-[11deg] rounded-2xl bg-white p-5 opacity-45 shadow-2xl">
        <FakePaperLines accent="#7c3aed" />
      </div>
      <div className="absolute right-0 top-8 h-[380px] w-[265px] rotate-[8deg] rounded-2xl bg-white p-5 opacity-70 shadow-2xl">
        <FakePaperLines accent="#0d9488" />
      </div>
      <div className="absolute left-1/2 top-0 h-[420px] w-[294px] -translate-x-1/2 rounded-[22px] bg-white p-6 text-slate-900 shadow-[0_35px_100px_rgba(0,0,0,0.48)]">
        <div className="h-2.5 w-20 rounded-full bg-amber-400" />
        <div className="mt-5 h-5 w-44 rounded bg-slate-900" />
        <div className="mt-2 h-2.5 w-32 rounded bg-slate-300" />
        <div className="mt-5 h-px bg-slate-200" />
        <FakePaperLines accent="#0f4c81" />
      </div>

      <div className="absolute -bottom-1 left-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl">
        <p className="text-xs font-extrabold text-white">
          {CV_TEMPLATES.length} template tersedia
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Beragam profesi dan level karier
        </p>
      </div>

      <div className="absolute bottom-9 right-0 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-xl">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <CheckIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-extrabold">Siap diedit</p>
          <p className="text-[10px] text-slate-400">Satu kali klik</p>
        </div>
      </div>
    </div>
  );
}

function FakePaperLines({ accent }) {
  return (
    <div className="mt-5">
      <div className="h-2 w-16 rounded-full" style={{ backgroundColor: accent }} />
      <div className="mt-3 space-y-2">
        <div className="h-1.5 w-full rounded-full bg-slate-200" />
        <div className="h-1.5 w-[88%] rounded-full bg-slate-200" />
        <div className="h-1.5 w-[72%] rounded-full bg-slate-100" />
      </div>

      <div className="mt-6 h-2 w-20 rounded-full" style={{ backgroundColor: accent }} />
      <div className="mt-3 space-y-2">
        <div className="h-1.5 w-full rounded-full bg-slate-200" />
        <div className="h-1.5 w-[92%] rounded-full bg-slate-200" />
        <div className="h-1.5 w-[80%] rounded-full bg-slate-100" />
        <div className="h-1.5 w-[65%] rounded-full bg-slate-100" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="h-16 rounded-xl bg-slate-100" />
        <div className="h-16 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

function FeatureCheck({ text }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
      {text}
    </span>
  );
}

function ProcessCard({ number, title, text }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-black text-sky-600 shadow-sm">
        {number}
      </span>
      <h3 className="mt-5 text-lg font-extrabold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </article>
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

function PlusIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function SearchIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function SparkIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 3 10.5 8.5 5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m18 16-.7 2.3L15 19l2.3.7L18 22l.7-2.3L21 19l-2.3-.7L18 16Z"
        fill="currentColor"
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

function ArrowLeftIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M19 12H5M10 7l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function ArrowDownIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 5v14M7 14l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

function DocumentIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M7 3h7l4 4v14H7V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h4M10 12h5M10 16h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

function PaletteIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 4a8 8 0 1 0 0 16h1.2a1.8 1.8 0 0 0 0-3.6H12a1.7 1.7 0 0 1 0-3.4h3.5A4.5 4.5 0 0 0 20 8.5C20 6 16.4 4 12 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="9" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="9" r="1" fill="currentColor" />
    </SvgIcon>
  );
}

function ShieldIcon({ className }) {
  return (
    <SvgIcon className={className}>
      <path
        d="M12 3 19 6v5c0 4.5-2.8 7.7-7 10-4.2-2.3-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
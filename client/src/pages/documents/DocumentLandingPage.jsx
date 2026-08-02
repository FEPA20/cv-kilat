// CK-DOC-00B-SAFE-V2
import { useMemo, useState } from "react";
import DocumentBuilderModal from "./DocumentBuilderModal";
import {
  KILAT_DOCS_CATALOG,
  KILAT_DOCS_CATEGORIES,
  KILAT_DOCS_TOTAL,
  getKilatDocsCategory,
  getKilatDocsCountByCategory,
} from "../../data/kilatDocsCatalog";

const ALL_CATEGORY_ID = "all";

const workflowSteps = [
  ["01", "Ceritakan kebutuhan", "Tulis kebutuhan dengan bahasa sehari-hari. Contoh: customer belum membayar invoice."],
  ["02", "Pilih dokumen", "KilatDocs membantu memilih dokumen yang paling sesuai dengan masalah Anda."],
  ["03", "Jawab pertanyaan sederhana", "Isi data pihak, tanggal, nominal, kronologi, barang, atau lampiran melalui form."],
  ["04", "Preview dokumen", "Nantinya dokumen dapat dilihat sebagai preview resmi dan diunduh sebagai DOCX/PDF."],
];

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function CategoryCard({ item }) {
  return (
    <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-2xl text-white shadow-lg">
        {item.icon}
      </span>
      <h3 className="mt-5 text-lg font-black text-slate-950">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
      <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
        {getKilatDocsCountByCategory(item.id)} dokumen
      </span>
    </article>
  );
}

function WorkflowCard({ item }) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur">
      <span className="text-sm font-black text-amber-300">{item[0]}</span>
      <h3 className="mt-3 text-lg font-black">{item[1]}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{item[2]}</p>
    </article>
  );
}

function DocumentCard({ document, onOpen }) {
  const category = getKilatDocsCategory(document.categoryId);

  return (
    <article className="flex min-h-[330px] flex-col rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-sky-700">
          {category?.title || "Dokumen"}
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-amber-700">
          {document.status}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
        {document.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {document.description}
      </p>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          Use case
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {document.useCase}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {document.outputFormat.map((format) => (
          <span key={format} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
            {format}
          </span>
        ))}
        {document.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            {tag}
          </span>
        ))}
      </div>

      {document.risk ? (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          {document.risk}
        </p>
      ) : null}

      <div className="mt-auto grid gap-2">


        <button


          type="button"


          onClick={() => onOpen?.(document)}


          className="inline-flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-black text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"


        >


          Lihat Detail


          <span>→</span>


        </button>



        <button


          type="button"


          disabled


          className="inline-flex cursor-not-allowed items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-400"


          title="Generator dokumen masuk tahap CK-DOC-01/CK-DOC-02"


        >


          Buat Dokumen


          <span>→</span>


        </button>


      </div>
    </article>
  );
}


function DocumentDetailModal({ document, onClose, onStart }) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-slate-950/60 px-4 py-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Tutup detail dokumen"
      />

      <article className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[30px] bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
              Detail Dokumen
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              {document.title}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              {document.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Use case
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {document.useCase}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Target output
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(document.outputFormat || []).map((format) => (
                <span
                  key={format}
                  className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            Data yang akan ditanyakan
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(document.fields || []).map((field) => (
              <div
                key={field}
                className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-black text-emerald-700">
                  ✓
                </span>

                {field}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
            Keyword
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {(document.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {document.risk ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">
              Catatan risiko
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-900">
              {document.risk}
            </p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={() => onStart?.(document)}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700"
          >
            Mulai Buat Dokumen
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </article>
    </div>
  );
}

export default function DocumentLandingPage({
  user = null,
  onBack = () => {},
  onStartCv = () => {},
  onLogin = () => {},
}) {
  // CK-DOC-00C-SAFE-V2
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_ID);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  // CK-DOC-01-SAFE-V2
  const [builderDocument, setBuilderDocument] = useState(null);

  const featuredDocuments = useMemo(
    () => KILAT_DOCS_CATALOG.filter((document) => document.featured).slice(0, 6),
    []
  );

  const filteredDocuments = useMemo(() => {
    const keyword = normalizeText(searchQuery);

    return KILAT_DOCS_CATALOG.filter((document) => {
      const categoryMatches =
        selectedCategory === ALL_CATEGORY_ID || document.categoryId === selectedCategory;

      if (!categoryMatches) return false;
      if (!keyword) return true;

      const searchableText = normalizeText([
        document.title,
        document.description,
        document.useCase,
        document.categoryId,
        ...document.tags,
        ...document.fields,
      ].join(" "));

      return searchableText.includes(keyword);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-10 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />

        <header className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <button type="button" onClick={onBack} className="flex items-center gap-3 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" aria-label="Kembali">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-2xl font-black text-slate-950 shadow-lg shadow-amber-400/30">⚡</span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.22em] text-amber-300">KilatTools</span>
              <span className="block text-xl font-black tracking-tight text-white">KilatDocs</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onStartCv} className="hidden rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex">
              CV Kilat
            </button>
            <button type="button" onClick={onBack} className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg transition hover:bg-amber-100">
              Kembali
            </button>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div>
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-700">
              CK-DOC-00B · Katalog Awal
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ceritakan kebutuhan Anda. <span className="text-amber-300">Dokumen resmi langsung jadi.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              KilatDocs membantu pengguna membuat surat, berita acara, SOP,
              BAST, dokumen klaim, dan dokumen bisnis tanpa perlu mahir Microsoft Word.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-3xl font-black text-white">{KILAT_DOCS_TOTAL}</p>
                <p className="mt-1 text-sm font-bold text-slate-300">Dokumen awal</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-3xl font-black text-white">{KILAT_DOCS_CATEGORIES.length}</p>
                <p className="mt-1 text-sm font-bold text-slate-300">Kategori</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-3xl font-black text-white">DOCX/PDF</p>
                <p className="mt-1 text-sm font-bold text-slate-300">Target output</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Tahap ini menambahkan katalog dokumen lokal. Generator, AI interview,
              export dokumen, database, dan payment dokumen belum diaktifkan.
            </p>
          </div>

          <aside className="rounded-[34px] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur sm:p-6">
            <div className="rounded-[26px] bg-white p-5 text-slate-900 shadow-xl sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">Cari dokumen</p>
              <h2 className="mt-2 text-2xl font-black">Mulai dari kebutuhan, bukan dari halaman kosong.</h2>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Contoh: somasi, BAST, klaim asuransi"
                className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />

              <div className="mt-4 grid gap-3">
                {featuredDocuments.slice(0, 4).map((document) => (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(document.title);
                      setSelectedCategory(ALL_CATEGORY_ID);
                    }}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
                  >
                    <span>
                      <span className="block text-sm font-black text-slate-900">{document.title}</span>
                      <span className="mt-1 block text-xs text-slate-500">{document.useCase}</span>
                    </span>
                    <span className="text-sky-500">→</span>
                  </button>
                ))}
              </div>

              {!user ? (
                <button type="button" onClick={onLogin} className="mt-5 w-full rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600">
                  Login untuk mencoba nanti
                </button>
              ) : (
                <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                  Akun Anda sudah siap digunakan untuk modul KilatDocs.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-600">Cara kerja</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Dibuat untuk pengguna Indonesia yang tidak ingin ribet Word.
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {workflowSteps.map((item) => <WorkflowCard key={item[0]} item={item} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">Katalog awal</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Kategori KilatDocs</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            {KILAT_DOCS_TOTAL} dokumen preview
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {KILAT_DOCS_CATEGORIES.map((item) => <CategoryCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-600">Daftar dokumen</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Pilih dokumen yang ingin dibuat</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                Search dan filter ini masih memakai data lokal. Tombol buat dokumen akan diaktifkan setelah tahap generator.
              </p>
            </div>
            <div className="w-full max-w-xl">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari: somasi, asuransi, SOP, BAST, resign..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          {/* CK-DOC-00B1: category chips wrap agar tidak muncul scrollbar horizontal di desktop/mobile. */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(ALL_CATEGORY_ID)}
              className={selectedCategory === ALL_CATEGORY_ID ? "shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white" : "shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-200"}
            >
              Semua
            </button>
            {KILAT_DOCS_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "shrink-0 rounded-full bg-sky-600 px-4 py-2 text-sm font-black text-white" : "shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-200"}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-sm font-bold text-slate-600">
              Menampilkan <span className="text-slate-950">{filteredDocuments.length}</span> dari {KILAT_DOCS_TOTAL} dokumen
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(ALL_CATEGORY_ID);
              }}
              className="rounded-xl px-3 py-2 text-xs font-black text-sky-600 transition hover:bg-sky-50"
            >
              Reset
            </button>
          </div>

          {filteredDocuments.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredDocuments.map((document) => <DocumentCard
                  key={document.id}
                  document={document}
                  onOpen={setSelectedDocument}
                />)}
            </div>
          ) : (
            <div className="mt-6 rounded-[26px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-xl font-black text-slate-900">Dokumen belum ditemukan</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Coba kata lain seperti somasi, BAST, SOP, klaim, invoice, resign, atau asuransi.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">Catatan risiko</p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-amber-900 sm:text-base">
            KilatDocs membantu menyusun dokumen administratif dan draft awal.
            Dokumen berisiko tinggi seperti gugatan, akta, dokumen medis, warisan kompleks,
            atau dokumen yang memerlukan pejabat berwenang tetap membutuhkan review profesional.
          </p>
        </div>
      </section>      {selectedDocument ? (
        <DocumentDetailModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onStart={(documentToBuild) => {
            // CK-DOC-01-FIX-BUILDER-SCOPE
            setSelectedDocument(null);
            setBuilderDocument(documentToBuild);
          }}
        />
      ) : null}

      {builderDocument ? (
        <DocumentBuilderModal
          document={builderDocument}
          onClose={() => setBuilderDocument(null)}
        />
      ) : null}
    </main>
  );
}

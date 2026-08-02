// CK-DOC-00A-SAFE-V2
const documentCategories = [
  {
    title: "Surat Umum",
    description:
      "Surat pernyataan, surat kuasa, permohonan, pemberitahuan, pengaduan, dan klarifikasi.",
    icon: "✉",
  },
  {
    title: "Penagihan & Somasi",
    description:
      "Pengingat pembayaran, penagihan resmi, somasi, kronologi, dan daftar bukti.",
    icon: "⚖",
  },
  {
    title: "HR & Karyawan",
    description:
      "Cuti, resign, paklaring, surat tugas, teguran, dan dokumen hubungan kerja.",
    icon: "👥",
  },
  {
    title: "SOP & Bisnis",
    description:
      "SOP HR, finance, purchasing, warehouse, operasional, sales, dan checklist kerja.",
    icon: "☷",
  },
  {
    title: "Warehouse & Logistik",
    description:
      "BAST barang, surat jalan, stock opname, receiving, putaway, RMA, dan garansi.",
    icon: "▣",
  },
  {
    title: "Asuransi & Klaim",
    description:
      "Pengajuan klaim, kronologi kejadian, checklist dokumen, keberatan, dan banding klaim.",
    icon: "◆",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Ceritakan kebutuhan",
    description:
      "Tulis kebutuhan dengan bahasa sehari-hari. Contoh: customer belum membayar invoice.",
  },
  {
    step: "02",
    title: "Pilih dokumen",
    description:
      "KilatDocs akan membantu memilih dokumen yang paling sesuai dengan masalah Anda.",
  },
  {
    step: "03",
    title: "Jawab pertanyaan sederhana",
    description:
      "Isi data pihak, tanggal, nominal, kronologi, barang, atau lampiran melalui form.",
  },
  {
    step: "04",
    title: "Preview dokumen",
    description:
      "Nantinya dokumen dapat dilihat sebagai preview resmi dan diunduh sebagai DOCX/PDF.",
  },
];

function CategoryCard({ item }) {
  return (
    <article className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-2xl text-white shadow-lg">
        {item.icon}
      </span>

      <h3 className="mt-5 text-lg font-black text-slate-950">
        {item.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {item.description}
      </p>

      <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
        Katalog awal
      </span>
    </article>
  );
}

function WorkflowCard({ item }) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/10 p-5 text-white backdrop-blur">
      <span className="text-sm font-black text-amber-300">
        {item.step}
      </span>

      <h3 className="mt-3 text-lg font-black">
        {item.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-300">
        {item.description}
      </p>
    </article>
  );
}

export default function DocumentLandingPage({
  user = null,
  onBack = () => {},
  onStartCv = () => {},
  onLogin = () => {},
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 top-10 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />

        <header className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-3 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label="Kembali"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-2xl font-black text-slate-950 shadow-lg shadow-amber-400/30">
              ⚡
            </span>

            <span>
              <span className="block text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                KilatTools
              </span>

              <span className="block text-xl font-black tracking-tight text-white">
                KilatDocs
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onStartCv}
              className="hidden rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex"
            >
              CV Kilat
            </button>

            <button
              type="button"
              onClick={onBack}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg transition hover:bg-amber-100"
            >
              Kembali
            </button>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div>
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-700">
              CK-DOC-00A · Preview Modul
            </span>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ceritakan kebutuhan Anda.{" "}
              <span className="text-amber-300">
                Dokumen resmi langsung jadi.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              KilatDocs membantu pengguna membuat surat, berita acara, SOP,
              BAST, dokumen klaim, dan dokumen bisnis tanpa perlu mahir
              Microsoft Word.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-2xl bg-amber-400 px-6 py-4 text-base font-black text-slate-950 opacity-80 shadow-xl shadow-amber-400/20"
              >
                Mulai Buat Dokumen
                <span className="ml-3">→</span>
              </button>

              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-2xl border border-white/15 px-6 py-4 text-base font-black text-white opacity-70"
              >
                Lihat Katalog Dokumen
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              Tahap ini hanya menambahkan brand, navigasi, dan landing modul.
              Database, AI interview, generator, export dokumen, dan payment
              dokumen belum diaktifkan.
            </p>
          </div>

          <aside className="rounded-[34px] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur sm:p-6">
            <div className="rounded-[26px] bg-white p-5 text-slate-900 shadow-xl sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                AI Document Agent
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Tidak perlu mulai dari halaman kosong.
              </h2>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Contoh kebutuhan
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  “Customer belum membayar invoice sejak bulan Mei dan sudah
                  beberapa kali diingatkan.”
                </p>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  "Rekomendasi dokumen",
                  "Pertanyaan adaptif",
                  "Ringkasan fakta",
                  "Preview resmi",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">
                      ✓
                    </span>

                    <span className="text-sm font-bold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {!user ? (
                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-5 w-full rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600"
                >
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
        <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-600">
          Cara kerja
        </p>

        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Dibuat untuk pengguna Indonesia yang tidak ingin ribet Word.
        </h2>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {workflowSteps.map((item) => (
            <WorkflowCard key={item.step} item={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
              Katalog awal
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Kategori KilatDocs
            </h2>
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Database aktif di CK-DOC-01
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {documentCategories.map((item) => (
            <CategoryCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">
            Catatan risiko
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-amber-900 sm:text-base">
            KilatDocs membantu menyusun dokumen administratif dan draft awal.
            Dokumen berisiko tinggi seperti gugatan, akta, dokumen medis,
            warisan kompleks, atau dokumen yang memerlukan pejabat berwenang
            tetap membutuhkan review profesional.
          </p>
        </div>
      </section>
    </main>
  );
}

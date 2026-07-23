import Header from "../components/Header";
import HeroSection from "../sections/HeroSection";
import UserReviewsSection from "../components/UserReviewsSection";

export default function LandingPage({
  user,
  onStart,
  onLogin,
  onLogout,
  onPricing,
}) {
  const advantages = [
    {
      icon: "⚡",
      title: "Cepat & Praktis",
      description:
        "Isi data diri secara bertahap dan dapatkan CV profesional dalam hitungan menit.",
    },
    {
      icon: "🎯",
      title: "ATS Friendly",
      description:
        "Struktur CV dirancang agar mudah dibaca sistem rekrutmen dan perekrut.",
    },
    {
      icon: "✨",
      title: "Tampilan Profesional",
      description:
        "Pilih template, font, warna, dan susunan CV sesuai karakter profesional Anda.",
    },
  ];

  const problems = [
    "Bingung menyusun isi CV yang menarik.",
    "Tidak memiliki kemampuan desain.",
    "Sulit menentukan kata-kata profesional.",
    "CV terlihat biasa dan kurang meyakinkan.",
  ];

  const solutions = [
    "Form langkah demi langkah yang mudah diikuti.",
    "Live preview yang langsung berubah saat diisi.",
    "Template profesional yang dapat disesuaikan.",
    "Bantuan AI untuk pengalaman dan ringkasan.",
  ];

  const steps = [
    {
      number: "01",
      title: "Isi Data",
      description:
        "Masukkan kontak, pengalaman, pendidikan, keahlian, dan ringkasan.",
    },
    {
      number: "02",
      title: "Pilih Desain",
      description:
        "Sesuaikan template, font, warna, susunan bagian, dan foto profil.",
    },
    {
      number: "03",
      title: "Unduh CV",
      description:
        "Daftar atau login, simpan CV Anda, lalu unduh sebagai file PDF.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#081326] text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <Header
  user={user}
  onStart={onStart}
  onLogin={onLogin}
  onLogout={onLogout}
  onPricing={onPricing}
/>

<main id="main-content">
  {/* =====================================================
      HERO
  ===================================================== */}
  <HeroSection
  user={user}
  onStart={onStart}
  onLogin={onLogin}
/>

      {/* =====================================================
          ADVANTAGES
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#081326] px-6 py-20 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Keunggulan CV Kilat
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              Semua yang Anda butuhkan untuk membuat CV profesional
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-400">
              Tidak perlu menguasai aplikasi desain. CV Kilat membantu Anda
              menyusun informasi dan tampilan CV dengan lebih mudah.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {advantages.map((item) => (
              <article
                key={item.title}
                className="
                  group
                  rounded-[24px]
                  border
                  border-white/10
                  bg-white/[0.05]
                  p-7
                  shadow-[0_24px_70px_rgba(0,0,0,0.18)]
                  backdrop-blur-md
                  transition
                  duration-300
                  hover:-translate-y-2
                  hover:border-amber-300/25
                  hover:bg-white/[0.08]
                "
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-2xl shadow-lg shadow-amber-500/20">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROBLEM & SOLUTION
      ===================================================== */}
      <section className="bg-[#0b172c] px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          {/* PROBLEM */}
          <article className="rounded-[28px] border border-red-300/10 bg-red-300/[0.04] p-7 sm:p-9">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-xl text-red-300">
              !
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-300">
              Masalah yang sering terjadi
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
              Membuat CV sering terasa sulit dan membingungkan
            </h2>

            <div className="mt-8 space-y-4">
              {problems.map((problem) => (
                <div
                  key={problem}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3.5"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-400/10 text-xs font-bold text-red-300">
                    ×
                  </span>

                  <p className="text-sm leading-6 text-slate-300">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </article>

          {/* SOLUTION */}
          <article className="rounded-[28px] border border-emerald-300/10 bg-emerald-300/[0.04] p-7 sm:p-9">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-xl text-emerald-300">
              ✓
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Solusi dari CV Kilat
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
              Proses lebih sederhana dengan hasil yang profesional
            </h2>

            <div className="mt-8 space-y-4">
              {solutions.map((solution) => (
                <div
                  key={solution}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3.5"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-300">
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-slate-300">
                    {solution}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}
      <section className="relative overflow-hidden bg-[#081326] px-6 py-24 lg:px-8">
        <div className="pointer-events-none absolute -right-44 top-16 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Cara Kerja
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              CV profesional dalam tiga langkah
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-400">
              Tidak perlu memulai dari halaman kosong. Kami memandu prosesnya
              dari pengisian data sampai CV siap digunakan.
            </p>
          </div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent md:block" />

            {steps.map((item) => (
              <article
                key={item.number}
                className="relative rounded-[24px] border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur-md"
              >
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/20 bg-[#0d1b32] text-lg font-extrabold text-amber-300 shadow-xl shadow-black/20">
                  {item.number}
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {/* =====================================================
          USER REVIEWS
      ===================================================== */}
      <UserReviewsSection />


      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="bg-[#0b172c] px-6 py-20 lg:px-8">
        <div
          className="
            relative
            mx-auto
            max-w-6xl
            overflow-hidden
            rounded-[32px]
            border
            border-amber-300/15
            bg-[linear-gradient(120deg,rgba(245,158,11,0.15),rgba(255,255,255,0.04),rgba(37,99,235,0.10))]
            px-7
            py-14
            text-center
            shadow-[0_30px_100px_rgba(0,0,0,0.30)]
            sm:px-12
          "
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-60 w-60 rounded-full bg-amber-400/15 blur-[90px]" />

          <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-blue-500/15 blur-[100px]" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Mulai Sekarang
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              Buat CV yang membantu Anda tampil lebih meyakinkan
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Isi data terlebih dahulu tanpa perlu mendaftar. Login atau
              registrasi hanya diperlukan ketika Anda ingin menyimpan dan
              mengunduh CV.
            </p>

            <button
              type="button"
              onClick={onStart}
              className="
                mt-8
                inline-flex
                min-h-14
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-gradient-to-r
                from-amber-400
                to-yellow-500
                px-8
                text-sm
                font-extrabold
                text-slate-950
                shadow-[0_18px_45px_rgba(245,158,11,0.24)]
                transition
                hover:-translate-y-1
                hover:from-amber-300
                hover:to-yellow-400
              "
            >
              Buat CV Gratis Sekarang
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-white/10 bg-[#081326] px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-bold text-white">
              CV <span className="text-amber-400">Kilat</span>
            </p>

            <p className="mt-1 text-xs text-slate-400">
              CV profesional dalam hitungan menit.
            </p>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CV Kilat. Seluruh hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}

import LogoCVKilat from "../components/LogoCVKilat";

const plans = [
  {
    id: "single_cv",
    name: "CV Sekali Jadi",
    price: "19.000",
    period: "sekali bayar",
    description:
      "Cocok untuk Anda yang membutuhkan satu CV profesional untuk melamar pekerjaan.",
    features: [
      "1 CV premium",
      "Semua template premium",
      "Tanpa watermark",
      "Revisi tanpa batas selama 7 hari",
      "Download ulang selama 7 hari",
      "File PDF berkualitas tinggi",
    ],
    buttonLabel: "Pilih Paket",
    highlighted: false,
  },
  {
    id: "three_cv",
    name: "Paket Lamaran",
    price: "39.000",
    period: "sekali bayar",
    description:
      "Buat beberapa versi CV untuk posisi dan perusahaan yang berbeda.",
    features: [
      "3 kredit CV premium",
      "Semua template premium",
      "Tanpa watermark",
      "Berlaku selama 60 hari",
      "Download PDF berkualitas tinggi",
      "Cocok untuk berbagai posisi",
    ],
    buttonLabel: "Pilih Paket Terfavorit",
    highlighted: true,
    badge: "Paling Populer",
  },
  {
    id: "career_30d",
    name: "Akses Karier",
    price: "59.000",
    period: "akses 30 hari",
    description:
      "Akses lengkap untuk mendukung proses pencarian kerja Anda selama satu bulan.",
    features: [
      "Pembuatan CV tanpa batas wajar",
      "Semua template premium",
      "Tanpa watermark",
      "Akses fitur surat lamaran",
      "Download PDF berkualitas tinggi",
      "Aktif selama 30 hari",
    ],
    buttonLabel: "Aktifkan Akses Karier",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "Apakah saya harus membayar sebelum membuat CV?",
    answer:
      "Tidak. Anda tetap dapat membuat, mengedit, melihat preview, dan menyimpan CV secara gratis. Pembayaran dilakukan ketika Anda ingin mengunduh hasil premium.",
  },
  {
    question: "Apakah pembayaran diperpanjang otomatis?",
    answer:
      "Tidak. Semua paket saat ini menggunakan pembayaran sekali bayar dan tidak diperpanjang secara otomatis.",
  },
  {
    question: "Apa yang terjadi setelah masa aktif berakhir?",
    answer:
      "CV tetap tersimpan di akun Anda. Namun, akses download premium mengikuti masa berlaku atau jumlah kredit paket yang dibeli.",
  },
];

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-sm font-black text-emerald-300"
    >
      ✓
    </span>
  );
}

function PricingCard({ plan, onChoose }) {
  return (
    <article
      className={[
        "relative flex h-full flex-col rounded-[28px] border p-7 shadow-2xl backdrop-blur transition duration-300 hover:-translate-y-1",
        plan.highlighted
          ? "border-amber-300/50 bg-gradient-to-b from-amber-300/[0.14] to-white/[0.06] shadow-amber-500/10"
          : "border-white/10 bg-white/[0.05] shadow-black/20 hover:border-white/20",
      ].join(" ")}
    >
      {plan.badge ? (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-950 shadow-lg shadow-amber-500/20">
          {plan.badge}
        </span>
      ) : null}

      <div>
        <h2 className="text-2xl font-extrabold text-white">
          {plan.name}
        </h2>

        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
          {plan.description}
        </p>
      </div>

      <div className="mt-7 border-b border-white/10 pb-7">
        <div className="flex items-end gap-2">
          <span className="pb-1 text-sm font-bold text-amber-300">
            Rp
          </span>

          <span className="text-5xl font-black tracking-[-0.05em] text-white">
            {plan.price}
          </span>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-500">
          {plan.period}
        </p>
      </div>

      <ul className="mt-7 flex-1 space-y-4">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm leading-6 text-slate-300"
          >
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onChoose(plan)}
        className={[
          "mt-8 w-full rounded-2xl px-5 py-3.5 text-sm font-black transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
          plan.highlighted
            ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300"
            : "border border-white/15 bg-white/10 text-white hover:border-amber-300/40 hover:bg-white/15",
        ].join(" ")}
      >
        {plan.buttonLabel}
      </button>
    </article>
  );
}

export default function PricingPage({
  user,
  onBack,
  onChoosePlan,
}) {
  const handleChoosePlan = (plan) => {
    onChoosePlan?.(plan);
  };

  return (
    <div className="min-h-screen bg-[#081326] text-white">
      <header className="border-b border-white/10 bg-[#081326]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[88px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="rounded-2xl text-left transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Kembali ke halaman utama"
          >
            <LogoCVKilat variant="light" />
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/15 bg-white/[0.07] px-5 py-2.5 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Kembali
            </button>

            {user ? (
              <span className="hidden rounded-full bg-emerald-400/10 px-4 py-2.5 text-xs font-bold text-emerald-300 sm:inline-flex">
                Akun aktif
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-24 pt-20 lg:px-8">
          <div className="pointer-events-none absolute -left-48 top-10 h-[460px] w-[460px] rounded-full bg-sky-500/10 blur-[140px]" />

          <div className="pointer-events-none absolute -right-48 top-40 h-[460px] w-[460px] rounded-full bg-amber-400/10 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                Harga CV Kilat
              </span>

              <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                Pilih akses yang sesuai dengan kebutuhan karier Anda
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Mulai membuat CV secara gratis. Bayar hanya ketika
                Anda membutuhkan hasil premium tanpa watermark.
              </p>
            </div>

            <div className="mt-16 grid gap-7 lg:grid-cols-3">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  onChoose={handleChoosePlan}
                />
              ))}
            </div>

            <div className="mt-10 rounded-[24px] border border-emerald-300/15 bg-emerald-300/[0.05] px-6 py-5 text-center">
              <p className="text-sm font-semibold leading-7 text-emerald-200">
                Pembayaran aman dan sekali bayar. Tidak ada
                perpanjangan otomatis atau biaya tersembunyi.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-white/[0.02] px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                Pertanyaan Umum
              </span>

              <h2 className="mt-4 text-3xl font-black text-white">
                Informasi sebelum membeli paket
              </h2>
            </div>

            <div className="mt-12 space-y-4">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-[22px] border border-white/10 bg-white/[0.05] p-6"
                >
                  <h3 className="text-base font-extrabold text-white">
                    {faq.question}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CV Kilat. Semua hak dilindungi.
      </footer>
    </div>
  );
}
const PACKAGES = [
  {
    code: "SINGLE_CV",
    title: "1 CV Premium",
    price: "Rp19.000",
    badge: "",
    description:
      "Satu CV premium dengan revisi dan unduh ulang selama 7 hari.",
    benefits: [
      "1 CV premium",
      "PDF tanpa watermark",
      "Revisi dan unduh ulang 7 hari",
    ],
  },
  {
    code: "THREE_CV",
    title: "3 Kredit CV",
    price: "Rp39.000",
    badge: "Paling Hemat",
    description:
      "Buat beberapa versi CV untuk kebutuhan lowongan yang berbeda.",
    benefits: [
      "3 CV berbeda",
      "PDF tanpa watermark",
      "Kredit berlaku 60 hari",
    ],
  },
  {
    code: "CAREER_ACCESS",
    title: "Career Access",
    price: "Rp59.000",
    badge: "Akses Terlengkap",
    description:
      "Akses premium selama masa aktif untuk mendukung pencarian kerja.",
    benefits: [
      "CV premium tanpa batas",
      "PDF tanpa watermark",
      "Akses aktif 30 hari",
    ],
  },
];

export default function PaymentPackageModal({
  open,
  busy = false,
  message = "",
  sandbox = true,
  onClose,
  onChoosePlan,
  onCheckAccess,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={busy ? undefined : onClose}
        aria-label="Tutup pilihan paket"
      />

      <section className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-[30px]">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                Unduh CV tanpa watermark
              </h2>

              {sandbox ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-700">
                  Sandbox
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pilih paket. Akses unduh diberikan setelah pembayaran
              terverifikasi oleh server CV Kilat.
            </p>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-500 hover:bg-slate-200 disabled:opacity-40"
            aria-label="Tutup"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7">
          {message ? (
            <div className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold leading-6 text-sky-800">
              {message}
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-3">
            {PACKAGES.map((item) => {
              const featured = item.code === "THREE_CV";

              return (
                <article
                  key={item.code}
                  className={
                    featured
                      ? "relative rounded-3xl border-2 border-sky-400 bg-sky-50/50 p-5 shadow-lg shadow-sky-100"
                      : "relative rounded-3xl border border-slate-200 bg-white p-5"
                  }
                >
                  {item.badge ? (
                    <span className="absolute right-4 top-4 rounded-full bg-sky-500 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                      {item.badge}
                    </span>
                  ) : null}

                  <p className="pr-24 text-sm font-extrabold text-slate-900">
                    {item.title}
                  </p>

                  <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                    {item.price}
                  </p>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {item.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2 text-sm font-medium text-slate-700"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-600">
                          ✓
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onChoosePlan(item.code)}
                    className={
                      featured
                        ? "mt-6 w-full rounded-2xl bg-sky-500 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 disabled:opacity-50"
                        : "mt-6 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-extrabold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-50"
                    }
                  >
                    {busy ? "Memproses..." : `Pilih ${item.title}`}
                  </button>
                </article>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4 text-xs leading-5 text-slate-500">
            Pada mode Sandbox tidak ada uang sungguhan yang dipindahkan.
            Sistem tetap menjalankan alur verifikasi seperti pembayaran asli.
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-40"
          >
            Nanti saja
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={onCheckAccess}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-sky-600 hover:bg-sky-50 disabled:opacity-40"
          >
            {busy ? "Memeriksa..." : "Saya sudah bayar · Cek akses"}
          </button>
        </footer>
      </section>
    </div>
  );
}

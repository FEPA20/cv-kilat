export default function AIPhotoStudio({
  photo,
  processingMode = "",
  notice = null,
  onApplyBackground = () => {},
  onUseOriginal = () => {},
}) {
  const originalUrl = photo?.originalUrl || "";
  const editedUrl = photo?.editedUrl || "";
  const hasPhoto = Boolean(originalUrl);
  const processing = Boolean(processingMode);

  const noticeClasses =
    notice?.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : notice?.type === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-sky-50">
      <div className="border-b border-violet-100 px-5 py-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-xl">
            ✨
          </span>

          <div>
            <h3 className="font-bold text-slate-900">
              Studio Foto AI
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Hapus latar belakang foto dan ubah menjadi putih atau biru
              profesional. Wajah dan pakaian tidak diubah.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {hasPhoto ? (
          <div className="mb-5 grid grid-cols-2 gap-3">
            <PhotoComparisonCard
              label="Foto asli"
              imageUrl={originalUrl}
            />

            <PhotoComparisonCard
              label={editedUrl ? "Hasil edit" : "Belum diproses"}
              imageUrl={editedUrl}
              emptyText="Pilih background"
            />
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-dashed border-violet-200 bg-white/80 px-5 py-7 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              📷
            </span>
            <p className="mt-3 text-sm font-bold text-slate-800">
              Upload foto terlebih dahulu
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Gunakan foto wajah yang terang, tidak tertutup, dan memiliki
              jarak yang cukup dari kamera.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <BackgroundButton
            label="Background Putih"
            description="Formal dan netral"
            color="#FFFFFF"
            borderColor="#CBD5E1"
            active={processingMode === "white"}
            disabled={!hasPhoto || processing}
            onClick={() => onApplyBackground("white")}
          />

          <BackgroundButton
            label="Background Biru"
            description="Biru muda profesional"
            color="#DCEBFF"
            borderColor="#93C5FD"
            active={processingMode === "blue"}
            disabled={!hasPhoto || processing}
            onClick={() => onApplyBackground("blue")}
          />
        </div>

        {editedUrl ? (
          <button
            type="button"
            onClick={onUseOriginal}
            disabled={processing}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kembali ke Foto Asli
          </button>
        ) : null}

        {processing ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm text-violet-700 shadow-sm">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
            <span className="font-semibold">
              {processingMode === "blue"
                ? "Membuat background biru..."
                : "Membuat background putih..."}
            </span>
          </div>
        ) : null}

        {notice?.text ? (
          <div className={`mt-4 rounded-xl border px-4 py-3 text-xs leading-5 ${noticeClasses}`}>
            {notice.text}
          </div>
        ) : null}

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-5 text-amber-800">
          Setiap proses memakai layanan penghapus background eksternal dan
          dapat mengurangi kuota API. Gunakan kembali hasil yang sudah dibuat
          selama masih sesuai.
        </div>
      </div>
    </section>
  );
}

function PhotoComparisonCard({
  label,
  imageUrl,
  emptyText = "Belum tersedia",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            draggable="false"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs font-semibold text-slate-400">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}

function BackgroundButton({
  label,
  description,
  color,
  borderColor,
  active,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
        active
          ? "border-violet-500 ring-4 ring-violet-100"
          : "border-slate-200 hover:-translate-y-0.5 hover:border-violet-300"
      } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0`}
    >
      <span
        className="block h-10 w-full rounded-xl border shadow-inner"
        style={{
          backgroundColor: color,
          borderColor,
        }}
      />

      <span className="mt-3 block text-xs font-extrabold text-slate-800">
        {label}
      </span>

      <span className="mt-1 block text-[10px] leading-4 text-slate-500">
        {description}
      </span>
    </button>
  );
}
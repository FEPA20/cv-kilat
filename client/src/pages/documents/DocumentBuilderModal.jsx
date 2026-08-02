// CK-DOC-01-SAFE-V2
import { useEffect, useMemo, useState } from "react";

function buildInitialForm(document) {
  const fields = Array.isArray(document?.fields) ? document.fields : [];

  return fields.reduce((accumulator, field) => {
    accumulator[field] = "";
    return accumulator;
  }, {});
}

function createDraftText(document, formData) {
  const entries = Object.entries(formData || {}).filter(([, value]) =>
    String(value || "").trim(),
  );

  const title = document?.title || "Dokumen";
  const opening =
    "Draft awal ini dibuat dari data yang Anda isi. Silakan periksa kembali nama pihak, tanggal, nominal, kronologi, dan bukti sebelum digunakan.";

  if (!entries.length) {
    return [
      title.toUpperCase(),
      "",
      opening,
      "",
      "Data belum diisi. Lengkapi form di sebelah kiri untuk melihat preview draft.",
    ].join("\n");
  }

  return [
    title.toUpperCase(),
    "",
    opening,
    "",
    "RINGKASAN DATA",
    ...entries.map(([field, value]) => `- ${field}: ${value}`),
    "",
    "DRAFT NARASI",
    `Berdasarkan informasi yang telah diberikan, dokumen “${title}” ini disusun untuk kebutuhan: ${document?.useCase || "administrasi pengguna"}.`,
    "",
    "Pihak terkait, tanggal, kronologi, dan informasi pendukung perlu disesuaikan kembali sebelum dokumen digunakan sebagai dokumen resmi.",
    "",
    "CATATAN",
    "Ini masih preview draft CK-DOC-01. Export DOCX/PDF, penyimpanan, AI interview, dan payment dokumen belum aktif.",
  ].join("\n");
}

function CompletionBadge({ completedCount, totalCount }) {
  const percentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-700">
          Kelengkapan data
        </p>

        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">
          {percentage}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-sky-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs font-bold text-slate-500">
        {completedCount} dari {totalCount} field terisi
      </p>
    </div>
  );
}

export default function DocumentBuilderModal({
  document,
  onClose,
}) {
  const [formData, setFormData] = useState(() => buildInitialForm(document));
  const [activeField, setActiveField] = useState("");

  useEffect(() => {
    setFormData(buildInitialForm(document));
    setActiveField("");
  }, [document]);

  const fields = Array.isArray(document?.fields) ? document.fields : [];

  const completedCount = useMemo(
    () =>
      fields.filter((field) => String(formData?.[field] || "").trim()).length,
    [fields, formData],
  );

  const draftText = useMemo(
    () => createDraftText(document, formData),
    [document, formData],
  );

  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[170] flex items-end justify-center bg-slate-950/65 px-4 py-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Tutup form dokumen"
      />

      <article className="relative grid max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-[30px] bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="max-h-[94vh] overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                CK-DOC-01 · Form Dokumen
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {document.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Lengkapi field awal untuk melihat preview draft. Tahap ini belum menyimpan data dan belum export DOCX/PDF.
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

          <div className="mt-5">
            <CompletionBadge
              completedCount={completedCount}
              totalCount={fields.length}
            />
          </div>

          <div className="mt-5 space-y-4">
            {fields.map((field) => (
              <label
                key={field}
                className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-100"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-slate-800">
                    {field}
                  </span>

                  {String(formData?.[field] || "").trim() ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                      Terisi
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-400">
                      Wajib
                    </span>
                  )}
                </span>

                <textarea
                  value={formData[field] || ""}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      [field]: event.target.value,
                    }))
                  }
                  onFocus={() => setActiveField(field)}
                  rows={field.toLowerCase().includes("kronologi") || field.toLowerCase().includes("deskripsi") ? 4 : 2}
                  placeholder={`Isi ${field.toLowerCase()}...`}
                  className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">
              Batasan CK-DOC-01
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-900">
              Data belum disimpan ke database. Export DOCX/PDF, payment dokumen, dan AI interview akan dibuat pada tahap berikutnya.
            </p>
          </div>
        </section>

        <section className="flex max-h-[94vh] flex-col border-t border-slate-200 bg-slate-50 lg:border-l lg:border-t-0">
          <div className="border-b border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                  Preview Draft
                </p>

                <h3 className="mt-1 text-xl font-black text-slate-950">
                  {activeField ? `Mengisi: ${activeField}` : "Draft awal dokumen"}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
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

          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div className="min-h-full rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-700">
                {draftText}
              </pre>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-black text-slate-400"
                title="Simpan/export akan dibuat pada tahap berikutnya"
              >
                Simpan / Export · Coming Soon
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}

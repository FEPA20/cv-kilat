// CK-DOC-01-SAFE-V2
import { useEffect, useMemo, useState } from "react";
import { saveKilatDocsDraft } from "../../lib/kilatDocsDraftService";

function buildInitialForm(document) {
  const fields = Array.isArray(document?.fields) ? document.fields : [];

  return fields.reduce((accumulator, field) => {
    accumulator[field] = "";
    return accumulator;
  }, {});
}

// CK-DOC-02-SAFE
function cleanText(value) {
  return String(value || "").trim();
}

function normalizeText(value) {
  return cleanText(value).toLowerCase();
}

function findValue(formData, keywords) {
  const entries = Object.entries(formData || {});
  const found = entries.find(([field]) => {
    const normalizedField = normalizeText(field);
    return keywords.some((keyword) => normalizedField.includes(keyword));
  });

  return cleanText(found?.[1]);
}

function pickFilledEntries(formData) {
  return Object.entries(formData || [])
    .map(([field, value]) => [field, cleanText(value)])
    .filter(([, value]) => value);
}

function detectDraftType(document) {
  const text = normalizeText(
    [
      document?.title,
      document?.categoryLabel,
      document?.useCase,
      ...(document?.tags || []),
    ].join(" "),
  );

  if (
    text.includes("somasi") ||
    text.includes("penagihan") ||
    text.includes("tagihan") ||
    text.includes("utang") ||
    text.includes("pembayaran")
  ) {
    return "somasi";
  }

  if (
    text.includes("bast") ||
    text.includes("serah terima") ||
    text.includes("handover")
  ) {
    return "bast";
  }

  if (
    text.includes("klaim") ||
    text.includes("asuransi") ||
    text.includes("jaminan")
  ) {
    return "klaim";
  }

  if (
    text.includes("sop") ||
    text.includes("prosedur") ||
    text.includes("instruksi kerja")
  ) {
    return "sop";
  }

  if (
    text.includes("kuasa") ||
    text.includes("pernyataan") ||
    text.includes("permohonan")
  ) {
    return "surat";
  }

  return "umum";
}

function createMetaBlock(document, formData) {
  const nomor = findValue(formData, ["nomor surat", "nomor dokumen", "nomor"]);
  const tanggal = findValue(formData, ["tanggal"]);
  const pihakPertama = findValue(formData, ["pihak pertama", "pengirim", "pemohon", "nama pemberi"]);
  const pihakKedua = findValue(formData, ["pihak kedua", "penerima", "termohon", "nama penerima"]);
  const perihal = document?.title || "Dokumen";

  return [
    `Nomor   : ${nomor || "[isi nomor dokumen jika ada]"}`,
    `Tanggal : ${tanggal || "[isi tanggal dokumen]"}`,
    `Perihal : ${perihal}`,
    "",
    `Pihak pembuat / pemohon : ${pihakPertama || "[isi pihak pembuat/pemohon]"}`,
    `Pihak tujuan / penerima : ${pihakKedua || "[isi pihak tujuan/penerima]"}`,
  ];
}

function createDataSummary(formData) {
  const entries = pickFilledEntries(formData);

  if (!entries.length) {
    return [
      "DATA YANG SUDAH DIISI",
      "- Belum ada data yang diisi.",
    ];
  }

  return [
    "DATA YANG SUDAH DIISI",
    ...entries.map(([field, value]) => `- ${field}: ${value}`),
  ];
}

function createFormalNarrative(document, formData) {
  const draftType = detectDraftType(document);
  const tujuan = document?.useCase || "kebutuhan administrasi pengguna";
  const pihakPertama = findValue(formData, ["pihak pertama", "pengirim", "pemohon", "nama pemberi"]);
  const pihakKedua = findValue(formData, ["pihak kedua", "penerima", "termohon", "nama penerima"]);
  const kronologi = findValue(formData, ["kronologi", "latar belakang", "deskripsi", "uraian"]);
  const nominal = findValue(formData, ["nominal", "jumlah", "tagihan", "biaya", "nilai"]);
  const batasWaktu = findValue(formData, ["batas waktu", "deadline", "tenggat", "tanggal jatuh tempo"]);
  const barang = findValue(formData, ["barang", "produk", "unit", "aset", "imei", "sku"]);
  const lokasi = findValue(formData, ["lokasi", "alamat", "tempat"]);
  const bukti = findValue(formData, ["bukti", "lampiran", "dokumen pendukung"]);

  if (draftType === "somasi") {
    return [
      "ISI DRAFT",
      `Dengan hormat,`,
      "",
      `Melalui surat ini, ${pihakPertama || "[pihak pengirim]"} menyampaikan pemberitahuan dan/atau teguran kepada ${pihakKedua || "[pihak tujuan]"} terkait kewajiban yang belum diselesaikan.`,
      "",
      kronologi
        ? `Adapun kronologi singkatnya adalah sebagai berikut: ${kronologi}`
        : "Adapun kronologi singkat kejadian perlu dilengkapi agar surat ini memiliki dasar yang jelas.",
      nominal
        ? `Kewajiban/nilai yang menjadi pokok permasalahan adalah sebesar ${nominal}.`
        : "Nominal atau kewajiban yang menjadi pokok permasalahan perlu dilengkapi apabila relevan.",
      bukti
        ? `Sebagai pendukung, terdapat bukti/lampiran berupa: ${bukti}.`
        : "Bukti pendukung perlu dilampirkan apabila tersedia.",
      "",
      `Sehubungan dengan hal tersebut, ${pihakKedua || "[pihak tujuan]"} diminta untuk menyelesaikan kewajiban tersebut ${batasWaktu ? `paling lambat pada ${batasWaktu}` : "dalam batas waktu yang akan ditentukan"}.`,
      "",
      "Apabila sampai batas waktu tersebut belum terdapat penyelesaian, pihak pengirim dapat mempertimbangkan langkah lanjutan sesuai ketentuan yang berlaku.",
    ];
  }

  if (draftType === "bast") {
    return [
      "ISI DRAFT",
      `Pada hari/tanggal sebagaimana tercantum dalam dokumen ini, ${pihakPertama || "[pihak pertama]"} telah menyerahkan kepada ${pihakKedua || "[pihak kedua]"} objek/barang/dokumen yang dijelaskan di bawah ini.`,
      "",
      barang
        ? `Objek yang diserahterimakan: ${barang}.`
        : "Objek yang diserahterimakan perlu dilengkapi secara jelas.",
      lokasi
        ? `Lokasi serah terima: ${lokasi}.`
        : "Lokasi serah terima perlu dilengkapi apabila relevan.",
      kronologi
        ? `Keterangan tambahan: ${kronologi}`
        : "Keterangan tambahan dapat dilengkapi sesuai kondisi serah terima.",
      "",
      "Dengan ditandatanganinya dokumen ini, para pihak menyatakan bahwa proses serah terima telah dilakukan sesuai kondisi yang disepakati.",
    ];
  }

  if (draftType === "klaim") {
    return [
      "ISI DRAFT",
      `Dengan hormat,`,
      "",
      `Melalui dokumen ini, ${pihakPertama || "[pemohon]"} mengajukan klaim/permohonan kepada ${pihakKedua || "[pihak tujuan]"} untuk kebutuhan: ${tujuan}.`,
      "",
      kronologi
        ? `Kronologi kejadian: ${kronologi}`
        : "Kronologi kejadian perlu dilengkapi secara jelas dan berurutan.",
      barang
        ? `Objek klaim: ${barang}.`
        : "Objek klaim perlu dilengkapi apabila relevan.",
      nominal
        ? `Estimasi nilai klaim/kerugian: ${nominal}.`
        : "Nilai klaim/kerugian perlu dilengkapi apabila tersedia.",
      bukti
        ? `Dokumen pendukung: ${bukti}.`
        : "Dokumen pendukung perlu dilampirkan untuk memperkuat pengajuan.",
      "",
      "Demikian pengajuan ini disampaikan agar dapat diproses sesuai ketentuan yang berlaku.",
    ];
  }

  if (draftType === "sop") {
    return [
      "ISI DRAFT",
      `Dokumen ini disusun sebagai panduan pelaksanaan untuk kebutuhan: ${tujuan}.`,
      "",
      "TUJUAN",
      kronologi || "Menjelaskan standar langkah kerja agar proses berjalan konsisten, tertib, dan terdokumentasi.",
      "",
      "RUANG LINGKUP",
      lokasi
        ? `Prosedur ini berlaku pada area/lokasi: ${lokasi}.`
        : "Ruang lingkup prosedur perlu dilengkapi sesuai proses yang akan diatur.",
      "",
      "KETENTUAN UMUM",
      "- Setiap pihak yang terlibat wajib mengikuti tahapan yang ditetapkan.",
      "- Setiap aktivitas penting perlu dicatat dan dapat ditelusuri kembali.",
      "- Penyimpangan proses harus dilaporkan kepada pihak penanggung jawab.",
    ];
  }

  return [
    "ISI DRAFT",
    `Dokumen “${document?.title || "Dokumen"}” ini disusun untuk kebutuhan: ${tujuan}.`,
    "",
    pihakPertama || pihakKedua
      ? `Dokumen ini melibatkan ${pihakPertama || "[pihak pertama]"} dan ${pihakKedua || "[pihak kedua]"}.`
      : "Pihak-pihak terkait perlu dilengkapi agar dokumen dapat digunakan dengan jelas.",
    kronologi
      ? `Uraian/kronologi: ${kronologi}`
      : "Uraian atau kronologi perlu dilengkapi sesuai kebutuhan dokumen.",
    bukti
      ? `Bukti atau lampiran pendukung: ${bukti}.`
      : "Bukti atau lampiran pendukung dapat ditambahkan apabila tersedia.",
    "",
    "Dokumen ini perlu diperiksa kembali sebelum digunakan sebagai dokumen final.",
  ];
}

function createClosingBlock() {
  return [
    "PENUTUP",
    "Demikian draft awal ini dibuat untuk diperiksa dan disesuaikan kembali sebelum digunakan.",
    "",
    "Hormat kami,",
    "",
    "",
    "[Nama dan Tanda Tangan]",
  ];
}

function createDraftText(document, formData) {
  const title = document?.title || "Dokumen";
  const entries = pickFilledEntries(formData);

  if (!entries.length) {
    return [
      title.toUpperCase(),
      "",
      "Draft resmi akan muncul setelah Anda mengisi form di sebelah kiri.",
      "",
      "Petunjuk:",
      "- Isi pihak terkait dengan lengkap.",
      "- Isi tanggal, kronologi, nominal, barang, atau bukti jika relevan.",
      "- Preview akan berubah otomatis setelah data diisi.",
      "",
      "Catatan: tahap CK-DOC-02 masih preview lokal. Export, penyimpanan, AI interview, dan payment dokumen belum aktif.",
    ].join("\n");
  }

  return [
    title.toUpperCase(),
    "=".repeat(Math.min(title.length, 60)),
    "",
    ...createMetaBlock(document, formData),
    "",
    ...createDataSummary(formData),
    "",
    ...createFormalNarrative(document, formData),
    "",
    ...createClosingBlock(),
    "",
    "CATATAN SISTEM",
    "- Draft ini masih perlu diperiksa ulang oleh pengguna.",
    "- Pastikan nama pihak, tanggal, nominal, kronologi, dan bukti sudah benar.",
    "- Export DOCX/PDF, penyimpanan, AI interview, dan payment dokumen belum aktif pada CK-DOC-02.",
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
  // CK-DOC-04B-SAFE
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  // CK-DOC-04C-SAFE
  const [currentDraftId, setCurrentDraftId] = useState(null);

  useEffect(() => {
    setFormData(buildInitialForm(document));
    setActiveField("");
    setSaveState({ status: "idle", message: "" });
    setCurrentDraftId(null);
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

  const canSaveDraft = completedCount > 0 && saveState.status !== "saving";

  const handleSaveDraft = async () => {
    if (!completedCount) {
      setSaveState({
        status: "error",
        message: "Isi minimal satu field sebelum menyimpan draft.",
      });
      return;
    }

    setSaveState({
      status: "saving",
      message: "Menyimpan draft...",
    });

    const result = await saveKilatDocsDraft({
      document,
      formData,
      draftContent: draftText,
      draftId: currentDraftId,
    });

    if (!result.ok) {
      setSaveState({
        status: "error",
        message: result.message || "Draft gagal disimpan.",
      });
      return;
    }

    if (result.draft?.id) {
      setCurrentDraftId(result.draft.id);
    }

    setSaveState({
      status: "success",
      message: result.message || "Draft berhasil disimpan.",
    });
  };

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
                CK-DOC-02 · Draft Dokumen Resmi
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {document.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Lengkapi field awal untuk membuat preview draft yang lebih rapi dan mendekati format dokumen resmi. Tahap ini belum menyimpan data dan belum export DOCX/PDF.
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
              Batasan CK-DOC-02
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-900">
              Draft sekarang bisa disimpan ke database. Export DOCX/PDF, payment dokumen, dan AI interview akan dibuat pada tahap berikutnya.
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
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={!canSaveDraft}
                className={`inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-black transition ${
                  canSaveDraft
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
              >
                {saveState.status === "saving"
                  ? "Menyimpan..."
                  : currentDraftId
                    ? "Update Draft"
                    : "Simpan Draft"}
              </button>

              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-black text-slate-400"
                title="Export DOCX/PDF akan dibuat pada tahap berikutnya"
              >
                Export · Coming Soon
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

            {saveState.message ? (
              <p
                className={`mt-3 rounded-2xl px-4 py-3 text-sm font-bold ${
                  saveState.status === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : saveState.status === "error"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-sky-50 text-sky-700"
                }`}
              >
                {saveState.message}
              </p>
            ) : null}
          </div>
        </section>
      </article>
    </div>
  );
}

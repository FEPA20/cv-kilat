import { useMemo, useRef, useState } from "react";
import LogoCVKilat from "../components/LogoCVKilat";
import {
  extractTextFromDocument,
  getDocumentExtension,
  isSupportedDocument,
} from "../utils/documentExtraction";
import {
  getCvImportSummary,
  parseCoverLetterText,
  parseCvText,
} from "../utils/cvTextParser";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const DOCUMENT_TYPES = [
  {
    id: "cv",
    title: "CV / Resume",
    description:
      "Ekstrak data CV lama lalu masukkan hasilnya ke Builder untuk diperbarui.",
    icon: DocumentIcon,
  },
  {
    id: "cover-letter",
    title: "Surat Lamaran",
    description:
      "Ekstrak isi surat lama lalu lanjutkan penyuntingan di editor Surat Lamaran.",
    icon: LetterIcon,
  },
];

function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file) {
  if (!file) return "Pilih file terlebih dahulu.";

  if (!isSupportedDocument(file)) {
    const extension = getDocumentExtension(file.name).toUpperCase();

    if (extension === "DOC") {
      return "Format DOC lama belum dapat diekstrak. Simpan ulang sebagai DOCX atau PDF.";
    }

    return "Format belum didukung. Gunakan PDF atau DOCX.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Ukuran file maksimal 10 MB.";
  }

  return "";
}

export default function UploadDocumentPage({
  user,
  onBack,
  onImportCv,
  onImportCoverLetter,
}) {
  const inputRef = useRef(null);
  const [documentType, setDocumentType] = useState("cv");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    message: "",
  });
  const [extractedText, setExtractedText] = useState("");
  const [parsedResult, setParsedResult] = useState(null);

  const selectedType = useMemo(
    () =>
      DOCUMENT_TYPES.find((item) => item.id === documentType) ||
      DOCUMENT_TYPES[0],
    [documentType]
  );

  const cvSummary = useMemo(
    () =>
      documentType === "cv" && parsedResult
        ? getCvImportSummary(parsedResult)
        : null,
    [documentType, parsedResult]
  );

  const parseText = (text, type = documentType) => {
    if (type === "cv") {
      return parseCvText(text);
    }

    return parseCoverLetterText(text);
  };

  const resetExtraction = () => {
    setExtractedText("");
    setParsedResult(null);
    setProgress({ current: 0, total: 0, message: "" });
  };

  const applyFile = (file) => {
    const error = validateFile(file);

    if (error) {
      setSelectedFile(null);
      setStatus("idle");
      setNotice(error);
      resetExtraction();
      return;
    }

    setSelectedFile(file);
    setStatus("selected");
    setNotice("");
    resetExtraction();
  };

  const handleInputChange = (event) => {
    applyFile(event.target.files?.[0] || null);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    applyFile(event.dataTransfer.files?.[0] || null);
  };

  const handleDocumentType = (type) => {
    setDocumentType(type);
    setNotice("");

    if (extractedText) {
      setParsedResult(parseText(extractedText, type));
      setStatus("extracted");
    } else {
      setStatus(selectedFile ? "selected" : "idle");
    }
  };

  const handleExtract = async () => {
    const error = validateFile(selectedFile);

    if (error) {
      setNotice(error);
      return;
    }

    setStatus("extracting");
    setNotice("");
    setProgress({
      current: 0,
      total: 0,
      message: "Menyiapkan dokumen",
    });

    try {
      const text = await extractTextFromDocument(
        selectedFile,
        setProgress
      );

      if (!text || text.replace(/\s/g, "").length < 20) {
        throw new Error(
          "Teks tidak ditemukan. PDF kemungkinan berupa scan atau gambar. OCR belum aktif pada tahap ini."
        );
      }

      const parsed = parseText(text);

      setExtractedText(text);
      setParsedResult(parsed);
      setStatus("extracted");
      setNotice(
        "Ekstraksi selesai. Periksa hasilnya sebelum dimasukkan ke editor."
      );
    } catch (error) {
      console.error("Gagal mengekstrak dokumen:", error);
      setStatus("error");
      setNotice(
        error?.message ||
          "Dokumen belum dapat dibaca. Coba file PDF/DOCX lain."
      );
    }
  };

  const handleTextChange = (value) => {
    setExtractedText(value);
    setParsedResult(parseText(value));
  };

  const resetFile = () => {
    setSelectedFile(null);
    setStatus("idle");
    setNotice("");
    resetExtraction();
  };

  const handleContinue = () => {
    if (!parsedResult) {
      setNotice("Hasil ekstraksi belum tersedia.");
      return;
    }

    if (documentType === "cv") {
      onImportCv?.(parsedResult);
      return;
    }

    onImportCoverLetter?.(parsedResult);
  };

  const progressPercent =
    progress.total > 0
      ? Math.min(
          100,
          Math.round((progress.current / progress.total) * 100)
        )
      : status === "extracting"
        ? 15
        : 0;

  return (
    <div className="min-h-screen bg-[#eef7ff] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1380px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Kembali ke dashboard"
          >
            <LogoCVKilat variant="dark" compact />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1220px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0b1730] via-[#102448] to-[#153a68] px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,55,95,0.18)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />

          <div className="relative">
            <p className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <UploadIcon className="h-4 w-4" />
              Import dan Ekstraksi Dokumen
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Perbarui dokumen lama tanpa mengetik ulang dari awal.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
              Teks PDF atau DOCX dibaca di browser, ditampilkan untuk
              diperiksa, lalu dimasukkan ke editor CV Kilat.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                Langkah 1
              </p>
              <h2 className="mt-1 text-xl font-extrabold">
                Jenis dokumen
              </h2>

              <div className="mt-4 space-y-3">
                {DOCUMENT_TYPES.map((item) => {
                  const Icon = item.icon;
                  const active = documentType === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleDocumentType(item.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-sky-300 bg-sky-50 ring-4 ring-sky-100"
                          : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            active
                              ? "bg-sky-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <div>
                          <p className="font-extrabold text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-extrabold text-slate-900">
                Format ekstraksi
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["PDF", "DOCX"].map((format) => (
                  <span
                    key={format}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                  >
                    {format}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Maksimal 10 MB. PDF scan/gambar memerlukan OCR dan belum
                termasuk pada tahap ini.
              </p>
            </div>

            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <div>
                  <p className="font-extrabold text-emerald-900">
                    Diproses di perangkat
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Pada tahap ini file dibaca langsung oleh browser dan
                    tidak disimpan sebagai file upload di database.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
                  Langkah 2
                </p>
                <h2 className="mt-1 text-2xl font-extrabold">
                  Upload dan ekstrak {selectedType.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Pastikan dokumen tidak dilindungi password dan teksnya
                  dapat dipilih.
                </p>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleInputChange}
                className="hidden"
              />

              <div
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                className={`mt-6 flex min-h-[260px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-6 text-center transition ${
                  dragActive
                    ? "border-sky-400 bg-sky-50"
                    : selectedFile
                      ? "border-emerald-300 bg-emerald-50/40"
                      : "border-slate-300 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/50"
                }`}
              >
                {selectedFile ? (
                  <>
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <CheckIcon className="h-8 w-8" />
                    </span>
                    <p className="mt-4 max-w-full break-all text-lg font-extrabold text-slate-900">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatFileSize(selectedFile.size)} ·{" "}
                      {getDocumentExtension(
                        selectedFile.name
                      ).toUpperCase()}
                    </p>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      disabled={status === "extracting"}
                      className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    >
                      Ganti File
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <UploadIcon className="h-8 w-8" />
                    </span>
                    <p className="mt-4 text-lg font-extrabold text-slate-900">
                      Tarik file ke sini
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      atau pilih file PDF/DOCX dari komputer
                    </p>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="mt-5 rounded-xl bg-sky-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
                    >
                      Pilih File
                    </button>
                  </>
                )}
              </div>

              {status === "extracting" ? (
                <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4">
                  <div className="flex items-center justify-between gap-4 text-sm font-bold text-sky-800">
                    <span>{progress.message || "Membaca dokumen"}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-sky-100">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              ) : null}

              {notice ? (
                <div
                  className={`mt-5 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                    status === "extracted"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : status === "error"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {notice}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={selectedFile ? resetFile : onBack}
                  disabled={status === "extracting"}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {selectedFile ? "Hapus File" : "Batal"}
                </button>

                <button
                  type="button"
                  disabled={!selectedFile || status === "extracting"}
                  onClick={handleExtract}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-200 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "extracting"
                    ? "Mengekstrak..."
                    : extractedText
                      ? "Ekstrak Ulang"
                      : "Ekstrak Dokumen"}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {status === "extracted" && extractedText ? (
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                      Langkah 3
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold">
                      Review hasil ekstraksi
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Koreksi teks yang salah. Data terstruktur akan
                      diperbarui otomatis dari teks di bawah.
                    </p>
                  </div>

                  <span className="self-start rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    {extractedText.length.toLocaleString("id-ID")} karakter
                  </span>
                </div>

                {documentType === "cv" && cvSummary ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryItem
                      label="Nama"
                      value={cvSummary.name || "Belum terdeteksi"}
                    />
                    <SummaryItem
                      label="Kontak"
                      value={
                        cvSummary.email ||
                        cvSummary.phone ||
                        "Belum terdeteksi"
                      }
                    />
                    <SummaryItem
                      label="Pengalaman"
                      value={`${cvSummary.experienceCount} data`}
                    />
                    <SummaryItem
                      label="Keahlian"
                      value={`${cvSummary.skillCount} data`}
                    />
                  </div>
                ) : null}

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Teks dokumen
                  </span>
                  <textarea
                    value={extractedText}
                    onChange={(event) =>
                      handleTextChange(event.target.value)
                    }
                    rows={18}
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                  Hasil otomatis perlu diperiksa. Layout dua kolom, ikon,
                  dan PDF hasil scan dapat menyebabkan urutan teks kurang
                  sempurna.
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("selected");
                      resetExtraction();
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Batalkan Hasil
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-white shadow-lg transition ${
                      documentType === "cv"
                        ? "bg-sky-500 shadow-sky-200 hover:bg-sky-600"
                        : "bg-violet-600 shadow-violet-200 hover:bg-violet-700"
                    }`}
                  >
                    {documentType === "cv"
                      ? "Masukkan ke Builder CV"
                      : "Masukkan ke Editor Surat"}
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Akun aktif: {user ? "Tersambung" : "Tidak tersambung"}
        </p>
      </main>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-extrabold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function IconBase({ children, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function UploadIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 14v5h14v-5" />
    </IconBase>
  );
}

function DocumentIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5" />
      <path d="M10 12h5M10 16h5" />
    </IconBase>
  );
}

function LetterIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 5h16v14H4z" />
      <path d="m4 7 8 6 8-6" />
      <path d="M8 3h8" />
    </IconBase>
  );
}

function CheckIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m5 12 4 4L19 6" />
    </IconBase>
  );
}

function ArrowLeftIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M19 12H5" />
      <path d="m10 17-5-5 5-5" />
    </IconBase>
  );
}

function ArrowRightIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </IconBase>
  );
}

function ShieldIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

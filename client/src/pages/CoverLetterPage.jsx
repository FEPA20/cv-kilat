import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { supabase } from "../lib/supabase";
import LogoCVKilat from "../components/LogoCVKilat";

const EMPTY_CV = {
  firstName: "",
  lastName: "",
  name: "",
  jobTitle: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  postal: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

const INITIAL_LETTER = {
  title: "Surat Lamaran Kerja",
  recipientName: "HRD / Tim Rekrutmen",
  companyName: "",
  companyAddress: "",
  companyCity: "",
  targetPosition: "",
  vacancySource: "",
  date: new Date().toISOString().slice(0, 10),
  subject: "Lamaran Pekerjaan",
  greeting: "Dengan hormat,",
  opening: "",
  body: "",
  closing: "",
  signatureName: "",
  language: "id",
  template: "professional",
  accentColor: "#0f766e",
  fontFamily: "Georgia",
  fontSize: "normal",
};

const DRAFT_KEY = "cv-kilat-cover-letter-draft-v1";

function normalizeCv(cv) {
  return {
    ...EMPTY_CV,
    ...(cv?.data || {}),
  };
}

function getFullName(cvData) {
  const combined = `${cvData?.firstName || ""} ${cvData?.lastName || ""}`.trim();
  return combined || cvData?.name || "Nama Pelamar";
}

function getLatestRole(cvData) {
  const experiences = Array.isArray(cvData?.experience) ? cvData.experience : [];
  const first = experiences[0] || {};
  return first.role || first.job || cvData?.jobTitle || "profesional";
}

function getSkillNames(cvData) {
  const skills = Array.isArray(cvData?.skills) ? cvData.skills : [];
  return skills
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean)
    .slice(0, 4);
}

function formatDate(value, language) {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function buildSuggestedLetter(cvData, current) {
  const fullName = getFullName(cvData);
  const latestRole = getLatestRole(cvData);
  const skills = getSkillNames(cvData);
  const target = current.targetPosition || cvData.jobTitle || latestRole;
  const company = current.companyName || "perusahaan Bapak/Ibu";

  if (current.language === "en") {
    return {
      opening: `I am writing to apply for the ${target || "available"} position at ${company}. With my professional background as ${latestRole}, I am confident that my experience is relevant to the needs of your organization.`,
      body: `Throughout my career, I have developed strong capabilities${
        skills.length ? ` in ${skills.join(", ")}` : " in operational execution, collaboration, and problem solving"
      }. I am accustomed to working toward measurable targets, maintaining accuracy, and coordinating with cross-functional teams. I would welcome the opportunity to bring this experience and work ethic to ${company}.`,
      closing: `I would appreciate the opportunity to discuss how my experience can contribute to your team. Thank you for your time and consideration.`,
      signatureName: fullName,
      greeting: "Dear Hiring Manager,",
      subject: `Application for ${target || "Position"}`,
    };
  }

  return {
    opening: `Sehubungan dengan informasi lowongan untuk posisi ${target || "yang tersedia"} di ${company}, saya bermaksud mengajukan lamaran kerja. Dengan latar belakang profesional sebagai ${latestRole}, saya yakin pengalaman saya relevan dengan kebutuhan perusahaan.`,
    body: `Dalam perjalanan karier, saya mengembangkan kemampuan${
      skills.length ? ` di bidang ${skills.join(", ")}` : " dalam pelaksanaan operasional, kerja sama tim, dan pemecahan masalah"
    }. Saya terbiasa bekerja berdasarkan target, menjaga akurasi pekerjaan, serta berkoordinasi dengan berbagai divisi. Saya siap membawa pengalaman, tanggung jawab, dan semangat kerja tersebut untuk memberikan kontribusi kepada ${company}.`,
    closing: `Besar harapan saya untuk memperoleh kesempatan mengikuti proses seleksi dan menjelaskan pengalaman saya lebih lanjut. Atas waktu dan perhatian Bapak/Ibu, saya ucapkan terima kasih.`,
    signatureName: fullName,
    greeting: "Dengan hormat,",
    subject: `Lamaran Pekerjaan – ${target || "Posisi yang Dilamar"}`,
  };
}

export default function CoverLetterPage({
  user,
  initialCv = null,
  onBack,
  onSaved,
}) {
  const letterRef = useRef(null);
  const [cvList, setCvList] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(initialCv?.id || "");
  const [letterId, setLetterId] = useState(null);
  const [letter, setLetter] = useState(INITIAL_LETTER);
  const [loadingCv, setLoadingCv] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");
  const [activePanel, setActivePanel] = useState("vacancy");

  const selectedCv = useMemo(() => {
    if (initialCv && (!selectedCvId || selectedCvId === initialCv.id)) return initialCv;
    return cvList.find((item) => item.id === selectedCvId) || cvList[0] || initialCv;
  }, [cvList, initialCv, selectedCvId]);

  const cvData = useMemo(() => normalizeCv(selectedCv), [selectedCv]);
  const fullName = useMemo(() => getFullName(cvData), [cvData]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(DRAFT_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setLetter((current) => ({ ...current, ...(parsed?.letter || {}) }));
        setLetterId(parsed?.letterId || null);
        if (!initialCv?.id && parsed?.selectedCvId) {
          setSelectedCvId(parsed.selectedCvId);
        }
      }
    } catch (error) {
      console.warn("Draft surat lamaran tidak dapat dibaca:", error);
    }
  }, [initialCv?.id]);

  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ letter, letterId, selectedCvId })
    );
  }, [letter, letterId, selectedCvId]);

  useEffect(() => {
    const loadCv = async () => {
      if (!user) {
        setCvList(initialCv ? [initialCv] : []);
        setLoadingCv(false);
        return;
      }

      setLoadingCv(true);
      const { data, error } = await supabase
        .from("cv_data")
        .select("*")
        .eq("user_id", user)
        .order("id", { ascending: false });

      if (error) {
        console.error("Gagal mengambil CV:", error);
        setNotice("Daftar CV belum dapat dimuat.");
        setCvList(initialCv ? [initialCv] : []);
        setLoadingCv(false);
        return;
      }

      const rows = data || [];
      setCvList(rows);
      setSelectedCvId((current) => {
        if (rows.some((item) => item.id === current)) return current;
        if (initialCv?.id && rows.some((item) => item.id === initialCv.id)) {
          return initialCv.id;
        }
        return rows[0]?.id || initialCv?.id || "";
      });
      setLoadingCv(false);
    };

    loadCv();
  }, [user, initialCv]);

  useEffect(() => {
    if (!selectedCv) return;

    setLetter((current) => ({
      ...current,
      targetPosition: current.targetPosition || cvData.jobTitle || getLatestRole(cvData),
      signatureName: current.signatureName || fullName,
    }));
  }, [selectedCv?.id]);

  const updateLetter = (field, value) => {
    setLetter((current) => ({ ...current, [field]: value }));
  };

  const handleGenerateFromCv = () => {
    const generated = buildSuggestedLetter(cvData, letter);
    setLetter((current) => ({ ...current, ...generated }));
    setNotice("Draf surat lamaran berhasil dibuat dari data CV.");
    setActivePanel("content");
  };

  const validate = () => {
    if (!selectedCv) return "Pilih CV yang akan digunakan.";
    if (!letter.companyName.trim()) return "Nama perusahaan wajib diisi.";
    if (!letter.targetPosition.trim()) return "Posisi yang dilamar wajib diisi.";
    if (!letter.opening.trim() || !letter.body.trim() || !letter.closing.trim()) {
      return "Lengkapi isi surat atau gunakan tombol Buat dari CV.";
    }
    return "";
  };

  const saveLetter = async () => {
    const validation = validate();
    if (validation) {
      setNotice(validation);
      return null;
    }

    if (!user) {
      setNotice("Silakan login untuk menyimpan surat lamaran.");
      return null;
    }

    setSaving(true);
    setNotice("");

    const payload = {
      user_id: user,
      cv_id: selectedCv?.id || null,
      title: letter.title || `Surat Lamaran ${letter.companyName}`,
      data: {
        ...letter,
        cvSnapshot: cvData,
      },
      updated_at: new Date().toISOString(),
    };

    let response;
    if (letterId) {
      response = await supabase
        .from("cover_letters")
        .update(payload)
        .eq("id", letterId)
        .eq("user_id", user)
        .select()
        .single();
    } else {
      response = await supabase
        .from("cover_letters")
        .insert([{ ...payload, created_at: new Date().toISOString() }])
        .select()
        .single();
    }

    setSaving(false);

    if (response.error) {
      console.error("Gagal menyimpan surat lamaran:", response.error);
      setNotice(
        "Surat belum tersimpan. Jalankan SQL tabel cover_letters yang disertakan dalam paket."
      );
      return null;
    }

    setLetterId(response.data.id);
    setNotice("Surat lamaran berhasil disimpan ke cloud.");
    onSaved?.(response.data);
    return response.data;
  };

  const downloadPdf = async () => {
    const validation = validate();
    if (validation) {
      setNotice(validation);
      return;
    }

    setDownloading(true);
    setNotice("");

    try {
      if (user) await saveLetter();

      const canvas = await html2canvas(letterRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const imageHeight = (canvas.height * pageWidth) / canvas.width;

      if (imageHeight <= pageHeight) {
        pdf.addImage(image, "PNG", 0, 0, pageWidth, imageHeight);
      } else {
        let remainingHeight = imageHeight;
        let position = 0;
        pdf.addImage(image, "PNG", 0, position, pageWidth, imageHeight);
        remainingHeight -= pageHeight;
        while (remainingHeight > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(image, "PNG", 0, position, pageWidth, imageHeight);
          remainingHeight -= pageHeight;
        }
      }

      const safeCompany = (letter.companyName || "Perusahaan")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "");
      pdf.save(`Surat-Lamaran-${fullName.replace(/\s+/g, "-")}-${safeCompany}.pdf`);
      setNotice("PDF surat lamaran berhasil diunduh.");
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      setNotice("PDF gagal dibuat. Silakan coba kembali.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef7ff] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => onBack?.()}
            className="rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <LogoCVKilat variant="dark" compact />
          </button>

          <div className="hidden items-center gap-2 text-sm font-semibold text-slate-500 md:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">✓</span>
            Draft tersimpan otomatis
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onBack?.()}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={saveLetter}
              disabled={saving}
              className="hidden rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-bold text-sky-700 hover:bg-sky-100 disabled:opacity-50 sm:block"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={downloading}
              className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 disabled:opacity-50"
            >
              {downloading ? "Membuat PDF..." : "Unduh PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {notice && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-sky-100 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} className="font-bold text-slate-400">×</button>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[560px_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
                Dokumen Lamaran
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
                Buat Surat Lamaran Kerja
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Gunakan data CV agar isi surat konsisten dengan pengalaman dan keahlian Anda.
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50 px-4 py-3">
              {[
                ["vacancy", "Informasi Lowongan"],
                ["content", "Isi Surat"],
                ["design", "Desain"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActivePanel(id)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${
                    activePanel === id
                      ? "bg-sky-500 text-white shadow"
                      : "bg-white text-slate-500 hover:text-sky-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-[calc(100vh-230px)] overflow-y-auto p-5 sm:p-6">
              {activePanel === "vacancy" && (
                <div className="space-y-5">
                  <Field label="CV yang digunakan">
                    <select
                      value={selectedCvId}
                      disabled={loadingCv}
                      onChange={(event) => setSelectedCvId(event.target.value)}
                      className={INPUT_CLASS}
                    >
                      {!cvList.length && <option value="">Belum ada CV</option>}
                      {cvList.map((cv) => (
                        <option key={cv.id} value={cv.id}>
                          {getFullName(normalizeCv(cv))} – {normalizeCv(cv).jobTitle || "CV"}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nama perusahaan" required>
                      <input
                        value={letter.companyName}
                        onChange={(event) => updateLetter("companyName", event.target.value)}
                        placeholder="PT Contoh Indonesia"
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Posisi yang dilamar" required>
                      <input
                        value={letter.targetPosition}
                        onChange={(event) => updateLetter("targetPosition", event.target.value)}
                        placeholder="Warehouse Manager"
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Ditujukan kepada">
                      <input
                        value={letter.recipientName}
                        onChange={(event) => updateLetter("recipientName", event.target.value)}
                        placeholder="HRD / Nama perekrut"
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Tanggal surat">
                      <input
                        type="date"
                        value={letter.date}
                        onChange={(event) => updateLetter("date", event.target.value)}
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>

                  <Field label="Alamat perusahaan">
                    <input
                      value={letter.companyAddress}
                      onChange={(event) => updateLetter("companyAddress", event.target.value)}
                      placeholder="Alamat kantor tujuan"
                      className={INPUT_CLASS}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Kota perusahaan">
                      <input
                        value={letter.companyCity}
                        onChange={(event) => updateLetter("companyCity", event.target.value)}
                        placeholder="Jakarta"
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Sumber lowongan">
                      <input
                        value={letter.vacancySource}
                        onChange={(event) => updateLetter("vacancySource", event.target.value)}
                        placeholder="LinkedIn / Job portal / Referensi"
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateFromCv}
                    disabled={!selectedCv}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-3.5 font-extrabold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    ✨ Buat Isi Surat dari CV
                  </button>
                </div>
              )}

              {activePanel === "content" && (
                <div className="space-y-5">
                  <Field label="Perihal surat">
                    <input
                      value={letter.subject}
                      onChange={(event) => updateLetter("subject", event.target.value)}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Salam pembuka">
                    <input
                      value={letter.greeting}
                      onChange={(event) => updateLetter("greeting", event.target.value)}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Paragraf pembuka">
                    <textarea
                      rows={5}
                      value={letter.opening}
                      onChange={(event) => updateLetter("opening", event.target.value)}
                      placeholder="Tuliskan tujuan melamar dan posisi yang dituju."
                      className={TEXTAREA_CLASS}
                    />
                  </Field>
                  <Field label="Paragraf utama">
                    <textarea
                      rows={8}
                      value={letter.body}
                      onChange={(event) => updateLetter("body", event.target.value)}
                      placeholder="Jelaskan pengalaman, keahlian, dan kontribusi yang ditawarkan."
                      className={TEXTAREA_CLASS}
                    />
                  </Field>
                  <Field label="Paragraf penutup">
                    <textarea
                      rows={5}
                      value={letter.closing}
                      onChange={(event) => updateLetter("closing", event.target.value)}
                      placeholder="Tutup dengan harapan mengikuti proses seleksi."
                      className={TEXTAREA_CLASS}
                    />
                  </Field>
                  <Field label="Nama tanda tangan">
                    <input
                      value={letter.signatureName}
                      onChange={(event) => updateLetter("signatureName", event.target.value)}
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>
              )}

              {activePanel === "design" && (
                <div className="space-y-5">
                  <Field label="Template">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        ["professional", "Profesional"],
                        ["modern", "Modern"],
                        ["minimal", "Minimal"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => updateLetter("template", value)}
                          className={`rounded-2xl border px-3 py-4 text-sm font-bold transition ${
                            letter.template === value
                              ? "border-sky-400 bg-sky-50 text-sky-700 ring-4 ring-sky-100"
                              : "border-slate-200 bg-white text-slate-600 hover:border-sky-200"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Bahasa">
                    <select
                      value={letter.language}
                      onChange={(event) => updateLetter("language", event.target.value)}
                      className={INPUT_CLASS}
                    >
                      <option value="id">Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Font">
                      <select
                        value={letter.fontFamily}
                        onChange={(event) => updateLetter("fontFamily", event.target.value)}
                        className={INPUT_CLASS}
                      >
                        <option value="Georgia">Georgia</option>
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Inter">Inter</option>
                      </select>
                    </Field>
                    <Field label="Ukuran teks">
                      <select
                        value={letter.fontSize}
                        onChange={(event) => updateLetter("fontSize", event.target.value)}
                        className={INPUT_CLASS}
                      >
                        <option value="small">Kecil</option>
                        <option value="normal">Normal</option>
                        <option value="large">Besar</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Warna utama">
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <input
                        type="color"
                        value={letter.accentColor}
                        onChange={(event) => updateLetter("accentColor", event.target.value)}
                        className="h-10 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                      />
                      <span className="text-sm font-bold text-slate-600">{letter.accentColor}</span>
                    </div>
                  </Field>
                </div>
              )}
            </div>
          </section>

          <section className="min-w-0 rounded-[28px] bg-[#dfe8f1] p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                  Live Preview
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Surat Lamaran · A4
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateFromCv}
                className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-violet-600 shadow-sm hover:bg-violet-50"
              >
                ✨ Perbarui dari CV
              </button>
            </div>

            <div className="mx-auto max-w-[800px] overflow-auto pb-8">
              <LetterPreview
                ref={letterRef}
                letter={letter}
                cvData={cvData}
                fullName={fullName}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";

const TEXTAREA_CLASS = `${INPUT_CLASS} resize-y leading-6`;

function Field({ label, required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const LetterPreview = forwardRef(function LetterPreview(
  { letter, cvData, fullName },
  ref
) {
  const fontSizes = {
    small: "13px",
    normal: "14px",
    large: "15.5px",
  };

  const applicantAddress = [cvData.address, cvData.city, cvData.country, cvData.postal]
    .filter(Boolean)
    .join(", ");

  const isModern = letter.template === "modern";
  const isMinimal = letter.template === "minimal";

  return (
    <div
      ref={ref}
      className="min-h-[1123px] w-[794px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
      style={{
        fontFamily: letter.fontFamily,
        fontSize: fontSizes[letter.fontSize] || fontSizes.normal,
        color: "#1e293b",
      }}
    >
      {isModern && (
        <div className="h-4" style={{ backgroundColor: letter.accentColor }} />
      )}

      <div className={`px-16 py-14 ${isMinimal ? "px-20" : ""}`}>
        <div
          className={`mb-10 ${
            isModern ? "border-b-2 pb-6" : isMinimal ? "text-center" : ""
          }`}
          style={isModern ? { borderColor: letter.accentColor } : undefined}
        >
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: isMinimal ? "#0f172a" : letter.accentColor }}
          >
            {fullName}
          </h1>
          {cvData.jobTitle && (
            <p className="mt-1 text-base font-semibold text-slate-500">
              {cvData.jobTitle}
            </p>
          )}
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {[cvData.email, cvData.phone, applicantAddress].filter(Boolean).join(" · ")}
          </p>
        </div>

        <div className="flex justify-between gap-8 text-sm leading-6">
          <div>
            <p className="font-bold">Kepada Yth.</p>
            <p>{letter.recipientName || "HRD / Tim Rekrutmen"}</p>
            <p className="font-semibold">{letter.companyName || "Nama Perusahaan"}</p>
            {letter.companyAddress && <p>{letter.companyAddress}</p>}
            {letter.companyCity && <p>{letter.companyCity}</p>}
          </div>
          <p className="shrink-0 text-right">
            {letter.companyCity || cvData.city || "Kota"}, {formatDate(letter.date, letter.language)}
          </p>
        </div>

        <div className="mt-10 border-y border-slate-200 py-4">
          <div className="grid grid-cols-[90px_1fr] gap-3">
            <span className="font-bold">Perihal</span>
            <span>: {letter.subject || "Lamaran Pekerjaan"}</span>
          </div>
        </div>

        <div className="mt-9 space-y-6 leading-[1.85] text-slate-700">
          <p>{letter.greeting || "Dengan hormat,"}</p>
          <p className="whitespace-pre-line text-justify">
            {letter.opening || "Isi paragraf pembuka akan tampil di sini."}
          </p>
          <p className="whitespace-pre-line text-justify">
            {letter.body || "Jelaskan pengalaman, keahlian, dan kontribusi Anda."}
          </p>
          <p className="whitespace-pre-line text-justify">
            {letter.closing || "Isi paragraf penutup akan tampil di sini."}
          </p>
        </div>

        <div className="mt-14 ml-auto w-56 text-center">
          <p>{letter.language === "en" ? "Sincerely," : "Hormat saya,"}</p>
          <div className="h-20" />
          <p className="border-b border-slate-400 pb-1 font-bold">
            {letter.signatureName || fullName}
          </p>
        </div>
      </div>
    </div>
  );
});

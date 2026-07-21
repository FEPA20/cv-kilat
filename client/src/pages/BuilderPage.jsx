// BuilderPage Rich Text V5 — selected-text formatting + formatted preview
import { useEffect, useMemo, useRef, useState } from "react";
import ProfessionalCVPreview from "../components/ProfessionalCVPreview";
import { applyTextFormatting } from "../utils/textFormatting";

const STEPS = [
  "Kontak",
  "Pengalaman",
  "Pendidikan",
  "Keahlian",
  "Ringkasan",
  "Finalisasi",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";
const labelClass = "mb-2 block text-sm font-medium text-slate-700";

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const emptyExperience = () => ({
  id: makeId(),
  jobTitle: "",
  employer: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  open: true,
});

const emptyEducation = () => ({
  id: makeId(),
  school: "",
  location: "",
  degree: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  open: true,
});

const emptySkill = (name = "", level = 3) => ({ id: makeId(), name, level });
const emptyLanguage = () => ({ id: makeId(), language: "", level: "Menengah" });
const emptyHobby = () => ({ id: makeId(), name: "" });
const emptyCertification = () => ({ id: makeId(), name: "", issuer: "", year: "" });

const defaultForm = () => ({
  contact: {
    firstName: "",
    lastName: "",
    desiredJob: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "Indonesia",
    postalCode: "",
  },
  experiences: [emptyExperience()],
  education: [emptyEducation()],
  showSkillLevel: true,
  skills: [],
  summary: "",
  languages: [emptyLanguage()],
  hobbies: [emptyHobby()],
  certifications: [],
});

const suggestedSkills = [
  "Pemecahan Masalah",
  "Microsoft Office",
  "Berpikir Analitis",
  "Komunikasi",
  "Kepemimpinan",
  "Manajemen Waktu",
  "Kerja Sama Tim",
  "Adaptasi",
];

const levelNames = {
  1: "Pemula",
  2: "Awal",
  3: "Terampil",
  4: "Berpengalaman",
  5: "Ahli",
};

const stripFormatting = (value = "") =>
  value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/<u>(.*?)<\/u>/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .trim();

// ======================================================
// RICH TEXT ENGINE V5
// Memformat teks yang dipilih dan merender hasilnya dengan aman di preview.
// ======================================================
function renderInlineFormatting(text, keyPrefix) {
  const tokenPattern = /(\*\*.+?\*\*|~~.+?~~|<u>.+?<\/u>|_.+?_|\[[^\]]+\]\([^)]+\))/g;
  const tokens = text.split(tokenPattern).filter((token) => token !== "");

  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;

    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("~~") && token.endsWith("~~")) {
      return <s key={key}>{token.slice(2, -2)}</s>;
    }
    if (token.startsWith("<u>") && token.endsWith("</u>")) {
      return <u key={key}>{token.slice(3, -4)}</u>;
    }
    if (token.startsWith("_") && token.endsWith("_")) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, rawUrl] = linkMatch;
      const safeUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : "#";
      return (
        <a
          key={key}
          href={safeUrl}
          target={safeUrl === "#" ? undefined : "_blank"}
          rel={safeUrl === "#" ? undefined : "noreferrer noopener"}
          className="text-sky-600 underline underline-offset-2"
        >
          {label}
        </a>
      );
    }

    return <span key={key}>{token}</span>;
  });
}

function FormattedText({ value, className = "" }) {
  const lines = String(value || "").replace(/\r/g, "").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const bullet = line.match(/^\s*[•*-]\s+(.*)$/);

    if (ordered) {
      const items = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*\d+[.)]\s+(.*)$/);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      blocks.push(
        <ol key={`ol-${index}`} className="ml-5 list-decimal space-y-1">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineFormatting(item, `ol-${index}-${itemIndex}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (bullet) {
      const items = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*[•*-]\s+(.*)$/);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      blocks.push(
        <ul key={`ul-${index}`} className="ml-5 list-disc space-y-1">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInlineFormatting(item, `ul-${index}-${itemIndex}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (!line.trim()) {
      blocks.push(<div key={`space-${index}`} className="h-2" />);
    } else {
      blocks.push(
        <p key={`p-${index}`} className="min-h-[1.25rem]">
          {renderInlineFormatting(line, `p-${index}`)}
        </p>
      );
    }
    index += 1;
  }

  return <div className={className}>{blocks}</div>;
}

// ======================================================
// AUTO LIST ENGINE V4
// Menghasilkan baris bullet/nomor berikutnya saat Enter.
// Fungsi dibuat murni agar mudah diuji dan tidak bergantung pada state React.
// ======================================================
export function computeAutoListEnter(value, selectionStart, selectionEnd) {
  const lineStart = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
  const nextLineBreak = value.indexOf("\n", selectionStart);
  const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
  const currentLine = value.slice(lineStart, lineEnd);

  const orderedMatch = currentLine.match(/^(\s*)(\d+)([.)])\s*(.*)$/);
  const bulletMatch = currentLine.match(/^(\s*)([•*-])\s*(.*)$/);

  if (!orderedMatch && !bulletMatch) return null;

  if (orderedMatch) {
    const [, indent, number, delimiter, content] = orderedMatch;

    // Enter pada nomor kosong mengakhiri list.
    if (!content.trim()) {
      return {
        nextValue: `${value.slice(0, lineStart)}${value.slice(lineEnd)}`,
        nextCursor: lineStart,
      };
    }

    const marker = `\n${indent}${Number(number) + 1}${delimiter} `;
    return {
      nextValue: `${value.slice(0, selectionStart)}${marker}${value.slice(selectionEnd)}`,
      nextCursor: selectionStart + marker.length,
    };
  }

  const [, indent, bullet, content] = bulletMatch;

  // Enter pada bullet kosong mengakhiri list.
  if (!content.trim()) {
    return {
      nextValue: `${value.slice(0, lineStart)}${value.slice(lineEnd)}`,
      nextCursor: lineStart,
    };
  }

  const marker = `\n${indent}${bullet} `;
  return {
    nextValue: `${value.slice(0, selectionStart)}${marker}${value.slice(selectionEnd)}`,
    nextCursor: selectionStart + marker.length,
  };
}

function SectionTitle({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
  );
}

function RichToolbar({ onInsert, onGenerate, generating }) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
      <button type="button" onClick={() => onInsert("bold")} className="rounded-lg px-2 py-1 font-bold hover:bg-slate-100">B</button>
      <button type="button" onClick={() => onInsert("italic")} className="rounded-lg px-2 py-1 italic hover:bg-slate-100">I</button>
      <button type="button" onClick={() => onInsert("underline")} className="rounded-lg px-2 py-1 underline hover:bg-slate-100">U</button>
      <button type="button" onClick={() => onInsert("strike")} className="rounded-lg px-2 py-1 line-through hover:bg-slate-100">S</button>
      <button type="button" onClick={() => onInsert("link")} className="rounded-lg px-2 py-1 hover:bg-slate-100">🔗</button>
      <button type="button" onClick={() => onInsert("ordered")} className="rounded-lg px-2 py-1 hover:bg-slate-100">1.</button>
      <button type="button" onClick={() => onInsert("bullet")} className="rounded-lg px-2 py-1 hover:bg-slate-100">•</button>
      <button
        type="button"
        onClick={onGenerate}
        disabled={generating}
        className="ml-auto rounded-lg bg-gradient-to-r from-violet-500 to-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-60"
      >
        {generating ? "Menghasilkan..." : "✨ Hasilkan dengan AI"}
      </button>
    </div>
  );
}

function SkillBars({ level }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((bar) => (
        <span key={bar} className={`h-2 flex-1 rounded-full ${bar <= level ? "bg-sky-500" : "bg-slate-200"}`} />
      ))}
    </div>
  );
}

export default function BuilderPage({
  user = null,
  editData = null,
  onBack = () => {},
  onRequireAuth = () => {},
  onContinueDesign = () => {},
}) {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("modern");
  const [language, setLanguage] = useState("ID");
  const [form, setForm] = useState(defaultForm);
  const [generatingKey, setGeneratingKey] = useState("");
  const editorRefs = useRef(new Map());

  useEffect(() => {
    if (editData?.data) {
      setForm((current) => ({
        ...current,
        ...editData.data,
        contact: { ...current.contact, ...(editData.data.contact || {}) },
        experiences: editData.data.experiences?.length ? editData.data.experiences : current.experiences,
        education: editData.data.education?.length ? editData.data.education : current.education,
        skills: editData.data.skills || current.skills,
        languages: editData.data.languages?.length ? editData.data.languages : current.languages,
        hobbies: editData.data.hobbies?.length ? editData.data.hobbies : current.hobbies,
        certifications: editData.data.certifications || current.certifications,
      }));
      setTemplate(editData.data.design?.template || editData.data.template || "modern");
      setLanguage(editData.data.design?.language || editData.data.language || "ID");
      return;
    }

    const draft = localStorage.getItem("cv-kilat-builder-draft");
    if (draft) {
      try {
        setForm(JSON.parse(draft));
      } catch (error) {
        console.error("Draft lokal tidak valid:", error);
      }
    }
  }, [editData]);

  useEffect(() => {
    localStorage.setItem("cv-kilat-builder-draft", JSON.stringify(form));
  }, [form]);

  const score = useMemo(() => {
    let total = 0;
    const contact = form.contact;
    if (contact.firstName && contact.lastName) total += 10;
    if (contact.desiredJob) total += 8;
    if (contact.phone && contact.email) total += 7;
    if (form.experiences.some((item) => item.jobTitle && item.employer)) total += 25;
    if (form.experiences.some((item) => stripFormatting(item.description).length > 30)) total += 10;
    if (form.education.some((item) => item.school && item.degree)) total += 15;
    if (form.skills.length >= 3) total += 10;
    if (stripFormatting(form.summary).length >= 60) total += 10;
    if (form.languages.some((item) => item.language)) total += 5;
    return Math.min(total, 100);
  }, [form]);

  const updateContact = (field, value) => {
    setForm((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }));
  };

  const updateArrayItem = (collection, id, field, value) => {
    setForm((current) => ({
      ...current,
      [collection]: current[collection].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeArrayItem = (collection, id) => {
    setForm((current) => ({
      ...current,
      [collection]: current[collection].filter((item) => item.id !== id),
    }));
  };

  // AUTO LIST V4: Enter meneruskan bullet/nomor; Shift+Enter membuat baris biasa.
  const handleAutoListEnter = (event, commitValue) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent?.isComposing
    ) {
      return;
    }

    const textarea = event.currentTarget;
    const edit = computeAutoListEnter(
      textarea.value,
      textarea.selectionStart,
      textarea.selectionEnd
    );

    if (!edit) return;

    event.preventDefault();
    commitValue(edit.nextValue);

    // Setelah React memperbarui value, kembalikan fokus dan posisi kursor.
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(edit.nextCursor, edit.nextCursor);
    });
  };

  const registerEditorRef = (key) => (node) => {
    if (node) editorRefs.current.set(key, node);
    else editorRefs.current.delete(key);
  };

  const applyEditorFormatting = (editorKey, currentValue, type, commitValue) => {
    const textarea = editorRefs.current.get(editorKey);
    const selectionStart = textarea?.selectionStart ?? currentValue.length;
    const selectionEnd = textarea?.selectionEnd ?? currentValue.length;
    const edit = applyTextFormatting(currentValue, selectionStart, selectionEnd, type);

    if (!edit) return;
    commitValue(edit.nextValue);

    requestAnimationFrame(() => {
      const currentTextarea = editorRefs.current.get(editorKey);
      if (!currentTextarea) return;
      currentTextarea.focus();
      currentTextarea.setSelectionRange(edit.nextSelectionStart, edit.nextSelectionEnd);
    });
  };

  const insertFormatting = (collection, id, field, editorKey, type) => {
    const currentItem = form[collection].find((item) => item.id === id);
    const currentValue = currentItem?.[field] || "";
    applyEditorFormatting(editorKey, currentValue, type, (nextValue) => {
      updateArrayItem(collection, id, field, nextValue);
    });
  };

  const insertSummaryFormatting = (type) => {
    applyEditorFormatting("summary", form.summary, type, (nextValue) => {
      setForm((current) => ({ ...current, summary: nextValue }));
    });
  };

  const generateExperienceDraft = async (item) => {
    setGeneratingKey(`experience-${item.id}`);
    const role = item.jobTitle || "posisi tersebut";
    const employer = item.employer || "perusahaan";
    const generated = `• Mengelola tanggung jawab utama sebagai ${role} di ${employer}.\n• Meningkatkan ketepatan proses kerja melalui koordinasi dan pemantauan rutin.\n• Berkolaborasi dengan tim untuk mencapai target operasional dan menyelesaikan kendala.`;
    await new Promise((resolve) => setTimeout(resolve, 450));
    updateArrayItem("experiences", item.id, "description", generated);
    setGeneratingKey("");
  };

  const generateEducationDraft = async (item) => {
    setGeneratingKey(`education-${item.id}`);
    const generated = `• Menyelesaikan pendidikan ${item.degree || "pada program terkait"} dengan fokus pada kompetensi yang relevan.\n• Aktif mengembangkan kemampuan analitis, komunikasi, dan kerja sama.`;
    await new Promise((resolve) => setTimeout(resolve, 450));
    updateArrayItem("education", item.id, "description", generated);
    setGeneratingKey("");
  };

  const generateSummaryDraft = async () => {
    setGeneratingKey("summary");
    const role = form.contact.desiredJob || form.experiences[0]?.jobTitle || "profesional";
    const skillNames = form.skills.map((skill) => skill.name).filter(Boolean).slice(0, 3);
    const generated = `${role} yang berorientasi pada hasil dengan pengalaman dalam mengelola pekerjaan secara akurat, terstruktur, dan kolaboratif. Memiliki kemampuan ${skillNames.length ? skillNames.join(", ") : "pemecahan masalah, komunikasi, dan kerja sama tim"}. Siap memberikan kontribusi nyata melalui peningkatan kualitas proses dan pencapaian target.`;
    await new Promise((resolve) => setTimeout(resolve, 450));
    setForm((current) => ({ ...current, summary: generated }));
    setGeneratingKey("");
  };

  const summarySuggestions = useMemo(() => {
    const role = form.contact.desiredJob || form.experiences[0]?.jobTitle || "profesional";
    return [
      `${role} berorientasi hasil dengan pengalaman relevan dan kemampuan bekerja secara terstruktur.`,
      `Profesional adaptif dengan kekuatan pada pemecahan masalah, komunikasi, dan pencapaian target.`,
      `Individu teliti dan bertanggung jawab yang siap memberikan kontribusi pada lingkungan kerja dinamis.`,
      `${role} dengan semangat belajar tinggi, kemampuan kolaborasi, dan fokus pada perbaikan berkelanjutan.`,
    ];
  }, [form.contact.desiredJob, form.experiences]);

  const goPrevious = () => {
    if (step === 0) onBack();
    else setStep((current) => current - 1);
  };

  const goNext = () => {
    if (step < STEPS.length - 1) setStep((current) => current + 1);
  };

  const handleContinueDesign = () => {
    const payload = {
      ...form,
      design: {
        ...(editData?.data?.design || {}),
        template,
        language,
        fontFamily: editData?.data?.design?.fontFamily || "Inter",
        fontSize: editData?.data?.design?.fontSize || "normal",
        primaryColor: editData?.data?.design?.primaryColor || "#0ea5e9",
        headerBackground: editData?.data?.design?.headerBackground || "#e8f3fb",
        pageBackground: editData?.data?.design?.pageBackground || "#ffffff",
        sectionSpacing: editData?.data?.design?.sectionSpacing || 22,
        paragraphSpacing: editData?.data?.design?.paragraphSpacing || 8,
        lineHeight: editData?.data?.design?.lineHeight || 1.5,
        pageMargin: editData?.data?.design?.pageMargin || 38,
        sectionOrder: editData?.data?.design?.sectionOrder || [
          "summary",
          "experience",
          "education",
          "skills",
          "languages",
          "certifications",
          "hobbies",
        ],
        hiddenSections: editData?.data?.design?.hiddenSections || [],
      },
      photo: editData?.data?.photo || {
        originalUrl: "",
        editedUrl: "",
        shape: "circle",
        size: 96,
        position: "right",
        zoom: 1,
        rotation: 0,
      },
    };

    localStorage.setItem("cv-kilat-design-draft", JSON.stringify(payload));
    onContinueDesign(payload);
  };

  const sectionLabels = language === "EN"
    ? { summary: "SUMMARY", experience: "EXPERIENCE", education: "EDUCATION", skills: "SKILLS", languages: "LANGUAGES", hobbies: "INTERESTS", certifications: "CERTIFICATIONS", present: "Present" }
    : { summary: "RINGKASAN", experience: "PENGALAMAN", education: "PENDIDIKAN", skills: "KEAHLIAN", languages: "BAHASA", hobbies: "HOBI & MINAT", certifications: "SERTIFIKASI", present: "Sekarang" };

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <>
          <SectionTitle title="Kontak" description="Tambahkan informasi yang memudahkan perekrut menghubungi Anda." />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <label><span className={labelClass}>Nama depan</span><input className={inputClass} value={form.contact.firstName} onChange={(e) => updateContact("firstName", e.target.value)} placeholder="Budi" /></label>
              <label><span className={labelClass}>Nama belakang</span><input className={inputClass} value={form.contact.lastName} onChange={(e) => updateContact("lastName", e.target.value)} placeholder="Santoso" /></label>
            </div>
            <label className="mt-5 block"><span className={labelClass}>Pekerjaan yang diinginkan</span><input className={inputClass} value={form.contact.desiredJob} onChange={(e) => updateContact("desiredJob", e.target.value)} placeholder="Warehouse Manager" /></label>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label><span className={labelClass}>Telepon</span><input className={inputClass} value={form.contact.phone} onChange={(e) => updateContact("phone", e.target.value)} placeholder="+62 812 3456 7890" /></label>
              <label><span className={labelClass}>Email</span><input type="email" className={inputClass} value={form.contact.email} onChange={(e) => updateContact("email", e.target.value)} placeholder="nama@email.com" /></label>
            </div>
            <details className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4" open>
              <summary className="cursor-pointer font-semibold text-sky-600">Informasi tambahan</summary>
              <label className="mt-4 block"><span className={labelClass}>Alamat</span><input className={inputClass} value={form.contact.address} onChange={(e) => updateContact("address", e.target.value)} placeholder="Nama jalan dan nomor" /></label>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label><span className={labelClass}>Kota</span><input className={inputClass} value={form.contact.city} onChange={(e) => updateContact("city", e.target.value)} placeholder="Jakarta" /></label>
                <label><span className={labelClass}>Negara</span><input className={inputClass} value={form.contact.country} onChange={(e) => updateContact("country", e.target.value)} placeholder="Indonesia" /></label>
                <label><span className={labelClass}>Kode pos</span><input className={inputClass} value={form.contact.postalCode} onChange={(e) => updateContact("postalCode", e.target.value)} placeholder="14240" /></label>
              </div>
            </details>
          </div>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <SectionTitle title="Pengalaman" description="Cantumkan pengalaman kerja mulai dari posisi yang paling baru." />
          <div className="space-y-5">
            {form.experiences.map((item, index) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <button type="button" onClick={() => updateArrayItem("experiences", item.id, "open", !item.open)} className="text-left">
                    <p className="font-semibold text-slate-800">{item.jobTitle || `Pengalaman ${index + 1}`}</p>
                    <p className="text-xs text-slate-400">{item.employer || "Nama perusahaan"}</p>
                  </button>
                  <div className="flex gap-2"><button type="button" onClick={() => updateArrayItem("experiences", item.id, "open", !item.open)} className="rounded-lg px-2 py-1 hover:bg-white">{item.open ? "⌃" : "⌄"}</button><button type="button" onClick={() => removeArrayItem("experiences", item.id)} disabled={form.experiences.length === 1} className="rounded-lg px-2 py-1 text-rose-500 hover:bg-rose-50 disabled:opacity-30">🗑</button></div>
                </div>
                {item.open ? (
                  <div className="p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label><span className={labelClass}>Judul pekerjaan</span><input className={inputClass} value={item.jobTitle} onChange={(e) => updateArrayItem("experiences", item.id, "jobTitle", e.target.value)} placeholder="Warehouse Manager" /></label>
                      <label><span className={labelClass}>Tempat kerja</span><input className={inputClass} value={item.employer} onChange={(e) => updateArrayItem("experiences", item.id, "employer", e.target.value)} placeholder="Nama perusahaan" /></label>
                      <label><span className={labelClass}>Lokasi</span><input className={inputClass} value={item.location} onChange={(e) => updateArrayItem("experiences", item.id, "location", e.target.value)} placeholder="Jakarta, Indonesia" /></label>
                      <div className="grid grid-cols-2 gap-3"><label><span className={labelClass}>Tanggal mulai</span><input type="month" className={inputClass} value={item.startDate} onChange={(e) => updateArrayItem("experiences", item.id, "startDate", e.target.value)} /></label><label><span className={labelClass}>Tanggal akhir</span><input type="month" disabled={item.current} className={inputClass} value={item.current ? "" : item.endDate} onChange={(e) => updateArrayItem("experiences", item.id, "endDate", e.target.value)} /></label></div>
                    </div>
                    <label className="mt-4 flex items-center gap-3 text-sm text-slate-700"><input type="checkbox" checked={item.current} onChange={(e) => updateArrayItem("experiences", item.id, "current", e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-sky-500" />Saat ini masih bekerja</label>
                    <div className="mt-5"><span className={labelClass}>Deskripsi</span><RichToolbar onInsert={(type) => insertFormatting("experiences", item.id, "description", `experience-${item.id}`, type)} onGenerate={() => generateExperienceDraft(item)} generating={generatingKey === `experience-${item.id}`} /><textarea ref={registerEditorRef(`experience-${item.id}`)} className={`${inputClass} min-h-44 rounded-t-none`} value={item.description} onChange={(e) => updateArrayItem("experiences", item.id, "description", e.target.value)} onKeyDown={(event) => handleAutoListEnter(event, (nextValue) => updateArrayItem("experiences", item.id, "description", nextValue))} placeholder="Tuliskan pencapaian dan tanggung jawab utama..." /></div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setForm((current) => ({ ...current, experiences: [...current.experiences, emptyExperience()] }))} className="mt-5 font-semibold text-sky-600 hover:text-sky-700">＋ Tambah pengalaman kerja</button>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <SectionTitle title="Pendidikan" description="Tambahkan rincian pendidikan, termasuk pendidikan yang masih berlangsung." />
          <div className="space-y-5">
            {form.education.map((item, index) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4"><button type="button" onClick={() => updateArrayItem("education", item.id, "open", !item.open)} className="text-left"><p className="font-semibold text-slate-800">{item.school || `Pendidikan ${index + 1}`}</p><p className="text-xs text-slate-400">{item.degree || "Gelar atau jurusan"}</p></button><div className="flex gap-2"><button type="button" onClick={() => updateArrayItem("education", item.id, "open", !item.open)} className="rounded-lg px-2 py-1 hover:bg-white">{item.open ? "⌃" : "⌄"}</button><button type="button" onClick={() => removeArrayItem("education", item.id)} disabled={form.education.length === 1} className="rounded-lg px-2 py-1 text-rose-500 hover:bg-rose-50 disabled:opacity-30">🗑</button></div></div>
                {item.open ? (
                  <div className="p-5"><div className="grid gap-4 md:grid-cols-2"><label><span className={labelClass}>Nama sekolah</span><input className={inputClass} value={item.school} onChange={(e) => updateArrayItem("education", item.id, "school", e.target.value)} placeholder="Universitas Indonesia" /></label><label><span className={labelClass}>Lokasi</span><input className={inputClass} value={item.location} onChange={(e) => updateArrayItem("education", item.id, "location", e.target.value)} placeholder="Jakarta" /></label><label><span className={labelClass}>Gelar</span><input className={inputClass} value={item.degree} onChange={(e) => updateArrayItem("education", item.id, "degree", e.target.value)} placeholder="Sarjana Manajemen" /></label><div className="grid grid-cols-2 gap-3"><label><span className={labelClass}>Tanggal mulai</span><input type="month" className={inputClass} value={item.startDate} onChange={(e) => updateArrayItem("education", item.id, "startDate", e.target.value)} /></label><label><span className={labelClass}>Tanggal akhir</span><input type="month" disabled={item.current} className={inputClass} value={item.current ? "" : item.endDate} onChange={(e) => updateArrayItem("education", item.id, "endDate", e.target.value)} /></label></div></div><label className="mt-4 flex items-center gap-3 text-sm text-slate-700"><input type="checkbox" checked={item.current} onChange={(e) => updateArrayItem("education", item.id, "current", e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-sky-500" />Saya masih terdaftar</label><div className="mt-5"><span className={labelClass}>Deskripsi</span><RichToolbar onInsert={(type) => insertFormatting("education", item.id, "description", `education-${item.id}`, type)} onGenerate={() => generateEducationDraft(item)} generating={generatingKey === `education-${item.id}`} /><textarea ref={registerEditorRef(`education-${item.id}`)} className={`${inputClass} min-h-40 rounded-t-none`} value={item.description} onChange={(e) => updateArrayItem("education", item.id, "description", e.target.value)} onKeyDown={(event) => handleAutoListEnter(event, (nextValue) => updateArrayItem("education", item.id, "description", nextValue))} placeholder="Prestasi, organisasi, atau bidang studi..." /></div></div>
                ) : null}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setForm((current) => ({ ...current, education: [...current.education, emptyEducation()] }))} className="mt-5 font-semibold text-sky-600 hover:text-sky-700">＋ Tambah pendidikan</button>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <SectionTitle title="Keahlian" description="Tambahkan keahlian profesional yang paling relevan dengan posisi tujuan." />
          <label className="mb-6 flex items-center gap-3 text-sm font-medium text-slate-700"><button type="button" onClick={() => setForm((current) => ({ ...current, showSkillLevel: !current.showSkillLevel }))} className={`relative h-7 w-12 rounded-full transition ${form.showSkillLevel ? "bg-sky-500" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${form.showSkillLevel ? "left-6" : "left-1"}`} /></button>Tampilkan level pengalaman</label>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-slate-800">✨ Keahlian yang disarankan</h3><span className="text-xs text-slate-400">Klik untuk menambahkan</span></div><div className="flex flex-wrap gap-2">{suggestedSkills.map((name) => <button key={name} type="button" onClick={() => { if (!form.skills.some((skill) => skill.name === name)) setForm((current) => ({ ...current, skills: [...current.skills, emptySkill(name, 3)] })); }} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700">{name}</button>)}</div></div>
          <div className="mt-5 space-y-4">{form.skills.map((skill) => <div key={skill.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start gap-4"><div className="flex-1"><label><span className={labelClass}>Keahlian</span><input className={inputClass} value={skill.name} onChange={(e) => updateArrayItem("skills", skill.id, "name", e.target.value)} placeholder="Contoh: Microsoft Excel" /></label>{form.showSkillLevel ? <div className="mt-4"><div className="mb-2 flex justify-between text-xs font-medium text-slate-500"><span>Tingkat</span><span>{levelNames[skill.level]}</span></div><input type="range" min="1" max="5" value={skill.level} onChange={(e) => updateArrayItem("skills", skill.id, "level", Number(e.target.value))} className="w-full accent-sky-500" /><div className="mt-2"><SkillBars level={skill.level} /></div></div> : null}</div><button type="button" onClick={() => removeArrayItem("skills", skill.id)} className="mt-7 rounded-lg p-2 text-rose-500 hover:bg-rose-50">🗑</button></div></div>)}</div>
          <button type="button" onClick={() => setForm((current) => ({ ...current, skills: [...current.skills, emptySkill()] }))} className="mt-5 font-semibold text-sky-600 hover:text-sky-700">＋ Tambahkan keahlian</button>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <SectionTitle title="Ringkasan" description="Soroti pengalaman, keahlian kunci, dan tujuan karier Anda dalam 3–4 kalimat." />
          <RichToolbar onInsert={insertSummaryFormatting} onGenerate={generateSummaryDraft} generating={generatingKey === "summary"} />
          <textarea ref={registerEditorRef("summary")} className={`${inputClass} min-h-48 rounded-t-none`} value={form.summary} onChange={(e) => setForm((current) => ({ ...current, summary: e.target.value }))} onKeyDown={(event) => handleAutoListEnter(event, (nextValue) => setForm((current) => ({ ...current, summary: nextValue })))} placeholder="Tuliskan profil profesional Anda..." />
          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5"><h3 className="font-semibold text-slate-800">Struktur ringkasan yang disarankan</h3><p className="mt-1 text-sm text-slate-500">Klik contoh untuk memasukkannya lalu sesuaikan.</p><div className="mt-4 grid gap-3 md:grid-cols-2">{summarySuggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setForm((current) => ({ ...current, summary: suggestion }))} className="rounded-xl border border-sky-200 bg-white p-4 text-left text-sm leading-6 text-slate-700 hover:border-sky-400 hover:shadow-sm"><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500 font-bold text-white">＋</span>{suggestion}</button>)}</div></div>
        </>
      );
    }

    return (
      <>
        <SectionTitle title="Bagian Tambahan" description="Tambahkan sertifikasi, bahasa, penghargaan, hobi, atau detail lain yang relevan." />
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-slate-800">🌐 Bahasa dan tingkat</h3><button type="button" onClick={() => setForm((current) => ({ ...current, languages: [...current.languages, emptyLanguage()] }))} className="font-semibold text-sky-600">＋ Tambah bahasa</button></div><div className="space-y-3">{form.languages.map((item) => <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_220px_44px]"><input className={inputClass} value={item.language} onChange={(e) => updateArrayItem("languages", item.id, "language", e.target.value)} placeholder="Bahasa Inggris" /><select className={inputClass} value={item.level} onChange={(e) => updateArrayItem("languages", item.id, "level", e.target.value)}><option>Pemula</option><option>Dasar</option><option>Menengah</option><option>Mahir</option><option>Fasih</option><option>Bahasa ibu</option></select><button type="button" onClick={() => removeArrayItem("languages", item.id)} disabled={form.languages.length === 1} className="rounded-xl text-rose-500 hover:bg-rose-50 disabled:opacity-30">🗑</button></div>)}</div></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-slate-800">🎯 Hobi dan minat</h3><button type="button" onClick={() => setForm((current) => ({ ...current, hobbies: [...current.hobbies, emptyHobby()] }))} className="font-semibold text-sky-600">＋ Tambah hobi</button></div><div className="space-y-3">{form.hobbies.map((item) => <div key={item.id} className="flex gap-3"><input className={inputClass} value={item.name} onChange={(e) => updateArrayItem("hobbies", item.id, "name", e.target.value)} placeholder="Contoh: Membaca, fotografi, olahraga" /><button type="button" onClick={() => removeArrayItem("hobbies", item.id)} disabled={form.hobbies.length === 1} className="rounded-xl px-3 text-rose-500 hover:bg-rose-50 disabled:opacity-30">🗑</button></div>)}</div></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-slate-800">🏅 Sertifikasi dan lisensi</h3><button type="button" onClick={() => setForm((current) => ({ ...current, certifications: [...current.certifications, emptyCertification()] }))} className="font-semibold text-sky-600">＋ Tambah sertifikasi</button></div>{form.certifications.length ? <div className="space-y-3">{form.certifications.map((item) => <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_1fr_120px_44px]"><input className={inputClass} value={item.name} onChange={(e) => updateArrayItem("certifications", item.id, "name", e.target.value)} placeholder="Nama sertifikasi" /><input className={inputClass} value={item.issuer} onChange={(e) => updateArrayItem("certifications", item.id, "issuer", e.target.value)} placeholder="Penerbit" /><input className={inputClass} value={item.year} onChange={(e) => updateArrayItem("certifications", item.id, "year", e.target.value)} placeholder="Tahun" /><button type="button" onClick={() => removeArrayItem("certifications", item.id)} className="rounded-xl text-rose-500 hover:bg-rose-50">🗑</button></div>)}</div> : <p className="text-sm text-slate-400">Belum ada sertifikasi.</p>}</div>
        </div>
      </>
    );
  };

  const paperClass = template === "ats"
    ? "font-serif"
    : template === "simple"
      ? "font-sans"
      : "font-sans";

  return (
    <div className="min-h-screen bg-slate-100 lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[minmax(340px,1fr)_minmax(680px,2fr)]">
        <section className="flex min-h-screen flex-col border-r border-slate-200 bg-white lg:h-screen lg:min-h-0">
          <div className="border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
            <div className="relative flex justify-between gap-2 overflow-x-auto pb-1">
              <div className="absolute left-5 right-5 top-[34px] h-px bg-slate-200" />
              {STEPS.map((item, index) => (
                <button key={item} type="button" onClick={() => setStep(index)} className="relative z-10 min-w-max px-2 text-center">
                  <span className={`block text-sm ${step === index ? "font-semibold text-sky-600" : index < step ? "font-medium text-slate-700" : "text-slate-400"}`}>{item}</span>
                  <span className={`mx-auto mt-3 block h-3 w-3 rounded-full border-2 bg-white ${step === index ? "border-sky-500 ring-4 ring-sky-100" : index < step ? "border-sky-400" : "border-slate-200"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 px-5 py-7 lg:px-8">
            <div className="mx-auto max-w-[620px]">{renderStepContent()}</div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] lg:px-8">
            <button type="button" onClick={goPrevious} className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">← Kembali</button>
            {step < STEPS.length - 1 ? <button type="button" onClick={goNext} className="rounded-xl bg-sky-500 px-7 py-3 font-semibold text-white shadow-lg shadow-sky-200 hover:bg-sky-600">Berikutnya: {STEPS[step + 1]} →</button> : <button type="button" onClick={handleContinueDesign} className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3 font-semibold text-slate-950 shadow-lg shadow-amber-200">Lanjut ke Desain →</button>}
          </div>
        </section>

        <aside className="bg-slate-200 px-5 py-5 lg:h-screen lg:overflow-y-auto lg:px-7">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"><span className={`mr-2 rounded-lg px-2 py-1 font-bold ${score >= 80 ? "bg-emerald-100 text-emerald-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{score}%</span>Skor resume Anda</div>
              <select value={template} onChange={(e) => setTemplate(e.target.value)} className="rounded-xl border-0 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none"><option value="modern">Template Modern</option><option value="ats">Template ATS</option><option value="simple">Template Simple</option></select>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-xl border-0 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none"><option value="ID">Indonesia</option><option value="EN">English</option></select>
              <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                Preview besar • Tajam
              </span>
            </div>

            <ProfessionalCVPreview
              refreshKey={form}
              sourceWidth={720}
              viewportHeight={820}
              minZoom={0.5}
              maxZoom={1.25}
              defaultZoom={1}
              defaultMode="actual-size"
            >
              <div
                className={`relative min-h-[940px] w-[720px] overflow-hidden bg-white p-10 text-slate-800 ${paperClass}`}
              >
              <header className={template === "ats" ? "border-b border-slate-300 pb-5 text-center" : template === "simple" ? "border-b-2 border-slate-900 pb-5" : "border-b-4 border-sky-500 pb-5"}>
                <h1 className={`text-3xl font-bold ${template === "modern" ? "text-sky-600" : "text-slate-900"}`}>{`${form.contact.firstName} ${form.contact.lastName}`.trim() || "Nama Anda"}</h1>
                <p className="mt-1 text-sm font-medium text-slate-500">{form.contact.desiredJob || "Pekerjaan yang diinginkan"}</p>
                <p className="mt-3 text-xs text-slate-500">{[form.contact.email, form.contact.phone, form.contact.city, form.contact.country].filter(Boolean).join(" • ") || "email@email.com • +62 812 3456 7890"}</p>
                {form.contact.address ? <p className="mt-1 text-xs text-slate-400">{form.contact.address}{form.contact.postalCode ? `, ${form.contact.postalCode}` : ""}</p> : null}
              </header>

              {stripFormatting(form.summary) ? <section className="mt-6"><h2 className="border-b border-slate-200 pb-1 text-xs font-bold tracking-[0.16em] text-slate-700">{sectionLabels.summary}</h2><FormattedText value={form.summary} className="mt-3 space-y-1 text-sm leading-6 text-slate-600" /></section> : null}

              {form.experiences.some((item) => item.jobTitle || item.employer || item.description) ? <section className="mt-6"><h2 className="border-b border-slate-200 pb-1 text-xs font-bold tracking-[0.16em] text-slate-700">{sectionLabels.experience}</h2><div className="mt-3 space-y-5">{form.experiences.filter((item) => item.jobTitle || item.employer || item.description).map((item) => <article key={item.id}><div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-bold text-slate-800">{item.jobTitle || "Judul pekerjaan"}</h3><p className="text-sm text-slate-500">{[item.employer, item.location].filter(Boolean).join(" • ")}</p></div><p className="whitespace-nowrap text-xs text-slate-400">{item.startDate || "Mulai"} – {item.current ? sectionLabels.present : item.endDate || "Selesai"}</p></div>{stripFormatting(item.description) ? <FormattedText value={item.description} className="mt-2 space-y-1 text-sm leading-6 text-slate-600" /> : null}</article>)}</div></section> : null}

              {form.education.some((item) => item.school || item.degree || item.description) ? <section className="mt-6"><h2 className="border-b border-slate-200 pb-1 text-xs font-bold tracking-[0.16em] text-slate-700">{sectionLabels.education}</h2><div className="mt-3 space-y-4">{form.education.filter((item) => item.school || item.degree || item.description).map((item) => <article key={item.id}><div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-bold text-slate-800">{item.school || "Nama sekolah"}</h3><p className="text-sm text-slate-500">{[item.degree, item.location].filter(Boolean).join(" • ")}</p></div><p className="whitespace-nowrap text-xs text-slate-400">{item.startDate || "Mulai"} – {item.current ? sectionLabels.present : item.endDate || "Selesai"}</p></div>{stripFormatting(item.description) ? <FormattedText value={item.description} className="mt-2 space-y-1 text-sm leading-6 text-slate-600" /> : null}</article>)}</div></section> : null}

              {form.skills.some((item) => item.name) ? <section className="mt-6"><h2 className="border-b border-slate-200 pb-1 text-xs font-bold tracking-[0.16em] text-slate-700">{sectionLabels.skills}</h2><div className="mt-3 grid grid-cols-2 gap-x-7 gap-y-3">{form.skills.filter((item) => item.name).map((item) => <div key={item.id}><div className="flex justify-between text-sm"><span>{item.name}</span>{form.showSkillLevel ? <span className="text-xs text-slate-400">{levelNames[item.level]}</span> : null}</div>{form.showSkillLevel ? <div className="mt-1"><SkillBars level={item.level} /></div> : null}</div>)}</div></section> : null}

              {form.languages.some((item) => item.language) ? <section className="mt-6"><h2 className="border-b border-slate-200 pb-1 text-xs font-bold tracking-[0.16em] text-slate-700">{sectionLabels.languages}</h2><div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">{form.languages.filter((item) => item.language).map((item) => <p key={item.id}>{item.language} — {item.level}</p>)}</div></section> : null}
              {form.certifications.length ? <section className="mt-6"><h2 className="border-b border-slate-200 pb-1 text-xs font-bold tracking-[0.16em] text-slate-700">{sectionLabels.certifications}</h2><div className="mt-3 space-y-2 text-sm text-slate-600">{form.certifications.filter((item) => item.name).map((item) => <p key={item.id}><strong>{item.name}</strong>{item.issuer ? ` — ${item.issuer}` : ""}{item.year ? ` (${item.year})` : ""}</p>)}</div></section> : null}
              {form.hobbies.some((item) => item.name) ? <section className="mt-6"><h2 className="border-b border-slate-200 pb-1 text-xs font-bold tracking-[0.16em] text-slate-700">{sectionLabels.hobbies}</h2><p className="mt-3 text-sm text-slate-600">{form.hobbies.map((item) => item.name).filter(Boolean).join(" • ")}</p></section> : null}
              </div>
            </ProfessionalCVPreview>
          </div>
        </aside>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { supabase } from "../lib/supabase";
import ProfessionalCVPreview from "../components/ProfessionalCVPreview";
import AIPhotoStudio from "../components/photo/AIPhotoStudio";
import LogoCVKilat from "../components/LogoCVKilat";

const PANELS = [
  { id: "template", label: "Template", icon: "▤" },
  { id: "sections", label: "Bagian", icon: "☷" },
  { id: "design", label: "Desain & Pemformatan", icon: "◉" },
  { id: "spelling", label: "Pemeriksa Ejaan", icon: "A" },
  { id: "photo", label: "Foto Profil", icon: "◍" },
];

const SECTION_KEYS = [
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
  "certifications",
  "hobbies",
];

const DEFAULT_DESIGN = {
  template: "modern",
  language: "ID",
  fontFamily: "Inter",
  fontSize: "normal",
  primaryColor: "#0ea5e9",
  headerBackground: "#e0f2fe",
  pageBackground: "#ffffff",
  sectionSpacing: 22,
  paragraphSpacing: 8,
  lineHeight: 1.5,
  pageMargin: 38,
  sectionOrder: SECTION_KEYS,
  hiddenSections: [],
};

const DEFAULT_PHOTO = {
  originalUrl: "",
  editedUrl: "",
  shape: "circle",
  size: 104,
  position: "right",
  zoom: 1,
  rotation: 0,
};

const EMPTY_DATA = {
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
  experiences: [],
  education: [],
  showSkillLevel: true,
  skills: [],
  summary: "",
  languages: [],
  hobbies: [],
  certifications: [],
};

const FONT_OPTIONS = [
  "Inter",
  "Arial",
  "Calibri",
  "Georgia",
  "Times New Roman",
  "Verdana",
];

const FONT_SIZE_MAP = {
  small: 0.9,
  normal: 1,
  large: 1.12,
};

const LEVEL_NAMES = {
  1: "Pemula",
  2: "Awal",
  3: "Terampil",
  4: "Berpengalaman",
  5: "Ahli",
};

const TYPO_MAP = {
  aktifitas: "aktivitas",
  resiko: "risiko",
  ijin: "izin",
  karir: "karier",
  sekedar: "sekadar",
  praktek: "praktik",
  analisa: "analisis",
  merubah: "mengubah",
  silahkan: "silakan",
  efektifitas: "efektivitas",
};

function normalizeData(source) {
  const safe = source && typeof source === "object" ? source : {};

  return {
    ...EMPTY_DATA,
    ...safe,
    contact: {
      ...EMPTY_DATA.contact,
      ...(safe.contact || {}),
    },
    experiences: Array.isArray(safe.experiences) ? safe.experiences : [],
    education: Array.isArray(safe.education) ? safe.education : [],
    skills: Array.isArray(safe.skills) ? safe.skills : [],
    languages: Array.isArray(safe.languages) ? safe.languages : [],
    hobbies: Array.isArray(safe.hobbies) ? safe.hobbies : [],
    certifications: Array.isArray(safe.certifications) ? safe.certifications : [],
    design: {
      ...DEFAULT_DESIGN,
      ...(safe.design || {}),
      sectionOrder:
        Array.isArray(safe.design?.sectionOrder) && safe.design.sectionOrder.length
          ? safe.design.sectionOrder
          : SECTION_KEYS,
      hiddenSections: Array.isArray(safe.design?.hiddenSections)
        ? safe.design.hiddenSections
        : [],
    },
    photo: {
      ...DEFAULT_PHOTO,
      ...(safe.photo || {}),
    },
  };
}

function stripFormatting(value = "") {
  return String(value)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/<u>(.*?)<\/u>/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1");
}

function renderInlineFormatting(text, keyPrefix) {
  const tokenPattern = /(\*\*.+?\*\*|~~.+?~~|<u>.+?<\/u>|_.+?_|\[[^\]]+\]\([^)]+\))/g;
  const tokens = String(text || "").split(tokenPattern).filter(Boolean);

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
      return (
        <span key={key} className="underline underline-offset-2">
          {linkMatch[1]}
        </span>
      );
    }

    return <span key={key}>{token}</span>;
  });
}

function FormattedText({ value, style }) {
  const lines = String(value || "").replace(/\r/g, "").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const ordered = lines[index].match(/^\s*\d+[.)]\s+(.*)$/);
    const bullet = lines[index].match(/^\s*[•*-]\s+(.*)$/);

    if (ordered) {
      const items = [];
      while (index < lines.length) {
        const match = lines[index].match(/^\s*\d+[.)]\s+(.*)$/);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }

      blocks.push(
        <ol key={`ol-${index}`} className="ml-5 list-decimal" style={style}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              {renderInlineFormatting(item, `ol-${index}-${itemIndex}`)}
            </li>
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
        <ul key={`ul-${index}`} className="ml-5 list-disc" style={style}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              {renderInlineFormatting(item, `ul-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    const line = lines[index];
    if (line.trim()) {
      blocks.push(
        <p key={`p-${index}`} style={style}>
          {renderInlineFormatting(line, `p-${index}`)}
        </p>
      );
    }
    index += 1;
  }

  return <>{blocks}</>;
}

function formatMonth(value, language) {
  if (!value) return "";
  const [year, month] = String(value).split("-").map(Number);
  if (!year || !month) return value;

  try {
    return new Intl.DateTimeFormat(language === "EN" ? "en-US" : "id-ID", {
      month: "short",
      year: "numeric",
    }).format(new Date(year, month - 1, 1));
  } catch {
    return value;
  }
}

function SkillBars({ level, color }) {
  return (
    <div className="mt-1 flex gap-1">
      {[1, 2, 3, 4, 5].map((bar) => (
        <span
          key={bar}
          className="h-1.5 flex-1 rounded-full"
          style={{ backgroundColor: bar <= Number(level || 0) ? color : "#dbe3ea" }}
        />
      ))}
    </div>
  );
}

function PhotoAvatar({ photo, fallbackName }) {
  const size = Number(photo?.size) || 96;
  const zoom = Number(photo?.zoom) || 1;
  const rotation = Number(photo?.rotation) || 0;
  const shape = photo?.shape || "circle";

  const src =
    photo?.editedUrl ||
    photo?.originalUrl ||
    "";

  const borderRadius =
    shape === "circle"
      ? "999px"
      : shape === "rounded"
        ? "18px"
        : "4px";

  const frameStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    maxWidth: `${size}px`,
    maxHeight: `${size}px`,
    borderRadius,
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
    contain: "paint",
    clipPath: `inset(0 round ${borderRadius})`,
    WebkitClipPath: `inset(0 round ${borderRadius})`,
  };

  if (!src) {
    return (
      <div
        data-photo-frame="true"
        className="flex shrink-0 items-center justify-center bg-white/30 font-bold text-white"
        style={frameStyle}
        aria-label="Foto profil belum tersedia"
      >
        {fallbackName || "CV"}
      </div>
    );
  }

  return (
    <div
      data-photo-frame="true"
      className="shrink-0 bg-slate-100"
      style={frameStyle}
    >
      <img
        data-photo-image="true"
        src={src}
        alt="Foto profil CV"
        draggable={false}
        style={{
          display: "block",
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          minWidth: "100%",
          minHeight: "100%",
          maxWidth: "none",
          maxHeight: "none",
          objectFit: "cover",
          objectPosition: "center",
          transformOrigin: "center center",
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
        }}
      />
    </div>
  );
}

function SectionHeading({ children, design, template }) {
  if (template === "ats") {
    return (
      <h2 className="border-b border-slate-500 pb-1 text-[11px] font-bold tracking-[0.14em] text-slate-900">
        {children}
      </h2>
    );
  }

  if (template === "executive") {
    return (
      <h2
        className="border-l-4 pl-2 text-[12px] font-bold tracking-[0.12em]"
        style={{ color: design.primaryColor, borderColor: design.primaryColor }}
      >
        {children}
      </h2>
    );
  }

  if (template === "minimal") {
    return (
      <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-500">
        {children}
      </h2>
    );
  }

  return (
    <h2
      className="border-b pb-1 text-[11px] font-bold tracking-[0.16em]"
      style={{ color: design.primaryColor, borderColor: `${design.primaryColor}55` }}
    >
      {children}
    </h2>
  );
}

function TemplatePreview({ data }) {
  const { contact, design, photo } = data;
  const language = design.language;
  const template = design.template;
  const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Nama Anda";
  const initials = `${contact.firstName?.[0] || ""}${contact.lastName?.[0] || ""}`.toUpperCase();
  const fontScale = FONT_SIZE_MAP[design.fontSize] || 1;
  const bodyStyle = {
    fontSize: `${12.5 * fontScale}px`,
    lineHeight: design.lineHeight,
    marginTop: design.paragraphSpacing,
  };

  const labels = language === "EN"
    ? {
        summary: "SUMMARY",
        experience: "EXPERIENCE",
        education: "EDUCATION",
        skills: "SKILLS",
        languages: "LANGUAGES",
        certifications: "CERTIFICATIONS",
        hobbies: "INTERESTS",
        present: "Present",
      }
    : {
        summary: "RINGKASAN",
        experience: "PENGALAMAN",
        education: "PENDIDIKAN",
        skills: "KEAHLIAN",
        languages: "BAHASA",
        certifications: "SERTIFIKASI",
        hobbies: "HOBI & MINAT",
        present: "Sekarang",
      };

  const sectionExists = {
    summary: Boolean(stripFormatting(data.summary).trim()),
    experience: data.experiences.some((item) => item.jobTitle || item.employer || item.description),
    education: data.education.some((item) => item.school || item.degree || item.description),
    skills: data.skills.some((item) => item.name),
    languages: data.languages.some((item) => item.language),
    certifications: data.certifications.some((item) => item.name),
    hobbies: data.hobbies.some((item) => item.name),
  };

  const renderSection = (sectionKey, compact = false) => {
    if (design.hiddenSections.includes(sectionKey) || !sectionExists[sectionKey]) {
      return null;
    }

    if (sectionKey === "summary") {
      return (
        <section key={sectionKey} style={{ marginTop: design.sectionSpacing }}>
          <SectionHeading design={design} template={template}>{labels.summary}</SectionHeading>
          <div className="text-slate-700">
            <FormattedText value={data.summary} style={bodyStyle} />
          </div>
        </section>
      );
    }

    if (sectionKey === "experience") {
      return (
        <section key={sectionKey} style={{ marginTop: design.sectionSpacing }}>
          <SectionHeading design={design} template={template}>{labels.experience}</SectionHeading>
          <div style={{ marginTop: design.paragraphSpacing }}>
            {data.experiences
              .filter((item) => item.jobTitle || item.employer || item.description)
              .map((item) => (
                <article key={item.id || `${item.jobTitle}-${item.employer}`} style={{ marginBottom: design.paragraphSpacing + 4 }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900" style={{ fontSize: `${13.2 * fontScale}px` }}>
                        {item.jobTitle || "Judul pekerjaan"}
                      </h3>
                      <p className="text-slate-600" style={{ fontSize: `${12.2 * fontScale}px` }}>
                        {[item.employer, item.location].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                    <p className="whitespace-nowrap text-slate-400" style={{ fontSize: `${10.7 * fontScale}px` }}>
                      {formatMonth(item.startDate, language) || "Mulai"} – {item.current ? labels.present : formatMonth(item.endDate, language) || "Selesai"}
                    </p>
                  </div>
                  {stripFormatting(item.description).trim() ? (
                    <div className="text-slate-700">
                      <FormattedText value={item.description} style={bodyStyle} />
                    </div>
                  ) : null}
                </article>
              ))}
          </div>
        </section>
      );
    }

    if (sectionKey === "education") {
      return (
        <section key={sectionKey} style={{ marginTop: design.sectionSpacing }}>
          <SectionHeading design={design} template={template}>{labels.education}</SectionHeading>
          <div style={{ marginTop: design.paragraphSpacing }}>
            {data.education
              .filter((item) => item.school || item.degree || item.description)
              .map((item) => (
                <article key={item.id || `${item.school}-${item.degree}`} style={{ marginBottom: design.paragraphSpacing + 2 }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900" style={{ fontSize: `${13 * fontScale}px` }}>
                        {item.school || "Nama sekolah"}
                      </h3>
                      <p className="text-slate-600" style={{ fontSize: `${12 * fontScale}px` }}>
                        {[item.degree, item.location].filter(Boolean).join(" • ")}
                      </p>
                    </div>
                    <p className="whitespace-nowrap text-slate-400" style={{ fontSize: `${10.7 * fontScale}px` }}>
                      {formatMonth(item.startDate, language) || "Mulai"} – {item.current ? labels.present : formatMonth(item.endDate, language) || "Selesai"}
                    </p>
                  </div>
                  {stripFormatting(item.description).trim() ? (
                    <div className="text-slate-700">
                      <FormattedText value={item.description} style={bodyStyle} />
                    </div>
                  ) : null}
                </article>
              ))}
          </div>
        </section>
      );
    }

    if (sectionKey === "skills") {
      const skillLegend = language === "EN"
        ? "LEVEL: 1 BASIC · 3 SKILLED · 5 EXPERT"
        : "LEVEL: 1 DASAR · 3 TERAMPIL · 5 AHLI";

      return (
        <section key={sectionKey} style={{ marginTop: design.sectionSpacing }}>
          <SectionHeading design={design} template={template}>{labels.skills}</SectionHeading>

          {data.showSkillLevel ? (
            <p
              className="mt-1 text-[8.5px] font-medium tracking-[0.08em] text-slate-400"
              aria-label={skillLegend}
            >
              {skillLegend}
            </p>
          ) : null}

          <div
            className={`grid ${compact ? "grid-cols-1" : "grid-cols-2"} gap-x-5`}
            style={{
              marginTop: data.showSkillLevel
                ? Math.max(5, design.paragraphSpacing - 2)
                : design.paragraphSpacing,
              rowGap: Math.max(8, design.paragraphSpacing),
            }}
          >
            {data.skills.filter((item) => item.name).map((item) => {
              const numericLevel = Math.min(5, Math.max(1, Number(item.level || 1)));
              const levelLabel = LEVEL_NAMES[numericLevel];

              return (
                <div
                  key={item.id || item.name}
                  className="min-w-0"
                  title={`${item.name}: ${levelLabel} (${numericLevel}/5)`}
                  aria-label={`${item.name}: ${levelLabel}, ${numericLevel} dari 5`}
                >
                  <p
                    className="break-words font-medium leading-snug text-slate-800"
                    style={{ fontSize: `${11.7 * fontScale}px` }}
                  >
                    {item.name}
                  </p>

                  {data.showSkillLevel ? (
                    <div className="mt-1 flex min-w-0 items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <SkillBars level={numericLevel} color={design.primaryColor} />
                      </div>
                      <span
                        className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[8.5px] font-bold tabular-nums text-slate-500"
                        title={levelLabel}
                      >
                        {numericLevel}/5
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    if (sectionKey === "languages") {
      return (
        <section key={sectionKey} style={{ marginTop: design.sectionSpacing }}>
          <SectionHeading design={design} template={template}>{labels.languages}</SectionHeading>
          <div className="grid grid-cols-2 gap-2 text-slate-700" style={{ ...bodyStyle, marginTop: design.paragraphSpacing }}>
            {data.languages.filter((item) => item.language).map((item) => (
              <p key={item.id || item.language}>{item.language} — {item.level}</p>
            ))}
          </div>
        </section>
      );
    }

    if (sectionKey === "certifications") {
      return (
        <section key={sectionKey} style={{ marginTop: design.sectionSpacing }}>
          <SectionHeading design={design} template={template}>{labels.certifications}</SectionHeading>
          <div className="text-slate-700" style={{ marginTop: design.paragraphSpacing }}>
            {data.certifications.filter((item) => item.name).map((item) => (
              <p key={item.id || item.name} style={bodyStyle}>
                <strong>{item.name}</strong>{item.issuer ? ` — ${item.issuer}` : ""}{item.year ? ` (${item.year})` : ""}
              </p>
            ))}
          </div>
        </section>
      );
    }

    if (sectionKey === "hobbies") {
      return (
        <section key={sectionKey} style={{ marginTop: design.sectionSpacing }}>
          <SectionHeading design={design} template={template}>{labels.hobbies}</SectionHeading>
          <p className="text-slate-700" style={{ ...bodyStyle, marginTop: design.paragraphSpacing }}>
            {data.hobbies.map((item) => item.name).filter(Boolean).join(" • ")}
          </p>
        </section>
      );
    }

    return null;
  };

  const orderedSections = design.sectionOrder.filter((key) => SECTION_KEYS.includes(key));
  const mainSections = orderedSections.filter((key) => ["summary", "experience", "education", "certifications"].includes(key));
  const sideSections = orderedSections.filter((key) => ["skills", "languages", "hobbies"].includes(key));

  const header = (
    <header
      className={template === "ats" ? "border-b border-slate-400 pb-5 text-center" : "flex items-center justify-between gap-6"}
      style={template === "ats" ? undefined : { backgroundColor: design.headerBackground, margin: `-${design.pageMargin}px -${design.pageMargin}px 0`, padding: `${Math.max(24, design.pageMargin - 8)}px ${design.pageMargin}px` }}
    >
      {template !== "ats" && photo.position === "left" ? <PhotoAvatar photo={photo} fallbackName={initials} /> : null}
      <div className={template === "ats" ? "" : "flex-1"}>
        <h1
          className="font-bold tracking-tight"
          style={{
            color: template === "ats" ? "#0f172a" : design.primaryColor,
            fontSize: `${30 * fontScale}px`,
          }}
        >
          {fullName}
        </h1>
        <p className="mt-1 font-medium text-slate-600" style={{ fontSize: `${13 * fontScale}px` }}>
          {contact.desiredJob || "Pekerjaan yang diinginkan"}
        </p>
        <p className="mt-3 text-slate-500" style={{ fontSize: `${10.8 * fontScale}px` }}>
          {[contact.email, contact.phone, contact.city, contact.country].filter(Boolean).join(" • ") || "email@email.com • +62 812 3456 7890"}
        </p>
        {contact.address ? (
          <p className="mt-1 text-slate-400" style={{ fontSize: `${10.5 * fontScale}px` }}>
            {contact.address}{contact.postalCode ? `, ${contact.postalCode}` : ""}
          </p>
        ) : null}
      </div>
      {template !== "ats" && photo.position === "right" ? <PhotoAvatar photo={photo} fallbackName={initials} /> : null}
    </header>
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "794px",
        minHeight: "1123px",
        backgroundColor: design.pageBackground,
        padding: design.pageMargin,
        fontFamily: design.fontFamily,
        color: "#1e293b",
      }}
    >
      {template === "executive" ? (
        <div className="absolute bottom-0 left-0 top-0 w-3" style={{ backgroundColor: design.primaryColor }} />
      ) : null}

      {header}

      {template === "modern" || template === "executive" ? (
        <div className="grid grid-cols-[0.34fr_0.66fr] gap-8">
          <aside>{sideSections.map((sectionKey) => renderSection(sectionKey, true))}</aside>
          <main>{mainSections.map((sectionKey) => renderSection(sectionKey, false))}</main>
        </div>
      ) : (
        <main>{orderedSections.map((sectionKey) => renderSection(sectionKey, false))}</main>
      )}
    </div>
  );
}

function PanelTitle({ title, description }) {
  return (
    <div className="border-b border-slate-200 pb-5">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () =>
      resolve(String(reader.result || ""));

    reader.onerror = () =>
      reject(
        new Error("File foto gagal dibaca.")
      );

    reader.readAsDataURL(file);
  });
}

function loadBrowserImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new Error("Foto gagal dibuka oleh browser.")
      );

    image.src = dataUrl;
  });
}

async function optimizePhotoDataUrl(
  dataUrl,
  {
    maxDimension = 1600,
    quality = 0.88,
  } = {}
) {
  const image = await loadBrowserImage(dataUrl);

  const longestSide = Math.max(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height
  );

  const scale = Math.min(
    1,
    maxDimension / Math.max(longestSide, 1)
  );

  const width = Math.max(
    1,
    Math.round(
      (image.naturalWidth || image.width) *
        scale
    )
  );

  const height = Math.max(
    1,
    Math.round(
      (image.naturalHeight || image.height) *
        scale
    )
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", {
    alpha: false,
  });

  if (!context) {
    throw new Error(
      "Browser tidak dapat memproses foto."
    );
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", quality);
}

async function getFunctionErrorMessage(error) {
  try {
    const response = error?.context;

    if (
      response &&
      typeof response.clone === "function"
    ) {
      const payload = await response
        .clone()
        .json();

      if (payload?.error) {
        return String(payload.error);
      }
    }
  } catch {
    // Gunakan message standar.
  }

  return (
    error?.message ||
    "Edge Function gagal memproses foto."
  );
}

function ControlLabel({ children }) {
  return <span className="mb-2 block text-sm font-medium text-slate-700">{children}</span>;
}

function RangeControl({ label, min, max, step = 1, value, onChange, suffix = "" }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
        <span>{label}</span>
        <span className="font-semibold text-sky-600">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-sky-500"
      />
    </label>
  );
}

export default function TemplateEditorPage({
  user = null,
  initialData = null,
  cvId = null,
  onBack = () => {},
  onSaved = () => {},
  onRequireAuth = () => {},
}) {
  const [data, setData] = useState(() => {
    if (initialData) return normalizeData(initialData);

    try {
      const draft = localStorage.getItem("cv-kilat-design-draft");
      return normalizeData(draft ? JSON.parse(draft) : null);
    } catch {
      return normalizeData(null);
    }
  });
  const [activePanel, setActivePanel] = useState("template");
  const [documentName, setDocumentName] = useState(() => {
    const name = `${initialData?.contact?.firstName || ""}_${initialData?.contact?.lastName || ""}`.replace(/^_|_$/g, "");
    return name ? `${name}_CV` : "CV_Kilat";
  });
  const [recordId, setRecordId] = useState(cvId);
  const [saveState, setSaveState] = useState("local");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

const [photoNotice, setPhotoNotice] = useState(null);
const [photoProcessingMode, setPhotoProcessingMode] =
  useState("");
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cvRef = useRef(null);

  useEffect(() => {
    if (!initialData) return;
    setData(normalizeData(initialData));
  }, [initialData]);

  useEffect(() => {
    localStorage.setItem("cv-kilat-design-draft", JSON.stringify(data));
    setSaveState("local");
  }, [data]);

  useEffect(() => () => {
    streamRef.current?.getTracks?.().forEach((track) => track.stop());
  }, []);

  const updateDesign = (field, value) => {
    setData((current) => ({
      ...current,
      design: {
        ...current.design,
        [field]: value,
      },
    }));
  };

  const updatePhoto = (field, value) => {
    setData((current) => ({
      ...current,
      photo: {
        ...current.photo,
        [field]: value,
      },
    }));
  };

  const resetDesign = () => {
    setData((current) => ({
      ...current,
      design: {
        ...DEFAULT_DESIGN,
        language: current.design.language,
      },
    }));
  };

  const saveToCloud = async ({ silent = false } = {}) => {
    if (!user) {
      onRequireAuth();
      return null;
    }

    setSaving(true);
    setSaveState("saving");

    try {
  const dataToSave = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  let response;
      if (recordId) {
        response = await supabase
          .from("cv_data")
          .update({ data: dataToSave })
          .eq("id", recordId)
          .eq("user_id", user)
          .select("id")
          .single();
      } else {
        response = await supabase
          .from("cv_data")
          .insert([
  {
    user_id: user,
    data: dataToSave,
  },
])
          .select("id")
          .single();
      }

      if (response.error) throw response.error;

      const savedId = response.data?.id || recordId;
      setRecordId(savedId);
      setSaveState("saved");
      onSaved(savedId, dataToSave);
      if (!silent) alert("✅ Desain CV berhasil disimpan.");
      return savedId;
    } catch (error) {
      console.error("Gagal menyimpan desain CV:", error);
      setSaveState("error");
      if (!silent) alert(`❌ Gagal menyimpan desain: ${error.message || "Terjadi kesalahan"}`);
      return null;
    } finally {
      setSaving(false);
    }
  };

const downloadPDF = async () => {
  if (!user) {
    onRequireAuth();
    return;
  }

  const previewElement = cvRef.current;

  if (!previewElement) {
    alert("❌ Preview CV belum siap. Silakan tunggu sebentar.");
    return;
  }

  setExporting(true);

  const watermarkElements = Array.from(
    previewElement.querySelectorAll(
      '[data-cv-watermark="true"]'
    )
  );

  const previousVisibility = watermarkElements.map(
    (element) => element.style.visibility
  );

  try {
    // Penyimpanan cloud tidak boleh menghentikan pembuatan PDF.
    // Bila gagal, PDF tetap dicoba dibuat dari data yang tampil.
    await saveToCloud({ silent: true });

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    // Sembunyikan watermark pada DOM hanya selama proses capture.
    watermarkElements.forEach((element) => {
      element.style.visibility = "hidden";
    });

    // Tunggu browser menerapkan perubahan style.
    await new Promise((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(resolve)
      )
    );

    const canvas = await html2canvas(previewElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor:
        data.design.pageBackground || "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,

      // Pengamanan tambahan: html2canvas tidak memproses watermark.
      ignoreElements: (element) =>
        element?.hasAttribute?.("data-cv-watermark") ||
        element?.hasAttribute?.("data-html2canvas-ignore"),
    });

    if (!canvas.width || !canvas.height) {
      throw new Error(
        "Ukuran hasil capture tidak valid."
      );
    }

    const imageData = canvas.toDataURL(
      "image/jpeg",
      0.96
    );

    if (!imageData || imageData === "data:,") {
      throw new Error(
        "Gambar PDF gagal dibuat dari preview."
      );
    }

        const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Tinggi satu halaman A4 dalam ukuran pixel canvas.
    const pagePixelHeight = Math.floor(
      (canvas.width * pageHeight) / pageWidth
    );

    // Toleransi maksimal 5 mm untuk CV yang hanya sedikit melebihi A4.
    const singlePageTolerancePx = Math.ceil(
      (canvas.width * 5) / pageWidth
    );

    const rawImageHeight =
      (canvas.height * pageWidth) /
      canvas.width;

    /*
     * CV satu halaman atau hanya sedikit melebihi A4:
     * perkecil sedikit agar tidak membuat halaman kosong tambahan.
     */
    if (
      canvas.height <=
      pagePixelHeight + singlePageTolerancePx
    ) {
      const scaleToFit = Math.min(
        1,
        pageHeight / rawImageHeight
      );

      const imageWidth =
        pageWidth * scaleToFit;

      const imageHeight =
        rawImageHeight * scaleToFit;

      const imageX =
        (pageWidth - imageWidth) / 2;

      pdf.addImage(
        imageData,
        "JPEG",
        imageX,
        0,
        imageWidth,
        imageHeight,
        undefined,
        "FAST"
      );
    } else {
      /*
       * CV beberapa halaman:
       * cari baris kosong terdekat sebelum batas A4.
       */
      const sourceContext = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!sourceContext) {
        throw new Error(
          "Browser tidak dapat membaca hasil CV untuk pembagian halaman."
        );
      }

      const sourcePixels =
        sourceContext.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;

      const sampleStep = Math.max(
        3,
        Math.floor(canvas.width / 400)
      );

      /*
       * Menghitung perubahan warna pada satu baris.
       * Baris kosong biasanya memiliki sangat sedikit perubahan warna,
       * sedangkan baris berisi teks memiliki banyak perubahan.
       */
      const isWhitespaceRow = (y) => {
        if (y < 0 || y >= canvas.height) {
          return false;
        }

        const startX = Math.floor(
          canvas.width * 0.03
        );

        const endX = Math.floor(
          canvas.width * 0.97
        );

        let previousIndex =
          (y * canvas.width + startX) * 4;

        let previousRed =
          sourcePixels[previousIndex];

        let previousGreen =
          sourcePixels[previousIndex + 1];

        let previousBlue =
          sourcePixels[previousIndex + 2];

        let transitions = 0;

        const maximumTransitions = Math.max(
          10,
          Math.floor(canvas.width / 120)
        );

        for (
          let x = startX + sampleStep;
          x < endX;
          x += sampleStep
        ) {
          const pixelIndex =
            (y * canvas.width + x) * 4;

          const red =
            sourcePixels[pixelIndex];

          const green =
            sourcePixels[pixelIndex + 1];

          const blue =
            sourcePixels[pixelIndex + 2];

          const colorDifference =
            Math.abs(red - previousRed) +
            Math.abs(green - previousGreen) +
            Math.abs(blue - previousBlue);

          if (colorDifference > 70) {
            transitions += 1;
          }

          if (
            transitions >
            maximumTransitions
          ) {
            return false;
          }

          previousRed = red;
          previousGreen = green;
          previousBlue = blue;
        }

        return true;
      };

      /*
       * Cari area kosong maksimal sekitar 22 mm
       * sebelum batas halaman.
       */
      const findSmartBreak = (
        pageStart,
        idealPageEnd
      ) => {
        const lookbackPixels = Math.floor(
          (canvas.width * 22) / pageWidth
        );

        const minimumPageEnd = Math.max(
          pageStart +
            Math.floor(pagePixelHeight * 0.72),
          idealPageEnd - lookbackPixels
        );

        const bandRadius = 3;

        for (
          let y = idealPageEnd - bandRadius - 1;
          y >= minimumPageEnd;
          y -= 1
        ) {
          let blankBand = true;

          for (
            let offset = -bandRadius;
            offset <= bandRadius;
            offset += 1
          ) {
            if (!isWhitespaceRow(y + offset)) {
              blankBand = false;
              break;
            }
          }

          if (blankBand) {
            return y;
          }
        }

        // Cadangan apabila tidak ditemukan area kosong.
        return idealPageEnd;
      };

            /*
       * Periksa apakah suatu potongan halaman benar-benar
       * mempunyai teks atau elemen visual.
       */
      const sliceHasMeaningfulContent = (
        startY,
        endY
      ) => {
        const sliceHeight = Math.max(
          0,
          endY - startY
        );

        if (sliceHeight <= 0) {
          return false;
        }

        const rowStep = Math.max(
          1,
          Math.floor(sliceHeight / 240)
        );

        let contentRows = 0;

        for (
          let y = startY;
          y < endY;
          y += rowStep
        ) {
          if (!isWhitespaceRow(y)) {
            contentRows += 1;

            // Beberapa baris berisi sudah cukup membuktikan ada konten.
            if (contentRows >= 3) {
              return true;
            }
          }
        }

        return false;
      };

      /*
       * Cari posisi konten terakhir dan buang ruang kosong
       * berlebihan di bagian bawah canvas.
       */
      let contentBottom = canvas.height;

      const bottomPaddingPixels = Math.ceil(
        (canvas.width * 4) / pageWidth
      );

      for (
        let y = canvas.height - 1;
        y >= 0;
        y -= 1
      ) {
        if (!isWhitespaceRow(y)) {
          contentBottom = Math.min(
            canvas.height,
            y + bottomPaddingPixels
          );
          break;
        }
      }

      let pageStart = 0;
      let pageIndex = 0;

      while (pageStart < contentBottom) {
        const idealPageEnd = Math.min(
          pageStart + pagePixelHeight,
          contentBottom
        );

        const pageEnd =
          idealPageEnd < contentBottom
            ? findSmartBreak(
                pageStart,
                idealPageEnd
              )
            : contentBottom;

        const safePageEnd =
          pageEnd > pageStart + 20
            ? pageEnd
            : idealPageEnd;

        /*
         * Jangan membuat halaman apabila bagian terakhir
         * hanya berisi ruang kosong.
         */
        if (
          !sliceHasMeaningfulContent(
            pageStart,
            safePageEnd
          )
        ) {
          if (safePageEnd >= contentBottom) {
            break;
          }

          pageStart = safePageEnd;
          continue;
        }

        const sliceHeight =
          safePageEnd - pageStart;

        const pageCanvas =
          document.createElement("canvas");

        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;

        const pageContext =
          pageCanvas.getContext("2d", {
            alpha: false,
          });

        if (!pageContext) {
          throw new Error(
            "Browser tidak dapat membuat halaman PDF."
          );
        }

        pageContext.fillStyle =
          data.design.pageBackground ||
          "#ffffff";

        pageContext.fillRect(
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );

        pageContext.drawImage(
          canvas,
          0,
          pageStart,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );

        const pageImageData =
          pageCanvas.toDataURL(
            "image/jpeg",
            0.96
          );

        const pageImageHeight =
          (sliceHeight * pageWidth) /
          canvas.width;

        if (pageIndex > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          pageImageData,
          "JPEG",
          0,
          0,
          pageWidth,
          Math.min(
            pageHeight,
            pageImageHeight
          ),
          undefined,
          "FAST"
        );

        pageStart = safePageEnd;
        pageIndex += 1;
      }
    }

    const safeFilename = (
      documentName.trim() || "CV_Kilat"
    )
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "_");

    pdf.save(`${safeFilename}.pdf`);
  } catch (error) {
    console.error("Gagal membuat PDF:", error);

    alert(
      `❌ PDF gagal dibuat.\n\n${
        error?.message ||
        "Terjadi kesalahan saat memproses preview."
      }`
    );
  } finally {
    watermarkElements.forEach((element, index) => {
      element.style.visibility =
        previousVisibility[index] || "";
    });

    setExporting(false);
  }
};

const moveSection = (sectionKey, direction) => {
    setData((current) => {
      const order = [...current.design.sectionOrder];
      const index = order.indexOf(sectionKey);
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || nextIndex < 0 || nextIndex >= order.length) return current;
      [order[index], order[nextIndex]] = [order[nextIndex], order[index]];

      return {
        ...current,
        design: {
          ...current.design,
          sectionOrder: order,
        },
      };
    });
  };

  const toggleSection = (sectionKey) => {
    setData((current) => {
      const hidden = current.design.hiddenSections.includes(sectionKey)
        ? current.design.hiddenSections.filter((item) => item !== sectionKey)
        : [...current.design.hiddenSections, sectionKey];

      return {
        ...current,
        design: {
          ...current.design,
          hiddenSections: hidden,
        },
      };
    });
  };

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0];

  event.target.value = "";

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setPhotoNotice({
      type: "error",
      text: "Pilih file gambar yang valid.",
    });
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    setPhotoNotice({
      type: "error",
      text: "Ukuran foto maksimal 8 MB.",
    });
    return;
  }

  try {
    setPhotoNotice({
      type: "info",
      text: "Menyiapkan foto...",
    });

    const rawDataUrl =
      await readFileAsDataUrl(file);

    const optimizedDataUrl =
      await optimizePhotoDataUrl(rawDataUrl);

    setData((current) => ({
      ...current,
      photo: {
        ...current.photo,
        originalUrl: optimizedDataUrl,
        editedUrl: "",
      },
    }));

    setPhotoNotice({
      type: "success",
      text:
        "Foto siap. Pilih background putih atau biru.",
    });
  } catch (error) {
    console.error(
      "Gagal menyiapkan foto:",
      error
    );

    setPhotoNotice({
      type: "error",
      text:
        error?.message ||
        "Foto gagal diproses.",
    });
  }
};

const closeCamera = () => {
    streamRef.current?.getTracks?.().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOpen(false);
  };

  const openCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Browser ini tidak mendukung akses kamera.");
      setCameraOpen(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (error) {
      console.error("Gagal membuka kamera:", error);
      setCameraError("Izin kamera ditolak atau kamera tidak tersedia.");
      setCameraOpen(true);
    }
  };

const capturePhoto = () => {
  const video = videoRef.current;

  if (
    !video ||
    !video.videoWidth ||
    !video.videoHeight
  ) {
    setPhotoNotice({
      type: "error",
      text: "Kamera belum siap. Silakan tunggu sebentar.",
    });
    return;
  }

  // Ambil area persegi dari bagian tengah frame kamera.
  const sourceSize = Math.min(
    video.videoWidth,
    video.videoHeight
  );

  const sourceX =
    (video.videoWidth - sourceSize) / 2;

  const sourceY =
    (video.videoHeight - sourceSize) / 2;

  // Batasi resolusi agar foto tetap tajam tetapi tidak terlalu besar.
  const outputSize = Math.max(
    1,
    Math.round(Math.min(1200, sourceSize))
  );

  const canvas = document.createElement("canvas");

  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext("2d", {
    alpha: false,
  });

  if (!context) {
    setPhotoNotice({
      type: "error",
      text: "Browser tidak dapat mengambil foto.",
    });
    return;
  }

  context.fillStyle = "#ffffff";
  context.fillRect(
    0,
    0,
    outputSize,
    outputSize
  );

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    video,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    outputSize,
    outputSize
  );

  const photoUrl = canvas.toDataURL(
    "image/jpeg",
    0.9
  );

  if (!photoUrl || photoUrl === "data:,") {
    setPhotoNotice({
      type: "error",
      text: "Foto gagal dibuat dari kamera.",
    });
    return;
  }

  setData((current) => ({
    ...current,
    photo: {
      ...current.photo,
      originalUrl: photoUrl,
      editedUrl: "",
      zoom: 1,
      rotation: 0,
    },
  }));

  setPhotoProcessingMode("");

  setPhotoNotice({
    type: "success",
    text: "Foto kamera berhasil diambil dan dipotong menjadi foto profil.",
  });

  closeCamera();
};

const applyPhotoBackground = async (
  background
) => {
  const originalUrl =
    data.photo.originalUrl;

  if (!originalUrl) {
    setPhotoNotice({
      type: "error",
      text:
        "Upload atau ambil foto terlebih dahulu.",
    });
    return;
  }

  if (!user) {
    onRequireAuth();
    return;
  }

  setPhotoProcessingMode(background);
  setPhotoNotice({
    type: "info",
    text:
      background === "blue"
        ? "Sedang membuat background biru..."
        : "Sedang membuat background putih...",
  });

  try {
    const {
      data: functionResult,
      error: functionError,
    } = await supabase.functions.invoke(
      "photo-background",
      {
        body: {
          imageDataUrl: originalUrl,
          background,
        },
      }
    );

    if (functionError) {
      throw new Error(
        await getFunctionErrorMessage(
          functionError
        )
      );
    }

    if (!functionResult?.editedUrl) {
      throw new Error(
        functionResult?.error ||
          "Hasil edit foto tidak ditemukan."
      );
    }

    setData((current) => ({
      ...current,
      photo: {
        ...current.photo,
        editedUrl:
          functionResult.editedUrl,
      },
    }));

    setPhotoNotice({
      type: "success",
      text:
        background === "blue"
          ? "Background biru berhasil diterapkan."
          : "Background putih berhasil diterapkan.",
    });
  } catch (error) {
    console.error(
      "Gagal mengganti background:",
      error
    );

    setPhotoNotice({
      type: "error",
      text:
        error?.message ||
        "Foto gagal diproses.",
    });
  } finally {
    setPhotoProcessingMode("");
  }
};

const useOriginalPhoto = () => {
  setData((current) => ({
    ...current,
    photo: {
      ...current.photo,
      editedUrl: "",
    },
  }));

  setPhotoNotice({
    type: "info",
    text: "Foto asli digunakan kembali.",
  });
};

const spellIssues = useMemo(() => {
    const sources = [
      { type: "summary", label: "Ringkasan", value: data.summary || "" },
      ...data.experiences.map((item) => ({
        type: "experience",
        id: item.id,
        label: `Pengalaman: ${item.jobTitle || "tanpa judul"}`,
        value: item.description || "",
      })),
      ...data.education.map((item) => ({
        type: "education",
        id: item.id,
        label: `Pendidikan: ${item.school || "tanpa nama"}`,
        value: item.description || "",
      })),
    ];

    const issues = [];
    sources.forEach((source) => {
      Object.entries(TYPO_MAP).forEach(([wrong, correction]) => {
        const regex = new RegExp(`\\b${wrong}\\b`, "i");
        if (regex.test(source.value)) {
          issues.push({ ...source, wrong, correction });
        }
      });
    });
    return issues;
  }, [data]);

  const applySpellCorrection = (issue) => {
    const regex = new RegExp(`\\b${issue.wrong}\\b`, "gi");

    setData((current) => {
      if (issue.type === "summary") {
        return { ...current, summary: current.summary.replace(regex, issue.correction) };
      }

      if (issue.type === "experience") {
        return {
          ...current,
          experiences: current.experiences.map((item) =>
            item.id === issue.id
              ? { ...item, description: item.description.replace(regex, issue.correction) }
              : item
          ),
        };
      }

      return {
        ...current,
        education: current.education.map((item) =>
          item.id === issue.id
            ? { ...item, description: item.description.replace(regex, issue.correction) }
            : item
        ),
      };
    });
  };

  const sectionLabel = (sectionKey) => {
    const labels = data.design.language === "EN"
      ? {
          summary: "Summary",
          experience: "Experience",
          education: "Education",
          skills: "Skills",
          languages: "Languages",
          certifications: "Certifications",
          hobbies: "Interests",
        }
      : {
          summary: "Ringkasan",
          experience: "Pengalaman",
          education: "Pendidikan",
          skills: "Keahlian",
          languages: "Bahasa",
          certifications: "Sertifikasi",
          hobbies: "Hobi & Minat",
        };

    return labels[sectionKey] || sectionKey;
  };

  const renderActivePanel = () => {
    if (activePanel === "template") {
      const templates = [
        { id: "modern", name: "Modern", description: "Header berwarna dan layout dua kolom." },
        { id: "ats", name: "ATS", description: "Satu kolom sederhana dan mudah dibaca ATS." },
        { id: "executive", name: "Executive", description: "Aksen tegas untuk profil berpengalaman." },
        { id: "minimal", name: "Minimal", description: "Tampilan bersih dengan ruang putih luas." },
      ];

      return (
        <div>
          <PanelTitle title="Pilih Template" description="Pilih struktur yang paling sesuai dengan posisi dan karakter Anda." />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {templates.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateDesign("template", item.id)}
                className={`rounded-2xl border p-4 text-left transition ${data.design.template === item.id ? "border-sky-500 bg-sky-50 ring-4 ring-sky-100" : "border-slate-200 bg-white hover:border-sky-300"}`}
              >
                <div className="mb-4 h-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="h-5 rounded" style={{ backgroundColor: item.id === "ats" ? "#e2e8f0" : data.design.primaryColor }} />
                  <div className="mt-3 h-2 w-4/5 rounded bg-slate-300" />
                  <div className="mt-2 h-2 w-3/5 rounded bg-slate-200" />
                  <div className="mt-4 grid grid-cols-2 gap-2"><div className="h-12 rounded bg-slate-100" /><div className="h-12 rounded bg-slate-100" /></div>
                </div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activePanel === "sections") {
      return (
        <div>
          <PanelTitle title="Bagian CV" description="Atur urutan dan tentukan bagian yang ditampilkan pada CV." />
          <div className="mt-6 space-y-3">
            {data.design.sectionOrder.map((sectionKey, index) => {
              const hidden = data.design.hiddenSections.includes(sectionKey);
              return (
                <div key={sectionKey} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <span className="cursor-grab text-slate-400">☷</span>
                  <button
                    type="button"
                    onClick={() => toggleSection(sectionKey)}
                    className={`relative h-6 w-11 rounded-full transition ${hidden ? "bg-slate-300" : "bg-sky-500"}`}
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${hidden ? "left-1" : "left-6"}`} />
                  </button>
                  <span className={`flex-1 text-sm font-medium ${hidden ? "text-slate-400 line-through" : "text-slate-700"}`}>
                    {sectionLabel(sectionKey)}
                  </span>
                  <button type="button" disabled={index === 0} onClick={() => moveSection(sectionKey, "up")} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-25">↑</button>
                  <button type="button" disabled={index === data.design.sectionOrder.length - 1} onClick={() => moveSection(sectionKey, "down")} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-25">↓</button>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (activePanel === "design") {
      return (
        <div>
          <PanelTitle title="Desain & Pemformatan" description="Sesuaikan tipografi, warna, jarak, dan margin dokumen." />
          <div className="mt-6 space-y-6">
            <div>
              <ControlLabel>Ukuran teks</ControlLabel>
              <div className="grid grid-cols-3 gap-3">
                {[{ id: "small", label: "Kecil", size: "A" }, { id: "normal", label: "Normal", size: "A" }, { id: "large", label: "Besar", size: "A" }].map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateDesign("fontSize", item.id)}
                    className={`rounded-2xl border p-3 text-center ${data.design.fontSize === item.id ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 bg-white"}`}
                  >
                    <span className="block font-bold" style={{ fontSize: 20 + index * 5 }}>{item.size}</span>
                    <span className="mt-1 block text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <ControlLabel>Font</ControlLabel>
              <select value={data.design.fontFamily} onChange={(event) => updateDesign("fontFamily", event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400">
                {FONT_OPTIONS.map((font) => <option key={font}>{font}</option>)}
              </select>
            </label>

            <div className="grid grid-cols-3 gap-3">
              <label><ControlLabel>Warna utama</ControlLabel><input type="color" value={data.design.primaryColor} onChange={(event) => updateDesign("primaryColor", event.target.value)} className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1" /></label>
              <label><ControlLabel>Header</ControlLabel><input type="color" value={data.design.headerBackground} onChange={(event) => updateDesign("headerBackground", event.target.value)} className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1" /></label>
              <label><ControlLabel>Halaman</ControlLabel><input type="color" value={data.design.pageBackground} onChange={(event) => updateDesign("pageBackground", event.target.value)} className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1" /></label>
            </div>

            <RangeControl label="Jarak bagian" min={10} max={42} value={data.design.sectionSpacing} onChange={(value) => updateDesign("sectionSpacing", value)} suffix=" px" />
            <RangeControl label="Jarak paragraf" min={2} max={22} value={data.design.paragraphSpacing} onChange={(value) => updateDesign("paragraphSpacing", value)} suffix=" px" />
            <RangeControl label="Jarak baris" min={1.1} max={2} step={0.1} value={data.design.lineHeight} onChange={(value) => updateDesign("lineHeight", value)} />
            <RangeControl label="Margin halaman" min={20} max={64} value={data.design.pageMargin} onChange={(value) => updateDesign("pageMargin", value)} suffix=" px" />

            <button type="button" onClick={resetDesign} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-sky-600 hover:bg-sky-50">
              Reset ke Awal
            </button>
          </div>
        </div>
      );
    }

    if (activePanel === "spelling") {
      return (
        <div>
          <PanelTitle title="Pemeriksa Ejaan" description="Tinjau beberapa kesalahan ejaan umum dan gunakan pemeriksa bawaan browser." />
          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-slate-600">
            Pemeriksa browser aktif pada editor di bawah. Kata yang tidak dikenali biasanya diberi garis merah oleh browser.
          </div>
          <label className="mt-5 block">
            <ControlLabel>Ringkasan profesional</ControlLabel>
            <textarea
              spellCheck
              lang={data.design.language === "EN" ? "en" : "id"}
              value={data.summary}
              onChange={(event) => setData((current) => ({ ...current, summary: event.target.value }))}
              className="min-h-44 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <div className="mt-6">
            <h3 className="font-semibold text-slate-900">Saran koreksi otomatis</h3>
            {spellIssues.length ? (
              <div className="mt-3 space-y-3">
                {spellIssues.map((issue, index) => (
                  <div key={`${issue.type}-${issue.id || "summary"}-${issue.wrong}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-medium text-amber-700">{issue.label}</p>
                    <p className="mt-2 text-sm text-slate-700"><s>{issue.wrong}</s> → <strong>{issue.correction}</strong></p>
                    <button type="button" onClick={() => applySpellCorrection(issue)} className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-sky-600 shadow-sm">Terapkan koreksi</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">✓ Tidak ditemukan kesalahan umum pada teks saat ini.</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        <PanelTitle title="Foto Profil" description="Upload atau ambil foto, lalu sesuaikan tampilannya pada CV." />
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-center">
          <div className="mx-auto mb-4 w-fit">
            <PhotoAvatar photo={{ ...data.photo, size: 150 }} fallbackName="CV" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white hover:bg-sky-600">Upload Foto</button>
            <button type="button" onClick={openCamera} className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">Ambil Foto</button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          {(data.photo.originalUrl || data.photo.editedUrl) ? (
            <button
              type="button"
              onClick={() => {
                setData((current) => ({
                  ...current,
                  photo: { ...DEFAULT_PHOTO },
                }));
                setPhotoNotice(null);
                setPhotoProcessingMode("");
              }}
              className="mt-3 text-sm font-medium text-rose-500"
            >
              Hapus foto
            </button>
          ) : null}
        </div>

        <div className="mt-5 space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <ControlLabel>Bentuk foto</ControlLabel>
            <div className="grid grid-cols-3 gap-2">
              {[{ id: "circle", label: "Lingkaran" }, { id: "rounded", label: "Rounded" }, { id: "square", label: "Kotak" }].map((item) => (
                <button key={item.id} type="button" onClick={() => updatePhoto("shape", item.id)} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${data.photo.shape === item.id ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200"}`}>{item.label}</button>
              ))}
            </div>
          </div>
          <div>
            <ControlLabel>Posisi foto</ControlLabel>
            <div className="grid grid-cols-2 gap-2">
              {[{ id: "left", label: "Kiri" }, { id: "right", label: "Kanan" }].map((item) => (
                <button key={item.id} type="button" onClick={() => updatePhoto("position", item.id)} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${data.photo.position === item.id ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200"}`}>{item.label}</button>
              ))}
            </div>
          </div>
          <RangeControl label="Ukuran foto" min={72} max={160} value={data.photo.size} onChange={(value) => updatePhoto("size", value)} suffix=" px" />
          <RangeControl label="Zoom" min={1} max={2.2} step={0.1} value={data.photo.zoom} onChange={(value) => updatePhoto("zoom", value)} />
          <RangeControl label="Rotasi" min={-15} max={15} value={data.photo.rotation} onChange={(value) => updatePhoto("rotation", value)} suffix="°" />
        </div>


      <AIPhotoStudio
        photo={data.photo}
        processingMode={photoProcessingMode}
        notice={photoNotice}
        onApplyBackground={
          applyPhotoBackground
        }
        onUseOriginal={useOriginalPhoto}
      />
    </div>
  );
};

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-5 lg:px-8">
  <button
    type="button"
    onClick={() => onBack(data)}
    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100"
    aria-label="Kembali ke Builder"
  >
    <span aria-hidden="true" className="text-lg leading-none">
      ←
    </span>

    <span className="hidden sm:inline">
      Kembali ke Builder
    </span>
  </button>

  <div className="shrink-0">
    <LogoCVKilat
      theme="light"
      compact
      tagline="Editor Desain"
    />
  </div>

        <div className="mx-auto hidden items-center gap-2 text-sm text-slate-500 md:flex">
          <span className={`h-2.5 w-2.5 rounded-full ${saveState === "error" ? "bg-rose-500" : saveState === "saving" ? "animate-pulse bg-amber-400" : "bg-emerald-500"}`} />
          {saveState === "saving" ? "Menyimpan..." : saveState === "saved" ? "Tersimpan di cloud" : saveState === "error" ? "Gagal tersimpan" : "Draft tersimpan lokal"}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button type="button" disabled={saving} onClick={() => saveToCloud()} className="hidden rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:block">{saving ? "Menyimpan..." : "Simpan"}</button>
          <button type="button" disabled={exporting} onClick={downloadPDF} className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-100 hover:bg-sky-600 disabled:opacity-60">{exporting ? "Membuat PDF..." : "Unduh PDF"}</button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[112px_340px_minmax(680px,2fr)]">
        <nav className="border-r border-slate-200 bg-white px-3 py-5">
          <div className="sticky top-24 space-y-2">
            {PANELS.map((item) => (
              <button key={item.id} type="button" onClick={() => setActivePanel(item.id)} className={`flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center text-xs font-medium transition ${activePanel === item.id ? "bg-sky-50 text-sky-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${activePanel === item.id ? "bg-sky-100" : "bg-slate-100"}`}>{item.icon}</span>
                <span className="leading-4">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <section className="border-r border-slate-200 bg-white p-6 lg:h-[calc(100vh-80px)] lg:overflow-y-auto">
          {renderActivePanel()}
        </section>

        <main className="overflow-auto bg-slate-200 px-5 py-6 xl:px-8">
          <div className="mx-auto mb-5 flex w-full max-w-[1240px] items-center justify-between">
            <input value={documentName} onChange={(event) => setDocumentName(event.target.value)} className="max-w-sm border-0 bg-transparent text-sm font-semibold text-sky-600 outline-none" aria-label="Nama dokumen" />
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                Preview besar • Tajam
              </span>
              <select value={data.design.language} onChange={(event) => updateDesign("language", event.target.value)} className="rounded-xl border-0 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none"><option value="ID">Indonesia</option><option value="EN">English</option></select>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[1240px]">
            <ProfessionalCVPreview
              ref={cvRef}
              refreshKey={data}
              sourceWidth={794}
              viewportHeight={820}
              minZoom={0.5}
              maxZoom={1.25}
              defaultZoom={1}
              defaultMode="actual-size"
            >
              <TemplatePreview data={data} />
            </ProfessionalCVPreview>
          </div>
        </main>
      </div>

      {cameraOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-900">Ambil Foto</h2><p className="mt-1 text-sm text-slate-500">Posisikan wajah di tengah kamera.</p></div><button type="button" onClick={closeCamera} className="rounded-xl p-3 text-slate-500 hover:bg-slate-100">✕</button></div>
            {cameraError ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{cameraError}</div> : <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  className="mx-auto aspect-square w-full max-w-xl rounded-2xl bg-slate-900 object-cover"
/>}
            <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={closeCamera} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600">Batal</button><button type="button" disabled={Boolean(cameraError)} onClick={capturePhoto} className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white disabled:opacity-40">📸 Ambil Foto</button></div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
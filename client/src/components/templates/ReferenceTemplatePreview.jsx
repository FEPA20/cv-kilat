import { useEffect, useRef, useState } from "react";

// CK-TPL-05 — production polish for Ribbon Corporate
// CK-TPL-07 — photo shape, size, position, zoom, and rotation sync
// CK-TPL-06 — live spacing and page margin controls

// CK-TPL-04 — readable typography, compact layout, sharp PDF

export const REFERENCE_TEMPLATE_IDS = [
  "ref-ribbon-corporate",
  "ref-navy-split",
  "ref-editorial-grid",
  "ref-orange-sidebar",
  "ref-classic-bands",
  "ref-clean-architect",
  "ref-minimal-columns",
  "ref-yellow-line",
  "ref-teal-banner",
];

export const REFERENCE_EDITOR_TEMPLATES = [
  {
    id: "ref-ribbon-corporate",
    primaryColor: "#c62828",
    name: "Ribbon Corporate",
    description: "Header foto, pita status, dan sidebar data pribadi.",
  },
  {
    id: "ref-navy-split",
    primaryColor: "#171d63",
    name: "Navy Split",
    description: "Sidebar navy tegas dengan area pengalaman dua kolom.",
  },
  {
    id: "ref-editorial-grid",
    primaryColor: "#111827",
    name: "Editorial Grid",
    description: "Gaya editorial tiga kolom dengan komposisi modern.",
  },
  {
    id: "ref-orange-sidebar",
    primaryColor: "#e94836",
    name: "Orange Sidebar",
    description: "Header jingga dan sidebar gelap untuk profil kreatif.",
  },
  {
    id: "ref-classic-bands",
    primaryColor: "#64748b",
    name: "Classic Bands",
    description: "Gaya klasik dengan judul bagian berupa pita abu-abu.",
  },
  {
    id: "ref-clean-architect",
    primaryColor: "#111827",
    name: "Clean Architect",
    description: "Layout bersih, formal, dan cocok untuk profesi teknis.",
  },
  {
    id: "ref-minimal-columns",
    primaryColor: "#334155",
    name: "Minimal Columns",
    description: "Dua kolom lapang dengan fokus pada pengalaman utama.",
  },
  {
    id: "ref-yellow-line",
    primaryColor: "#facc15",
    name: "Yellow Line",
    description: "Aksen garis kuning dengan foto bulat dan struktur rapi.",
  },
  {
    id: "ref-teal-banner",
    primaryColor: "#155e63",
    name: "Teal Banner",
    description: "Banner hijau tua dengan section marker modern.",
  },
];

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

export function isReferenceTemplate(templateId) {
  return REFERENCE_TEMPLATE_IDS.includes(String(templateId || ""));
}

export function ReferenceTemplateScaled({
  data,
  className = "",
}) {
  const hostRef = useRef(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const update = () => {
      const width = host.getBoundingClientRect().width;
      if (width > 0) setScale(width / PAGE_WIDTH);
    };

    update();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;

    observer?.observe(host);
    window.addEventListener("resize", update);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`relative aspect-[210/297] overflow-hidden bg-white ${className}`}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          transform: `scale(${scale})`,
        }}
      >
        <ReferenceTemplatePreview data={data} />
      </div>
    </div>
  );
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function stripBullet(line) {
  return String(line || "")
    .replace(/^\s*[•*-]\s*/, "")
    .trim();
}

function formatPeriod(item) {
  const start = String(item?.startDate || "").slice(0, 7);
  const end = item?.current
    ? "Sekarang"
    : String(item?.endDate || "").slice(0, 7);

  return [start, end].filter(Boolean).join(" – ");
}

function Description({
  value,
  className = "",
  limit = 4,
}) {
  const lines = String(value || "")
    .replace(/\r/g, "")
    .split("\n")
    .map(stripBullet)
    .filter(Boolean)
    .slice(0, limit);

  if (!lines.length) return null;

  if (lines.length === 1) {
    return (
      <p className={className}>
        {lines[0]}
      </p>
    );
  }

  return (
    <ul className={`space-y-0.5 ${className}`}>
      {lines.map((line, index) => (
        <li
          key={`${line}-${index}`}
          className="flex gap-2"
        >
          <span className="shrink-0">•</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

function Avatar({
  photo,
  name,
  size = 96,
  rounded = "999px",
  className = "",
}) {
  const src =
    photo?.editedUrl ||
    photo?.originalUrl ||
    "";

  const [imageFailed, setImageFailed] =
    useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const initials = String(name || "RS")
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showImage =
    Boolean(src) && !imageFailed;

  /*
   * CK-TPL-07
   * Seluruh kontrol Foto Profil dibaca langsung oleh
   * renderer template referensi.
   */
  const configuredSize = Math.min(
    180,
    Math.max(
      56,
      Number(photo?.size || size || 96),
    ),
  );

  const shape =
    photo?.shape || "circle";

  const borderRadius =
    shape === "square"
      ? "0px"
      : shape === "rounded"
        ? "18px"
        : "9999px";

  const zoom = Math.min(
    2.5,
    Math.max(
      0.6,
      Number(photo?.zoom || 1),
    ),
  );

  const rotation = Math.min(
    45,
    Math.max(
      -45,
      Number(photo?.rotation || 0),
    ),
  );

  const position =
    photo?.position === "left"
      ? "left"
      : "right";

  const absoluteLayout =
    /(^|\s)absolute(\s|$)/.test(
      className,
    );

  const frameStyle = {
    width: configuredSize,
    height: configuredSize,
    minWidth: configuredSize,
    minHeight: configuredSize,
    borderRadius,
    overflow: "hidden",
    position: absoluteLayout
      ? "absolute"
      : "relative",
    /*
     * Pada header flex, tombol Kiri/Kanan memindahkan foto.
     * Layout dengan avatar absolut tetap mempertahankan
     * komposisi khas templatenya.
     */
    order:
      absoluteLayout
        ? undefined
        : position === "right"
          ? 2
          : 0,
    marginLeft:
      !absoluteLayout &&
      position === "right"
        ? "auto"
        : undefined,
    marginRight:
      !absoluteLayout &&
      position === "left"
        ? undefined
        : 0,
  };

  return (
    <div
      data-photo-frame="true"
      data-photo-shape={shape}
      data-photo-position={position}
      className={`shrink-0 bg-slate-200 ${className}`}
      style={frameStyle}
    >
      {showImage ? (
        <img
          data-photo-image="true"
          src={src}
          alt={`Foto profil ${name || "CV"}`}
          draggable={false}
          crossOrigin="anonymous"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 block h-full w-full max-w-none object-cover"
          style={{
            transformOrigin:
              "center center",
            transform:
              `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-950 font-black tracking-tight text-white"
          style={{
            fontSize: Math.max(
              18,
              configuredSize * 0.24,
            ),
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function PersonalDetails({
  contact,
  dark = false,
  columns = 1,
}) {
  const items = [
    [
      "Nama",
      `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
    ],
    [
      "Alamat",
      [contact.address, contact.city]
        .filter(Boolean)
        .join(", "),
    ],
    ["Negara", contact.country],
    ["No Telp", contact.phone],
    ["Email", contact.email],
  ].filter(([, value]) => value);

  const layoutClass =
    columns === 4
      ? "grid grid-cols-4 gap-x-6 gap-y-3"
      : columns === 2
        ? "grid grid-cols-2 gap-x-6 gap-y-3"
        : "space-y-2.5";

  return (
    <div className={layoutClass}>
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <p
            className={`text-[9px] font-black uppercase tracking-[0.07em] ${
              dark
                ? "text-white/60"
                : "text-slate-500"
            }`}
          >
            {label}
          </p>

          <p
            className={`mt-0.5 break-words text-[10px] leading-[1.35] ${
              dark
                ? "text-white/95"
                : "text-slate-700"
            }`}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function SkillList({
  skills,
  accent,
  dark = false,
  bars = false,
  columns = 1,
}) {
  const items = safeArray(skills)
    .filter((item) => item?.name)
    .slice(0, 6);

  return (
    <div
      className={
        columns === 2
          ? "grid grid-cols-2 gap-x-5 gap-y-2.5"
          : "space-y-2.5"
      }
    >
      {items.map((item) => {
        const level = Math.min(
          5,
          Math.max(
            1,
            Number(item.level || 3),
          ),
        );

        return (
          <div key={item.id || item.name}>
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-[10px] font-semibold leading-tight ${
                  dark
                    ? "text-white/95"
                    : "text-slate-700"
                }`}
              >
                {item.name}
              </span>

              {!bars ? (
                <span
                  className={`text-[8.5px] ${
                    dark
                      ? "text-white/55"
                      : "text-slate-400"
                  }`}
                >
                  {level}/5
                </span>
              ) : null}
            </div>

            {bars ? (
              <div
                className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${
                  dark
                    ? "bg-white/15"
                    : "bg-slate-200"
                }`}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${level * 20}%`,
                    backgroundColor: accent,
                  }}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function ExperienceList({
  items,
  accent,
  dense = false,
  max = 3,
  showRule = false,
}) {
  return (
    <div
      className={
        dense ? "space-y-3" : "space-y-4"
      }
    >
      {safeArray(items)
        .filter(
          (item) =>
            item?.jobTitle ||
            item?.employer ||
            item?.description,
        )
        .slice(0, max)
        .map((item, index) => (
          <article
            key={
              item.id ||
              `${item.jobTitle}-${item.employer}-${index}`
            }
            className={
              showRule
                ? "border-b border-slate-200 pb-3 last:border-b-0"
                : ""
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-[11px] font-black leading-tight text-slate-900">
                  {item.jobTitle || "Posisi"}
                </h4>

                <p
                  className="mt-0.5 text-[9.5px] font-semibold leading-tight"
                  style={{ color: accent }}
                >
                  {[item.employer, item.location]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>

              <span className="shrink-0 text-[8.5px] leading-tight text-slate-400">
                {formatPeriod(item)}
              </span>
            </div>

            <Description
              value={item.description}
              limit={dense ? 2 : 3}
              className="mt-1.5 text-[9.5px] leading-[1.42] text-slate-600"
            />
          </article>
        ))}
    </div>
  );
}

function EducationList({
  items,
  accent,
  compact = false,
  max = 3,
}) {
  return (
    <div
      className={
        compact ? "space-y-2.5" : "space-y-3.5"
      }
    >
      {safeArray(items)
        .filter(
          (item) =>
            item?.school ||
            item?.degree ||
            item?.description,
        )
        .slice(0, max)
        .map((item, index) => (
          <article
            key={
              item.id ||
              `${item.school}-${item.degree}-${index}`
            }
          >
            <p className="text-[10.5px] font-black leading-tight text-slate-900">
              {item.degree || "Pendidikan"}
            </p>

            <p
              className="mt-0.5 text-[9px] font-semibold leading-tight"
              style={{ color: accent }}
            >
              {[item.school, item.location]
                .filter(Boolean)
                .join(" • ")}
            </p>

            <p className="mt-0.5 text-[8.5px] leading-tight text-slate-400">
              {formatPeriod(item)}
            </p>
          </article>
        ))}
    </div>
  );
}

function SimpleList({
  items,
  field,
  dark = false,
}) {
  return (
    <div className="space-y-1.5">
      {safeArray(items)
        .filter((item) => item?.[field])
        .slice(0, 5)
        .map((item, index) => (
          <p
            key={
              item.id ||
              `${item[field]}-${index}`
            }
            className={`text-[9.5px] leading-[1.38] ${
              dark
                ? "text-white/90"
                : "text-slate-600"
            }`}
          >
            • {item[field]}
            {field === "language" &&
            item.level
              ? ` — ${item.level}`
              : ""}
          </p>
        ))}
    </div>
  );
}

function SectionTitle({
  children,
  accent,
  variant = "line",
  dark = false,
}) {
  if (variant === "band") {
    return (
      <h3 className="bg-slate-300 px-3 py-1.5 text-center text-[11px] font-black uppercase tracking-[0.12em] text-slate-900">
        {children}
      </h3>
    );
  }

  if (variant === "thick") {
    return (
      <h3
        className="border-y-[3px] py-1.5 text-[13px] font-black uppercase tracking-[-0.02em]"
        style={{
          borderColor: accent,
          color: dark
            ? "#ffffff"
            : "#0f172a",
        }}
      >
        {children}
      </h3>
    );
  }

  if (variant === "dot") {
    return (
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white"
          style={{
            backgroundColor: accent,
          }}
        >
          ✓
        </span>

        <h3
          className="text-[11.5px] font-black leading-none"
          style={{ color: accent }}
        >
          {children}
        </h3>
      </div>
    );
  }

  return (
    <h3
      className={`border-b pb-1.5 text-[10.5px] font-black uppercase tracking-[0.12em] ${
        dark
          ? "text-white"
          : "text-slate-900"
      }`}
      style={{ borderColor: accent }}
    >
      {children}
    </h3>
  );
}

function useCv(data) {
  const contact = data?.contact || {};
  const design = data?.design || {};
  const photo = data?.photo || {};
  const name =
    `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
    "Rizky Saputra";
  const hidden = new Set(
    safeArray(design.hiddenSections),
  );

  return {
    contact,
    design,
    photo,
    name,
    accent: design.primaryColor || "#0f4c81",
    summary: String(data?.summary || ""),
    experiences: safeArray(data?.experiences),
    education: safeArray(data?.education),
    skills: safeArray(data?.skills),
    languages: safeArray(data?.languages),
    certifications: safeArray(data?.certifications),
    hobbies: safeArray(data?.hobbies),
    show: (key) => !hidden.has(key),
  };
}

function Page({
  data,
  children,
  className = "",
  style = {},
}) {
  const design = data?.design || {};

  const clamp = (
    value,
    minimum,
    maximum,
    fallback,
  ) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return Math.min(
      maximum,
      Math.max(minimum, parsed),
    );
  };

  /*
   * CK-TPL-06
   *
   * Sembilan template referensi sebelumnya memakai jarak
   * Tailwind tetap seperti mt-6, space-y-4, dan px-12.
   * Slider editor hanya mengubah data.design tetapi nilainya
   * tidak pernah dipakai oleh renderer template.
   */
  const sectionSpacing = clamp(
    design.sectionSpacing,
    10,
    42,
    18,
  );

  const paragraphSpacing = clamp(
    design.paragraphSpacing,
    2,
    22,
    8,
  );

  const lineHeight = clamp(
    design.lineHeight,
    1.1,
    2,
    1.55,
  );

  const pageMargin = clamp(
    design.pageMargin,
    20,
    64,
    42,
  );

  /*
   * Desain referensi awal dibuat pada margin dasar 42 px.
   * Yang diterapkan ke layout adalah selisih terhadap nilai
   * dasar agar bentuk awal template tetap sama.
   */
  const baseMargin = 42;
  const horizontalDelta =
    pageMargin - baseMargin;

  const verticalDelta =
    Math.round(horizontalDelta * 0.55);

  const positiveHorizontal =
    Math.max(0, horizontalDelta);

  const negativeHorizontal =
    Math.min(0, horizontalDelta);

  const positiveVertical =
    Math.max(0, verticalDelta);

  const negativeVertical =
    Math.min(0, verticalDelta);

  return (
    <div
      className={`cv-reference-page relative overflow-hidden bg-white text-slate-800 ${className}`}
      style={{
        width: `${PAGE_WIDTH}px`,
        height: `${PAGE_HEIGHT}px`,
        minHeight: `${PAGE_HEIGHT}px`,
        boxSizing: "border-box",
        fontFamily:
          design.fontFamily ||
          "Inter, Arial, sans-serif",
        backgroundColor:
          design.pageBackground ||
          "#ffffff",
        WebkitFontSmoothing:
          "antialiased",
        textRendering:
          "geometricPrecision",
        "--cv-section-spacing":
          `${sectionSpacing}px`,
        "--cv-paragraph-spacing":
          `${paragraphSpacing}px`,
        "--cv-line-height":
          String(lineHeight),
        ...style,
      }}
    >
      <style>{`
        .cv-reference-page
        .cv-reference-layout
        section + section {
          margin-top:
            var(--cv-section-spacing)
            !important;
        }

        .cv-reference-page
        .cv-reference-layout
        article + article {
          margin-top:
            calc(
              var(--cv-section-spacing)
              * 0.55
            )
            !important;
        }

        .cv-reference-page
        .cv-reference-layout
        p,
        .cv-reference-page
        .cv-reference-layout
        li {
          line-height:
            var(--cv-line-height)
            !important;
        }

        .cv-reference-page
        .cv-reference-layout
        p + p {
          margin-top:
            var(--cv-paragraph-spacing)
            !important;
        }

        .cv-reference-page
        .cv-reference-layout
        li + li {
          margin-top:
            calc(
              var(--cv-paragraph-spacing)
              * 0.45
            )
            !important;
        }
      `}</style>

      <div
        className="cv-reference-layout relative min-h-full"
        style={{
          boxSizing: "border-box",
          minHeight: "100%",
          paddingLeft:
            `${positiveHorizontal}px`,
          paddingRight:
            `${positiveHorizontal}px`,
          paddingTop:
            `${positiveVertical}px`,
          paddingBottom:
            `${positiveVertical}px`,
          marginLeft:
            `${negativeHorizontal}px`,
          marginRight:
            `${negativeHorizontal}px`,
          marginTop:
            `${negativeVertical}px`,
          marginBottom:
            `${negativeVertical}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function RibbonCorporate({ data }) {
  const cv = useCv(data);

  /*
   * Warna template tetap mengikuti pilihan user,
   * tetapi dibuat lebih gelap agar kontrasnya layak cetak.
   */
  const selectedAccent =
    cv.accent || "#166534";

  const accent =
    selectedAccent.toLowerCase() === "#22c55e"
      ? "#15803d"
      : selectedAccent;

  return (
    <Page data={data}>
      <header className="relative flex min-h-[158px] items-center gap-7 border-b border-slate-200 bg-slate-100 px-12 py-8">
        <span
          className="absolute inset-y-0 left-0 w-2.5"
          style={{ backgroundColor: accent }}
        />

        <Avatar
          photo={cv.photo}
          name={cv.name}
          size={102}
          rounded="8px"
          className="border-4 border-white shadow-sm"
        />

        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-black leading-[1.05] tracking-[-0.025em] text-slate-950">
            {cv.name}
          </h1>

          <p
            className="mt-2 text-[12px] font-bold uppercase tracking-[0.06em]"
            style={{ color: accent }}
          >
            {cv.contact.desiredJob ||
              "Profesional"}
          </p>

          <p className="mt-3 text-[10px] font-medium leading-[1.4] text-slate-500">
            {[
              cv.contact.email,
              cv.contact.phone,
              cv.contact.city,
              cv.contact.country,
            ]
              .filter(Boolean)
              .join("  •  ")}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-[minmax(0,1.75fr)_minmax(210px,0.85fr)] gap-9 px-12 pb-10 pt-8">
        <main className="min-w-0">
          {cv.show("summary") ? (
            <section>
              <SectionTitle accent={accent}>
                Tentang Saya
              </SectionTitle>

              <p className="mt-3 text-[10.5px] leading-[1.52] text-slate-650">
                {cv.summary}
              </p>
            </section>
          ) : null}

          {cv.show("experience") ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Pengalaman Kerja
              </SectionTitle>

              <div className="mt-4">
                <ExperienceList
                  items={cv.experiences}
                  accent={accent}
                  dense
                  max={3}
                  showRule
                />
              </div>
            </section>
          ) : null}

          {cv.show("education") ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Riwayat Pendidikan
              </SectionTitle>

              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                {safeArray(cv.education)
                  .filter(
                    (item) =>
                      item?.school ||
                      item?.degree,
                  )
                  .slice(0, 4)
                  .map((item, index) => (
                    <article
                      key={
                        item.id ||
                        `${item.school}-${index}`
                      }
                    >
                      <p className="text-[10.5px] font-black leading-tight text-slate-900">
                        {item.degree ||
                          "Pendidikan"}
                      </p>

                      <p
                        className="mt-1 text-[9.5px] font-bold leading-tight"
                        style={{ color: accent }}
                      >
                        {[
                          item.school,
                          item.location,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>

                      <p className="mt-1 text-[9px] text-slate-400">
                        {formatPeriod(item)}
                      </p>
                    </article>
                  ))}
              </div>
            </section>
          ) : null}

          {cv.show("certifications") &&
          cv.certifications.length ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Sertifikasi
              </SectionTitle>

              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                {safeArray(cv.certifications)
                  .filter((item) => item?.name)
                  .slice(0, 4)
                  .map((item, index) => (
                    <p
                      key={
                        item.id ||
                        `${item.name}-${index}`
                      }
                      className="text-[9.5px] leading-[1.4] text-slate-600"
                    >
                      <span
                        className="mr-2 font-black"
                        style={{ color: accent }}
                      >
                        •
                      </span>
                      {item.name}
                    </p>
                  ))}
              </div>
            </section>
          ) : null}
        </main>

        <aside className="min-w-0 border-l border-slate-200 pl-7">
          <SectionTitle accent={accent}>
            Data Pribadi
          </SectionTitle>

          <div className="mt-4">
            <PersonalDetails
              contact={cv.contact}
            />
          </div>

          {cv.show("skills") ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Keahlian
              </SectionTitle>

              <div className="mt-4">
                <SkillList
                  skills={cv.skills}
                  accent={accent}
                  bars
                />
              </div>
            </section>
          ) : null}

          {cv.show("languages") ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Bahasa
              </SectionTitle>

              <div className="mt-4">
                <SimpleList
                  items={cv.languages}
                  field="language"
                />
              </div>
            </section>
          ) : null}

          {cv.show("hobbies") &&
          cv.hobbies.length ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Hobi
              </SectionTitle>

              <div className="mt-4">
                <SimpleList
                  items={cv.hobbies}
                  field="name"
                />
              </div>
            </section>
          ) : null}
        </aside>
      </div>

      <div
        className="absolute inset-x-12 bottom-7 h-1 rounded-full opacity-70"
        style={{ backgroundColor: accent }}
      />
    </Page>
  );
}

function NavySplit({ data }) {
  const cv = useCv(data);
  const accent = cv.accent || "#131a64";

  return (
    <Page data={data}>
      <div className="grid min-h-[1123px] grid-cols-[0.37fr_0.63fr]">
        <aside
          className="text-white"
          style={{ backgroundColor: accent }}
        >
          <div className="h-[300px] overflow-hidden bg-slate-300">
            <Avatar
              photo={cv.photo}
              name={cv.name}
              size={300}
              rounded="0"
              className="h-full w-full"
            />
          </div>

          <div className="px-10 py-8">
            {cv.show("summary") ? (
              <section>
                <h3 className="text-[16px] font-black">
                  Tentang Saya
                </h3>
                <p className="mt-4 text-[10px] leading-[1.48] text-white/80">
                  {cv.summary}
                </p>
              </section>
            ) : null}

            <section className="mt-6">
              <h3 className="text-[16px] font-black">
                Data Diri
              </h3>
              <div className="mt-4">
                <PersonalDetails
                  contact={cv.contact}
                  dark
                />
              </div>
            </section>

            {cv.show("languages") ? (
              <section className="mt-6">
                <h3 className="text-[14px] font-black">
                  Bahasa
                </h3>
                <div className="mt-3">
                  <SimpleList
                    items={cv.languages}
                    field="language"
                    dark
                  />
                </div>
              </section>
            ) : null}
          </div>
        </aside>

        <main className="px-10 py-12">
          <header className="border-b-2 pb-7" style={{ borderColor: accent }}>
            <h1
              className="text-[44px] font-black leading-[0.95]"
              style={{ color: accent }}
            >
              {cv.name}
            </h1>
            <p className="mt-4 text-[13px] font-black uppercase text-slate-600">
              {cv.contact.desiredJob || "Profesional"}
            </p>
          </header>

          <div className="mt-6 grid grid-cols-2 gap-8">
            <div>
              {cv.show("education") ? (
                <section>
                  <h3
                    className="text-[16px] font-black"
                    style={{ color: accent }}
                  >
                    Riwayat Pendidikan
                  </h3>
                  <div className="mt-4">
                    <EducationList
                      items={cv.education}
                      accent={accent}
                      compact
                    />
                  </div>
                </section>
              ) : null}

              {cv.show("experience") ? (
                <section className="mt-6">
                  <h3
                    className="text-[16px] font-black"
                    style={{ color: accent }}
                  >
                    Pengalaman Kerja
                  </h3>
                  <div className="mt-4">
                    <ExperienceList
                      items={cv.experiences}
                      accent={accent}
                      dense
                      max={3}
                    />
                  </div>
                </section>
              ) : null}
            </div>

            <div>
              {cv.show("skills") ? (
                <section>
                  <h3
                    className="text-[16px] font-black"
                    style={{ color: accent }}
                  >
                    Keahlian
                  </h3>
                  <div className="mt-4">
                    <SkillList
                      skills={cv.skills}
                      accent={accent}
                    />
                  </div>
                </section>
              ) : null}

              {cv.show("certifications") &&
              cv.certifications.length ? (
                <section className="mt-6">
                  <h3
                    className="text-[16px] font-black"
                    style={{ color: accent }}
                  >
                    Sertifikasi
                  </h3>
                  <div className="mt-4">
                    <SimpleList
                      items={cv.certifications}
                      field="name"
                    />
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </Page>
  );
}

function EditorialGrid({ data }) {
  const cv = useCv(data);
  const accent = cv.accent || "#111111";

  return (
    <Page
      data={data}
      className="bg-[#fbf8ed]"
      style={{ backgroundColor: "#fbf8ed" }}
    >
      <header className="flex items-end gap-6 px-10 pb-7 pt-10">
        <Avatar
          photo={cv.photo}
          name={cv.name}
          size={120}
          rounded="16px"
        />
        <div className="flex-1">
          <div
            className="h-[4px] w-full"
            style={{ backgroundColor: accent }}
          />
          <h1 className="mt-4 text-[34px] font-black leading-[0.95] text-slate-950">
            {cv.name}
          </h1>
          <p className="mt-2 text-[16px] leading-none text-slate-600">
            {cv.contact.desiredJob || "Profesional"}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-[0.28fr_0.42fr_0.30fr] gap-0 px-10 pb-10">
        <aside className="border-r-2 pr-6" style={{ borderColor: accent }}>
          <SectionTitle accent={accent} variant="thick">
            Profil
          </SectionTitle>
          <div className="mt-4">
            <PersonalDetails contact={cv.contact} />
          </div>
        </aside>

        <main className="border-r-2 px-6" style={{ borderColor: accent }}>
          {cv.show("summary") ? (
            <section>
              <SectionTitle accent={accent} variant="thick">
                Tentang Saya
              </SectionTitle>
              <p className="mt-4 text-[10px] leading-[1.48] text-slate-600">
                {cv.summary}
              </p>
            </section>
          ) : null}

          {cv.show("experience") ? (
            <section className="mt-6">
              <SectionTitle accent={accent} variant="thick">
                Pengalaman Kerja
              </SectionTitle>
              <div className="mt-4">
                <ExperienceList
                  items={cv.experiences}
                  accent={accent}
                  dense
                  max={3}
                />
              </div>
            </section>
          ) : null}
        </main>

        <aside className="pl-6">
          {cv.show("education") ? (
            <section>
              <SectionTitle accent={accent} variant="thick">
                Pendidikan
              </SectionTitle>
              <div className="mt-4">
                <EducationList
                  items={cv.education}
                  accent={accent}
                  compact
                />
              </div>
            </section>
          ) : null}

          {cv.show("skills") ? (
            <section className="mt-6">
              <SectionTitle accent={accent} variant="thick">
                Keahlian
              </SectionTitle>
              <div className="mt-4">
                <SkillList
                  skills={cv.skills}
                  accent={accent}
                />
              </div>
            </section>
          ) : null}

          {cv.show("certifications") ? (
            <section className="mt-6">
              <SectionTitle accent={accent} variant="thick">
                Sertifikasi
              </SectionTitle>
              <div className="mt-4">
                <SimpleList
                  items={cv.certifications}
                  field="name"
                />
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </Page>
  );
}

function OrangeSidebar({ data }) {
  const cv = useCv(data);
  const accent = cv.accent || "#e94836";

  return (
    <Page data={data}>
      <header
        className="relative h-[180px] pl-[230px] pr-12 pt-48 text-white"
        style={{
          backgroundColor: accent,
          paddingTop: "48px",
        }}
      >
        <Avatar
          photo={cv.photo}
          name={cv.name}
          size={190}
          rounded="0"
          className="absolute bottom-0 left-8 border-4 border-white"
        />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
          Daftar Riwayat Hidup
        </p>
        <h1 className="mt-1 text-[28px] font-black">
          {cv.name}
        </h1>
        <p className="mt-2 text-[11px] font-semibold uppercase text-white/85">
          {cv.contact.desiredJob || "Profesional"}
        </p>
      </header>

      <div className="grid min-h-[943px] grid-cols-[0.28fr_0.72fr]">
        <aside className="bg-slate-800 px-8 py-8 text-white">
          <h3 className="text-[12px] font-black uppercase">
            Data Pribadi
          </h3>
          <div className="mt-5">
            <PersonalDetails
              contact={cv.contact}
              dark
            />
          </div>

          {cv.show("languages") ? (
            <section className="mt-6">
              <h3 className="text-[12px] font-black uppercase">
                Bahasa
              </h3>
              <div className="mt-3">
                <SimpleList
                  items={cv.languages}
                  field="language"
                  dark
                />
              </div>
            </section>
          ) : null}

          {cv.show("hobbies") ? (
            <section className="mt-6">
              <h3 className="text-[12px] font-black uppercase">
                Hobi
              </h3>
              <div className="mt-3">
                <SimpleList
                  items={cv.hobbies}
                  field="name"
                  dark
                />
              </div>
            </section>
          ) : null}
        </aside>

        <main className="px-10 py-8">
          {cv.show("summary") ? (
            <section>
              <SectionTitle accent={accent}>
                Tentang Saya
              </SectionTitle>
              <p className="mt-3 text-[10px] leading-[1.48] text-slate-600">
                {cv.summary}
              </p>
            </section>
          ) : null}

          {cv.show("education") ? (
            <section className="mt-5">
              <SectionTitle accent={accent}>
                Riwayat Pendidikan
              </SectionTitle>
              <div className="mt-3">
                <EducationList
                  items={cv.education}
                  accent={accent}
                  compact
                />
              </div>
            </section>
          ) : null}

          {cv.show("experience") ? (
            <section className="mt-5">
              <SectionTitle accent={accent}>
                Pengalaman Kerja
              </SectionTitle>
              <div className="mt-3">
                <ExperienceList
                  items={cv.experiences}
                  accent={accent}
                  dense
                  max={3}
                />
              </div>
            </section>
          ) : null}

          {cv.show("skills") ? (
            <section className="mt-5">
              <SectionTitle accent={accent}>
                Keahlian
              </SectionTitle>
              <div className="mt-3">
                <SkillList
                  skills={cv.skills}
                  accent={accent}
                  bars
                  columns={2}
                />
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </Page>
  );
}

function ClassicBands({ data }) {
  const cv = useCv(data);
  const accent = cv.accent || "#a3a3a3";

  return (
    <Page data={data} className="px-9 py-8">
      <header className="text-center">
        <h1 className="text-[25px] font-semibold tracking-[0.04em] text-slate-900">
          {cv.name}
        </h1>
        <p className="mt-2 text-[9.5px] text-slate-500">
          {[
            cv.contact.address,
            cv.contact.city,
            cv.contact.phone,
            cv.contact.email,
          ]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </header>

      {cv.show("summary") ? (
        <section className="mt-5">
          <SectionTitle accent={accent} variant="band">
            Tentang Saya
          </SectionTitle>
          <p className="mt-3 text-center text-[10px] leading-[1.48] text-slate-600">
            {cv.summary}
          </p>
        </section>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div>
          {cv.show("education") ? (
            <section>
              <SectionTitle accent={accent} variant="band">
                Riwayat Pendidikan
              </SectionTitle>
              <div className="mt-3">
                <EducationList
                  items={cv.education}
                  accent="#475569"
                  compact
                />
              </div>
            </section>
          ) : null}
        </div>

        <div>
          {cv.show("experience") ? (
            <section>
              <SectionTitle accent={accent} variant="band">
                Pengalaman Kerja
              </SectionTitle>
              <div className="mt-3">
                <ExperienceList
                  items={cv.experiences}
                  accent="#475569"
                  dense
                  max={3}
                />
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {cv.show("skills") ? (
        <section className="mt-5">
          <SectionTitle accent={accent} variant="band">
            Keahlian
          </SectionTitle>
          <div className="mt-3">
            <SkillList
              skills={cv.skills}
              accent="#64748b"
              columns={2}
            />
          </div>
        </section>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-5">
        {cv.show("certifications") ? (
          <section>
            <SectionTitle accent={accent} variant="band">
              Sertifikasi
            </SectionTitle>
            <div className="mt-3">
              <SimpleList
                items={cv.certifications}
                field="name"
              />
            </div>
          </section>
        ) : null}

        {cv.show("hobbies") ? (
          <section>
            <SectionTitle accent={accent} variant="band">
              Hobi
            </SectionTitle>
            <div className="mt-3">
              <SimpleList
                items={cv.hobbies}
                field="name"
              />
            </div>
          </section>
        ) : null}
      </div>
    </Page>
  );
}

function CleanArchitect({ data }) {
  const cv = useCv(data);
  const accent = cv.accent || "#111827";

  return (
    <Page data={data} className="px-12 py-10">
      <header className="grid grid-cols-[0.62fr_0.38fr] gap-8 border-b border-slate-300 pb-7">
        <div>
          <h1 className="text-[23px] font-black uppercase leading-[1.05] text-slate-950">
            {cv.name}
          </h1>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
            {cv.contact.desiredJob || "Profesional"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-[8.5px] text-slate-600">
          <span>{cv.contact.phone}</span>
          <span>{cv.contact.email}</span>
          <span>{cv.contact.city}</span>
          <span>{cv.contact.country}</span>
        </div>
      </header>

      {cv.show("summary") ? (
        <section className="mt-6">
          <SectionTitle accent={accent}>
            Tentang Saya
          </SectionTitle>
          <p className="mt-3 text-[10px] leading-[1.48] text-slate-600">
            {cv.summary}
          </p>
        </section>
      ) : null}

      <div className="mt-6 grid grid-cols-[0.62fr_0.38fr] gap-10">
        <main>
          {cv.show("experience") ? (
            <section>
              <SectionTitle accent={accent}>
                Pengalaman
              </SectionTitle>
              <div className="mt-4">
                <ExperienceList
                  items={cv.experiences}
                  accent={accent}
                  max={4}
                  showRule
                />
              </div>
            </section>
          ) : null}

          {cv.show("certifications") ? (
            <section className="mt-6">
              <SectionTitle accent={accent}>
                Referensi & Sertifikasi
              </SectionTitle>
              <div className="mt-3">
                <SimpleList
                  items={cv.certifications}
                  field="name"
                />
              </div>
            </section>
          ) : null}
        </main>

        <aside>
          {cv.show("skills") ? (
            <section>
              <SectionTitle accent={accent}>
                Keahlian
              </SectionTitle>
              <div className="mt-4">
                <SkillList
                  skills={cv.skills}
                  accent={accent}
                />
              </div>
            </section>
          ) : null}

          {cv.show("education") ? (
            <section className="mt-6">
              <SectionTitle accent={accent}>
                Pendidikan
              </SectionTitle>
              <div className="mt-4">
                <EducationList
                  items={cv.education}
                  accent={accent}
                  compact
                />
              </div>
            </section>
          ) : null}

          {cv.show("hobbies") ? (
            <section className="mt-6">
              <SectionTitle accent={accent}>
                Hobi
              </SectionTitle>
              <div className="mt-3">
                <SimpleList
                  items={cv.hobbies}
                  field="name"
                />
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </Page>
  );
}

function MinimalColumns({ data }) {
  const cv = useCv(data);
  const accent = cv.accent || "#334155";

  return (
    <Page data={data} className="px-14 py-12">
      <header className="grid grid-cols-[0.58fr_0.42fr] gap-10">
        <div>
          <h1 className="text-[25px] font-black uppercase leading-[1.05] text-slate-950">
            {cv.name}
          </h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
            {cv.contact.desiredJob || "Profesional"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[8.5px] text-slate-500">
          <span>{cv.contact.phone}</span>
          <span>{cv.contact.email}</span>
          <span>{cv.contact.city}</span>
          <span>{cv.contact.country}</span>
        </div>
      </header>

      <div className="mt-10 grid grid-cols-[0.58fr_0.42fr] gap-12">
        <main>
          {cv.show("summary") ? (
            <section>
              <SectionTitle accent={accent}>
                Tentang Saya
              </SectionTitle>
              <p className="mt-4 text-[10px] leading-[1.5] text-slate-600">
                {cv.summary}
              </p>
            </section>
          ) : null}

          {cv.show("experience") ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Pengalaman
              </SectionTitle>
              <div className="mt-4">
                <ExperienceList
                  items={cv.experiences}
                  accent={accent}
                  max={4}
                />
              </div>
            </section>
          ) : null}

          {cv.show("certifications") ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Referensi
              </SectionTitle>
              <div className="mt-4">
                <SimpleList
                  items={cv.certifications}
                  field="name"
                />
              </div>
            </section>
          ) : null}
        </main>

        <aside>
          {cv.show("skills") ? (
            <section>
              <SectionTitle accent={accent}>
                Keahlian
              </SectionTitle>
              <div className="mt-4">
                <SkillList
                  skills={cv.skills}
                  accent={accent}
                />
              </div>
            </section>
          ) : null}

          {cv.show("education") ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Pendidikan
              </SectionTitle>
              <div className="mt-4">
                <EducationList
                  items={cv.education}
                  accent={accent}
                />
              </div>
            </section>
          ) : null}

          {cv.show("hobbies") ? (
            <section className="mt-7">
              <SectionTitle accent={accent}>
                Hobi
              </SectionTitle>
              <div className="mt-4">
                <SimpleList
                  items={cv.hobbies}
                  field="name"
                />
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </Page>
  );
}

function YellowLine({ data }) {
  const cv = useCv(data);
  const accent = cv.accent || "#facc15";

  return (
    <Page data={data} className="px-12 py-9">
      <header className="flex items-center justify-between gap-8 border-b-2 border-slate-900 pb-7">
        <div>
          <div
            className="mb-3 h-14 w-14 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <h1 className="text-[28px] font-black leading-[0.95] text-slate-950">
            {cv.name}
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
            {cv.contact.desiredJob || "Profesional"}
          </p>
        </div>
        <Avatar
          photo={cv.photo}
          name={cv.name}
          size={105}
          rounded="999px"
        />
      </header>

      <div className="mt-6 grid grid-cols-4 gap-4 text-[8.5px] text-slate-600">
        <span>{cv.contact.city}</span>
        <span>{cv.contact.phone}</span>
        <span>{cv.contact.email}</span>
        <span>{cv.contact.country}</span>
      </div>

      {cv.show("summary") ? (
        <div className="mt-6 grid grid-cols-[0.22fr_0.78fr] gap-8 border-b border-slate-300 pb-6">
          <h3 className="text-[12px] font-black">
            Tentang Saya
          </h3>
          <p className="text-[10px] leading-[1.48] text-slate-600">
            {cv.summary}
          </p>
        </div>
      ) : null}

      {cv.show("education") ? (
        <div className="grid grid-cols-[0.22fr_0.78fr] gap-8 border-b border-slate-300 py-6">
          <h3 className="text-[12px] font-black">
            Pendidikan
          </h3>
          <EducationList
            items={cv.education}
            accent={accent}
            compact
          />
        </div>
      ) : null}

      {cv.show("experience") ? (
        <div className="grid grid-cols-[0.22fr_0.78fr] gap-8 border-b border-slate-300 py-6">
          <h3 className="text-[12px] font-black">
            Pengalaman Kerja
          </h3>
          <ExperienceList
            items={cv.experiences}
            accent={accent}
            dense
            max={3}
          />
        </div>
      ) : null}

      {cv.show("skills") ? (
        <div className="grid grid-cols-[0.22fr_0.78fr] gap-8 border-b border-slate-300 py-6">
          <h3 className="text-[12px] font-black">
            Keahlian
          </h3>
          <SkillList
            skills={cv.skills}
            accent={accent}
            bars
            columns={2}
          />
        </div>
      ) : null}

      {cv.show("certifications") ? (
        <div className="grid grid-cols-[0.22fr_0.78fr] gap-8 py-6">
          <h3 className="text-[12px] font-black">
            Sertifikasi
          </h3>
          <SimpleList
            items={cv.certifications}
            field="name"
          />
        </div>
      ) : null}
    </Page>
  );
}

function TealBanner({ data }) {
  const cv = useCv(data);
  const accent =
    cv.accent || "#155e63";

  return (
    <Page
      data={data}
      className="px-10 pb-8 pt-7"
    >
      <header
        className="relative ml-16 flex min-h-[142px] items-center px-9 py-6 text-white"
        style={{ backgroundColor: accent }}
      >
        <Avatar
          photo={cv.photo}
          name={cv.name}
          size={118}
          rounded="999px"
          className="absolute -left-[62px] border-[7px] border-white"
        />

        <div className="pl-14">
          <p className="text-[11px] uppercase tracking-[0.08em] text-white/75">
            Daftar Riwayat Hidup
          </p>

          <h1 className="mt-1 text-[29px] font-black leading-[1.02]">
            {cv.name}
          </h1>

          <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/85">
            {cv.contact.desiredJob ||
              "Profesional"}
          </p>
        </div>
      </header>

      <section className="mt-5">
        <SectionTitle
          accent={accent}
          variant="dot"
        >
          Data Pribadi
        </SectionTitle>

        <div className="mt-3">
          <PersonalDetails
            contact={cv.contact}
            columns={4}
          />
        </div>
      </section>

      {cv.show("summary") ? (
        <section className="mt-5">
          <SectionTitle
            accent={accent}
            variant="dot"
          >
            Tentang Saya
          </SectionTitle>

          <p className="mt-2.5 text-[10px] leading-[1.45] text-slate-600">
            {cv.summary}
          </p>
        </section>
      ) : null}

      {cv.show("education") ? (
        <section className="mt-5">
          <SectionTitle
            accent={accent}
            variant="dot"
          >
            Pendidikan
          </SectionTitle>

          <div className="mt-2.5">
            <EducationList
              items={cv.education}
              accent={accent}
              compact
              max={2}
            />
          </div>
        </section>
      ) : null}

      {cv.show("experience") ? (
        <section className="mt-5">
          <SectionTitle
            accent={accent}
            variant="dot"
          >
            Pengalaman Kerja
          </SectionTitle>

          <div className="mt-2.5">
            <ExperienceList
              items={cv.experiences}
              accent={accent}
              dense
              max={3}
            />
          </div>
        </section>
      ) : null}

      {cv.show("skills") ? (
        <section className="mt-5">
          <SectionTitle
            accent={accent}
            variant="dot"
          >
            Keahlian
          </SectionTitle>

          <div className="mt-2.5">
            <SkillList
              skills={cv.skills}
              accent={accent}
              bars
              columns={2}
            />
          </div>
        </section>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-8">
        {cv.show("certifications") ? (
          <section>
            <SectionTitle
              accent={accent}
              variant="dot"
            >
              Sertifikasi
            </SectionTitle>

            <div className="mt-2.5">
              <SimpleList
                items={cv.certifications}
                field="name"
              />
            </div>
          </section>
        ) : null}

        {cv.show("hobbies") ? (
          <section>
            <SectionTitle
              accent={accent}
              variant="dot"
            >
              Hobi
            </SectionTitle>

            <div className="mt-2.5">
              <SimpleList
                items={cv.hobbies}
                field="name"
              />
            </div>
          </section>
        ) : null}
      </div>
    </Page>
  );
}

export default function ReferenceTemplatePreview({
  data,
}) {
  const templateId =
    data?.design?.template ||
    "ref-ribbon-corporate";

  switch (templateId) {
    case "ref-ribbon-corporate":
      return <RibbonCorporate data={data} />;
    case "ref-navy-split":
      return <NavySplit data={data} />;
    case "ref-editorial-grid":
      return <EditorialGrid data={data} />;
    case "ref-orange-sidebar":
      return <OrangeSidebar data={data} />;
    case "ref-classic-bands":
      return <ClassicBands data={data} />;
    case "ref-clean-architect":
      return <CleanArchitect data={data} />;
    case "ref-minimal-columns":
      return <MinimalColumns data={data} />;
    case "ref-yellow-line":
      return <YellowLine data={data} />;
    case "ref-teal-banner":
      return <TealBanner data={data} />;
    default:
      return <RibbonCorporate data={data} />;
  }
}

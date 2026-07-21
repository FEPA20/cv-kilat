const makeId = () =>
  `import-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const PAGE_BREAK_MARKER = "<<<CV_KILAT_PAGE_BREAK>>>";

const SECTION_ALIASES = {
  summary: [
    "ringkasan",
    "ringkasan profesional",
    "profil",
    "profil profesional",
    "profil singkat",
    "tentang saya",
    "about me",
    "summary",
    "professional summary",
    "career objective",
    "objective",
  ],
  experience: [
    "pengalaman",
    "pengalaman kerja",
    "riwayat pekerjaan",
    "experience",
    "work experience",
    "employment history",
    "professional experience",
  ],
  education: [
    "pendidikan",
    "riwayat pendidikan",
    "education",
    "academic background",
    "academic history",
  ],
  skills: [
    "keahlian",
    "kemampuan",
    "kompetensi",
    "skills",
    "core skills",
    "competencies",
    "core competencies",
  ],
  achievements: [
    "achievement",
    "achievements",
    "pencapaian",
    "prestasi",
    "key achievements",
    "career achievements",
  ],
  languages: [
    "bahasa",
    "kemampuan bahasa",
    "languages",
    "language",
  ],
  certifications: [
    "sertifikasi",
    "pelatihan",
    "lisensi",
    "certifications",
    "certificates",
    "training",
    "licenses",
  ],
  hobbies: [
    "hobi",
    "minat",
    "hobi & minat",
    "hobbies",
    "interests",
  ],
};

const MONTH_NAMES =
  "jan|feb|mar|apr|mei|may|jun|jul|agu|aug|sep|okt|oct|nov|des|dec|januari|februari|maret|april|juni|juli|agustus|september|oktober|november|desember";

const DATE_RANGE_PATTERN = new RegExp(
  `((?:${MONTH_NAMES})?\\s*(?:19|20)\\d{2}(?:[-/.]\\d{1,2})?)\\s*(?:-|–|—|sampai|hingga|to)\\s*((?:${MONTH_NAMES})?\\s*(?:19|20)\\d{2}(?:[-/.]\\d{1,2})?|sekarang|present|current|date)`,
  "i"
);

const INSTITUTION_PATTERN =
  /\b(?:universitas|university|institut|institute|politeknik|polytechnic|college|academy|akademi|sekolah|sma|smk|smp|sd|madrasah|pesantren)\b/i;

const ACHIEVEMENT_ACTION_PATTERN =
  /^(?:berhasil|meningkatkan|mengurangi|menjaga|membantu|menemukan|memberikan|mengungkap|memastikan|menerapkan|mengimplementasikan|membangun|mencapai|mengelola|memimpin|improved|increased|reduced|managed|achieved|implemented|built|maintained)\b/i;

function compactLetters(value = "") {
  const tokens = String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length >= 3 && tokens.every((token) => token.length === 1)) {
    return tokens.join("");
  }

  return tokens.join(" ");
}

function normalizeHeading(value = "") {
  const cleaned = String(value)
    .toLowerCase()
    .replace(/[•:|/\\()[\]{}]+/g, " ")
    .replace(/[._-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return compactLetters(cleaned);
}

function headingMatches(normalized, alias) {
  const normalizedCompact = normalized.replace(/\s+/g, "");
  const aliasNormalized = normalizeHeading(alias);
  const aliasCompact = aliasNormalized.replace(/\s+/g, "");

  return (
    normalized === aliasNormalized ||
    normalizedCompact === aliasCompact ||
    normalized.startsWith(`${aliasNormalized} `)
  );
}

function sectionKeyForLine(line = "") {
  const normalized = normalizeHeading(line);

  if (!normalized || normalized === PAGE_BREAK_MARKER.toLowerCase()) {
    return "";
  }

  for (const [key, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.some((alias) => headingMatches(normalized, alias))) {
      return key;
    }
  }

  return "";
}

function splitLines(text = "", keepEmpty = false) {
  const lines = String(text)
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[ ]{2,}/g, " ").trim());

  return keepEmpty ? lines : lines.filter(Boolean);
}

function cleanBullet(value = "") {
  return String(value)
    .replace(/^\s*(?:[•●▪◦*-]|\d+[.)])\s*/, "")
    .trim();
}

function joinWrappedLines(lines = []) {
  const output = [];

  for (const rawLine of lines) {
    const line = cleanBullet(rawLine);

    if (!line) continue;

    const previous = output.at(-1);
    const startsLowercase = /^[a-zà-ÿ]/.test(line);
    const previousLooksIncomplete =
      previous && !/[.!?:;)]$/.test(previous);

    if (previous && (startsLowercase || previousLooksIncomplete)) {
      output[output.length - 1] = `${previous} ${line}`
        .replace(/\s+/g, " ")
        .trim();
    } else {
      output.push(line);
    }
  }

  return output;
}

function extractSections(text = "") {
  const lines = splitLines(text, true);
  const sections = {
    intro: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    achievements: [],
    languages: [],
    certifications: [],
    hobbies: [],
  };

  let active = "intro";

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line === PAGE_BREAK_MARKER) {
      if (sections[active].length && sections[active].at(-1) !== "") {
        sections[active].push("");
      }
      continue;
    }

    const detected = sectionKeyForLine(line);

    if (detected) {
      active = detected;
      continue;
    }

    sections[active].push(line);
  }

  for (const key of Object.keys(sections)) {
    while (sections[key][0] === "") sections[key].shift();
    while (sections[key].at(-1) === "") sections[key].pop();
  }

  return sections;
}

function findEmail(text = "") {
  return (
    String(text).match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    )?.[0] || ""
  );
}

function findPhone(text = "") {
  const candidates =
    String(text).match(
      /(?:\+?62|0)[\s().-]?\d{2,4}(?:[\s().-]?\d{2,4}){2,4}/g
    ) || [];

  return (
    candidates
      .map((item) => item.trim())
      .sort((a, b) => b.replace(/\D/g, "").length - a.replace(/\D/g, "").length)[0] ||
    ""
  );
}

function looksLikeContactLine(line = "") {
  const value = String(line);
  return Boolean(
    findEmail(value) ||
      findPhone(value) ||
      /linkedin|github|portfolio|website|www\.|https?:\/\//i.test(value)
  );
}

function looksLikeName(line = "") {
  const value = cleanBullet(line);

  if (!value || value.length < 3 || value.length > 60) return false;
  if (looksLikeContactLine(value)) return false;
  if (sectionKeyForLine(value)) return false;
  if (/\d{3,}/.test(value)) return false;

  const words = value.split(/\s+/);

  return (
    words.length >= 2 &&
    words.length <= 6 &&
    words.every((word) => /^[A-Za-zÀ-ÿ'.-]+$/.test(word))
  );
}

function splitName(fullName = "") {
  const words = fullName.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return { firstName: "", lastName: "" };
  }

  if (words.length === 1) {
    return { firstName: words[0], lastName: "" };
  }

  return {
    firstName: words[0],
    lastName: words.slice(1).join(" "),
  };
}

function monthValue(value = "") {
  const year = value.match(/\b(19|20)\d{2}\b/)?.[0] || "";
  if (!year) return "";

  const monthMap = {
    jan: "01",
    januari: "01",
    feb: "02",
    februari: "02",
    mar: "03",
    maret: "03",
    apr: "04",
    april: "04",
    mei: "05",
    may: "05",
    jun: "06",
    juni: "06",
    jul: "07",
    juli: "07",
    agu: "08",
    aug: "08",
    agustus: "08",
    sep: "09",
    september: "09",
    okt: "10",
    oct: "10",
    oktober: "10",
    nov: "11",
    november: "11",
    des: "12",
    dec: "12",
    desember: "12",
  };

  const lowerValue = value.toLowerCase();
  const monthName = Object.keys(monthMap).find((key) =>
    new RegExp(`\\b${key}\\b`, "i").test(lowerValue)
  );

  const numericMonth =
    value.match(/\b(?:19|20)\d{2}[-/.](\d{1,2})\b/)?.[1] || "";

  const month = monthName
    ? monthMap[monthName]
    : numericMonth
      ? String(Math.min(12, Math.max(1, Number(numericMonth)))).padStart(2, "0")
      : "01";

  return `${year}-${month}`;
}

function parseDateRange(line = "") {
  const match = String(line).match(DATE_RANGE_PATTERN);

  if (!match) return null;

  const isCurrent = /sekarang|present|current|date/i.test(match[2]);

  return {
    startDate: monthValue(match[1]),
    endDate: isCurrent ? "" : monthValue(match[2]),
    current: isCurrent,
  };
}

function splitRoleAndOrganization(value = "") {
  const line = cleanBullet(value).replace(/\s+/g, " ").trim();

  const explicit = line.match(
    /^(.*?)\s+(?:di|at|@)\s+(.+?)(?:\s*[|•·]\s*(.+))?$/i
  );

  if (explicit) {
    return {
      role: explicit[1].trim(),
      organization: explicit[2].trim(),
      location: explicit[3]?.trim() || "",
    };
  }

  const parts = line
    .split(/\s*(?:\||•|·)\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    role: parts[0] || "",
    organization: parts[1] || "",
    location: parts.slice(2).join(", "),
  };
}

function makeDescription(lines = []) {
  return joinWrappedLines(lines)
    .filter(Boolean)
    .map((line) => `• ${line}`)
    .join("\n");
}

function parseTimelineWithDates(lines = [], type = "experience") {
  const cleaned = lines.map((line) => line.trim()).filter(Boolean);
  const dateIndexes = cleaned
    .map((line, index) => (parseDateRange(line) ? index : -1))
    .filter((index) => index >= 0);

  if (!dateIndexes.length) return [];

  return dateIndexes
    .map((dateIndex, position) => {
      const dates = parseDateRange(cleaned[dateIndex]);
      const titleIndex = Math.max(0, dateIndex - 1);
      const titleLine = cleaned[titleIndex] || "";
      const nextDateIndex = dateIndexes[position + 1] ?? cleaned.length;
      const nextTitleIndex =
        position + 1 < dateIndexes.length
          ? Math.max(dateIndex + 1, nextDateIndex - 1)
          : cleaned.length;
      const descriptionLines = cleaned.slice(
        dateIndex + 1,
        nextTitleIndex
      );

      if (type === "experience") {
        const details = splitRoleAndOrganization(titleLine);

        return {
          id: makeId(),
          jobTitle: details.role,
          employer: details.organization,
          location: details.location,
          startDate: dates.startDate,
          endDate: dates.endDate,
          current: dates.current,
          description: makeDescription(descriptionLines),
          open: true,
        };
      }

      const educationParts = splitRoleAndOrganization(titleLine);

      return {
        id: makeId(),
        school: educationParts.role || titleLine,
        degree: educationParts.organization,
        location: educationParts.location,
        startDate: dates.startDate,
        endDate: dates.endDate,
        current: dates.current,
        description: makeDescription(descriptionLines),
        open: true,
      };
    })
    .filter((record) =>
      type === "experience"
        ? record.jobTitle || record.employer
        : record.school || record.degree
    );
}

function parseEducation(lines = []) {
  const dated = parseTimelineWithDates(lines, "education");
  if (dated.length) return dated;

  const cleaned = lines
    .flatMap((line) => String(line).split(/\t+/))
    .map(cleanBullet)
    .filter(Boolean);

  const institutionLines = cleaned.filter((line) =>
    INSTITUTION_PATTERN.test(line)
  );
  const source = institutionLines.length ? institutionLines : cleaned;

  return source.slice(0, 10).map((line) => ({
    id: makeId(),
    school: line,
    degree: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    open: true,
  }));
}

function parseSkills(lines = []) {
  const candidates = lines
    .flatMap((line) =>
      String(line).split(/\t+|\s{3,}|[,;|•·]+/)
    )
    .map(cleanBullet)
    .map((item) =>
      item.replace(
        /\b(?:pemula|awal|terampil|berpengalaman|ahli|basic|intermediate|advanced|expert)\b/gi,
        ""
      )
    )
    .map((item) => item.trim())
    .filter(
      (item) =>
        item.length >= 2 &&
        item.length <= 60 &&
        !/^\d(?:\/5)?$/.test(item) &&
        !ACHIEVEMENT_ACTION_PATTERN.test(item)
    );

  const unique = [];
  const seen = new Set();

  for (const item of candidates) {
    const key = item.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique.slice(0, 20).map((name) => ({
    id: makeId(),
    name,
    level: 3,
  }));
}

function isAchievementHeading(line = "", nextLine = "") {
  const cleaned = cleanBullet(line);

  if (!cleaned || cleaned.length > 60) return false;
  if (/[.!?;:]$/.test(cleaned)) return false;
  if (ACHIEVEMENT_ACTION_PATTERN.test(cleaned)) return false;
  if (!nextLine || !ACHIEVEMENT_ACTION_PATTERN.test(cleanBullet(nextLine))) {
    return false;
  }

  return cleaned.split(/\s+/).length <= 7;
}

function parseAchievementGroups(lines = []) {
  const cleaned = lines.map(cleanBullet).filter(Boolean);
  const groups = [];
  let current = null;

  for (let index = 0; index < cleaned.length; index += 1) {
    const line = cleaned[index];
    const nextLine = cleaned[index + 1] || "";

    if (isAchievementHeading(line, nextLine)) {
      current = {
        title: line,
        items: [],
      };
      groups.push(current);
      continue;
    }

    if (!current) {
      current = {
        title: "Pencapaian",
        items: [],
      };
      groups.push(current);
    }

    const previous = current.items.at(-1);
    const startsLowercase = /^[a-zà-ÿ]/.test(line);
    const previousIncomplete =
      previous && !/[.!?:;)]$/.test(previous);

    if (previous && (startsLowercase || previousIncomplete)) {
      current.items[current.items.length - 1] = `${previous} ${line}`
        .replace(/\s+/g, " ")
        .trim();
    } else {
      current.items.push(line);
    }
  }

  return groups.filter((group) => group.items.length);
}

function canonicalRole(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/\bmanager gudang\b/g, "warehouse manager")
    .replace(/\binternal audit\b/g, "audit")
    .replace(/\bstaff audit\b/g, "audit")
    .replace(/\bstaff return\b/g, "return")
    .replace(/\badmin return\b/g, "return")
    .replace(/\binventory control\b/g, "inventory control")
    .replace(/\bwarehouse\b/g, "warehouse")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b(?:staff|senior|junior|officer|specialist|lead|leader)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function roleMatchScore(groupTitle = "", experience = {}) {
  const group = canonicalRole(groupTitle);
  const role = canonicalRole(
    `${experience.jobTitle || ""} ${experience.employer || ""}`
  );

  if (!group || !role) return 0;
  if (group === role) return 10;
  if (role.includes(group) || group.includes(role)) return 7;

  const groupTokens = new Set(group.split(" ").filter(Boolean));
  const roleTokens = new Set(role.split(" ").filter(Boolean));
  let score = 0;

  for (const token of groupTokens) {
    if (roleTokens.has(token)) score += 2;
  }

  if (group.includes("audit") && role.includes("audit")) score += 5;
  if (
    group.includes("inventory control") &&
    role.includes("inventory control")
  ) {
    score += 6;
  }
  if (
    group.includes("warehouse manager") &&
    role.includes("warehouse manager")
  ) {
    score += 6;
  }
  if (group.includes("return") && role.includes("return")) score += 5;

  return score;
}

function attachAchievements(experiences = [], achievementGroups = []) {
  const enriched = experiences.map((item) => ({ ...item }));
  const unmatched = [];

  for (const group of achievementGroups) {
    let bestIndex = -1;
    let bestScore = 0;

    enriched.forEach((experience, index) => {
      const score = roleMatchScore(group.title, experience);

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    if (bestIndex >= 0 && bestScore >= 4) {
      const achievementText = group.items
        .map((item) => `• ${item}`)
        .join("\n");
      const currentDescription =
        enriched[bestIndex].description?.trim() || "";

      enriched[bestIndex].description = [
        currentDescription,
        "PENCAPAIAN:",
        achievementText,
      ]
        .filter(Boolean)
        .join("\n");
    } else {
      unmatched.push(group);
    }
  }

  return {
    experiences: enriched,
    unmatched,
  };
}

function parseLanguages(lines = []) {
  return lines
    .map(cleanBullet)
    .filter(Boolean)
    .slice(0, 8)
    .map((line) => {
      const [language, ...levelParts] = line.split(
        /\s*(?:—|-|:|\||·|\t)\s*/
      );

      return {
        id: makeId(),
        language: language || "",
        level: levelParts.join(" ") || "Menengah",
      };
    });
}

function parseCertifications(lines = []) {
  return lines
    .map(cleanBullet)
    .filter(Boolean)
    .slice(0, 10)
    .map((line) => {
      const year = line.match(/\b(?:19|20)\d{2}\b/)?.[0] || "";
      const withoutYear = line.replace(year, "").replace(/[()]/g, "").trim();
      const [name, ...issuerParts] = withoutYear.split(
        /\s*(?:—|-|\||·|\t)\s*/
      );

      return {
        id: makeId(),
        name: name || "",
        issuer: issuerParts.join(" ") || "",
        year,
      };
    });
}

function parseHobbies(lines = []) {
  return lines
    .flatMap((line) => line.split(/\t+|\s*(?:,|;|\||•|·)\s*/))
    .map(cleanBullet)
    .filter(Boolean)
    .slice(0, 10)
    .map((name) => ({
      id: makeId(),
      name,
    }));
}

function detectLanguage(text = "") {
  const idSignals =
    String(text).match(
      /\b(?:pengalaman|pendidikan|keahlian|ringkasan|sekarang|bahasa|sertifikasi|profil)\b/gi
    )?.length || 0;
  const enSignals =
    String(text).match(
      /\b(?:experience|education|skills|summary|present|languages|certifications|profile)\b/gi
    )?.length || 0;

  return enSignals > idSignals ? "EN" : "ID";
}

function extractAddress(introLines = [], nameLine = "", email = "", phone = "") {
  const contactText = introLines
    .filter((line) => line && line !== nameLine)
    .join(" ")
    .replace(email, " ")
    .replace(phone, " ")
    .replace(/https?:\/\/\S+|www\.\S+/gi, " ")
    .replace(/\b(?:linkedin|github|portfolio)\b[^|]*/gi, " ")
    .replace(/[|•·]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[,;:\s-]+|[,;:\s-]+$/g, "")
    .trim();

  return contactText.length >= 4 ? contactText : "";
}

export function parseCvText(text = "") {
  const sections = extractSections(text);
  const allText = String(text);
  const introLines = sections.intro.filter(Boolean).slice(0, 20);
  const email = findEmail(allText);
  const phone = findPhone(allText);

  const nameLine =
    introLines.find(looksLikeName) ||
    splitLines(allText).find(looksLikeName) ||
    "";

  const name = splitName(nameLine);
  const experiencesBase = parseTimelineWithDates(
    sections.experience,
    "experience"
  );
  const achievementGroups = parseAchievementGroups(
    sections.achievements
  );
  const achievementResult = attachAchievements(
    experiencesBase,
    achievementGroups
  );
  const experiences = achievementResult.experiences;
  const education = parseEducation(sections.education);
  const skills = parseSkills(sections.skills);
  const languages = parseLanguages(sections.languages);
  const certifications = parseCertifications(
    sections.certifications
  );
  const hobbies = parseHobbies(sections.hobbies);
  const language = detectLanguage(text);

  const nameIndex = introLines.indexOf(nameLine);
  const firstContactIndex = introLines.findIndex(
    (line, index) =>
      index > nameIndex && looksLikeContactLine(line)
  );
  const desiredJobCandidates = introLines.slice(
    Math.max(0, nameIndex + 1),
    firstContactIndex >= 0 ? firstContactIndex : introLines.length
  );
  const explicitDesiredJob =
    desiredJobCandidates.find(
      (line) =>
        !sectionKeyForLine(line) &&
        line.length <= 80 &&
        !/[,;]|\b(?:jalan|jl\.?|rt\.?|rw\.?|kelurahan|kecamatan|kota|kabupaten|jakarta|bandung|surabaya|bekasi|depok|tangerang)\b/i.test(
          line
        )
    ) || "";

  const desiredJob =
    explicitDesiredJob || experiences[0]?.jobTitle || "";

  const summary = joinWrappedLines(sections.summary)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    contact: {
      firstName: name.firstName,
      lastName: name.lastName,
      desiredJob,
      phone,
      email,
      address: extractAddress(introLines, nameLine, email, phone),
      city: "",
      country: language === "EN" ? "" : "Indonesia",
      postalCode: "",
    },
    experiences,
    education,
    showSkillLevel: false,
    skills,
    summary,
    languages,
    hobbies,
    certifications,
    achievements: achievementGroups,
    design: {
      template: "modern",
      language,
    },
    importMeta: {
      source: "document-upload",
      extractedAt: new Date().toISOString(),
      characterCount: allText.length,
      unmatchedAchievements: achievementResult.unmatched,
    },
  };
}

function paragraphsFromText(text = "") {
  return String(text)
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")
    )
    .filter(Boolean);
}

export function parseCoverLetterText(text = "") {
  const lines = splitLines(text);
  const paragraphs = paragraphsFromText(text);
  const greetingIndex = lines.findIndex((line) =>
    /^(dengan hormat|dear|kepada yth|yth\.?)/i.test(line)
  );

  const greeting =
    greetingIndex >= 0 ? lines[greetingIndex] : "Dengan hormat,";
  const recipientLine =
    lines.find((line) => /^(yth\.?|kepada yth|dear)/i.test(line)) || "";
  const dateLine =
    lines.find(
      (line) =>
        /\b\d{1,2}\s+[A-Za-zÀ-ÿ]+\s+(?:19|20)\d{2}\b/.test(line) ||
        /\b(?:19|20)\d{2}[-/]\d{1,2}[-/]\d{1,2}\b/.test(line)
    ) || "";

  const bodyParagraphs = paragraphs.filter(
    (paragraph) =>
      paragraph !== greeting &&
      paragraph !== recipientLine &&
      paragraph !== dateLine &&
      !/^surat lamaran/i.test(paragraph)
  );

  const signatureName =
    [...lines]
      .reverse()
      .find(
        (line) =>
          looksLikeName(line) &&
          !/hormat|sincerely|regards|yth/i.test(line)
      ) || "";

  const opening = bodyParagraphs[0] || "";
  const closing =
    bodyParagraphs.length > 1
      ? bodyParagraphs.at(-1)
      : "";
  const body =
    bodyParagraphs.length > 2
      ? bodyParagraphs.slice(1, -1).join("\n\n")
      : bodyParagraphs.slice(1).join("\n\n");

  return {
    title:
      lines.find((line) => /surat lamaran/i.test(line)) ||
      "Surat Lamaran Kerja",
    recipientName: recipientLine || "HRD / Tim Rekrutmen",
    companyName: "",
    companyAddress: "",
    companyCity: "",
    targetPosition: "",
    vacancySource: "",
    date: new Date().toISOString().slice(0, 10),
    subject:
      lines.find((line) => /^(perihal|subject)\s*:/i.test(line)) ||
      "Lamaran Pekerjaan",
    greeting,
    opening,
    body,
    closing,
    signatureName,
    language: /\bdear|sincerely|application\b/i.test(text)
      ? "en"
      : "id",
    template: "professional",
    accentColor: "#0f766e",
    fontFamily: "Georgia",
    fontSize: "normal",
    importMeta: {
      source: "document-upload",
      originalDateText: dateLine,
      extractedAt: new Date().toISOString(),
    },
  };
}

export function getCvImportSummary(parsed = {}) {
  return {
    name: `${parsed?.contact?.firstName || ""} ${
      parsed?.contact?.lastName || ""
    }`.trim(),
    desiredJob: parsed?.contact?.desiredJob || "",
    email: parsed?.contact?.email || "",
    phone: parsed?.contact?.phone || "",
    experienceCount: parsed?.experiences?.length || 0,
    educationCount: parsed?.education?.length || 0,
    skillCount: parsed?.skills?.length || 0,
    achievementCount:
      parsed?.achievements?.reduce(
        (sum, group) => sum + (group?.items?.length || 0),
        0
      ) || 0,
  };
}

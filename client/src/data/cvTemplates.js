const makeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const DEFAULT_SECTION_ORDER = [
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
  "certifications",
  "hobbies",
];

const BASE_DESIGN = {
  template: "modern",
  language: "ID",
  primaryColor: "#0ea5e9",
  pageBackground: "#ffffff",
  fontFamily: "Inter",
  fontSize: "normal",
  lineHeight: 1.55,
  sectionSpacing: 18,
  paragraphSpacing: 8,
  pageMargin: 42,
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

const BASE_PHOTO = {
  originalUrl: "",
  editedUrl: "",
  shape: "rounded",
  size: 84,
  zoom: 1,
  rotation: 0,
};

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

const emptyLanguage = () => ({
  id: makeId(),
  language: "",
  level: "Menengah",
});

const emptyHobby = () => ({
  id: makeId(),
  name: "",
});

export function createBlankCvData(designOverrides = {}) {
  return {
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
    design: {
      ...BASE_DESIGN,
      ...designOverrides,
      sectionOrder:
        designOverrides.sectionOrder || [...DEFAULT_SECTION_ORDER],
      hiddenSections:
        designOverrides.hiddenSections || [],
    },
    photo: {
      ...BASE_PHOTO,
    },
  };
}

function experience(data) {
  return {
    id: makeId(),
    open: true,
    current: false,
    ...data,
  };
}

function education(data) {
  return {
    id: makeId(),
    open: true,
    current: false,
    ...data,
  };
}

function skill(name, level = 4) {
  return {
    id: makeId(),
    name,
    level,
  };
}

function language(name, level = "Profesional") {
  return {
    id: makeId(),
    language: name,
    level,
  };
}

function hobby(name) {
  return {
    id: makeId(),
    name,
  };
}

function certification(name, issuer, year) {
  return {
    id: makeId(),
    name,
    issuer,
    year,
  };
}

export const CV_TEMPLATES = [
  {
    id: "professional-navy",
    name: "Professional Navy",
    category: "Profesional",
    badge: "Paling populer",
    description:
      "Template modern dan rapi untuk profesional berpengalaman.",
    accent: "#0f4c81",
    tags: ["Profesional", "ATS Friendly", "Dua Kolom"],
    design: {
      ...BASE_DESIGN,
      template: "modern",
      primaryColor: "#0f4c81",
      fontFamily: "Inter",
      sectionSpacing: 17,
    },
    sampleData: {
      contact: {
        firstName: "Andi",
        lastName: "Pratama",
        desiredJob: "Business Development Specialist",
        phone: "+62 812 3456 7890",
        email: "andi.pratama@email.com",
        address: "Kebayoran Baru",
        city: "Jakarta Selatan",
        country: "Indonesia",
        postalCode: "12120",
      },
      summary:
        "Business Development Specialist dengan pengalaman lebih dari 5 tahun dalam pengembangan pasar, negosiasi komersial, dan pengelolaan hubungan klien. Berhasil meningkatkan nilai penjualan melalui strategi berbasis data dan kolaborasi lintas divisi.",
      experiences: [
        experience({
          jobTitle: "Senior Business Development",
          employer: "PT Nusantara Digital Solusi",
          location: "Jakarta",
          startDate: "2022-01",
          endDate: "",
          current: true,
          description:
            "• Mengembangkan strategi akuisisi klien untuk segmen korporasi.\n• Meningkatkan pendapatan portofolio sebesar 28% dalam satu tahun.\n• Memimpin negosiasi dan koordinasi implementasi bersama tim operasional.",
        }),
        experience({
          jobTitle: "Account Executive",
          employer: "PT Kreasi Teknologi Indonesia",
          location: "Tangerang",
          startDate: "2019-02",
          endDate: "2021-12",
          description:
            "• Mengelola lebih dari 40 akun aktif.\n• Menyusun proposal komersial dan laporan performa bulanan.\n• Menjaga tingkat retensi pelanggan di atas 90%.",
        }),
      ],
      education: [
        education({
          school: "Universitas Bina Nusantara",
          location: "Jakarta",
          degree: "S1 Manajemen",
          startDate: "2014-08",
          endDate: "2018-07",
          description: "Konsentrasi Manajemen Pemasaran.",
        }),
      ],
      showSkillLevel: true,
      skills: [
        skill("Business Development", 5),
        skill("Negotiation", 5),
        skill("Sales Strategy", 4),
        skill("CRM", 4),
        skill("Data Analysis", 4),
        skill("Presentation", 4),
      ],
      languages: [
        language("Bahasa Indonesia", "Native"),
        language("English", "Profesional"),
      ],
      hobbies: [hobby("Membaca"), hobby("Public Speaking")],
      certifications: [
        certification(
          "Strategic Sales Management",
          "Professional Academy",
          "2023"
        ),
      ],
    },
  },
  {
    id: "minimal-ats",
    name: "Minimal ATS",
    category: "ATS",
    badge: "ATS terbaik",
    description:
      "Satu kolom sederhana dengan struktur yang mudah dibaca sistem rekrutmen.",
    accent: "#111827",
    tags: ["ATS Friendly", "Minimal", "Tanpa Foto"],
    design: {
      ...BASE_DESIGN,
      template: "ats",
      primaryColor: "#111827",
      fontFamily: "Arial",
      sectionSpacing: 15,
      pageMargin: 48,
      hiddenSections: ["hobbies"],
    },
    sampleData: {
      contact: {
        firstName: "Siti",
        lastName: "Rahmawati",
        desiredJob: "Finance & Accounting Officer",
        phone: "+62 811 2233 4455",
        email: "siti.rahmawati@email.com",
        address: "Cibubur",
        city: "Jakarta Timur",
        country: "Indonesia",
        postalCode: "13720",
      },
      summary:
        "Finance & Accounting Officer dengan pengalaman dalam rekonsiliasi, laporan keuangan, pengelolaan invoice, dan kontrol dokumen. Teliti, terorganisasi, serta terbiasa bekerja dengan tenggat waktu dan volume transaksi tinggi.",
      experiences: [
        experience({
          jobTitle: "Finance Officer",
          employer: "PT Prima Distribusi Indonesia",
          location: "Jakarta",
          startDate: "2021-06",
          endDate: "",
          current: true,
          description:
            "• Melakukan rekonsiliasi transaksi harian dan bulanan.\n• Memproses invoice vendor serta memastikan kelengkapan dokumen.\n• Menyiapkan laporan arus kas dan biaya operasional.",
        }),
        experience({
          jobTitle: "Accounting Staff",
          employer: "PT Sentosa Retail",
          location: "Bekasi",
          startDate: "2019-01",
          endDate: "2021-05",
          description:
            "• Mencatat jurnal transaksi dan membantu proses tutup buku.\n• Mengarsipkan dokumen pajak dan transaksi secara terstruktur.",
        }),
      ],
      education: [
        education({
          school: "Universitas Gunadarma",
          location: "Depok",
          degree: "S1 Akuntansi",
          startDate: "2014-09",
          endDate: "2018-08",
          description: "",
        }),
      ],
      showSkillLevel: false,
      skills: [
        skill("Financial Reporting", 4),
        skill("Reconciliation", 5),
        skill("Microsoft Excel", 5),
        skill("Accounts Payable", 4),
        skill("Tax Administration", 3),
      ],
      languages: [
        language("Bahasa Indonesia", "Native"),
        language("English", "Menengah"),
      ],
      hobbies: [],
      certifications: [
        certification("Brevet Pajak A & B", "Tax Center Indonesia", "2022"),
      ],
    },
  },
  {
    id: "executive-manager",
    name: "Executive Manager",
    category: "Manager",
    badge: "Senior level",
    description:
      "Tampilan tegas untuk manager, supervisor, dan kandidat leadership.",
    accent: "#7c2d12",
    tags: ["Manager", "Executive", "Leadership"],
    design: {
      ...BASE_DESIGN,
      template: "executive",
      primaryColor: "#7c2d12",
      fontFamily: "Georgia",
      sectionSpacing: 19,
    },
    sampleData: {
      contact: {
        firstName: "Rizky",
        lastName: "Adiwijaya",
        desiredJob: "Operations Manager",
        phone: "+62 813 7788 9900",
        email: "rizky.adiwijaya@email.com",
        address: "Bintaro",
        city: "Tangerang Selatan",
        country: "Indonesia",
        postalCode: "15224",
      },
      summary:
        "Operations Manager dengan pengalaman 9 tahun dalam pengelolaan operasional, peningkatan produktivitas, pengendalian biaya, dan pengembangan tim. Terbukti membangun proses kerja terukur serta meningkatkan kualitas layanan secara berkelanjutan.",
      experiences: [
        experience({
          jobTitle: "Operations Manager",
          employer: "PT Solusi Logistik Nasional",
          location: "Tangerang",
          startDate: "2020-03",
          endDate: "",
          current: true,
          description:
            "• Memimpin operasional harian dengan lebih dari 80 anggota tim.\n• Menurunkan biaya operasional sebesar 15% melalui perbaikan proses.\n• Membangun dashboard KPI dan evaluasi produktivitas mingguan.\n• Mengembangkan supervisor dan team leader melalui coaching rutin.",
        }),
        experience({
          jobTitle: "Operations Supervisor",
          employer: "PT Mandiri Supply Chain",
          location: "Jakarta",
          startDate: "2016-01",
          endDate: "2020-02",
          description:
            "• Mengawasi pencapaian SLA dan kualitas operasional.\n• Menangani eskalasi pelanggan dan tindakan perbaikan.",
        }),
      ],
      education: [
        education({
          school: "Universitas Trisakti",
          location: "Jakarta",
          degree: "S1 Teknik Industri",
          startDate: "2010-08",
          endDate: "2014-07",
          description: "",
        }),
      ],
      showSkillLevel: true,
      skills: [
        skill("Operations Management", 5),
        skill("Leadership", 5),
        skill("Cost Control", 4),
        skill("Process Improvement", 5),
        skill("KPI Management", 5),
        skill("Problem Solving", 5),
      ],
      languages: [
        language("Bahasa Indonesia", "Native"),
        language("English", "Profesional"),
      ],
      hobbies: [hobby("Mentoring"), hobby("Business Reading")],
      certifications: [
        certification("Lean Six Sigma Green Belt", "Quality Institute", "2021"),
      ],
    },
  },
  {
    id: "fresh-graduate",
    name: "Fresh Graduate",
    category: "Fresh Graduate",
    badge: "Pemula",
    description:
      "Menonjolkan pendidikan, organisasi, proyek, dan keterampilan awal.",
    accent: "#7c3aed",
    tags: ["Fresh Graduate", "Modern", "Proyek"],
    design: {
      ...BASE_DESIGN,
      template: "minimal",
      primaryColor: "#7c3aed",
      fontFamily: "Inter",
      sectionSpacing: 16,
    },
    sampleData: {
      contact: {
        firstName: "Nadia",
        lastName: "Putri",
        desiredJob: "Human Resources Staff",
        phone: "+62 857 1100 2233",
        email: "nadia.putri@email.com",
        address: "Dago",
        city: "Bandung",
        country: "Indonesia",
        postalCode: "40135",
      },
      summary:
        "Lulusan Psikologi yang memiliki minat pada rekrutmen, administrasi HR, dan pengembangan karyawan. Aktif dalam organisasi kampus, terbiasa melakukan koordinasi, pengolahan data, serta komunikasi dengan berbagai pihak.",
      experiences: [
        experience({
          jobTitle: "HR Intern",
          employer: "PT Talenta Bersama",
          location: "Bandung",
          startDate: "2024-02",
          endDate: "2024-07",
          description:
            "• Membantu screening CV dan penjadwalan wawancara.\n• Memperbarui database kandidat dan dokumen onboarding.\n• Mendukung pelaksanaan kegiatan employee engagement.",
        }),
        experience({
          jobTitle: "Koordinator Divisi Pengembangan Anggota",
          employer: "BEM Fakultas Psikologi",
          location: "Bandung",
          startDate: "2022-01",
          endDate: "2023-12",
          description:
            "• Menyusun program pelatihan untuk lebih dari 50 anggota.\n• Mengkoordinasikan evaluasi kegiatan dan dokumentasi.",
        }),
      ],
      education: [
        education({
          school: "Universitas Padjadjaran",
          location: "Bandung",
          degree: "S1 Psikologi",
          startDate: "2020-08",
          endDate: "2024-07",
          description: "IPK 3,72/4,00.",
        }),
      ],
      showSkillLevel: true,
      skills: [
        skill("Recruitment Administration", 4),
        skill("Microsoft Office", 4),
        skill("Communication", 4),
        skill("Data Entry", 4),
        skill("Teamwork", 5),
      ],
      languages: [
        language("Bahasa Indonesia", "Native"),
        language("English", "Menengah"),
      ],
      hobbies: [hobby("Volunteer"), hobby("Membaca")],
      certifications: [
        certification("Basic Human Resources", "HR Academy", "2024"),
      ],
    },
  },
  {
    id: "warehouse-professional",
    name: "Warehouse Professional",
    category: "Operasional",
    badge: "Industri",
    description:
      "Didesain untuk warehouse, inventory, logistik, dan operasional.",
    accent: "#d97706",
    tags: ["Warehouse", "Logistik", "Operasional"],
    design: {
      ...BASE_DESIGN,
      template: "executive",
      primaryColor: "#d97706",
      fontFamily: "Inter",
      sectionSpacing: 17,
    },
    sampleData: {
      contact: {
        firstName: "Dimas",
        lastName: "Saputra",
        desiredJob: "Warehouse Supervisor",
        phone: "+62 812 9090 1122",
        email: "dimas.saputra@email.com",
        address: "Cikarang Selatan",
        city: "Bekasi",
        country: "Indonesia",
        postalCode: "17530",
      },
      summary:
        "Warehouse Supervisor dengan pengalaman dalam inbound, outbound, inventory control, stock opname, dan pengembangan produktivitas tim. Terbiasa mengelola akurasi stok, penerapan SOP, keselamatan kerja, dan pencapaian target operasional.",
      experiences: [
        experience({
          jobTitle: "Warehouse Supervisor",
          employer: "PT Distribusi Elektronik Indonesia",
          location: "Bekasi",
          startDate: "2021-04",
          endDate: "",
          current: true,
          description:
            "• Mengawasi kegiatan inbound, putaway, picking, packing, dan dispatch.\n• Meningkatkan akurasi stok hingga 99,6% melalui cycle count terjadwal.\n• Mengelola briefing, manpower, KPI, dan tindak lanjut kendala harian.\n• Memastikan kepatuhan SOP, 5R, dan keselamatan kerja.",
        }),
        experience({
          jobTitle: "Inventory Control Leader",
          employer: "PT Logistik Utama",
          location: "Karawang",
          startDate: "2018-01",
          endDate: "2021-03",
          description:
            "• Melaksanakan stock opname dan investigasi selisih stok.\n• Membuat laporan stock aging, minus stock, dan slow moving.",
        }),
      ],
      education: [
        education({
          school: "Universitas Pelita Bangsa",
          location: "Bekasi",
          degree: "S1 Manajemen",
          startDate: "2013-09",
          endDate: "2017-08",
          description: "",
        }),
      ],
      showSkillLevel: true,
      skills: [
        skill("Warehouse Operations", 5),
        skill("Inventory Control", 5),
        skill("Stock Opname", 5),
        skill("Team Leadership", 4),
        skill("Microsoft Excel", 4),
        skill("5R & Safety", 4),
      ],
      languages: [
        language("Bahasa Indonesia", "Native"),
        language("English", "Dasar"),
      ],
      hobbies: [hobby("Olahraga")],
      certifications: [
        certification("Warehouse Management Fundamentals", "Logistics Academy", "2023"),
      ],
    },
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    category: "Teknologi",
    badge: "Digital",
    description:
      "Tampilan modern untuk developer, analyst, product, dan profesi digital.",
    accent: "#0d9488",
    tags: ["Teknologi", "Modern", "Skills"],
    design: {
      ...BASE_DESIGN,
      template: "modern",
      primaryColor: "#0d9488",
      fontFamily: "Inter",
      sectionSpacing: 16,
    },
    sampleData: {
      contact: {
        firstName: "Kevin",
        lastName: "Wijaya",
        desiredJob: "Frontend Developer",
        phone: "+62 821 4455 6677",
        email: "kevin.wijaya@email.com",
        address: "Sukajadi",
        city: "Bandung",
        country: "Indonesia",
        postalCode: "40162",
      },
      summary:
        "Frontend Developer dengan pengalaman membangun aplikasi web responsif menggunakan React, JavaScript, dan REST API. Memiliki perhatian tinggi pada kualitas UI, performa, aksesibilitas, dan kolaborasi bersama tim product.",
      experiences: [
        experience({
          jobTitle: "Frontend Developer",
          employer: "PT Aplikasi Digital Indonesia",
          location: "Remote",
          startDate: "2022-07",
          endDate: "",
          current: true,
          description:
            "• Mengembangkan dashboard dan portal pelanggan menggunakan React.\n• Membuat reusable component dan meningkatkan konsistensi design system.\n• Mengoptimalkan performa halaman dan integrasi REST API.\n• Berkolaborasi dengan UI/UX, backend, dan QA dalam agile sprint.",
        }),
        experience({
          jobTitle: "Junior Web Developer",
          employer: "Studio Teknologi Kreatif",
          location: "Bandung",
          startDate: "2020-09",
          endDate: "2022-06",
          description:
            "• Mengembangkan landing page dan website perusahaan.\n• Melakukan maintenance serta perbaikan bug antarmuka.",
        }),
      ],
      education: [
        education({
          school: "Institut Teknologi Nasional",
          location: "Bandung",
          degree: "S1 Informatika",
          startDate: "2016-08",
          endDate: "2020-07",
          description: "",
        }),
      ],
      showSkillLevel: true,
      skills: [
        skill("React", 5),
        skill("JavaScript", 5),
        skill("Tailwind CSS", 4),
        skill("REST API", 4),
        skill("Git", 4),
        skill("Responsive Design", 5),
      ],
      languages: [
        language("Bahasa Indonesia", "Native"),
        language("English", "Profesional"),
      ],
      hobbies: [hobby("Open Source"), hobby("UI Exploration")],
      certifications: [
        certification("React Developer", "Digital Skill Academy", "2023"),
      ],
    },
  },
];

function refreshArrayIds(items) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    ...item,
    id: makeId(),
  }));
}

function normalizeTemplateSample(template) {
  const sample = template?.sampleData || {};

  return {
    ...createBlankCvData(template?.design || {}),
    ...sample,
    contact: {
      ...createBlankCvData().contact,
      ...(sample.contact || {}),
    },
    experiences: refreshArrayIds(sample.experiences),
    education: refreshArrayIds(sample.education),
    skills: refreshArrayIds(sample.skills),
    languages: refreshArrayIds(sample.languages),
    hobbies: refreshArrayIds(sample.hobbies),
    certifications: refreshArrayIds(sample.certifications),
    design: {
      ...BASE_DESIGN,
      ...(template?.design || {}),
      sectionOrder:
        template?.design?.sectionOrder || [...DEFAULT_SECTION_ORDER],
      hiddenSections:
        template?.design?.hiddenSections || [],
    },
    photo: {
      ...BASE_PHOTO,
      ...(sample.photo || {}),
    },
  };
}

export function createTemplateDraft(template, mode = "sample") {
  if (!template) {
    return createBlankCvData();
  }

  if (mode === "design") {
    return createBlankCvData(template.design || {});
  }

  return normalizeTemplateSample(template);
}

export function getTemplateById(templateId) {
  return CV_TEMPLATES.find((template) => template.id === templateId) || null;
}
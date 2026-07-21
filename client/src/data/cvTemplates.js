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

{
  id: "admin-office",
  name: "Admin Office",
  category: "Administrasi",
  badge: "Rapi & Formal",
  description:
    "Template terstruktur untuk admin, sekretaris, document control, dan office support.",
  accent: "#334155",
  tags: ["Administrasi", "Office", "ATS Friendly"],
  design: {
    ...BASE_DESIGN,
    template: "ats",
    primaryColor: "#334155",
    fontFamily: "Arial",
    sectionSpacing: 15,
    pageMargin: 46,
    hiddenSections: ["hobbies"],
  },
  sampleData: {
    contact: {
      firstName: "Ayu",
      lastName: "Lestari",
      desiredJob: "Administration Officer",
      phone: "+62 812 2200 1188",
      email: "ayu.lestari@email.com",
      address: "Kranji",
      city: "Bekasi",
      country: "Indonesia",
      postalCode: "17135",
    },
    summary:
      "Administration Officer dengan pengalaman mengelola dokumen, database, jadwal operasional, pengadaan kebutuhan kantor, serta koordinasi lintas divisi. Teliti, cepat, dan terbiasa menangani pekerjaan dengan volume tinggi.",
    experiences: [
      experience({
        jobTitle: "Administration Officer",
        employer: "PT Sentra Niaga Indonesia",
        location: "Bekasi",
        startDate: "2021-03",
        endDate: "",
        current: true,
        description:
          "• Mengelola lebih dari 1.000 dokumen transaksi setiap bulan.\n• Memperbarui database operasional dan membuat laporan mingguan.\n• Menangani pengadaan ATK, agenda rapat, dan arsip kontrak.",
      }),
      experience({
        jobTitle: "Admin Staff",
        employer: "PT Mitra Solusi Bersama",
        location: "Jakarta",
        startDate: "2018-08",
        endDate: "2021-02",
        description:
          "• Memproses input data, surat-menyurat, dan rekap absensi.\n• Mendukung kebutuhan administratif tim sales dan operasional.",
      }),
    ],
    education: [
      education({
        school: "Universitas Bina Sarana Informatika",
        location: "Bekasi",
        degree: "D3 Administrasi Perkantoran",
        startDate: "2015-09",
        endDate: "2018-07",
        description: "",
      }),
    ],
    showSkillLevel: false,
    skills: [
      skill("Microsoft Excel", 5),
      skill("Document Control", 5),
      skill("Data Entry", 5),
      skill("Google Workspace", 4),
      skill("Office Administration", 5),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Dasar"),
    ],
    hobbies: [],
    certifications: [
      certification("Microsoft Office Specialist", "Skill Academy", "2023"),
    ],
  },
},
{
  id: "sales-achiever",
  name: "Sales Achiever",
  category: "Sales & Marketing",
  badge: "Target Oriented",
  description:
    "Menonjolkan pencapaian penjualan, pertumbuhan revenue, dan hubungan pelanggan.",
  accent: "#dc2626",
  tags: ["Sales", "Revenue", "Achievement"],
  design: {
    ...BASE_DESIGN,
    template: "executive",
    primaryColor: "#dc2626",
    fontFamily: "Inter",
    sectionSpacing: 17,
  },
  sampleData: {
    contact: {
      firstName: "Fajar",
      lastName: "Ramadhan",
      desiredJob: "Senior Sales Executive",
      phone: "+62 811 7000 2299",
      email: "fajar.ramadhan@email.com",
      address: "Kelapa Gading",
      city: "Jakarta Utara",
      country: "Indonesia",
      postalCode: "14240",
    },
    summary:
      "Senior Sales Executive dengan pengalaman 6 tahun dalam B2B sales, account management, negosiasi, dan pengembangan wilayah. Konsisten melampaui target serta mampu membangun hubungan jangka panjang dengan pelanggan strategis.",
    experiences: [
      experience({
        jobTitle: "Senior Sales Executive",
        employer: "PT Prima Bisnis Nusantara",
        location: "Jakarta",
        startDate: "2021-01",
        endDate: "",
        current: true,
        description:
          "• Mencapai 118% target tahunan selama dua tahun berturut-turut.\n• Mengembangkan 25 akun korporasi baru dengan nilai kontrak Rp4,2 miliar.\n• Meningkatkan repeat order melalui program account review.",
      }),
      experience({
        jobTitle: "Sales Representative",
        employer: "PT Distribusi Sukses Mandiri",
        location: "Tangerang",
        startDate: "2018-03",
        endDate: "2020-12",
        description:
          "• Mengelola area penjualan Jabodetabek.\n• Menyusun pipeline, forecast, dan laporan penjualan mingguan.",
      }),
    ],
    education: [
      education({
        school: "Universitas Mercu Buana",
        location: "Jakarta",
        degree: "S1 Manajemen Pemasaran",
        startDate: "2013-09",
        endDate: "2017-08",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("B2B Sales", 5),
      skill("Negotiation", 5),
      skill("Account Management", 5),
      skill("Sales Forecasting", 4),
      skill("CRM", 4),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Profesional"),
    ],
    hobbies: [hobby("Networking"), hobby("Futsal")],
    certifications: [
      certification("Professional Selling Skills", "Sales Academy", "2022"),
    ],
  },
},
{
  id: "digital-marketing",
  name: "Digital Marketing",
  category: "Sales & Marketing",
  badge: "Growth",
  description:
    "Cocok untuk performance marketing, social media, content, dan brand campaign.",
  accent: "#db2777",
  tags: ["Digital Marketing", "Campaign", "Analytics"],
  design: {
    ...BASE_DESIGN,
    template: "modern",
    primaryColor: "#db2777",
    fontFamily: "Inter",
    sectionSpacing: 16,
  },
  sampleData: {
    contact: {
      firstName: "Citra",
      lastName: "Maharani",
      desiredJob: "Digital Marketing Specialist",
      phone: "+62 857 3322 1100",
      email: "citra.maharani@email.com",
      address: "Setiabudi",
      city: "Bandung",
      country: "Indonesia",
      postalCode: "40143",
    },
    summary:
      "Digital Marketing Specialist dengan pengalaman mengelola kampanye berbayar, media sosial, content planning, dan analisis funnel. Terbiasa mengoptimalkan biaya akuisisi serta meningkatkan engagement dan conversion.",
    experiences: [
      experience({
        jobTitle: "Digital Marketing Specialist",
        employer: "PT Brand Kreatif Indonesia",
        location: "Bandung",
        startDate: "2022-02",
        endDate: "",
        current: true,
        description:
          "• Mengelola budget iklan digital Rp250 juta per bulan.\n• Menurunkan cost per lead sebesar 24% melalui optimasi campaign.\n• Meningkatkan organic engagement Instagram sebesar 63%.",
      }),
      experience({
        jobTitle: "Social Media Officer",
        employer: "Studio Komunikasi Digital",
        location: "Bandung",
        startDate: "2019-08",
        endDate: "2022-01",
        description:
          "• Menyusun kalender konten dan laporan performa bulanan.\n• Berkolaborasi dengan desainer dan copywriter untuk kampanye brand.",
      }),
    ],
    education: [
      education({
        school: "Universitas Telkom",
        location: "Bandung",
        degree: "S1 Ilmu Komunikasi",
        startDate: "2015-08",
        endDate: "2019-07",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("Meta Ads", 5),
      skill("Google Ads", 4),
      skill("Content Strategy", 5),
      skill("Google Analytics", 4),
      skill("Social Media", 5),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Profesional"),
    ],
    hobbies: [hobby("Photography"), hobby("Trend Research")],
    certifications: [
      certification("Google Analytics Certification", "Google", "2024"),
    ],
  },
},
{
  id: "customer-service",
  name: "Customer Service",
  category: "Customer Service",
  badge: "Service Excellence",
  description:
    "Tampilan ramah dan profesional untuk customer service, call center, dan frontliner.",
  accent: "#0284c7",
  tags: ["Customer Service", "Communication", "Frontliner"],
  design: {
    ...BASE_DESIGN,
    template: "minimal",
    primaryColor: "#0284c7",
    fontFamily: "Inter",
    sectionSpacing: 16,
  },
  sampleData: {
    contact: {
      firstName: "Rina",
      lastName: "Kusuma",
      desiredJob: "Customer Service Representative",
      phone: "+62 813 9900 3377",
      email: "rina.kusuma@email.com",
      address: "Margonda",
      city: "Depok",
      country: "Indonesia",
      postalCode: "16424",
    },
    summary:
      "Customer Service Representative berpengalaman menangani pertanyaan, keluhan, dan kebutuhan pelanggan melalui telepon, chat, serta email. Memiliki komunikasi yang baik, empati tinggi, dan fokus pada penyelesaian masalah.",
    experiences: [
      experience({
        jobTitle: "Customer Service Representative",
        employer: "PT Layanan Digital Nusantara",
        location: "Depok",
        startDate: "2021-05",
        endDate: "",
        current: true,
        description:
          "• Menangani rata-rata 80 interaksi pelanggan per hari.\n• Mempertahankan skor kepuasan pelanggan di atas 94%.\n• Menyelesaikan eskalasi dan membuat laporan tren keluhan.",
      }),
      experience({
        jobTitle: "Frontliner",
        employer: "PT Retail Sejahtera",
        location: "Jakarta",
        startDate: "2019-01",
        endDate: "2021-04",
        description:
          "• Memberikan informasi produk dan layanan kepada pelanggan.\n• Menangani administrasi transaksi serta komplain langsung.",
      }),
    ],
    education: [
      education({
        school: "Universitas Pancasila",
        location: "Jakarta",
        degree: "S1 Ilmu Komunikasi",
        startDate: "2014-09",
        endDate: "2018-08",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("Customer Handling", 5),
      skill("Complaint Resolution", 5),
      skill("Communication", 5),
      skill("CRM", 4),
      skill("Data Entry", 4),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Menengah"),
    ],
    hobbies: [hobby("Membaca"), hobby("Volunteer")],
    certifications: [
      certification("Service Excellence", "Customer Experience Institute", "2023"),
    ],
  },
},
{
  id: "graphic-designer",
  name: "Creative Designer",
  category: "Creative",
  badge: "Portfolio Ready",
  description:
    "Desain modern untuk graphic designer, UI designer, content creator, dan creative talent.",
  accent: "#7c3aed",
  tags: ["Creative", "Design", "Portfolio"],
  design: {
    ...BASE_DESIGN,
    template: "modern",
    primaryColor: "#7c3aed",
    fontFamily: "Inter",
    sectionSpacing: 17,
  },
  sampleData: {
    contact: {
      firstName: "Bagas",
      lastName: "Prakoso",
      desiredJob: "Graphic Designer",
      phone: "+62 821 5522 4400",
      email: "bagas.prakoso@email.com",
      address: "Sleman",
      city: "Yogyakarta",
      country: "Indonesia",
      postalCode: "55281",
    },
    summary:
      "Graphic Designer dengan pengalaman membuat identitas visual, konten media sosial, materi promosi, dan kampanye digital. Menggabungkan kreativitas dengan konsistensi brand serta kebutuhan bisnis.",
    experiences: [
      experience({
        jobTitle: "Graphic Designer",
        employer: "Studio Visual Nusantara",
        location: "Yogyakarta",
        startDate: "2021-06",
        endDate: "",
        current: true,
        description:
          "• Membuat lebih dari 300 aset visual untuk kampanye digital.\n• Mengembangkan brand guideline untuk 12 klien.\n• Berkolaborasi dengan marketing dan content team.",
      }),
      experience({
        jobTitle: "Junior Designer",
        employer: "Kreasi Media Jogja",
        location: "Yogyakarta",
        startDate: "2019-02",
        endDate: "2021-05",
        description:
          "• Mendesain materi promosi, presentasi, dan konten sosial media.\n• Menyiapkan file final untuk kebutuhan digital dan cetak.",
      }),
    ],
    education: [
      education({
        school: "Institut Seni Indonesia",
        location: "Yogyakarta",
        degree: "S1 Desain Komunikasi Visual",
        startDate: "2014-08",
        endDate: "2018-07",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("Adobe Illustrator", 5),
      skill("Adobe Photoshop", 5),
      skill("Figma", 4),
      skill("Brand Identity", 5),
      skill("Layout Design", 4),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Menengah"),
    ],
    hobbies: [hobby("Illustration"), hobby("Photography")],
    certifications: [
      certification("Visual Branding", "Design Academy", "2023"),
    ],
  },
},
{
  id: "registered-nurse",
  name: "Healthcare Professional",
  category: "Kesehatan",
  badge: "Clinical",
  description:
    "Struktur ATS untuk perawat, tenaga kesehatan, klinik, dan rumah sakit.",
  accent: "#0f766e",
  tags: ["Kesehatan", "Perawat", "ATS Friendly"],
  design: {
    ...BASE_DESIGN,
    template: "ats",
    primaryColor: "#0f766e",
    fontFamily: "Arial",
    sectionSpacing: 15,
    pageMargin: 46,
    hiddenSections: ["hobbies"],
  },
  sampleData: {
    contact: {
      firstName: "Dewi",
      lastName: "Anggraini",
      desiredJob: "Registered Nurse",
      phone: "+62 812 8877 6655",
      email: "dewi.anggraini@email.com",
      address: "Cempaka Putih",
      city: "Jakarta Pusat",
      country: "Indonesia",
      postalCode: "10510",
    },
    summary:
      "Perawat profesional dengan pengalaman pada pelayanan rawat inap, monitoring kondisi pasien, administrasi medis, dan edukasi keluarga. Memiliki STR aktif, komunikasi empatik, dan disiplin tinggi terhadap keselamatan pasien.",
    experiences: [
      experience({
        jobTitle: "Staff Nurse",
        employer: "Rumah Sakit Harapan Sehat",
        location: "Jakarta",
        startDate: "2020-01",
        endDate: "",
        current: true,
        description:
          "• Memberikan asuhan keperawatan kepada pasien rawat inap.\n• Melakukan monitoring tanda vital dan dokumentasi rekam medis.\n• Berkoordinasi dengan dokter dan tenaga kesehatan lainnya.",
      }),
      experience({
        jobTitle: "Nurse Assistant",
        employer: "Klinik Medika Utama",
        location: "Bekasi",
        startDate: "2018-07",
        endDate: "2019-12",
        description:
          "• Membantu pemeriksaan awal pasien dan persiapan tindakan medis.\n• Mengelola persediaan alat kesehatan dan administrasi pelayanan.",
      }),
    ],
    education: [
      education({
        school: "Poltekkes Kemenkes Jakarta",
        location: "Jakarta",
        degree: "D3 Keperawatan",
        startDate: "2015-08",
        endDate: "2018-06",
        description: "",
      }),
    ],
    showSkillLevel: false,
    skills: [
      skill("Patient Care", 5),
      skill("Vital Sign Monitoring", 5),
      skill("Medical Documentation", 4),
      skill("Basic Life Support", 5),
      skill("Patient Education", 4),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Menengah"),
    ],
    hobbies: [],
    certifications: [
      certification("Basic Life Support", "AHA Training Center", "2024"),
    ],
  },
},
{
  id: "teacher-educator",
  name: "Teacher & Educator",
  category: "Pendidikan",
  badge: "Education",
  description:
    "Cocok untuk guru, tutor, trainer, dan tenaga pendidikan.",
  accent: "#1d4ed8",
  tags: ["Pendidikan", "Guru", "Training"],
  design: {
    ...BASE_DESIGN,
    template: "minimal",
    primaryColor: "#1d4ed8",
    fontFamily: "Georgia",
    sectionSpacing: 18,
  },
  sampleData: {
    contact: {
      firstName: "Lukman",
      lastName: "Hakim",
      desiredJob: "Mathematics Teacher",
      phone: "+62 856 2211 0033",
      email: "lukman.hakim@email.com",
      address: "Cimahi Tengah",
      city: "Cimahi",
      country: "Indonesia",
      postalCode: "40523",
    },
    summary:
      "Guru Matematika dengan pengalaman mengajar tingkat SMP dan SMA, menyusun modul pembelajaran, melakukan asesmen, serta mendampingi siswa dalam persiapan ujian. Mengutamakan pembelajaran yang sistematis dan mudah dipahami.",
    experiences: [
      experience({
        jobTitle: "Mathematics Teacher",
        employer: "SMA Cendekia Mandiri",
        location: "Bandung",
        startDate: "2019-07",
        endDate: "",
        current: true,
        description:
          "• Mengajar Matematika untuk kelas X–XII.\n• Menyusun modul, asesmen, dan program remedial.\n• Membimbing tim olimpiade matematika sekolah.",
      }),
      experience({
        jobTitle: "Private Tutor",
        employer: "Bimbingan Belajar Prestasi",
        location: "Bandung",
        startDate: "2017-01",
        endDate: "2019-06",
        description:
          "• Mengajar siswa SMP dan SMA secara individu dan kelompok.\n• Membuat evaluasi perkembangan belajar bulanan.",
      }),
    ],
    education: [
      education({
        school: "Universitas Pendidikan Indonesia",
        location: "Bandung",
        degree: "S1 Pendidikan Matematika",
        startDate: "2012-08",
        endDate: "2016-07",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("Lesson Planning", 5),
      skill("Classroom Management", 5),
      skill("Assessment", 4),
      skill("Public Speaking", 4),
      skill("Microsoft Office", 4),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Menengah"),
    ],
    hobbies: [hobby("Membaca"), hobby("Educational Content")],
    certifications: [
      certification("Pendidikan Profesi Guru", "Kemendikbud", "2021"),
    ],
  },
},
{
  id: "hospitality-service",
  name: "Hospitality Service",
  category: "Hospitality",
  badge: "Guest Experience",
  description:
    "Elegan untuk hotel, restoran, front office, housekeeping, dan F&B service.",
  accent: "#92400e",
  tags: ["Hospitality", "Hotel", "Service"],
  design: {
    ...BASE_DESIGN,
    template: "executive",
    primaryColor: "#92400e",
    fontFamily: "Georgia",
    sectionSpacing: 18,
  },
  sampleData: {
    contact: {
      firstName: "Maya",
      lastName: "Permata",
      desiredJob: "Front Office Supervisor",
      phone: "+62 878 5566 1122",
      email: "maya.permata@email.com",
      address: "Kuta",
      city: "Badung",
      country: "Indonesia",
      postalCode: "80361",
    },
    summary:
      "Front Office Supervisor dengan pengalaman di industri perhotelan, pelayanan tamu, reservasi, complaint handling, dan koordinasi shift. Berorientasi pada service excellence serta konsistensi standar operasional.",
    experiences: [
      experience({
        jobTitle: "Front Office Supervisor",
        employer: "Nusantara Grand Hotel",
        location: "Bali",
        startDate: "2021-10",
        endDate: "",
        current: true,
        description:
          "• Mengawasi operasional front desk dan koordinasi shift.\n• Menjaga guest satisfaction score di atas 92%.\n• Menangani complaint dan kebutuhan VIP guest.",
      }),
      experience({
        jobTitle: "Guest Service Agent",
        employer: "Sunset Resort Bali",
        location: "Bali",
        startDate: "2018-05",
        endDate: "2021-09",
        description:
          "• Menangani check-in, check-out, reservasi, dan informasi tamu.\n• Berkoordinasi dengan housekeeping dan concierge.",
      }),
    ],
    education: [
      education({
        school: "Sekolah Tinggi Pariwisata Bali",
        location: "Bali",
        degree: "D4 Manajemen Perhotelan",
        startDate: "2014-08",
        endDate: "2018-04",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("Guest Relations", 5),
      skill("Complaint Handling", 5),
      skill("Hotel PMS", 4),
      skill("Team Coordination", 4),
      skill("English Communication", 5),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Profesional"),
    ],
    hobbies: [hobby("Travel"), hobby("Culinary")],
    certifications: [
      certification("Hospitality Service Excellence", "Hospitality Academy", "2023"),
    ],
  },
},
{
  id: "civil-engineer",
  name: "Engineering Pro",
  category: "Engineering",
  badge: "Technical",
  description:
    "Tampilan tegas untuk engineer, project site, maintenance, dan technical specialist.",
  accent: "#475569",
  tags: ["Engineering", "Project", "Technical"],
  design: {
    ...BASE_DESIGN,
    template: "executive",
    primaryColor: "#475569",
    fontFamily: "Inter",
    sectionSpacing: 17,
  },
  sampleData: {
    contact: {
      firstName: "Arif",
      lastName: "Setiawan",
      desiredJob: "Civil Engineer",
      phone: "+62 813 4455 8811",
      email: "arif.setiawan@email.com",
      address: "Rungkut",
      city: "Surabaya",
      country: "Indonesia",
      postalCode: "60293",
    },
    summary:
      "Civil Engineer dengan pengalaman pada proyek gedung, pengawasan lapangan, estimasi biaya, quality control, dan koordinasi kontraktor. Terbiasa memastikan pekerjaan sesuai gambar, spesifikasi, jadwal, dan standar keselamatan.",
    experiences: [
      experience({
        jobTitle: "Site Engineer",
        employer: "PT Konstruksi Utama Nasional",
        location: "Surabaya",
        startDate: "2020-04",
        endDate: "",
        current: true,
        description:
          "• Mengawasi progres konstruksi gedung komersial.\n• Memeriksa kualitas pekerjaan dan kesesuaian shop drawing.\n• Menyusun progress report serta koordinasi vendor dan subkontraktor.",
      }),
      experience({
        jobTitle: "Junior Civil Engineer",
        employer: "PT Bangun Cipta Persada",
        location: "Sidoarjo",
        startDate: "2017-08",
        endDate: "2020-03",
        description:
          "• Membantu quantity take-off dan estimasi material.\n• Melakukan inspeksi lapangan serta dokumentasi pekerjaan.",
      }),
    ],
    education: [
      education({
        school: "Institut Teknologi Sepuluh Nopember",
        location: "Surabaya",
        degree: "S1 Teknik Sipil",
        startDate: "2013-08",
        endDate: "2017-07",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("AutoCAD", 5),
      skill("Project Supervision", 5),
      skill("Quantity Take-Off", 4),
      skill("Quality Control", 5),
      skill("Microsoft Project", 4),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Menengah"),
    ],
    hobbies: [hobby("Cycling")],
    certifications: [
      certification("Ahli Muda Teknik Bangunan Gedung", "LPJK", "2023"),
    ],
  },
},
{
  id: "data-analyst",
  name: "Data Analyst",
  category: "Teknologi",
  badge: "Data Driven",
  description:
    "ATS-modern untuk data analyst, BI analyst, reporting, dan business intelligence.",
  accent: "#2563eb",
  tags: ["Data", "Analytics", "Business Intelligence"],
  design: {
    ...BASE_DESIGN,
    template: "ats",
    primaryColor: "#2563eb",
    fontFamily: "Arial",
    sectionSpacing: 15,
    pageMargin: 46,
    hiddenSections: ["hobbies"],
  },
  sampleData: {
    contact: {
      firstName: "Naufal",
      lastName: "Akbar",
      desiredJob: "Data Analyst",
      phone: "+62 812 3333 4499",
      email: "naufal.akbar@email.com",
      address: "Pancoran",
      city: "Jakarta Selatan",
      country: "Indonesia",
      postalCode: "12780",
    },
    summary:
      "Data Analyst dengan pengalaman mengolah data operasional dan komersial, membuat dashboard, melakukan analisis tren, serta menerjemahkan data menjadi rekomendasi bisnis yang dapat ditindaklanjuti.",
    experiences: [
      experience({
        jobTitle: "Data Analyst",
        employer: "PT Insight Digital Indonesia",
        location: "Jakarta",
        startDate: "2022-01",
        endDate: "",
        current: true,
        description:
          "• Membuat dashboard performa menggunakan Power BI.\n• Mengotomasi laporan mingguan dan mengurangi waktu proses sebesar 60%.\n• Melakukan analisis customer behavior untuk mendukung strategi produk.",
      }),
      experience({
        jobTitle: "Reporting Analyst",
        employer: "PT Layanan Finansial Nusantara",
        location: "Jakarta",
        startDate: "2019-06",
        endDate: "2021-12",
        description:
          "• Menyusun laporan KPI dan analisis variance bulanan.\n• Membersihkan dan menggabungkan data dari berbagai sumber.",
      }),
    ],
    education: [
      education({
        school: "Universitas Indonesia",
        location: "Depok",
        degree: "S1 Statistika",
        startDate: "2015-08",
        endDate: "2019-07",
        description: "",
      }),
    ],
    showSkillLevel: false,
    skills: [
      skill("SQL", 5),
      skill("Power BI", 5),
      skill("Microsoft Excel", 5),
      skill("Python", 4),
      skill("Data Visualization", 5),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Profesional"),
    ],
    hobbies: [],
    certifications: [
      certification("Microsoft Power BI Data Analyst", "Microsoft", "2024"),
    ],
  },
},
{
  id: "retail-supervisor",
  name: "Retail Supervisor",
  category: "Operasional",
  badge: "Store Leader",
  description:
    "Untuk store supervisor, retail operations, merchandiser, dan kepala toko.",
  accent: "#ea580c",
  tags: ["Retail", "Store", "Leadership"],
  design: {
    ...BASE_DESIGN,
    template: "modern",
    primaryColor: "#ea580c",
    fontFamily: "Inter",
    sectionSpacing: 17,
  },
  sampleData: {
    contact: {
      firstName: "Yusuf",
      lastName: "Maulana",
      desiredJob: "Retail Store Supervisor",
      phone: "+62 857 7788 1155",
      email: "yusuf.maulana@email.com",
      address: "Bogor Barat",
      city: "Bogor",
      country: "Indonesia",
      postalCode: "16116",
    },
    summary:
      "Retail Store Supervisor dengan pengalaman mengelola operasional toko, pencapaian sales, stok, visual merchandising, pelayanan pelanggan, dan pengembangan tim. Terbiasa bekerja berdasarkan target dan SOP.",
    experiences: [
      experience({
        jobTitle: "Store Supervisor",
        employer: "PT Retail Modern Indonesia",
        location: "Bogor",
        startDate: "2020-08",
        endDate: "",
        current: true,
        description:
          "• Memimpin 18 anggota tim operasional toko.\n• Meningkatkan pencapaian sales tahunan sebesar 17%.\n• Mengontrol stok, shrinkage, cash handling, dan visual display.",
      }),
      experience({
        jobTitle: "Senior Sales Associate",
        employer: "PT Gaya Retail Nusantara",
        location: "Depok",
        startDate: "2017-03",
        endDate: "2020-07",
        description:
          "• Memberikan pelayanan pelanggan dan rekomendasi produk.\n• Membantu onboarding serta coaching staf baru.",
      }),
    ],
    education: [
      education({
        school: "Universitas Ibn Khaldun",
        location: "Bogor",
        degree: "S1 Manajemen",
        startDate: "2012-09",
        endDate: "2016-08",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("Store Operations", 5),
      skill("Sales Leadership", 5),
      skill("Inventory Control", 4),
      skill("Visual Merchandising", 4),
      skill("Customer Service", 5),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Dasar"),
    ],
    hobbies: [hobby("Olahraga")],
    certifications: [
      certification("Retail Store Management", "Retail Academy", "2022"),
    ],
  },
},
{
  id: "procurement-specialist",
  name: "Procurement Specialist",
  category: "Profesional",
  badge: "Supply Chain",
  description:
    "Profesional untuk purchasing, procurement, vendor management, dan supply chain.",
  accent: "#0369a1",
  tags: ["Procurement", "Purchasing", "Vendor"],
  design: {
    ...BASE_DESIGN,
    template: "ats",
    primaryColor: "#0369a1",
    fontFamily: "Arial",
    sectionSpacing: 15,
    pageMargin: 46,
    hiddenSections: ["hobbies"],
  },
  sampleData: {
    contact: {
      firstName: "Intan",
      lastName: "Puspita",
      desiredJob: "Procurement Specialist",
      phone: "+62 811 4455 2299",
      email: "intan.puspita@email.com",
      address: "Cawang",
      city: "Jakarta Timur",
      country: "Indonesia",
      postalCode: "13630",
    },
    summary:
      "Procurement Specialist dengan pengalaman dalam sourcing, negosiasi vendor, purchase order, analisis harga, dan monitoring delivery. Berhasil meningkatkan efisiensi biaya tanpa mengurangi kualitas dan service level.",
    experiences: [
      experience({
        jobTitle: "Procurement Specialist",
        employer: "PT Industri Solusi Indonesia",
        location: "Jakarta",
        startDate: "2020-02",
        endDate: "",
        current: true,
        description:
          "• Mengelola pengadaan barang dan jasa untuk kebutuhan operasional.\n• Menurunkan biaya pembelian sebesar 12% melalui tender dan negosiasi.\n• Melakukan evaluasi vendor dan monitoring lead time.",
      }),
      experience({
        jobTitle: "Purchasing Staff",
        employer: "PT Manufaktur Prima",
        location: "Bekasi",
        startDate: "2017-06",
        endDate: "2020-01",
        description:
          "• Memproses purchase request dan purchase order.\n• Membandingkan penawaran serta menindaklanjuti pengiriman vendor.",
      }),
    ],
    education: [
      education({
        school: "Universitas Negeri Jakarta",
        location: "Jakarta",
        degree: "S1 Manajemen",
        startDate: "2013-08",
        endDate: "2017-05",
        description: "",
      }),
    ],
    showSkillLevel: false,
    skills: [
      skill("Vendor Management", 5),
      skill("Negotiation", 5),
      skill("Sourcing", 5),
      skill("Cost Analysis", 4),
      skill("Purchase Order", 5),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Profesional"),
    ],
    hobbies: [],
    certifications: [
      certification("Procurement Management", "Supply Chain Academy", "2023"),
    ],
  },
},
{
  id: "hr-recruitment",
  name: "HR & Recruitment",
  category: "Human Resources",
  badge: "People Focused",
  description:
    "Cocok untuk recruiter, HR generalist, people operations, dan talent acquisition.",
  accent: "#9333ea",
  tags: ["HR", "Recruitment", "People"],
  design: {
    ...BASE_DESIGN,
    template: "minimal",
    primaryColor: "#9333ea",
    fontFamily: "Inter",
    sectionSpacing: 17,
  },
  sampleData: {
    contact: {
      firstName: "Shafira",
      lastName: "Aulia",
      desiredJob: "Talent Acquisition Specialist",
      phone: "+62 812 6644 3399",
      email: "shafira.aulia@email.com",
      address: "Alam Sutera",
      city: "Tangerang Selatan",
      country: "Indonesia",
      postalCode: "15325",
    },
    summary:
      "Talent Acquisition Specialist dengan pengalaman end-to-end recruitment, employer branding, onboarding, dan pengelolaan kandidat. Terbiasa menangani kebutuhan hiring dalam jumlah besar maupun posisi spesialis.",
    experiences: [
      experience({
        jobTitle: "Talent Acquisition Specialist",
        employer: "PT Talenta Digital Nusantara",
        location: "Tangerang",
        startDate: "2021-09",
        endDate: "",
        current: true,
        description:
          "• Menangani rata-rata 25 posisi aktif setiap bulan.\n• Mempercepat time-to-hire sebesar 20% melalui perbaikan sourcing.\n• Menjalankan interview, offering, dan onboarding kandidat.",
      }),
      experience({
        jobTitle: "HR Recruitment Staff",
        employer: "PT Sumber Daya Mandiri",
        location: "Jakarta",
        startDate: "2018-07",
        endDate: "2021-08",
        description:
          "• Melakukan screening CV, penjadwalan, dan administrasi kandidat.\n• Mendukung job fair dan program employer branding.",
      }),
    ],
    education: [
      education({
        school: "Universitas Atma Jaya",
        location: "Jakarta",
        degree: "S1 Psikologi",
        startDate: "2014-08",
        endDate: "2018-06",
        description: "",
      }),
    ],
    showSkillLevel: true,
    skills: [
      skill("Talent Acquisition", 5),
      skill("Interviewing", 5),
      skill("Sourcing", 5),
      skill("Employer Branding", 4),
      skill("HR Administration", 4),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Profesional"),
    ],
    hobbies: [hobby("Community"), hobby("Reading")],
    certifications: [
      certification("Certified Recruitment Specialist", "HR Institute", "2023"),
    ],
  },
},
{
  id: "finance-analyst",
  name: "Finance Analyst",
  category: "Finance",
  badge: "Numbers",
  description:
    "Profesional dan ATS-friendly untuk finance analyst, budgeting, dan accounting.",
  accent: "#166534",
  tags: ["Finance", "Budgeting", "Analysis"],
  design: {
    ...BASE_DESIGN,
    template: "ats",
    primaryColor: "#166534",
    fontFamily: "Arial",
    sectionSpacing: 15,
    pageMargin: 46,
    hiddenSections: ["hobbies"],
  },
  sampleData: {
    contact: {
      firstName: "Reza",
      lastName: "Mahendra",
      desiredJob: "Financial Analyst",
      phone: "+62 813 2200 5566",
      email: "reza.mahendra@email.com",
      address: "Grogol",
      city: "Jakarta Barat",
      country: "Indonesia",
      postalCode: "11450",
    },
    summary:
      "Financial Analyst dengan pengalaman dalam budgeting, forecasting, management reporting, dan analisis varians. Mampu mengolah data keuangan menjadi insight untuk mendukung pengambilan keputusan bisnis.",
    experiences: [
      experience({
        jobTitle: "Financial Analyst",
        employer: "PT Investasi Nusantara",
        location: "Jakarta",
        startDate: "2021-01",
        endDate: "",
        current: true,
        description:
          "• Menyusun budget tahunan dan rolling forecast.\n• Membuat laporan profitabilitas serta analisis varians bulanan.\n• Mengembangkan dashboard monitoring biaya operasional.",
      }),
      experience({
        jobTitle: "Finance Staff",
        employer: "PT Konsumen Prima",
        location: "Tangerang",
        startDate: "2018-04",
        endDate: "2020-12",
        description:
          "• Melakukan rekonsiliasi dan penyusunan laporan keuangan.\n• Mendukung proses audit dan closing bulanan.",
      }),
    ],
    education: [
      education({
        school: "Universitas Tarumanagara",
        location: "Jakarta",
        degree: "S1 Akuntansi",
        startDate: "2013-08",
        endDate: "2017-07",
        description: "",
      }),
    ],
    showSkillLevel: false,
    skills: [
      skill("Financial Modeling", 5),
      skill("Budgeting", 5),
      skill("Forecasting", 4),
      skill("Microsoft Excel", 5),
      skill("Management Reporting", 5),
    ],
    languages: [
      language("Bahasa Indonesia", "Native"),
      language("English", "Profesional"),
    ],
    hobbies: [],
    certifications: [
      certification("Financial Modeling & Valuation", "Finance Academy", "2024"),
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

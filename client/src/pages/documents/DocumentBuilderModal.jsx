// CK-DOC-01-SAFE-V2
import { useEffect, useMemo, useState } from "react";
import { saveKilatDocsDraft } from "../../lib/kilatDocsDraftService";
import { getKilatDocsTemplateProfile } from "../../data/kilatDocsTemplateProfiles";

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

// CK-DOC-05B-V6-SAFE
function detectDraftType(document) {
  return getKilatDocsTemplateProfile(document).templateType;
}

function createMetaBlock(document, formData) {
  const draftType = detectDraftType(document);
  const nomor = findValue(formData, ["nomor surat", "nomor dokumen", "nomor invoice", "nomor klaim", "nomor polis", "nomor"]);
  const tanggal = findValue(formData, ["tanggal", "tanggal efektif", "tanggal kejadian", "tanggal berobat"]);
  const pihakPertama = findValue(formData, ["pihak pertama", "pengirim", "pemohon", "pemberi", "penagih", "perusahaan", "pengundang"]);
  const pihakKedua = findValue(formData, ["pihak kedua", "penerima", "termohon", "customer", "pembayar"]);
  const namaKaryawan = findValue(formData, ["nama karyawan", "karyawan"]);
  const jabatan = findValue(formData, ["jabatan", "posisi", "status kerja"]);
  const lokasi = findValue(formData, ["lokasi", "alamat", "tempat", "fasilitas kesehatan"]);
  const pasien = findValue(formData, ["nama pasien", "pasien", "nomor pasien"]);
  const pic = findValue(formData, ["pic", "penanggung jawab", "approval", "pemberi tugas"]);
  const keperluan = findValue(formData, ["keperluan", "tujuan", "maksud"]);
  const perihal = document?.title || "Dokumen";

  if (draftType === "sop") return [
    `Dokumen         : ${perihal}`,
    `Tanggal Berlaku : ${tanggal || "[isi tanggal berlaku jika ada]"}`,
    `PIC             : ${pic || "[isi PIC/penanggung jawab]"}`,
  ];

  if (draftType === "warehouse") return [
    `Dokumen : ${perihal}`,
    `Tanggal : ${tanggal || "[isi tanggal]"}`,
    `Lokasi  : ${lokasi || "[isi lokasi jika relevan]"}`,
    `PIC     : ${pic || pihakPertama || "[isi PIC/pihak terkait]"}`,
  ];

  if (draftType === "hr") return [
    `Dokumen  : ${perihal}`,
    `Tanggal  : ${tanggal || "[isi tanggal]"}`,
    `Karyawan : ${namaKaryawan || pihakKedua || pihakPertama || "[isi nama karyawan]"}`,
    `Jabatan  : ${jabatan || "[isi jabatan/posisi jika relevan]"}`,
  ];

  if (draftType === "asuransi") return [
    `Perihal           : ${perihal}`,
    `Nomor Polis/Klaim : ${nomor || "[isi nomor polis/klaim jika ada]"}`,
    `Tanggal           : ${tanggal || "[isi tanggal]"}`,
    `Pemohon           : ${pihakPertama || "[isi pemohon/pemegang polis]"}`,
  ];

  if (draftType === "bisnis") return [
    `Dokumen       : ${perihal}`,
    `Tanggal       : ${tanggal || "[isi tanggal]"}`,
    `Pihak Pertama : ${pihakPertama || "[isi pihak pertama]"}`,
    `Pihak Kedua   : ${pihakKedua || "[isi pihak kedua/customer]"}`,
  ];

  if (draftType === "klinik") return [
    `Dokumen   : ${perihal}`,
    `Tanggal   : ${tanggal || "[isi tanggal]"}`,
    `Pasien    : ${pasien || "[isi pasien jika relevan]"}`,
    `Fasilitas : ${lokasi || "[isi fasilitas kesehatan jika relevan]"}`,
  ];

  if (draftType === "pribadi") return [
    `Dokumen   : ${perihal}`,
    `Tanggal   : ${tanggal || "[isi tanggal]"}`,
    `Nama      : ${pihakPertama || "[isi nama pembuat]"}`,
    `Keperluan : ${keperluan || document?.useCase || "[isi keperluan]"}`,
  ];

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
  const pihakPertama = findValue(formData, ["pihak pertama", "pengirim", "pemohon", "nama pemberi", "perusahaan", "pemberi", "pengundang"]);
  const pihakKedua = findValue(formData, ["pihak kedua", "penerima", "termohon", "nama penerima", "customer", "pembayar"]);
  const kronologi = findValue(formData, ["kronologi", "latar belakang", "deskripsi", "uraian", "alasan", "keterangan"]);
  const nominal = findValue(formData, ["nominal", "jumlah", "tagihan", "biaya", "nilai", "harga", "penghasilan", "qty"]);
  const batasWaktu = findValue(formData, ["batas waktu", "deadline", "tenggat", "jatuh tempo", "tanggal efektif"]);
  const barang = findValue(formData, ["barang", "produk", "unit", "aset", "imei", "sku", "item", "daftar barang"]);
  const lokasi = findValue(formData, ["lokasi", "alamat", "tempat", "fasilitas kesehatan"]);
  const bukti = findValue(formData, ["bukti", "lampiran", "dokumen pendukung", "dokumen"]);
  const jabatan = findValue(formData, ["jabatan", "posisi", "divisi", "status kerja"]);
  const periode = findValue(formData, ["periode", "masa", "tanggal cuti", "masa tugas", "jangka waktu"]);
  const polis = findValue(formData, ["nomor polis", "polis", "nomor klaim"]);
  const pasien = findValue(formData, ["nama pasien", "pasien", "nomor pasien"]);
  const pic = findValue(formData, ["pic", "penanggung jawab", "pemberi tugas", "approval"]);

  if (draftType === "surat") return [
    "ISI SURAT",
    "Dengan hormat,",
    "",
    `${pihakPertama || "[pihak pengirim/pembuat]"} menyampaikan ${document?.title || "dokumen ini"} kepada ${pihakKedua || "[pihak tujuan/penerima]"} untuk keperluan: ${tujuan}.`,
    kronologi ? `Pokok keterangan/permohonan: ${kronologi}` : "Pokok keterangan atau permohonan perlu dilengkapi secara jelas.",
    batasWaktu ? `Waktu/tanggal yang berkaitan: ${batasWaktu}.` : "",
    "",
    "Demikian surat ini dibuat dan disampaikan untuk dapat dipergunakan sebagaimana mestinya.",
  ].filter(Boolean);

  if (draftType === "penagihan") return [
    "POKOK PENAGIHAN / TEGURAN",
    "Dengan hormat,",
    "",
    `${pihakPertama || "[pihak penagih]"} menyampaikan penagihan/pemberitahuan kepada ${pihakKedua || "[pihak tertagih]"} terkait kewajiban yang belum diselesaikan.`,
    nominal ? `Nilai kewajiban/tagihan: ${nominal}.` : "Nilai kewajiban/tagihan perlu dilengkapi.",
    batasWaktu ? `Batas penyelesaian/jatuh tempo: ${batasWaktu}.` : "Batas penyelesaian perlu ditentukan.",
    kronologi ? `Kronologi/riwayat komunikasi: ${kronologi}` : "Riwayat penagihan atau kronologi dapat dilengkapi.",
    bukti ? `Bukti pendukung: ${bukti}.` : "",
  ].filter(Boolean);

  if (draftType === "hr") return [
    "ADMINISTRASI HR & KARYAWAN",
    `Dokumen ini dibuat untuk kebutuhan: ${tujuan}.`,
    `Karyawan/pihak terkait: ${pihakPertama || pihakKedua || "[nama karyawan/pihak terkait]"}.`,
    jabatan ? `Jabatan/posisi/status: ${jabatan}.` : "Jabatan/posisi/status kerja perlu dilengkapi apabila relevan.",
    periode ? `Periode/tanggal efektif: ${periode}.` : "",
    kronologi ? `Keterangan/alasan: ${kronologi}` : "",
    pic ? `PIC/atasan/approval: ${pic}.` : "",
  ].filter(Boolean);

  if (draftType === "sop") return [
    "TUJUAN",
    kronologi || `Menetapkan standar pelaksanaan untuk: ${tujuan}.`,
    "",
    "RUANG LINGKUP",
    lokasi ? `Berlaku pada area/lokasi: ${lokasi}.` : "Ruang lingkup proses perlu ditentukan.",
    "",
    "TANGGUNG JAWAB",
    pic ? `PIC/penanggung jawab: ${pic}.` : "- PIC wajib ditentukan sesuai struktur organisasi.",
    "",
    "PROSEDUR",
    "- Persiapan dan pemeriksaan dokumen/data yang dibutuhkan.",
    "- Pelaksanaan pekerjaan sesuai urutan proses yang ditetapkan.",
    "- Pencatatan hasil, penyimpangan, dan bukti pelaksanaan.",
    "- Eskalasi kepada atasan/PIC apabila terjadi kendala.",
    "",
    "KONTROL & EVALUASI",
    "- Hasil pekerjaan diperiksa secara berkala.",
    "- Temuan ditindaklanjuti dan didokumentasikan.",
  ];

  if (draftType === "warehouse") return [
    "RINCIAN OPERASIONAL WAREHOUSE / LOGISTIK",
    `Jenis proses: ${document?.title || "Dokumen Warehouse"}.`,
    barang ? `Barang/SKU/Unit: ${barang}.` : "Barang/SKU/Unit perlu dilengkapi.",
    lokasi ? `Lokasi asal/tujuan: ${lokasi}.` : "Lokasi proses perlu dilengkapi apabila relevan.",
    nominal ? `Qty/nilai terkait: ${nominal}.` : "",
    kronologi ? `Kondisi/keterangan: ${kronologi}` : "Kondisi dan keterangan operasional perlu dicatat.",
    bukti ? `Dokumen/bukti pendukung: ${bukti}.` : "",
    "",
    "VERIFIKASI",
    "- Pastikan identitas barang, qty, lokasi, dan kondisi sesuai kondisi aktual.",
    "- Pihak terkait melakukan pengecekan sebelum dokumen dinyatakan selesai.",
  ].filter(Boolean);

  if (draftType === "asuransi") return [
    "PENGAJUAN / ADMINISTRASI KLAIM",
    "Dengan hormat,",
    `${pihakPertama || "[pemegang polis/pemohon]"} mengajukan dokumen kepada ${pihakKedua || "[perusahaan asuransi/pihak tujuan]"} untuk: ${tujuan}.`,
    polis ? `Nomor polis/klaim: ${polis}.` : "Nomor polis/klaim perlu dilengkapi apabila tersedia.",
    kronologi ? `Kronologi kejadian: ${kronologi}` : "Kronologi kejadian perlu disusun secara runtut.",
    barang ? `Objek klaim: ${barang}.` : "",
    nominal ? `Nilai klaim/kerugian: ${nominal}.` : "",
    bukti ? `Dokumen pendukung: ${bukti}.` : "Dokumen pendukung perlu dilampirkan sesuai ketentuan polis.",
  ].filter(Boolean);

  if (draftType === "bisnis") return [
    "RINGKASAN TRANSAKSI / HUBUNGAN BISNIS",
    `Dokumen: ${document?.title || "Dokumen Bisnis"}.`,
    `Pihak pertama: ${pihakPertama || "[pihak pertama]"}.`,
    `Pihak kedua/customer: ${pihakKedua || "[pihak kedua/customer]"}.`,
    barang ? `Barang/jasa/objek: ${barang}.` : "",
    nominal ? `Nilai/harga/nominal: ${nominal}.` : "",
    periode ? `Periode/jangka waktu: ${periode}.` : "",
    kronologi ? `Ruang lingkup/keterangan: ${kronologi}` : "Ruang lingkup atau keterangan transaksi perlu dilengkapi.",
  ].filter(Boolean);

  if (draftType === "klinik") return [
    "ADMINISTRASI RUMAH SAKIT / KLINIK",
    `Jenis dokumen: ${document?.title || "Dokumen Administrasi"}.`,
    pasien ? `Pasien: ${pasien}.` : "Identitas pasien perlu dilengkapi sesuai kebutuhan administratif.",
    lokasi ? `Fasilitas/lokasi: ${lokasi}.` : "",
    kronologi ? `Keterangan administratif: ${kronologi}` : "",
    bukti ? `Dokumen yang disertakan/diserahterimakan: ${bukti}.` : "",
    "",
    "CATATAN ADMINISTRASI",
    "- Dokumen ini tidak menggantikan diagnosis, keputusan klinis, atau rekam medis resmi.",
    "- Penggunaan data pasien harus mengikuti prosedur privasi fasilitas kesehatan.",
  ].filter(Boolean);

  if (draftType === "pribadi") return [
    "PERNYATAAN / KETERANGAN PRIBADI",
    `Saya/yang bertanda tangan pada dokumen ini menyampaikan ${document?.title || "pernyataan"} untuk keperluan: ${tujuan}.`,
    lokasi ? `Alamat/lokasi terkait: ${lokasi}.` : "",
    nominal ? `Nilai/penghasilan yang dinyatakan: ${nominal}.` : "",
    kronologi ? `Keterangan/kronologi: ${kronologi}` : "Isi pernyataan atau keterangan perlu dilengkapi.",
    bukti ? `Lampiran/bukti pendukung: ${bukti}.` : "",
  ].filter(Boolean);

  return [
    "ISI DOKUMEN",
    `Dokumen “${document?.title || "Dokumen"}” ini disusun untuk kebutuhan: ${tujuan}.`,
    kronologi ? `Uraian: ${kronologi}` : "Uraian dokumen perlu dilengkapi.",
  ];
}

function createClosingBlock(document, formData) {
  const draftType = detectDraftType(document);
  const pihakPertama = findValue(formData, ["pihak pertama", "pengirim", "pemohon", "nama pemberi", "pemberi", "perusahaan"]);
  const pihakKedua = findValue(formData, ["pihak kedua", "penerima", "termohon", "nama penerima", "customer"]);
  const pic = findValue(formData, ["pic", "penanggung jawab", "approval", "pemberi tugas"]);

  if (draftType === "sop") return [
    "PENGESAHAN",
    "",
    `Dibuat oleh : ${pic || "[PIC/Penyusun]"}`,
    "Diperiksa   : [Atasan/Reviewer]",
    "Disetujui   : [Pejabat Berwenang]",
  ];

  if (draftType === "warehouse") return [
    "SERAH TERIMA / VERIFIKASI",
    "",
    `Pihak/PIC 1 : ${pihakPertama || "[Nama/Tanda Tangan]"}`,
    `Pihak/PIC 2 : ${pihakKedua || "[Nama/Tanda Tangan]"}`,
  ];

  if (draftType === "hr") return [
    "PENGESAHAN / PERSETUJUAN",
    "",
    `Karyawan/Pihak terkait : ${pihakKedua || pihakPertama || "[Nama/Tanda Tangan]"}`,
    "HR / Atasan             : [Nama/Tanda Tangan]",
  ];

  if (draftType === "bisnis") return [
    "PARA PIHAK",
    "",
    `Pihak Pertama : ${pihakPertama || "[Nama/Tanda Tangan]"}`,
    `Pihak Kedua   : ${pihakKedua || "[Nama/Tanda Tangan]"}`,
  ];

  if (draftType === "klinik") return [
    "VERIFIKASI ADMINISTRASI",
    "",
    `Pemohon/Penerima : ${pihakPertama || pihakKedua || "[Nama/Tanda Tangan]"}`,
    "Petugas Admin     : [Nama/Tanda Tangan]",
  ];

  if (draftType === "pribadi") return [
    "PENUTUP",
    "Demikian pernyataan/keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.",
    "",
    "Yang membuat pernyataan,",
    "",
    `${pihakPertama || "[Nama dan Tanda Tangan]"}`,
  ];

  if (draftType === "asuransi") return [
    "PENUTUP",
    "Demikian pengajuan ini disampaikan. Data dan dokumen pendukung perlu diperiksa kembali sebelum dikirim.",
    "",
    "Pemohon,",
    "",
    `${pihakPertama || "[Nama dan Tanda Tangan]"}`,
  ];

  return [
    "PENUTUP",
    "Demikian draft ini dibuat untuk diperiksa dan disesuaikan kembali sebelum digunakan.",
    "",
    "Hormat kami,",
    "",
    `${pihakPertama || "[Nama dan Tanda Tangan]"}`,
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
      "Catatan: draft dapat disimpan ke akun pengguna. Export DOCX/PDF dan payment dokumen masih tahap berikutnya.",
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
    ...createClosingBlock(document, formData),
    "",
    "CATATAN SISTEM",
    "- Draft ini masih perlu diperiksa ulang oleh pengguna.",
    "- Pastikan nama pihak, tanggal, nominal, kronologi, dan bukti sudah benar.",
    "- Draft dapat disimpan dan diperbarui. Export DOCX/PDF dan payment dokumen masih tahap berikutnya.",
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
  const templateProfile = useMemo(
    () => getKilatDocsTemplateProfile(document),
    [document],
  );

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
                {templateProfile.shortLabel}
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                {document.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Template otomatis mengikuti kategori {templateProfile.label}. Lengkapi field untuk membentuk draft yang sesuai kategori. Draft dapat disimpan; export DOCX/PDF masih tahap berikutnya.
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
                  Preview · {templateProfile.shortLabel}
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

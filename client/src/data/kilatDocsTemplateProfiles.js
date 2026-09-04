// CK-DOC-05B-V6-SAFE
export const KILAT_DOCS_TEMPLATE_PROFILES = {
  "surat-umum": {
    id: "surat-umum",
    label: "Template Surat Umum",
    shortLabel: "Surat Formal",
    templateType: "surat",
  },
  "penagihan-somasi": {
    id: "penagihan-somasi",
    label: "Template Penagihan & Somasi",
    shortLabel: "Penagihan / Somasi",
    templateType: "penagihan",
  },
  "hr-karyawan": {
    id: "hr-karyawan",
    label: "Template HR & Karyawan",
    shortLabel: "HR / Karyawan",
    templateType: "hr",
  },
  "sop-bisnis": {
    id: "sop-bisnis",
    label: "Template SOP & Bisnis",
    shortLabel: "SOP / Prosedur",
    templateType: "sop",
  },
  "warehouse-logistik": {
    id: "warehouse-logistik",
    label: "Template Warehouse & Logistik",
    shortLabel: "Warehouse / Logistik",
    templateType: "warehouse",
  },
  "asuransi-klaim": {
    id: "asuransi-klaim",
    label: "Template Asuransi & Klaim",
    shortLabel: "Asuransi / Klaim",
    templateType: "asuransi",
  },
  "umkm-perusahaan": {
    id: "umkm-perusahaan",
    label: "Template UMKM & Perusahaan",
    shortLabel: "Bisnis / Perusahaan",
    templateType: "bisnis",
  },
  "rumah-sakit-klinik": {
    id: "rumah-sakit-klinik",
    label: "Template Rumah Sakit / Klinik",
    shortLabel: "Klinik / Administrasi",
    templateType: "klinik",
  },
  "legalitas-pribadi": {
    id: "legalitas-pribadi",
    label: "Template Legalitas Pribadi",
    shortLabel: "Pribadi / Pernyataan",
    templateType: "pribadi",
  },
};

const DEFAULT_TEMPLATE_PROFILE = {
  id: "umum",
  label: "Template Dokumen Formal",
  shortLabel: "Dokumen Formal",
  templateType: "umum",
};

export function getKilatDocsTemplateProfile(documentOrCategory) {
  const categoryId =
    typeof documentOrCategory === "string"
      ? documentOrCategory
      : documentOrCategory?.categoryId || documentOrCategory?.category_id || "";

  return KILAT_DOCS_TEMPLATE_PROFILES[categoryId] || DEFAULT_TEMPLATE_PROFILE;
}

-- CK-DOC-03D-SAFE
-- Activate initial KilatDocs documents.
-- Scope:
-- - Only update status from COMING_SOON to ACTIVE for selected initial documents.
-- - Does not create tables, change RLS, change frontend, payment, Midtrans, or CV export.
--
-- Selected documents:
-- - surat-kuasa | Surat Kuasa | Surat Kuasa
-- - surat-kuasa-klaim-asuransi | Surat Kuasa Klaim Asuransi | Surat Kuasa
-- - surat-pernyataan | Surat Pernyataan | Surat Pernyataan
-- - surat-pernyataan-domisili | Surat Pernyataan Domisili | Surat Pernyataan
-- - surat-permohonan | Surat Permohonan | Surat Permohonan
-- - surat-permohonan-salinan-rekam-medis | Surat Permohonan Salinan Rekam Medis | Surat Permohonan
-- - invoice-formal | Invoice Formal | Somasi / Penagihan
-- - kronologi-masalah-pembayaran | Kronologi Masalah Pembayaran | Somasi / Penagihan
-- - bast-barang | BAST Barang | BAST / Serah Terima
-- - form-serah-terima-dokumen-pasien | Form Serah Terima Dokumen Pasien | BAST / Serah Terima

begin;

update public.document_catalog
set
  status = 'ACTIVE',
  updated_at = now()
where id in (
  'surat-kuasa',
  'surat-kuasa-klaim-asuransi',
  'surat-pernyataan',
  'surat-pernyataan-domisili',
  'surat-permohonan',
  'surat-permohonan-salinan-rekam-medis',
  'invoice-formal',
  'kronologi-masalah-pembayaran',
  'bast-barang',
  'form-serah-terima-dokumen-pasien'
);

-- Keep all other documents visible but not yet buildable.
update public.document_catalog
set
  status = 'COMING_SOON',
  updated_at = now()
where id not in (
  'surat-kuasa',
  'surat-kuasa-klaim-asuransi',
  'surat-pernyataan',
  'surat-pernyataan-domisili',
  'surat-permohonan',
  'surat-permohonan-salinan-rekam-medis',
  'invoice-formal',
  'kronologi-masalah-pembayaran',
  'bast-barang',
  'form-serah-terima-dokumen-pasien'
)
and status = 'ACTIVE';

comment on table public.document_catalog is 'CK-DOC-03D: Initial KilatDocs documents activated. Other documents remain COMING_SOON until ready.';

commit;

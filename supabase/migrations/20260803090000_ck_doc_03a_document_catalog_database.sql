-- CK-DOC-03A-SAFE-V2
-- Supabase migration for KilatDocs database catalog.
-- Generated from client/src/data/kilatDocsCatalog.js.
-- Scope:
-- - Create document categories table
-- - Create document subcategories table
-- - Create document catalog table
-- - Enable RLS
-- - Add public read policies for ACTIVE and COMING_SOON catalog data
-- - Seed categories, subcategories, and document catalog
-- Not touched:
-- - CV Builder payment
-- - Midtrans
-- - CV PDF/DOCX export
-- - Existing app pages

begin;

create table if not exists public.document_categories (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  sort_order integer not null default 0,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'COMING_SOON', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_subcategories (
  id text primary key,
  category_id text not null references public.document_categories(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  sort_order integer not null default 0,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'COMING_SOON', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists public.document_catalog (
  id text primary key,
  slug text not null unique,
  category_id text not null references public.document_categories(id) on delete restrict,
  subcategory_id text references public.document_subcategories(id) on delete set null,
  title text not null,
  description text,
  use_case text,
  risk text,
  status text not null default 'COMING_SOON' check (status in ('ACTIVE', 'COMING_SOON', 'ARCHIVED')),
  output_format text[] not null default array[]::text[],
  fields jsonb not null default '[]'::jsonb,
  tags text[] not null default array[]::text[],
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists document_categories_status_sort_idx
  on public.document_categories (status, sort_order, name);

create index if not exists document_subcategories_category_sort_idx
  on public.document_subcategories (category_id, status, sort_order, name);

create index if not exists document_catalog_status_sort_idx
  on public.document_catalog (status, sort_order, title);

create index if not exists document_catalog_category_status_idx
  on public.document_catalog (category_id, status, sort_order);

create index if not exists document_catalog_subcategory_status_idx
  on public.document_catalog (subcategory_id, status, sort_order);

create or replace function public.set_kilatdocs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_document_categories_updated_at on public.document_categories;
create trigger set_document_categories_updated_at
before update on public.document_categories
for each row
execute function public.set_kilatdocs_updated_at();

drop trigger if exists set_document_subcategories_updated_at on public.document_subcategories;
create trigger set_document_subcategories_updated_at
before update on public.document_subcategories
for each row
execute function public.set_kilatdocs_updated_at();

drop trigger if exists set_document_catalog_updated_at on public.document_catalog;
create trigger set_document_catalog_updated_at
before update on public.document_catalog
for each row
execute function public.set_kilatdocs_updated_at();

alter table public.document_categories enable row level security;
alter table public.document_subcategories enable row level security;
alter table public.document_catalog enable row level security;

drop policy if exists "document_categories_read_public" on public.document_categories;
create policy "document_categories_read_public"
on public.document_categories
for select
to anon, authenticated
using (status in ('ACTIVE', 'COMING_SOON'));

drop policy if exists "document_subcategories_read_public" on public.document_subcategories;
create policy "document_subcategories_read_public"
on public.document_subcategories
for select
to anon, authenticated
using (status in ('ACTIVE', 'COMING_SOON'));

drop policy if exists "document_catalog_read_public" on public.document_catalog;
create policy "document_catalog_read_public"
on public.document_catalog
for select
to anon, authenticated
using (status in ('ACTIVE', 'COMING_SOON'));

insert into public.document_categories (
  id,
  slug,
  name,
  description,
  icon,
  sort_order,
  status
)
values
  (
    'surat-umum',
    'surat-umum',
    'Surat Umum',
    'Surat kuasa, pernyataan, permohonan, pemberitahuan, pengaduan, dan undangan resmi.',
    '✉',
    1,
    'ACTIVE'
  ),
  (
    'penagihan-somasi',
    'penagihan-somasi',
    'Penagihan & Somasi',
    'Penagihan invoice, reminder pembayaran, somasi, kronologi, dan kesepakatan bayar.',
    '⚖',
    2,
    'ACTIVE'
  ),
  (
    'hr-karyawan',
    'hr-karyawan',
    'HR & Karyawan',
    'Resign, paklaring, teguran, surat tugas, cuti, mutasi, dan keterangan kerja.',
    '👥',
    3,
    'ACTIVE'
  ),
  (
    'sop-bisnis',
    'sop-bisnis',
    'SOP & Bisnis',
    'SOP HR, finance, purchasing, sales, customer service, operasional, dan checklist audit.',
    '☷',
    4,
    'ACTIVE'
  ),
  (
    'warehouse-logistik',
    'warehouse-logistik',
    'Warehouse & Logistik',
    'BAST, surat jalan, stock opname, receiving, putaway, RMA, dan serah terima unit.',
    '▣',
    5,
    'ACTIVE'
  ),
  (
    'asuransi-klaim',
    'asuransi-klaim',
    'Asuransi & Klaim',
    'Pengajuan klaim, kronologi, checklist klaim, keberatan, banding, dan kuasa klaim.',
    '◆',
    6,
    'ACTIVE'
  ),
  (
    'umkm-perusahaan',
    'umkm-perusahaan',
    'UMKM & Perusahaan',
    'Penawaran harga, invoice, kwitansi, MoU, kerja sama, jual beli, dan pemutusan kerja sama.',
    '◈',
    7,
    'ACTIVE'
  ),
  (
    'rumah-sakit-klinik',
    'rumah-sakit-klinik',
    'Rumah Sakit / Klinik',
    'Dokumen administratif klinik, pasien, front office, dan serah terima dokumen.',
    '✚',
    8,
    'ACTIVE'
  ),
  (
    'legalitas-pribadi',
    'legalitas-pribadi',
    'Legalitas Pribadi',
    'Domisili, kehilangan dokumen, izin orang tua, penghasilan, tidak sengketa, dan kronologi pribadi.',
    '◉',
    9,
    'ACTIVE'
  )
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  status = excluded.status,
  updated_at = now();

insert into public.document_subcategories (
  id,
  category_id,
  slug,
  name,
  description,
  sort_order,
  status
)
values
  (
    'asuransi-klaim-umum',
    'asuransi-klaim',
    'umum',
    'Umum',
    'Subkategori umum untuk Asuransi & Klaim.',
    1,
    'ACTIVE'
  ),
  (
    'hr-karyawan-umum',
    'hr-karyawan',
    'umum',
    'Umum',
    'Subkategori umum untuk HR & Karyawan.',
    1,
    'ACTIVE'
  ),
  (
    'legalitas-pribadi-umum',
    'legalitas-pribadi',
    'umum',
    'Umum',
    'Subkategori umum untuk Legalitas Pribadi.',
    1,
    'ACTIVE'
  ),
  (
    'penagihan-somasi-umum',
    'penagihan-somasi',
    'umum',
    'Umum',
    'Subkategori umum untuk Penagihan & Somasi.',
    1,
    'ACTIVE'
  ),
  (
    'rumah-sakit-klinik-umum',
    'rumah-sakit-klinik',
    'umum',
    'Umum',
    'Subkategori umum untuk Rumah Sakit / Klinik.',
    1,
    'ACTIVE'
  ),
  (
    'sop-bisnis-umum',
    'sop-bisnis',
    'umum',
    'Umum',
    'Subkategori umum untuk SOP & Bisnis.',
    1,
    'ACTIVE'
  ),
  (
    'surat-umum-umum',
    'surat-umum',
    'umum',
    'Umum',
    'Subkategori umum untuk Surat Umum.',
    1,
    'ACTIVE'
  ),
  (
    'umkm-perusahaan-umum',
    'umkm-perusahaan',
    'umum',
    'Umum',
    'Subkategori umum untuk UMKM & Perusahaan.',
    1,
    'ACTIVE'
  ),
  (
    'warehouse-logistik-umum',
    'warehouse-logistik',
    'umum',
    'Umum',
    'Subkategori umum untuk Warehouse & Logistik.',
    1,
    'ACTIVE'
  )
on conflict (id) do update set
  category_id = excluded.category_id,
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  status = excluded.status,
  updated_at = now();

insert into public.document_catalog (
  id,
  slug,
  category_id,
  subcategory_id,
  title,
  description,
  use_case,
  risk,
  status,
  output_format,
  fields,
  tags,
  sort_order,
  is_featured
)
values
  (
    'surat-kuasa',
    'surat-kuasa',
    'surat-umum',
    'surat-umum-umum',
    'Surat Kuasa',
    'Memberi wewenang kepada pihak lain untuk kebutuhan administratif.',
    'Saat pengguna tidak bisa hadir atau perlu menunjuk perwakilan.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemberi kuasa","Penerima kuasa","Tujuan kuasa","Masa berlaku"]'::jsonb,
    array['kuasa', 'perorangan', 'wakil', 'administrasi']::text[],
    1,
    true
  ),
  (
    'surat-pernyataan',
    'surat-pernyataan',
    'surat-umum',
    'surat-umum-umum',
    'Surat Pernyataan',
    'Pernyataan tertulis tentang fakta, komitmen, atau tanggung jawab.',
    'Untuk kebutuhan administrasi kantor, sekolah, bisnis, atau pribadi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama pembuat","Isi pernyataan","Tanggal","Saksi"]'::jsonb,
    array['pernyataan', 'fakta', 'komitmen']::text[],
    2,
    true
  ),
  (
    'surat-permohonan',
    'surat-permohonan',
    'surat-umum',
    'surat-umum-umum',
    'Surat Permohonan',
    'Mengajukan permintaan bantuan, izin, fasilitas, atau persetujuan.',
    'Saat pengguna perlu menyampaikan permintaan secara formal.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemohon","Penerima","Tujuan permohonan","Alasan"]'::jsonb,
    array['permohonan', 'izin', 'persetujuan']::text[],
    3,
    false
  ),
  (
    'surat-pengaduan',
    'surat-pengaduan',
    'surat-umum',
    'surat-umum-umum',
    'Surat Pengaduan',
    'Pengaduan resmi atas layanan, produk, perilaku, atau kejadian.',
    'Untuk menyampaikan keluhan dengan kronologi dan permintaan solusi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pengadu","Pihak tujuan","Kronologi","Permintaan solusi"]'::jsonb,
    array['pengaduan', 'komplain', 'kronologi']::text[],
    4,
    false
  ),
  (
    'surat-pemberitahuan',
    'surat-pemberitahuan',
    'surat-umum',
    'surat-umum-umum',
    'Surat Pemberitahuan',
    'Pemberitahuan resmi tentang kegiatan, perubahan, jadwal, atau keputusan.',
    'Untuk perusahaan, komunitas, sekolah, atau perorangan.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pengirim","Penerima","Isi","Tanggal berlaku"]'::jsonb,
    array['pemberitahuan', 'jadwal', 'pengumuman']::text[],
    5,
    false
  ),
  (
    'surat-undangan-resmi',
    'surat-undangan-resmi',
    'surat-umum',
    'surat-umum-umum',
    'Surat Undangan Resmi',
    'Undangan formal untuk rapat, acara, klarifikasi, atau pertemuan.',
    'Mengundang pihak lain secara resmi dan rapi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pengundang","Penerima","Agenda","Waktu dan tempat"]'::jsonb,
    array['undangan', 'rapat', 'acara']::text[],
    6,
    false
  ),
  (
    'surat-penagihan-invoice',
    'surat-penagihan-invoice',
    'penagihan-somasi',
    'penagihan-somasi-umum',
    'Surat Penagihan Invoice',
    'Penagihan formal atas invoice yang belum dibayar.',
    'Saat customer atau partner belum menyelesaikan pembayaran.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nomor invoice","Nominal","Jatuh tempo","Riwayat penagihan"]'::jsonb,
    array['invoice', 'tagihan', 'piutang', 'pembayaran']::text[],
    7,
    true
  ),
  (
    'surat-pengingat-pembayaran',
    'surat-pengingat-pembayaran',
    'penagihan-somasi',
    'penagihan-somasi-umum',
    'Surat Pengingat Pembayaran',
    'Reminder pembayaran dengan bahasa formal namun tetap sopan.',
    'Sebelum eskalasi ke penagihan tegas atau somasi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Penerima","Nominal","Jatuh tempo","Instruksi bayar"]'::jsonb,
    array['reminder', 'pembayaran', 'jatuh tempo']::text[],
    8,
    false
  ),
  (
    'surat-somasi',
    'surat-somasi',
    'penagihan-somasi',
    'penagihan-somasi-umum',
    'Surat Somasi',
    'Teguran formal agar pihak lain memenuhi kewajiban dalam batas waktu tertentu.',
    'Eskalasi awal sengketa pembayaran, kewajiban, atau wanprestasi sederhana.',
    'Butuh review profesional untuk kasus hukum kompleks.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pengirim","Penerima","Dasar masalah","Batas waktu"]'::jsonb,
    array['somasi', 'teguran', 'wanprestasi']::text[],
    9,
    true
  ),
  (
    'kronologi-masalah-pembayaran',
    'kronologi-masalah-pembayaran',
    'penagihan-somasi',
    'penagihan-somasi-umum',
    'Kronologi Masalah Pembayaran',
    'Kronologi runtut terkait tagihan, janji bayar, komunikasi, dan bukti.',
    'Lampiran penagihan, somasi, atau laporan internal.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Tanggal kejadian","Pihak terkait","Bukti","Dampak"]'::jsonb,
    array['kronologi', 'pembayaran', 'bukti']::text[],
    10,
    false
  ),
  (
    'surat-kesepakatan-pembayaran',
    'surat-kesepakatan-pembayaran',
    'penagihan-somasi',
    'penagihan-somasi-umum',
    'Surat Kesepakatan Pembayaran',
    'Kesepakatan pembayaran bertahap atau pelunasan.',
    'Setelah pihak tertagih menyetujui skema pembayaran.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pihak pertama","Pihak kedua","Nominal","Jadwal pembayaran"]'::jsonb,
    array['kesepakatan', 'cicilan', 'pelunasan']::text[],
    11,
    false
  ),
  (
    'surat-pernyataan-hutang',
    'surat-pernyataan-hutang',
    'penagihan-somasi',
    'penagihan-somasi-umum',
    'Surat Pernyataan Hutang',
    'Pernyataan pengakuan hutang atau kewajiban pembayaran.',
    'Mendokumentasikan kewajiban bayar secara tertulis.',
    'Perlu review profesional untuk nilai besar atau sengketa berat.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemberi pernyataan","Penerima","Nominal","Tanggal bayar"]'::jsonb,
    array['hutang', 'piutang', 'pengakuan']::text[],
    12,
    false
  ),
  (
    'surat-resign',
    'surat-resign',
    'hr-karyawan',
    'hr-karyawan-umum',
    'Surat Resign',
    'Pengunduran diri formal, singkat, dan sopan.',
    'Karyawan mengajukan resign dari perusahaan.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama karyawan","Jabatan","Tanggal efektif","Alasan"]'::jsonb,
    array['resign', 'pengunduran diri', 'karyawan']::text[],
    13,
    false
  ),
  (
    'paklaring',
    'paklaring',
    'hr-karyawan',
    'hr-karyawan-umum',
    'Paklaring',
    'Surat keterangan pengalaman kerja dari perusahaan.',
    'HR menerbitkan bukti pengalaman kerja karyawan.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama karyawan","Jabatan","Periode kerja","Keterangan"]'::jsonb,
    array['paklaring', 'keterangan kerja', 'hr']::text[],
    14,
    true
  ),
  (
    'surat-teguran',
    'surat-teguran',
    'hr-karyawan',
    'hr-karyawan-umum',
    'Surat Teguran',
    'Teguran tertulis untuk pelanggaran ringan atau perbaikan kinerja.',
    'HR atau atasan memberi peringatan administratif.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama karyawan","Jenis pelanggaran","Tanggal","Arahan"]'::jsonb,
    array['teguran', 'karyawan', 'disiplin']::text[],
    15,
    false
  ),
  (
    'surat-peringatan',
    'surat-peringatan',
    'hr-karyawan',
    'hr-karyawan-umum',
    'Surat Peringatan',
    'SP karyawan dengan detail pelanggaran, dasar, dan konsekuensi.',
    'Proses disiplin yang perlu terdokumentasi.',
    'Perlu disesuaikan dengan peraturan perusahaan.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama karyawan","SP ke-","Pelanggaran","Konsekuensi"]'::jsonb,
    array['sp', 'surat peringatan', 'karyawan']::text[],
    16,
    false
  ),
  (
    'surat-tugas',
    'surat-tugas',
    'hr-karyawan',
    'hr-karyawan-umum',
    'Surat Tugas',
    'Penugasan resmi untuk karyawan, tim, atau perwakilan perusahaan.',
    'Saat seseorang ditugaskan ke lokasi, proyek, meeting, atau pekerjaan tertentu.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemberi tugas","Penerima tugas","Tujuan","Masa tugas"]'::jsonb,
    array['surat tugas', 'penugasan', 'karyawan']::text[],
    17,
    false
  ),
  (
    'surat-cuti',
    'surat-cuti',
    'hr-karyawan',
    'hr-karyawan-umum',
    'Surat Cuti',
    'Pengajuan cuti karyawan dengan periode dan alasan.',
    'Administrasi cuti karyawan atau HR.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama karyawan","Jenis cuti","Tanggal cuti","Alasan"]'::jsonb,
    array['cuti', 'izin', 'karyawan']::text[],
    18,
    false
  ),
  (
    'surat-keterangan-kerja',
    'surat-keterangan-kerja',
    'hr-karyawan',
    'hr-karyawan-umum',
    'Surat Keterangan Kerja',
    'Menerangkan status kerja karyawan aktif.',
    'Pengajuan bank, sewa, visa, administrasi, atau kebutuhan pribadi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama karyawan","Jabatan","Status kerja","Keperluan"]'::jsonb,
    array['keterangan kerja', 'aktif kerja', 'hr']::text[],
    19,
    false
  ),
  (
    'surat-mutasi-karyawan',
    'surat-mutasi-karyawan',
    'hr-karyawan',
    'hr-karyawan-umum',
    'Surat Mutasi Karyawan',
    'Pemberitahuan mutasi jabatan, lokasi, divisi, atau tanggung jawab.',
    'Perusahaan memindahkan karyawan ke posisi atau lokasi baru.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama karyawan","Posisi lama","Posisi baru","Tanggal efektif"]'::jsonb,
    array['mutasi', 'karyawan', 'jabatan', 'lokasi']::text[],
    20,
    false
  ),
  (
    'sop-hr-recruitment',
    'sop-hr-recruitment',
    'sop-bisnis',
    'sop-bisnis-umum',
    'SOP HR Recruitment',
    'SOP rekrutmen dari kebutuhan posisi sampai onboarding.',
    'Perusahaan atau UMKM yang ingin alur hiring lebih rapi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Tujuan SOP","PIC","Tahapan","Dokumen"]'::jsonb,
    array['sop', 'hr', 'rekrutmen', 'onboarding']::text[],
    21,
    false
  ),
  (
    'sop-finance-pengeluaran-kas',
    'sop-finance-pengeluaran-kas',
    'sop-bisnis',
    'sop-bisnis-umum',
    'SOP Finance Pengeluaran Kas',
    'SOP pengajuan, approval, pencairan, dan pertanggungjawaban kas.',
    'Agar pengeluaran kas kecil atau operasional lebih terkontrol.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Tujuan","Limit","Approval","Dokumen bukti"]'::jsonb,
    array['sop', 'finance', 'kas', 'approval']::text[],
    22,
    false
  ),
  (
    'sop-purchasing',
    'sop-purchasing',
    'sop-bisnis',
    'sop-bisnis-umum',
    'SOP Purchasing',
    'SOP pembelian barang atau jasa dari permintaan sampai penerimaan.',
    'Mengatur pembelian agar jelas dan terdokumentasi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Permintaan","Approval","Vendor","Penerimaan"]'::jsonb,
    array['sop', 'purchasing', 'pembelian', 'vendor']::text[],
    23,
    false
  ),
  (
    'sop-sales-follow-up',
    'sop-sales-follow-up',
    'sop-bisnis',
    'sop-bisnis-umum',
    'SOP Sales Follow Up',
    'SOP follow up prospek, customer, quotation, dan closing.',
    'Tim sales agar tindak lanjut pelanggan konsisten.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Tahapan sales","Waktu follow up","Template pesan","PIC"]'::jsonb,
    array['sop', 'sales', 'follow up', 'customer']::text[],
    24,
    false
  ),
  (
    'sop-customer-service',
    'sop-customer-service',
    'sop-bisnis',
    'sop-bisnis-umum',
    'SOP Customer Service',
    'SOP respon komplain, eskalasi, pencatatan tiket, dan penyelesaian.',
    'Bisnis yang menerima keluhan atau pertanyaan customer.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Jenis tiket","SLA","PIC","Eskalasi"]'::jsonb,
    array['sop', 'customer service', 'komplain', 'eskalasi']::text[],
    25,
    false
  ),
  (
    'sop-operasional-harian',
    'sop-operasional-harian',
    'sop-bisnis',
    'sop-bisnis-umum',
    'SOP Operasional Harian',
    'SOP rutinitas kerja harian, pembagian tugas, dan kontrol hasil kerja.',
    'Toko, kantor, klinik, atau operasional kecil menengah.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Jam kerja","Aktivitas","PIC","Checklist"]'::jsonb,
    array['sop', 'operasional', 'harian', 'checklist']::text[],
    26,
    false
  ),
  (
    'checklist-audit-internal',
    'checklist-audit-internal',
    'sop-bisnis',
    'sop-bisnis-umum',
    'Checklist Audit Internal',
    'Checklist audit untuk dokumen, stok, kas, operasional, atau kepatuhan SOP.',
    'Pemeriksaan internal yang praktis dan terstruktur.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Area audit","Item pemeriksaan","Temuan","Tindak lanjut"]'::jsonb,
    array['audit', 'checklist', 'internal', 'kontrol']::text[],
    27,
    false
  ),
  (
    'bast-barang',
    'bast-barang',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'BAST Barang',
    'Berita acara serah terima barang antara dua pihak.',
    'Saat barang diserahkan, diterima, dipinjamkan, atau dikembalikan.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pihak pertama","Pihak kedua","Daftar barang","Kondisi barang"]'::jsonb,
    array['bast', 'serah terima', 'barang', 'warehouse']::text[],
    28,
    true
  ),
  (
    'surat-jalan',
    'surat-jalan',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'Surat Jalan',
    'Dokumen pengiriman barang dari gudang ke tujuan.',
    'Menyertai pengiriman dan bukti keluar barang.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pengirim","Penerima","Tujuan","Daftar barang"]'::jsonb,
    array['surat jalan', 'pengiriman', 'logistik']::text[],
    29,
    false
  ),
  (
    'berita-acara-kerusakan-barang',
    'berita-acara-kerusakan-barang',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'Berita Acara Kerusakan Barang',
    'Berita acara barang rusak saat diterima, disimpan, atau dikirim.',
    'Dokumentasi kerusakan dan dasar klaim atau tindak lanjut.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Barang","Jenis kerusakan","Kronologi","Bukti"]'::jsonb,
    array['kerusakan', 'barang', 'berita acara', 'klaim']::text[],
    30,
    false
  ),
  (
    'berita-acara-kehilangan-barang',
    'berita-acara-kehilangan-barang',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'Berita Acara Kehilangan Barang',
    'Berita acara kehilangan barang, unit, dokumen, atau aksesoris.',
    'Laporan internal, investigasi, klaim, atau administrasi penggantian.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Barang hilang","Lokasi","Kronologi","Pihak terkait"]'::jsonb,
    array['kehilangan', 'barang', 'investigasi']::text[],
    31,
    false
  ),
  (
    'form-receiving',
    'form-receiving',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'Form Receiving',
    'Form penerimaan barang masuk dengan qty, kondisi, dan dokumen pendukung.',
    'Admin gudang menerima barang dari supplier atau ekspedisi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Supplier","No dokumen","SKU","Qty","Kondisi"]'::jsonb,
    array['receiving', 'barang masuk', 'warehouse']::text[],
    32,
    false
  ),
  (
    'form-putaway',
    'form-putaway',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'Form Putaway',
    'Form penempatan barang ke lokasi gudang.',
    'Memastikan barang diterima ditempatkan ke lokasi yang benar.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["SKU","Qty","Lokasi asal","Lokasi tujuan"]'::jsonb,
    array['putaway', 'lokasi', 'warehouse', 'stok']::text[],
    33,
    false
  ),
  (
    'form-stock-opname',
    'form-stock-opname',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'Form Stock Opname',
    'Form pemeriksaan stok fisik dan selisih stok.',
    'Stock opname harian, mingguan, bulanan, atau audit.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["SKU","Qty sistem","Qty fisik","Selisih","Keterangan"]'::jsonb,
    array['stock opname', 'stok', 'inventory', 'audit']::text[],
    34,
    false
  ),
  (
    'form-rma-garansi',
    'form-rma-garansi',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'Form RMA / Garansi',
    'Form retur, RMA, atau klaim garansi produk.',
    'Mencatat unit rusak, keluhan, hasil pengecekan, dan tindak lanjut.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Customer","Produk","IMEI/serial","Keluhan","Status"]'::jsonb,
    array['rma', 'garansi', 'return', 'service']::text[],
    35,
    true
  ),
  (
    'form-serah-terima-unit',
    'form-serah-terima-unit',
    'warehouse-logistik',
    'warehouse-logistik-umum',
    'Form Serah Terima Unit',
    'Serah terima unit, perangkat, aksesoris, atau inventaris.',
    'Unit berpindah tangan antar user, teknisi, admin, atau customer.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemberi","Penerima","Unit","Aksesoris","Kondisi"]'::jsonb,
    array['serah terima', 'unit', 'inventaris', 'asset']::text[],
    36,
    false
  ),
  (
    'surat-pengajuan-klaim-asuransi',
    'surat-pengajuan-klaim-asuransi',
    'asuransi-klaim',
    'asuransi-klaim-umum',
    'Surat Pengajuan Klaim Asuransi',
    'Pengajuan klaim asuransi dengan ringkasan kejadian dan permintaan proses.',
    'Klaim kendaraan, kesehatan, properti, perjalanan, atau barang sesuai polis.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemegang polis","Nomor polis","Jenis klaim","Kronologi"]'::jsonb,
    array['asuransi', 'klaim', 'pengajuan', 'polis']::text[],
    37,
    true
  ),
  (
    'kronologi-kejadian-klaim',
    'kronologi-kejadian-klaim',
    'asuransi-klaim',
    'asuransi-klaim-umum',
    'Kronologi Kejadian Klaim',
    'Kronologi kejadian untuk mendukung pengajuan klaim.',
    'Lampiran klaim agar kejadian jelas dan runtut.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Tanggal kejadian","Lokasi","Pihak terkait","Bukti"]'::jsonb,
    array['kronologi', 'klaim', 'kejadian', 'asuransi']::text[],
    38,
    false
  ),
  (
    'checklist-dokumen-klaim',
    'checklist-dokumen-klaim',
    'asuransi-klaim',
    'asuransi-klaim-umum',
    'Checklist Dokumen Klaim',
    'Checklist dokumen yang perlu disiapkan untuk pengajuan klaim.',
    'Agar dokumen klaim tidak tercecer sebelum dikirim ke asuransi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Jenis klaim","Dokumen utama","Dokumen tambahan","Status"]'::jsonb,
    array['checklist', 'klaim', 'dokumen', 'asuransi']::text[],
    39,
    false
  ),
  (
    'surat-keberatan-klaim',
    'surat-keberatan-klaim',
    'asuransi-klaim',
    'asuransi-klaim-umum',
    'Surat Keberatan Klaim',
    'Keberatan atas hasil klaim, penolakan, atau nilai penggantian.',
    'Meminta peninjauan kembali secara tertulis.',
    'Perlu membaca ketentuan polis sebelum dikirim.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nomor klaim","Alasan keberatan","Bukti","Permintaan"]'::jsonb,
    array['keberatan', 'klaim', 'penolakan', 'asuransi']::text[],
    40,
    false
  ),
  (
    'surat-banding-klaim',
    'surat-banding-klaim',
    'asuransi-klaim',
    'asuransi-klaim-umum',
    'Surat Banding Klaim',
    'Banding atau permohonan peninjauan ulang klaim asuransi.',
    'Jika keberatan awal belum diterima atau perlu eskalasi resmi.',
    'Perlu disesuaikan dengan polis dan prosedur asuransi.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nomor klaim","Riwayat komunikasi","Dasar banding","Bukti"]'::jsonb,
    array['banding', 'klaim', 'review', 'asuransi']::text[],
    41,
    false
  ),
  (
    'surat-kuasa-klaim-asuransi',
    'surat-kuasa-klaim-asuransi',
    'asuransi-klaim',
    'asuransi-klaim-umum',
    'Surat Kuasa Klaim Asuransi',
    'Kuasa kepada pihak lain untuk membantu proses klaim asuransi.',
    'Pemegang polis menunjuk perwakilan untuk administrasi klaim.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemberi kuasa","Penerima kuasa","Nomor polis","Batas kuasa"]'::jsonb,
    array['kuasa', 'klaim', 'asuransi', 'perwakilan']::text[],
    42,
    false
  ),
  (
    'perjanjian-kerja-sama-sederhana',
    'perjanjian-kerja-sama-sederhana',
    'umkm-perusahaan',
    'umkm-perusahaan-umum',
    'Perjanjian Kerja Sama Sederhana',
    'Kerja sama sederhana antara dua pihak untuk aktivitas bisnis tertentu.',
    'UMKM atau perusahaan kecil mencatat peran, hak, dan kewajiban dasar.',
    'Perlu review profesional untuk nilai besar atau kompleks.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pihak pertama","Pihak kedua","Ruang lingkup","Durasi"]'::jsonb,
    array['kerja sama', 'perjanjian', 'bisnis', 'umkm']::text[],
    43,
    false
  ),
  (
    'surat-penawaran-harga',
    'surat-penawaran-harga',
    'umkm-perusahaan',
    'umkm-perusahaan-umum',
    'Surat Penawaran Harga',
    'Penawaran harga barang atau jasa kepada calon customer.',
    'Sales, UMKM, atau perusahaan mengirim proposal harga ringkas.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Customer","Produk/jasa","Harga","Masa berlaku"]'::jsonb,
    array['penawaran', 'harga', 'quotation', 'sales']::text[],
    44,
    true
  ),
  (
    'invoice-formal',
    'invoice-formal',
    'umkm-perusahaan',
    'umkm-perusahaan-umum',
    'Invoice Formal',
    'Invoice sederhana dengan rincian barang/jasa, nominal, dan instruksi pembayaran.',
    'Penagihan transaksi bisnis.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nomor invoice","Customer","Item","Nominal","Rekening"]'::jsonb,
    array['invoice', 'tagihan', 'umkm', 'pembayaran']::text[],
    45,
    false
  ),
  (
    'kwitansi-pembayaran',
    'kwitansi-pembayaran',
    'umkm-perusahaan',
    'umkm-perusahaan-umum',
    'Kwitansi Pembayaran',
    'Bukti penerimaan pembayaran dengan nominal dan keterangan transaksi.',
    'Bukti pembayaran tunai atau transfer.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Penerima","Pembayar","Nominal","Keterangan"]'::jsonb,
    array['kwitansi', 'pembayaran', 'bukti', 'transaksi']::text[],
    46,
    false
  ),
  (
    'mou-sederhana',
    'mou-sederhana',
    'umkm-perusahaan',
    'umkm-perusahaan-umum',
    'MoU Sederhana',
    'Nota kesepahaman sederhana untuk rencana kerja sama.',
    'Mencatat kesepahaman awal sebelum perjanjian detail.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Para pihak","Maksud","Ruang lingkup","Jangka waktu"]'::jsonb,
    array['mou', 'kesepahaman', 'kerja sama', 'bisnis']::text[],
    47,
    false
  ),
  (
    'perjanjian-jual-beli-sederhana',
    'perjanjian-jual-beli-sederhana',
    'umkm-perusahaan',
    'umkm-perusahaan-umum',
    'Perjanjian Jual Beli Sederhana',
    'Perjanjian jual beli barang sederhana.',
    'Transaksi barang yang perlu bukti tertulis lebih rapi.',
    'Perlu review profesional untuk aset bernilai besar.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Penjual","Pembeli","Barang","Harga","Serah terima"]'::jsonb,
    array['jual beli', 'perjanjian', 'barang', 'transaksi']::text[],
    48,
    false
  ),
  (
    'surat-pemutusan-kerja-sama',
    'surat-pemutusan-kerja-sama',
    'umkm-perusahaan',
    'umkm-perusahaan-umum',
    'Surat Pemutusan Kerja Sama',
    'Pemberitahuan penghentian kerja sama secara formal.',
    'Salah satu pihak ingin mengakhiri hubungan kerja sama.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pengirim","Penerima","Dasar pemutusan","Tanggal efektif"]'::jsonb,
    array['pemutusan', 'kerja sama', 'bisnis', 'pemberitahuan']::text[],
    49,
    false
  ),
  (
    'surat-keterangan-berobat',
    'surat-keterangan-berobat',
    'rumah-sakit-klinik',
    'rumah-sakit-klinik-umum',
    'Surat Keterangan Berobat',
    'Dokumen administratif yang menerangkan seseorang berobat pada tanggal tertentu.',
    'Format awal surat keterangan non-diagnosis.',
    'Konten medis wajib mengikuti kebijakan fasilitas kesehatan.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama pasien","Tanggal berobat","Fasilitas kesehatan","Keperluan"]'::jsonb,
    array['klinik', 'rumah sakit', 'berobat', 'administrasi']::text[],
    50,
    false
  ),
  (
    'form-serah-terima-dokumen-pasien',
    'form-serah-terima-dokumen-pasien',
    'rumah-sakit-klinik',
    'rumah-sakit-klinik-umum',
    'Form Serah Terima Dokumen Pasien',
    'Serah terima dokumen administratif pasien.',
    'Mencatat dokumen yang diberikan atau diterima administrasi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemberi","Penerima","Daftar dokumen","Tanggal"]'::jsonb,
    array['dokumen pasien', 'serah terima', 'klinik', 'admin']::text[],
    51,
    false
  ),
  (
    'berita-acara-kehilangan-kartu-berobat',
    'berita-acara-kehilangan-kartu-berobat',
    'rumah-sakit-klinik',
    'rumah-sakit-klinik-umum',
    'Berita Acara Kehilangan Kartu Berobat',
    'Berita acara kehilangan kartu berobat atau kartu pasien.',
    'Administrasi klinik/rumah sakit untuk penggantian kartu.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama pasien","Nomor pasien","Kronologi","Permintaan"]'::jsonb,
    array['kartu berobat', 'kehilangan', 'pasien', 'admin']::text[],
    52,
    false
  ),
  (
    'surat-permohonan-salinan-rekam-medis',
    'surat-permohonan-salinan-rekam-medis',
    'rumah-sakit-klinik',
    'rumah-sakit-klinik-umum',
    'Surat Permohonan Salinan Rekam Medis',
    'Permohonan administratif meminta salinan rekam medis sesuai prosedur fasilitas kesehatan.',
    'Pasien atau keluarga mengajukan permohonan formal.',
    'Harus mengikuti aturan privasi dan prosedur fasilitas kesehatan.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pemohon","Hubungan","Identitas pasien","Keperluan"]'::jsonb,
    array['rekam medis', 'permohonan', 'pasien', 'admin']::text[],
    53,
    false
  ),
  (
    'surat-pernyataan-penanggung-jawab-pasien',
    'surat-pernyataan-penanggung-jawab-pasien',
    'rumah-sakit-klinik',
    'rumah-sakit-klinik-umum',
    'Surat Pernyataan Penanggung Jawab Pasien',
    'Pernyataan pihak yang bertanggung jawab atas kebutuhan administrasi pasien.',
    'Administrasi mencatat penanggung jawab non-medis.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Penanggung jawab","Pasien","Hubungan","Tanggung jawab"]'::jsonb,
    array['penanggung jawab', 'pasien', 'admin', 'klinik']::text[],
    54,
    false
  ),
  (
    'sop-front-office-klinik',
    'sop-front-office-klinik',
    'rumah-sakit-klinik',
    'rumah-sakit-klinik-umum',
    'SOP Front Office Klinik',
    'SOP pendaftaran pasien, antrean, pembayaran, dan serah terima dokumen.',
    'Klinik menstandarkan proses administrasi depan.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Alur pasien","PIC","Dokumen","SLA"]'::jsonb,
    array['sop', 'front office', 'klinik', 'pendaftaran']::text[],
    55,
    false
  ),
  (
    'surat-pernyataan-domisili',
    'surat-pernyataan-domisili',
    'legalitas-pribadi',
    'legalitas-pribadi-umum',
    'Surat Pernyataan Domisili',
    'Pernyataan alamat domisili untuk kebutuhan administratif.',
    'Keperluan data internal, komunitas, kerja, atau administrasi lain.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama","Alamat KTP","Alamat domisili","Keperluan"]'::jsonb,
    array['domisili', 'alamat', 'pernyataan', 'pribadi']::text[],
    56,
    false
  ),
  (
    'surat-pernyataan-kehilangan-dokumen',
    'surat-pernyataan-kehilangan-dokumen',
    'legalitas-pribadi',
    'legalitas-pribadi-umum',
    'Surat Pernyataan Kehilangan Dokumen',
    'Pernyataan kehilangan dokumen seperti kartu, bukti, atau arsip pribadi.',
    'Kronologi awal sebelum mengurus penggantian atau laporan resmi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama","Jenis dokumen","Kronologi","Keperluan"]'::jsonb,
    array['kehilangan', 'dokumen', 'kronologi', 'pribadi']::text[],
    57,
    false
  ),
  (
    'surat-izin-orang-tua',
    'surat-izin-orang-tua',
    'legalitas-pribadi',
    'legalitas-pribadi-umum',
    'Surat Izin Orang Tua',
    'Izin orang tua/wali untuk kegiatan, kerja, magang, atau administrasi.',
    'Menyatakan persetujuan wali secara tertulis.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama anak","Nama wali","Kegiatan","Tanggal"]'::jsonb,
    array['izin', 'orang tua', 'wali', 'kegiatan']::text[],
    58,
    false
  ),
  (
    'surat-keterangan-penghasilan',
    'surat-keterangan-penghasilan',
    'legalitas-pribadi',
    'legalitas-pribadi-umum',
    'Surat Keterangan Penghasilan',
    'Keterangan penghasilan untuk kebutuhan administratif non-pajak.',
    'Pengajuan sewa, sekolah, administrasi komunitas, atau data internal.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Nama","Pekerjaan","Penghasilan","Keperluan"]'::jsonb,
    array['penghasilan', 'keterangan', 'pribadi', 'administrasi']::text[],
    59,
    false
  ),
  (
    'surat-pernyataan-tidak-sengketa',
    'surat-pernyataan-tidak-sengketa',
    'legalitas-pribadi',
    'legalitas-pribadi-umum',
    'Surat Pernyataan Tidak Sengketa',
    'Pernyataan bahwa objek, dokumen, atau kondisi tertentu tidak sedang disengketakan.',
    'Draft awal kebutuhan administrasi pribadi atau bisnis.',
    'Perlu review profesional bila berkaitan dengan aset atau sengketa hukum.',
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Pihak yang menyatakan","Objek","Dasar pernyataan","Tanggal"]'::jsonb,
    array['tidak sengketa', 'pernyataan', 'legalitas']::text[],
    60,
    false
  ),
  (
    'draft-kronologi-kejadian-pribadi',
    'draft-kronologi-kejadian-pribadi',
    'legalitas-pribadi',
    'legalitas-pribadi-umum',
    'Draft Kronologi Kejadian Pribadi',
    'Kronologi pribadi yang runtut untuk menjelaskan masalah, kejadian, atau bukti.',
    'Lampiran laporan, pengaduan, klaim, atau klarifikasi.',
    null,
    'COMING_SOON',
    array['DOCX', 'PDF']::text[],
    '["Tanggal","Lokasi","Pihak terkait","Urutan kejadian","Bukti"]'::jsonb,
    array['kronologi', 'kejadian', 'pribadi', 'bukti']::text[],
    61,
    false
  )
on conflict (id) do update set
  slug = excluded.slug,
  category_id = excluded.category_id,
  subcategory_id = excluded.subcategory_id,
  title = excluded.title,
  description = excluded.description,
  use_case = excluded.use_case,
  risk = excluded.risk,
  status = excluded.status,
  output_format = excluded.output_format,
  fields = excluded.fields,
  tags = excluded.tags,
  sort_order = excluded.sort_order,
  is_featured = excluded.is_featured,
  updated_at = now();

comment on table public.document_categories is 'CK-DOC-03A: KilatDocs document categories.';
comment on table public.document_subcategories is 'CK-DOC-03A: KilatDocs document subcategories.';
comment on table public.document_catalog is 'CK-DOC-03A: KilatDocs document catalog. Documents can be ACTIVE, COMING_SOON, or ARCHIVED.';

commit;

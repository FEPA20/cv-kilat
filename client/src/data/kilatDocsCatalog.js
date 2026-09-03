// CK-DOC-00B-SAFE-V2
export const KILAT_DOCS_CATEGORIES = [
  { id: "surat-umum", title: "Surat Umum", icon: "✉", description: "Surat kuasa, pernyataan, permohonan, pemberitahuan, pengaduan, dan undangan resmi." },
  { id: "penagihan-somasi", title: "Penagihan & Somasi", icon: "⚖", description: "Penagihan invoice, reminder pembayaran, somasi, kronologi, dan kesepakatan bayar." },
  { id: "hr-karyawan", title: "HR & Karyawan", icon: "👥", description: "Resign, paklaring, teguran, surat tugas, cuti, mutasi, dan keterangan kerja." },
  { id: "sop-bisnis", title: "SOP & Bisnis", icon: "☷", description: "SOP HR, finance, purchasing, sales, customer service, operasional, dan checklist audit." },
  { id: "warehouse-logistik", title: "Warehouse & Logistik", icon: "▣", description: "BAST, surat jalan, stock opname, receiving, putaway, RMA, dan serah terima unit." },
  { id: "asuransi-klaim", title: "Asuransi & Klaim", icon: "◆", description: "Pengajuan klaim, kronologi, checklist klaim, keberatan, banding, dan kuasa klaim." },
  { id: "umkm-perusahaan", title: "UMKM & Perusahaan", icon: "◈", description: "Penawaran harga, invoice, kwitansi, MoU, kerja sama, jual beli, dan pemutusan kerja sama." },
  { id: "rumah-sakit-klinik", title: "Rumah Sakit / Klinik", icon: "✚", description: "Dokumen administratif klinik, pasien, front office, dan serah terima dokumen." },
  { id: "legalitas-pribadi", title: "Legalitas Pribadi", icon: "◉", description: "Domisili, kehilangan dokumen, izin orang tua, penghasilan, tidak sengketa, dan kronologi pribadi." },
];

const rawDocuments = [
  ["surat-kuasa","Surat Kuasa","surat-umum","Memberi wewenang kepada pihak lain untuk kebutuhan administratif.","Saat pengguna tidak bisa hadir atau perlu menunjuk perwakilan.","kuasa,perorangan,wakil,administrasi","Pemberi kuasa,Penerima kuasa,Tujuan kuasa,Masa berlaku",true],
  ["surat-pernyataan","Surat Pernyataan","surat-umum","Pernyataan tertulis tentang fakta, komitmen, atau tanggung jawab.","Untuk kebutuhan administrasi kantor, sekolah, bisnis, atau pribadi.","pernyataan,fakta,komitmen","Nama pembuat,Isi pernyataan,Tanggal,Saksi",true],
  ["surat-permohonan","Surat Permohonan","surat-umum","Mengajukan permintaan bantuan, izin, fasilitas, atau persetujuan.","Saat pengguna perlu menyampaikan permintaan secara formal.","permohonan,izin,persetujuan","Pemohon,Penerima,Tujuan permohonan,Alasan",false],
  ["surat-pengaduan","Surat Pengaduan","surat-umum","Pengaduan resmi atas layanan, produk, perilaku, atau kejadian.","Untuk menyampaikan keluhan dengan kronologi dan permintaan solusi.","pengaduan,komplain,kronologi","Pengadu,Pihak tujuan,Kronologi,Permintaan solusi",false],
  ["surat-pemberitahuan","Surat Pemberitahuan","surat-umum","Pemberitahuan resmi tentang kegiatan, perubahan, jadwal, atau keputusan.","Untuk perusahaan, komunitas, sekolah, atau perorangan.","pemberitahuan,jadwal,pengumuman","Pengirim,Penerima,Isi,Tanggal berlaku",false],
  ["surat-undangan-resmi","Surat Undangan Resmi","surat-umum","Undangan formal untuk rapat, acara, klarifikasi, atau pertemuan.","Mengundang pihak lain secara resmi dan rapi.","undangan,rapat,acara","Pengundang,Penerima,Agenda,Waktu dan tempat",false],

  ["surat-penagihan-invoice","Surat Penagihan Invoice","penagihan-somasi","Penagihan formal atas invoice yang belum dibayar.","Saat customer atau partner belum menyelesaikan pembayaran.","invoice,tagihan,piutang,pembayaran","Nomor invoice,Nominal,Jatuh tempo,Riwayat penagihan",true],
  ["surat-pengingat-pembayaran","Surat Pengingat Pembayaran","penagihan-somasi","Reminder pembayaran dengan bahasa formal namun tetap sopan.","Sebelum eskalasi ke penagihan tegas atau somasi.","reminder,pembayaran,jatuh tempo","Penerima,Nominal,Jatuh tempo,Instruksi bayar",false],
  ["surat-somasi","Surat Somasi","penagihan-somasi","Teguran formal agar pihak lain memenuhi kewajiban dalam batas waktu tertentu.","Eskalasi awal sengketa pembayaran, kewajiban, atau wanprestasi sederhana.","somasi,teguran,wanprestasi","Pengirim,Penerima,Dasar masalah,Batas waktu",true,"Butuh review profesional untuk kasus hukum kompleks."],
  ["kronologi-masalah-pembayaran","Kronologi Masalah Pembayaran","penagihan-somasi","Kronologi runtut terkait tagihan, janji bayar, komunikasi, dan bukti.","Lampiran penagihan, somasi, atau laporan internal.","kronologi,pembayaran,bukti","Tanggal kejadian,Pihak terkait,Bukti,Dampak",false],
  ["surat-kesepakatan-pembayaran","Surat Kesepakatan Pembayaran","penagihan-somasi","Kesepakatan pembayaran bertahap atau pelunasan.","Setelah pihak tertagih menyetujui skema pembayaran.","kesepakatan,cicilan,pelunasan","Pihak pertama,Pihak kedua,Nominal,Jadwal pembayaran",false],
  ["surat-pernyataan-hutang","Surat Pernyataan Hutang","penagihan-somasi","Pernyataan pengakuan hutang atau kewajiban pembayaran.","Mendokumentasikan kewajiban bayar secara tertulis.","hutang,piutang,pengakuan","Pemberi pernyataan,Penerima,Nominal,Tanggal bayar",false,"Perlu review profesional untuk nilai besar atau sengketa berat."],

  ["surat-resign","Surat Resign","hr-karyawan","Pengunduran diri formal, singkat, dan sopan.","Karyawan mengajukan resign dari perusahaan.","resign,pengunduran diri,karyawan","Nama karyawan,Jabatan,Tanggal efektif,Alasan",false],
  ["paklaring","Paklaring","hr-karyawan","Surat keterangan pengalaman kerja dari perusahaan.","HR menerbitkan bukti pengalaman kerja karyawan.","paklaring,keterangan kerja,hr","Nama karyawan,Jabatan,Periode kerja,Keterangan",true],
  ["surat-teguran","Surat Teguran","hr-karyawan","Teguran tertulis untuk pelanggaran ringan atau perbaikan kinerja.","HR atau atasan memberi peringatan administratif.","teguran,karyawan,disiplin","Nama karyawan,Jenis pelanggaran,Tanggal,Arahan",false],
  ["surat-peringatan","Surat Peringatan","hr-karyawan","SP karyawan dengan detail pelanggaran, dasar, dan konsekuensi.","Proses disiplin yang perlu terdokumentasi.","sp,surat peringatan,karyawan","Nama karyawan,SP ke-,Pelanggaran,Konsekuensi",false,"Perlu disesuaikan dengan peraturan perusahaan."],
  ["surat-tugas","Surat Tugas","hr-karyawan","Penugasan resmi untuk karyawan, tim, atau perwakilan perusahaan.","Saat seseorang ditugaskan ke lokasi, proyek, meeting, atau pekerjaan tertentu.","surat tugas,penugasan,karyawan","Pemberi tugas,Penerima tugas,Tujuan,Masa tugas",false],
  ["surat-cuti","Surat Cuti","hr-karyawan","Pengajuan cuti karyawan dengan periode dan alasan.","Administrasi cuti karyawan atau HR.","cuti,izin,karyawan","Nama karyawan,Jenis cuti,Tanggal cuti,Alasan",false],
  ["surat-keterangan-kerja","Surat Keterangan Kerja","hr-karyawan","Menerangkan status kerja karyawan aktif.","Pengajuan bank, sewa, visa, administrasi, atau kebutuhan pribadi.","keterangan kerja,aktif kerja,hr","Nama karyawan,Jabatan,Status kerja,Keperluan",false],
  ["surat-mutasi-karyawan","Surat Mutasi Karyawan","hr-karyawan","Pemberitahuan mutasi jabatan, lokasi, divisi, atau tanggung jawab.","Perusahaan memindahkan karyawan ke posisi atau lokasi baru.","mutasi,karyawan,jabatan,lokasi","Nama karyawan,Posisi lama,Posisi baru,Tanggal efektif",false],

  ["sop-hr-recruitment","SOP HR Recruitment","sop-bisnis","SOP rekrutmen dari kebutuhan posisi sampai onboarding.","Perusahaan atau UMKM yang ingin alur hiring lebih rapi.","sop,hr,rekrutmen,onboarding","Tujuan SOP,PIC,Tahapan,Dokumen",false],
  ["sop-finance-pengeluaran-kas","SOP Finance Pengeluaran Kas","sop-bisnis","SOP pengajuan, approval, pencairan, dan pertanggungjawaban kas.","Agar pengeluaran kas kecil atau operasional lebih terkontrol.","sop,finance,kas,approval","Tujuan,Limit,Approval,Dokumen bukti",false],
  ["sop-purchasing","SOP Purchasing","sop-bisnis","SOP pembelian barang atau jasa dari permintaan sampai penerimaan.","Mengatur pembelian agar jelas dan terdokumentasi.","sop,purchasing,pembelian,vendor","Permintaan,Approval,Vendor,Penerimaan",false],
  ["sop-sales-follow-up","SOP Sales Follow Up","sop-bisnis","SOP follow up prospek, customer, quotation, dan closing.","Tim sales agar tindak lanjut pelanggan konsisten.","sop,sales,follow up,customer","Tahapan sales,Waktu follow up,Template pesan,PIC",false],
  ["sop-customer-service","SOP Customer Service","sop-bisnis","SOP respon komplain, eskalasi, pencatatan tiket, dan penyelesaian.","Bisnis yang menerima keluhan atau pertanyaan customer.","sop,customer service,komplain,eskalasi","Jenis tiket,SLA,PIC,Eskalasi",false],
  ["sop-operasional-harian","SOP Operasional Harian","sop-bisnis","SOP rutinitas kerja harian, pembagian tugas, dan kontrol hasil kerja.","Toko, kantor, klinik, atau operasional kecil menengah.","sop,operasional,harian,checklist","Jam kerja,Aktivitas,PIC,Checklist",false],
  ["checklist-audit-internal","Checklist Audit Internal","sop-bisnis","Checklist audit untuk dokumen, stok, kas, operasional, atau kepatuhan SOP.","Pemeriksaan internal yang praktis dan terstruktur.","audit,checklist,internal,kontrol","Area audit,Item pemeriksaan,Temuan,Tindak lanjut",false],

  ["bast-barang","BAST Barang","warehouse-logistik","Berita acara serah terima barang antara dua pihak.","Saat barang diserahkan, diterima, dipinjamkan, atau dikembalikan.","bast,serah terima,barang,warehouse","Pihak pertama,Pihak kedua,Daftar barang,Kondisi barang",true],
  ["surat-jalan","Surat Jalan","warehouse-logistik","Dokumen pengiriman barang dari gudang ke tujuan.","Menyertai pengiriman dan bukti keluar barang.","surat jalan,pengiriman,logistik","Pengirim,Penerima,Tujuan,Daftar barang",false],
  ["berita-acara-kerusakan-barang","Berita Acara Kerusakan Barang","warehouse-logistik","Berita acara barang rusak saat diterima, disimpan, atau dikirim.","Dokumentasi kerusakan dan dasar klaim atau tindak lanjut.","kerusakan,barang,berita acara,klaim","Barang,Jenis kerusakan,Kronologi,Bukti",false],
  ["berita-acara-kehilangan-barang","Berita Acara Kehilangan Barang","warehouse-logistik","Berita acara kehilangan barang, unit, dokumen, atau aksesoris.","Laporan internal, investigasi, klaim, atau administrasi penggantian.","kehilangan,barang,investigasi","Barang hilang,Lokasi,Kronologi,Pihak terkait",false],
  ["form-receiving","Form Receiving","warehouse-logistik","Form penerimaan barang masuk dengan qty, kondisi, dan dokumen pendukung.","Admin gudang menerima barang dari supplier atau ekspedisi.","receiving,barang masuk,warehouse","Supplier,No dokumen,SKU,Qty,Kondisi",false],
  ["form-putaway","Form Putaway","warehouse-logistik","Form penempatan barang ke lokasi gudang.","Memastikan barang diterima ditempatkan ke lokasi yang benar.","putaway,lokasi,warehouse,stok","SKU,Qty,Lokasi asal,Lokasi tujuan",false],
  ["form-stock-opname","Form Stock Opname","warehouse-logistik","Form pemeriksaan stok fisik dan selisih stok.","Stock opname harian, mingguan, bulanan, atau audit.","stock opname,stok,inventory,audit","SKU,Qty sistem,Qty fisik,Selisih,Keterangan",false],
  ["form-rma-garansi","Form RMA / Garansi","warehouse-logistik","Form retur, RMA, atau klaim garansi produk.","Mencatat unit rusak, keluhan, hasil pengecekan, dan tindak lanjut.","rma,garansi,return,service","Customer,Produk,IMEI/serial,Keluhan,Status",true],
  ["form-serah-terima-unit","Form Serah Terima Unit","warehouse-logistik","Serah terima unit, perangkat, aksesoris, atau inventaris.","Unit berpindah tangan antar user, teknisi, admin, atau customer.","serah terima,unit,inventaris,asset","Pemberi,Penerima,Unit,Aksesoris,Kondisi",false],

  ["surat-pengajuan-klaim-asuransi","Surat Pengajuan Klaim Asuransi","asuransi-klaim","Pengajuan klaim asuransi dengan ringkasan kejadian dan permintaan proses.","Klaim kendaraan, kesehatan, properti, perjalanan, atau barang sesuai polis.","asuransi,klaim,pengajuan,polis","Pemegang polis,Nomor polis,Jenis klaim,Kronologi",true],
  ["kronologi-kejadian-klaim","Kronologi Kejadian Klaim","asuransi-klaim","Kronologi kejadian untuk mendukung pengajuan klaim.","Lampiran klaim agar kejadian jelas dan runtut.","kronologi,klaim,kejadian,asuransi","Tanggal kejadian,Lokasi,Pihak terkait,Bukti",false],
  ["checklist-dokumen-klaim","Checklist Dokumen Klaim","asuransi-klaim","Checklist dokumen yang perlu disiapkan untuk pengajuan klaim.","Agar dokumen klaim tidak tercecer sebelum dikirim ke asuransi.","checklist,klaim,dokumen,asuransi","Jenis klaim,Dokumen utama,Dokumen tambahan,Status",false],
  ["surat-keberatan-klaim","Surat Keberatan Klaim","asuransi-klaim","Keberatan atas hasil klaim, penolakan, atau nilai penggantian.","Meminta peninjauan kembali secara tertulis.","keberatan,klaim,penolakan,asuransi","Nomor klaim,Alasan keberatan,Bukti,Permintaan",false,"Perlu membaca ketentuan polis sebelum dikirim."],
  ["surat-banding-klaim","Surat Banding Klaim","asuransi-klaim","Banding atau permohonan peninjauan ulang klaim asuransi.","Jika keberatan awal belum diterima atau perlu eskalasi resmi.","banding,klaim,review,asuransi","Nomor klaim,Riwayat komunikasi,Dasar banding,Bukti",false,"Perlu disesuaikan dengan polis dan prosedur asuransi."],
  ["surat-kuasa-klaim-asuransi","Surat Kuasa Klaim Asuransi","asuransi-klaim","Kuasa kepada pihak lain untuk membantu proses klaim asuransi.","Pemegang polis menunjuk perwakilan untuk administrasi klaim.","kuasa,klaim,asuransi,perwakilan","Pemberi kuasa,Penerima kuasa,Nomor polis,Batas kuasa",false],

  ["perjanjian-kerja-sama-sederhana","Perjanjian Kerja Sama Sederhana","umkm-perusahaan","Kerja sama sederhana antara dua pihak untuk aktivitas bisnis tertentu.","UMKM atau perusahaan kecil mencatat peran, hak, dan kewajiban dasar.","kerja sama,perjanjian,bisnis,umkm","Pihak pertama,Pihak kedua,Ruang lingkup,Durasi",false,"Perlu review profesional untuk nilai besar atau kompleks."],
  ["surat-penawaran-harga","Surat Penawaran Harga","umkm-perusahaan","Penawaran harga barang atau jasa kepada calon customer.","Sales, UMKM, atau perusahaan mengirim proposal harga ringkas.","penawaran,harga,quotation,sales","Customer,Produk/jasa,Harga,Masa berlaku",true],
  ["invoice-formal","Invoice Formal","umkm-perusahaan","Invoice sederhana dengan rincian barang/jasa, nominal, dan instruksi pembayaran.","Penagihan transaksi bisnis.","invoice,tagihan,umkm,pembayaran","Nomor invoice,Customer,Item,Nominal,Rekening",false],
  ["kwitansi-pembayaran","Kwitansi Pembayaran","umkm-perusahaan","Bukti penerimaan pembayaran dengan nominal dan keterangan transaksi.","Bukti pembayaran tunai atau transfer.","kwitansi,pembayaran,bukti,transaksi","Penerima,Pembayar,Nominal,Keterangan",false],
  ["mou-sederhana","MoU Sederhana","umkm-perusahaan","Nota kesepahaman sederhana untuk rencana kerja sama.","Mencatat kesepahaman awal sebelum perjanjian detail.","mou,kesepahaman,kerja sama,bisnis","Para pihak,Maksud,Ruang lingkup,Jangka waktu",false],
  ["perjanjian-jual-beli-sederhana","Perjanjian Jual Beli Sederhana","umkm-perusahaan","Perjanjian jual beli barang sederhana.","Transaksi barang yang perlu bukti tertulis lebih rapi.","jual beli,perjanjian,barang,transaksi","Penjual,Pembeli,Barang,Harga,Serah terima",false,"Perlu review profesional untuk aset bernilai besar."],
  ["surat-pemutusan-kerja-sama","Surat Pemutusan Kerja Sama","umkm-perusahaan","Pemberitahuan penghentian kerja sama secara formal.","Salah satu pihak ingin mengakhiri hubungan kerja sama.","pemutusan,kerja sama,bisnis,pemberitahuan","Pengirim,Penerima,Dasar pemutusan,Tanggal efektif",false],

  ["surat-keterangan-berobat","Surat Keterangan Berobat","rumah-sakit-klinik","Dokumen administratif yang menerangkan seseorang berobat pada tanggal tertentu.","Format awal surat keterangan non-diagnosis.","klinik,rumah sakit,berobat,administrasi","Nama pasien,Tanggal berobat,Fasilitas kesehatan,Keperluan",false,"Konten medis wajib mengikuti kebijakan fasilitas kesehatan."],
  ["form-serah-terima-dokumen-pasien","Form Serah Terima Dokumen Pasien","rumah-sakit-klinik","Serah terima dokumen administratif pasien.","Mencatat dokumen yang diberikan atau diterima administrasi.","dokumen pasien,serah terima,klinik,admin","Pemberi,Penerima,Daftar dokumen,Tanggal",false],
  ["berita-acara-kehilangan-kartu-berobat","Berita Acara Kehilangan Kartu Berobat","rumah-sakit-klinik","Berita acara kehilangan kartu berobat atau kartu pasien.","Administrasi klinik/rumah sakit untuk penggantian kartu.","kartu berobat,kehilangan,pasien,admin","Nama pasien,Nomor pasien,Kronologi,Permintaan",false],
  ["surat-permohonan-salinan-rekam-medis","Surat Permohonan Salinan Rekam Medis","rumah-sakit-klinik","Permohonan administratif meminta salinan rekam medis sesuai prosedur fasilitas kesehatan.","Pasien atau keluarga mengajukan permohonan formal.","rekam medis,permohonan,pasien,admin","Pemohon,Hubungan,Identitas pasien,Keperluan",false,"Harus mengikuti aturan privasi dan prosedur fasilitas kesehatan."],
  ["surat-pernyataan-penanggung-jawab-pasien","Surat Pernyataan Penanggung Jawab Pasien","rumah-sakit-klinik","Pernyataan pihak yang bertanggung jawab atas kebutuhan administrasi pasien.","Administrasi mencatat penanggung jawab non-medis.","penanggung jawab,pasien,admin,klinik","Penanggung jawab,Pasien,Hubungan,Tanggung jawab",false],
  ["sop-front-office-klinik","SOP Front Office Klinik","rumah-sakit-klinik","SOP pendaftaran pasien, antrean, pembayaran, dan serah terima dokumen.","Klinik menstandarkan proses administrasi depan.","sop,front office,klinik,pendaftaran","Alur pasien,PIC,Dokumen,SLA",false],

  ["surat-pernyataan-domisili","Surat Pernyataan Domisili","legalitas-pribadi","Pernyataan alamat domisili untuk kebutuhan administratif.","Keperluan data internal, komunitas, kerja, atau administrasi lain.","domisili,alamat,pernyataan,pribadi","Nama,Alamat KTP,Alamat domisili,Keperluan",false],
  ["surat-pernyataan-kehilangan-dokumen","Surat Pernyataan Kehilangan Dokumen","legalitas-pribadi","Pernyataan kehilangan dokumen seperti kartu, bukti, atau arsip pribadi.","Kronologi awal sebelum mengurus penggantian atau laporan resmi.","kehilangan,dokumen,kronologi,pribadi","Nama,Jenis dokumen,Kronologi,Keperluan",false],
  ["surat-izin-orang-tua","Surat Izin Orang Tua","legalitas-pribadi","Izin orang tua/wali untuk kegiatan, kerja, magang, atau administrasi.","Menyatakan persetujuan wali secara tertulis.","izin,orang tua,wali,kegiatan","Nama anak,Nama wali,Kegiatan,Tanggal",false],
  ["surat-keterangan-penghasilan","Surat Keterangan Penghasilan","legalitas-pribadi","Keterangan penghasilan untuk kebutuhan administratif non-pajak.","Pengajuan sewa, sekolah, administrasi komunitas, atau data internal.","penghasilan,keterangan,pribadi,administrasi","Nama,Pekerjaan,Penghasilan,Keperluan",false],
  ["surat-pernyataan-tidak-sengketa","Surat Pernyataan Tidak Sengketa","legalitas-pribadi","Pernyataan bahwa objek, dokumen, atau kondisi tertentu tidak sedang disengketakan.","Draft awal kebutuhan administrasi pribadi atau bisnis.","tidak sengketa,pernyataan,legalitas","Pihak yang menyatakan,Objek,Dasar pernyataan,Tanggal",false,"Perlu review profesional bila berkaitan dengan aset atau sengketa hukum."],
  ["draft-kronologi-kejadian-pribadi","Draft Kronologi Kejadian Pribadi","legalitas-pribadi","Kronologi pribadi yang runtut untuk menjelaskan masalah, kejadian, atau bukti.","Lampiran laporan, pengaduan, klaim, atau klarifikasi.","kronologi,kejadian,pribadi,bukti","Tanggal,Lokasi,Pihak terkait,Urutan kejadian,Bukti",false],
];

export const KILAT_DOCS_CATALOG = rawDocuments.map((item) => ({
  id: item[0],
  title: item[1],
  categoryId: item[2],
  description: item[3],
  useCase: item[4],
  tags: item[5].split(","),
  fields: item[6].split(","),
  featured: Boolean(item[7]),
  risk: item[8] || "",
  outputFormat: ["DOCX", "PDF"],
  status: "ACTIVE" // CK-DOC-05A-SAFE: fallback lokal seluruh katalog aktif,
}));

export const getKilatDocsCategory = (categoryId) =>
  KILAT_DOCS_CATEGORIES.find((category) => category.id === categoryId) || null;

export const getKilatDocsCountByCategory = (categoryId) =>
  KILAT_DOCS_CATALOG.filter((document) => document.categoryId === categoryId).length;

export const KILAT_DOCS_TOTAL = KILAT_DOCS_CATALOG.length;

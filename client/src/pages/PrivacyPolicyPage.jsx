import LegalPageShell, {
  LegalList,
  LegalSection,
} from "../components/LegalPageShell";
import { LEGAL_CONFIG } from "../config/legalConfig";

export default function PrivacyPolicyPage({
  onBack = () => {},
  onNavigate = () => {},
}) {
  return (
    <LegalPageShell
      eyebrow="Pelindungan Data"
      title="Kebijakan Privasi"
      description={`Kebijakan ini menjelaskan bagaimana ${LEGAL_CONFIG.productName} mengumpulkan, menggunakan, menyimpan, membagikan, dan melindungi data pribadi pengguna.`}
      version={LEGAL_CONFIG.privacyVersion}
      onBack={onBack}
      onNavigate={onNavigate}
    >
      <LegalSection number="1" title="Pengendali Data">
        <p>
          Pengendali data untuk layanan ini adalah{" "}
          <strong>{LEGAL_CONFIG.operatorName}</strong>, beralamat di{" "}
          <strong>{LEGAL_CONFIG.operatorAddress}</strong>.
        </p>
        <p>
          Permintaan mengenai privasi dapat dikirim ke{" "}
          <strong>{LEGAL_CONFIG.privacyEmail}</strong>.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Data yang Kami Kumpulkan">
        <LegalList
          items={[
            "Data akun: email, ID pengguna, metode login, waktu pembuatan akun, dan metadata autentikasi.",
            "Data CV dan surat lamaran: nama, nomor telepon, alamat, foto, ringkasan, pengalaman kerja, pendidikan, keahlian, sertifikasi, bahasa, dan informasi lain yang dimasukkan pengguna.",
            "Data dari Google atau Apple: informasi dasar yang diberikan oleh penyedia login sesuai izin pengguna.",
            "Data penggunaan: halaman yang dibuka, tindakan pada aplikasi, perangkat, browser, alamat IP, log keamanan, dan informasi diagnostik.",
            "Data komunikasi: nama, email, subjek, dan isi pesan yang dikirim melalui halaman Hubungi Kami.",
            "Data pembayaran apabila fitur berbayar tersedia, dengan rincian pembayaran sensitif dapat diproses langsung oleh penyedia pembayaran.",
          ]}
        />
      </LegalSection>

      <LegalSection number="3" title="Sumber Data">
        <p>
          Data diperoleh langsung dari pengguna, dari penyedia autentikasi yang
          dipilih pengguna, dan secara otomatis ketika aplikasi digunakan.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Tujuan Pemrosesan">
        <LegalList
          items={[
            "Membuat, menyunting, menyimpan, menampilkan, dan mengunduh CV serta surat lamaran.",
            "Menyediakan akun, autentikasi, sinkronisasi, dan pemulihan kata sandi.",
            "Memproses template, fitur AI, dan pemeriksaan ATS yang diminta pengguna.",
            "Menjaga keamanan, mencegah penyalahgunaan, dan menangani gangguan teknis.",
            "Menjawab pertanyaan, keluhan, dan permintaan hak pengguna.",
            "Menganalisis dan meningkatkan performa produk apabila pengguna menyetujui cookie analitik.",
            "Memenuhi kewajiban hukum dan menegakkan ketentuan layanan.",
          ]}
        />
      </LegalSection>

      <LegalSection number="5" title="Dasar Pemrosesan">
        <p>
          Kami memproses data berdasarkan persetujuan pengguna, pelaksanaan
          perjanjian atau permintaan pengguna, pemenuhan kewajiban hukum,
          perlindungan kepentingan vital apabila relevan, dan kepentingan sah
          yang seimbang seperti keamanan dan pencegahan penyalahgunaan.
        </p>
        <p>
          Apabila pemrosesan bergantung pada persetujuan, pengguna dapat
          menarik persetujuan sesuai ketentuan hukum tanpa memengaruhi
          keabsahan pemrosesan sebelumnya.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Pembagian Data">
        <p>
          Data dapat diproses oleh penyedia layanan yang membantu menjalankan
          CV Kilat, antara lain:
        </p>
        <LegalList
          items={[
            "Penyedia database, autentikasi, penyimpanan, dan fungsi server seperti Supabase.",
            "Penyedia hosting, jaringan, keamanan, dan pengiriman email.",
            "Google dan Apple ketika pengguna memilih login melalui penyedia tersebut.",
            "Penyedia analitik hanya apabila cookie analitik diaktifkan.",
            "Penyedia pembayaran apabila fitur berbayar digunakan.",
            "Penasihat profesional, auditor, atau instansi berwenang ketika diwajibkan hukum.",
          ]}
        />
        <p>
          Kami tidak menjual data pribadi pengguna kepada pengiklan.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Pemrosesan Lintas Negara">
        <p>
          Penyedia teknologi dapat memproses atau menyimpan data di luar
          Indonesia. Apabila terjadi transfer lintas negara, kami akan
          menggunakan langkah perlindungan yang disyaratkan hukum dan menilai
          kecukupan perlindungan data yang relevan.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Penyimpanan dan Retensi">
        <LegalList
          items={[
            "Data akun dan dokumen disimpan selama akun aktif atau masih diperlukan untuk menyediakan layanan.",
            "Draft pada browser dapat tersimpan melalui localStorage sampai dihapus pengguna atau browser.",
            "Log keamanan dapat disimpan untuk periode yang wajar guna pencegahan penyalahgunaan dan investigasi.",
            "Setelah penghapusan akun, data aktif akan dihapus atau dianonimkan, kecuali terdapat kewajiban hukum untuk menyimpannya.",
            "Cadangan sistem dapat membutuhkan waktu tambahan sebelum terhapus sesuai siklus backup.",
          ]}
        />
      </LegalSection>

      <LegalSection number="9" title="Hak Pengguna">
        <p>
          Sesuai hukum yang berlaku, pengguna dapat mengajukan:
        </p>
        <LegalList
          items={[
            "Informasi mengenai identitas, dasar, tujuan, dan akuntabilitas pemrosesan data.",
            "Akses dan salinan data pribadi.",
            "Perbaikan atau pembaruan data yang tidak akurat.",
            "Pengakhiran pemrosesan, penghapusan, atau pemusnahan data.",
            "Penarikan persetujuan.",
            "Keberatan terhadap keputusan yang hanya didasarkan pada pemrosesan otomatis apabila menimbulkan akibat hukum atau dampak signifikan.",
            "Pemindahan data dalam format yang lazim apabila berlaku.",
            "Pengajuan keluhan atau tuntutan sesuai peraturan.",
          ]}
        />
        <p>
          Sebagian hak dapat dilakukan melalui menu Akun Saya. Permintaan lain
          dapat dikirim ke {LEGAL_CONFIG.privacyEmail}. Kami dapat meminta
          verifikasi identitas sebelum memproses permintaan.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Keamanan">
        <p>
          Kami menerapkan langkah teknis dan organisasi yang wajar, termasuk
          kontrol akses, autentikasi, enkripsi saat transmisi, pembatasan kunci
          administratif, dan pencatatan insiden.
        </p>
        <p>
          Tidak ada sistem elektronik yang sepenuhnya bebas risiko. Pengguna
          juga bertanggung jawab menjaga perangkat, email, dan kata sandinya.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Insiden Data">
        <p>
          Apabila terjadi kegagalan pelindungan data pribadi, kami akan
          melakukan penanganan, dokumentasi, dan pemberitahuan kepada pihak
          yang diwajibkan sesuai tenggat serta prosedur hukum yang berlaku.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Data Anak">
        <p>
          Layanan ditujukan bagi pengguna berusia sekurang-kurangnya{" "}
          {LEGAL_CONFIG.minimumAge} tahun. Pengguna di bawah usia tersebut
          hanya boleh menggunakan layanan dengan persetujuan dan pengawasan
          orang tua atau wali yang sah.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Cookie dan Penyimpanan Browser">
        <p>
          Kami menggunakan cookie atau penyimpanan browser untuk autentikasi,
          keamanan, preferensi, dan draft. Cookie analitik atau pemasaran hanya
          digunakan sesuai pilihan pengguna dan dijelaskan dalam Kebijakan
          Cookie.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Perubahan Kebijakan">
        <p>
          Kebijakan ini dapat diperbarui untuk mencerminkan perubahan layanan,
          penyedia, keamanan, dan hukum. Perubahan material akan diinformasikan
          melalui media yang wajar.
        </p>
      </LegalSection>

      <LegalSection number="15" title="Kontak Privasi">
        <p>
          Email privasi: <strong>{LEGAL_CONFIG.privacyEmail}</strong>
        </p>
        <p>
          Alamat: <strong>{LEGAL_CONFIG.operatorAddress}</strong>
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

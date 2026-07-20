import LegalPageShell, {
  LegalList,
  LegalSection,
} from "../components/LegalPageShell";
import { LEGAL_CONFIG } from "../config/legalConfig";

export default function TermsPage({
  onBack = () => {},
  onNavigate = () => {},
}) {
  return (
    <LegalPageShell
      eyebrow="Dokumen Legal"
      title="Syarat dan Ketentuan"
      description={`Ketentuan ini mengatur penggunaan layanan ${LEGAL_CONFIG.productName}, termasuk pembuatan CV, template, surat lamaran, akun, dan fitur pendukung lainnya.`}
      version={LEGAL_CONFIG.termsVersion}
      onBack={onBack}
      onNavigate={onNavigate}
    >
      <LegalSection number="1" title="Penerimaan Ketentuan">
        <p>
          Dengan mengakses, membuat akun, atau menggunakan layanan{" "}
          {LEGAL_CONFIG.productName}, Anda menyatakan telah membaca, memahami,
          dan menyetujui Syarat dan Ketentuan ini serta Kebijakan Privasi kami.
        </p>
        <p>
          Apabila Anda tidak menyetujui ketentuan ini, jangan melanjutkan
          penggunaan layanan.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Identitas Pengelola">
        <p>
          Layanan {LEGAL_CONFIG.productName} dikelola oleh{" "}
          <strong>{LEGAL_CONFIG.operatorName}</strong>, beralamat di{" "}
          <strong>{LEGAL_CONFIG.operatorAddress}</strong>.
        </p>
        <p>
          Pertanyaan umum dapat disampaikan ke{" "}
          <strong>{LEGAL_CONFIG.supportEmail}</strong>.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Kelayakan dan Akun">
        <LegalList
          items={[
            `Pengguna harus berusia sekurang-kurangnya ${LEGAL_CONFIG.minimumAge} tahun atau memperoleh persetujuan orang tua/wali yang sah.`,
            "Pengguna wajib memberikan informasi akun yang benar dan menjaga kerahasiaan kata sandi.",
            "Pengguna bertanggung jawab atas aktivitas yang terjadi melalui akunnya.",
            "Pengguna wajib segera menghubungi kami apabila mengetahui adanya penggunaan akun tanpa izin.",
            "Satu orang tidak boleh menggunakan akun untuk penipuan, penyamaran, atau tindakan melanggar hukum.",
          ]}
        />
      </LegalSection>

      <LegalSection number="4" title="Ruang Lingkup Layanan">
        <p>
          CV Kilat menyediakan alat bantu pembuatan, penyuntingan, penyimpanan,
          pratinjau, dan pengunduhan CV serta surat lamaran. Layanan dapat
          mencakup template, pemeriksaan ATS, rekomendasi penulisan, login pihak
          ketiga, dan fitur berbasis kecerdasan buatan.
        </p>
        <p>
          Fitur dapat ditambah, diubah, dibatasi, atau dihentikan untuk
          pemeliharaan, peningkatan keamanan, perubahan bisnis, atau kewajiban
          hukum.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Konten dan Tanggung Jawab Pengguna">
        <LegalList
          items={[
            "Pengguna bertanggung jawab atas kebenaran nama, pengalaman, pendidikan, keahlian, foto, dan informasi lain yang dimasukkan.",
            "Pengguna tidak boleh memasukkan data pribadi orang lain tanpa dasar dan izin yang sah.",
            "Pengguna tidak boleh mengunggah konten yang melanggar hak cipta, merek, privasi, kerahasiaan, atau hak pihak lain.",
            "Pengguna tidak boleh membuat CV palsu, menyesatkan, atau digunakan untuk penipuan dan tindakan ilegal.",
            "Pengguna wajib meninjau kembali dokumen sebelum mengirimkannya kepada perusahaan atau perekrut.",
          ]}
        />
      </LegalSection>

      <LegalSection number="6" title="Hak atas Konten">
        <p>
          Pengguna tetap memiliki hak atas data dan isi CV yang dibuatnya.
          Pengguna memberikan izin terbatas kepada CV Kilat untuk memproses,
          menyimpan, menampilkan, mengubah format, dan menghasilkan dokumen
          sejauh diperlukan untuk menyediakan layanan.
        </p>
        <p>
          Template, logo, antarmuka, kode, merek, dan elemen desain milik CV
          Kilat atau pemberi lisensinya tidak boleh disalin, dijual kembali,
          atau didistribusikan tanpa izin tertulis.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Template dan Data Contoh">
        <p>
          Data pada template merupakan contoh fiktif atau materi demonstrasi.
          Pengguna wajib mengganti data contoh sebelum menggunakan dokumen untuk
          keperluan nyata.
        </p>
        <p>
          Penggunaan template membuat salinan untuk pengguna dan tidak mengubah
          template master.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Fitur AI dan Pemeriksaan ATS">
        <LegalList
          items={[
            "Saran AI, skor ATS, dan rekomendasi penulisan bersifat alat bantu, bukan keputusan perekrutan.",
            "Hasil otomatis dapat tidak lengkap, tidak akurat, atau tidak sesuai dengan kebutuhan lowongan tertentu.",
            "Pengguna wajib memeriksa fakta, tata bahasa, relevansi, dan kepatuhan dokumen sebelum digunakan.",
            "CV Kilat tidak menjamin pengguna mendapat wawancara, pekerjaan, promosi, atau hasil tertentu.",
          ]}
        />
      </LegalSection>

      <LegalSection number="9" title="Penggunaan yang Dilarang">
        <LegalList
          items={[
            "Meretas, mengganggu, membebani, atau menguji keamanan sistem tanpa izin.",
            "Menggunakan bot, scraping, atau otomatisasi yang merugikan layanan.",
            "Menyebarkan malware, kode berbahaya, spam, atau konten ilegal.",
            "Menyalahgunakan akun, identitas, atau data pengguna lain.",
            "Menjual kembali akses layanan tanpa persetujuan tertulis.",
            "Menghindari pembatasan teknis, pembayaran, atau kontrol akses.",
          ]}
        />
      </LegalSection>

      <LegalSection number="10" title="Layanan Pihak Ketiga">
        <p>
          Sebagian fungsi dapat menggunakan penyedia pihak ketiga, termasuk
          layanan autentikasi, database, hosting, analitik, pembayaran, Google,
          dan Apple. Penggunaan layanan tersebut dapat tunduk pada ketentuan
          pihak ketiga yang bersangkutan.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Fitur Berbayar">
        <p>
          Apabila CV Kilat menawarkan fitur berbayar, harga, periode akses,
          pajak, perpanjangan, pembatalan, dan ketentuan pengembalian dana akan
          ditampilkan sebelum transaksi diselesaikan.
        </p>
        <p>
          Tidak ada biaya yang dikenakan tanpa persetujuan pengguna pada proses
          transaksi.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Penangguhan dan Pengakhiran">
        <p>
          Kami dapat membatasi atau menangguhkan akun apabila terdapat dugaan
          pelanggaran ketentuan, risiko keamanan, penyalahgunaan, kewajiban
          hukum, atau tindakan yang merugikan pengguna lain.
        </p>
        <p>
          Pengguna dapat berhenti menggunakan layanan dan mengajukan
          penghapusan akun melalui menu Akun Saya.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Ketersediaan dan Batas Tanggung Jawab">
        <p>
          Kami berupaya menjaga layanan tersedia dan aman, tetapi tidak
          menjamin layanan selalu bebas gangguan, kesalahan, kehilangan
          koneksi, atau kompatibel dengan seluruh perangkat.
        </p>
        <p>
          Sepanjang diperbolehkan hukum, tanggung jawab kami dibatasi pada
          kerugian langsung yang terbukti timbul akibat kesalahan kami. Ketentuan
          ini tidak menghapus hak konsumen atau tanggung jawab yang tidak dapat
          dikesampingkan berdasarkan hukum Indonesia.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Perubahan Ketentuan">
        <p>
          Kami dapat memperbarui ketentuan ini untuk menyesuaikan fitur, praktik
          bisnis, keamanan, dan peraturan. Perubahan material akan diberitahukan
          melalui website, akun, atau email apabila diperlukan.
        </p>
      </LegalSection>

      <LegalSection number="15" title="Hukum dan Penyelesaian Perselisihan">
        <p>
          Ketentuan ini ditafsirkan berdasarkan hukum Republik Indonesia.
          Perselisihan akan diupayakan terlebih dahulu melalui musyawarah.
          Apabila tidak selesai, para pihak dapat menggunakan mekanisme
          penyelesaian sengketa yang tersedia berdasarkan hukum Indonesia.
        </p>
      </LegalSection>

      <LegalSection number="16" title="Kontak">
        <p>
          Pertanyaan mengenai ketentuan ini dapat dikirim ke{" "}
          <strong>{LEGAL_CONFIG.supportEmail}</strong>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

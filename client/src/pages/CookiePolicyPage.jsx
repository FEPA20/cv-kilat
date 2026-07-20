import LegalPageShell, {
  LegalList,
  LegalSection,
} from "../components/LegalPageShell";
import { LEGAL_CONFIG } from "../config/legalConfig";

export default function CookiePolicyPage({
  onBack = () => {},
  onNavigate = () => {},
}) {
  return (
    <LegalPageShell
      eyebrow="Preferensi Browser"
      title="Kebijakan Cookie"
      description="Kebijakan ini menjelaskan cookie, localStorage, dan teknologi serupa yang digunakan pada CV Kilat."
      version={LEGAL_CONFIG.cookieVersion}
      onBack={onBack}
      onNavigate={onNavigate}
    >
      <LegalSection number="1" title="Pengertian">
        <p>
          Cookie adalah berkas kecil yang disimpan oleh browser. LocalStorage
          adalah penyimpanan pada browser yang dapat mempertahankan data seperti
          draft dan preferensi. Dalam kebijakan ini, keduanya disebut teknologi
          penyimpanan browser.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Kategori yang Digunakan">
        <LegalList
          items={[
            "Esensial: diperlukan untuk autentikasi, keamanan, sesi, pemulihan akun, dan fungsi utama aplikasi. Kategori ini tidak dapat dimatikan melalui banner.",
            "Preferensi: menyimpan pilihan bahasa, desain, template, dan pengaturan tampilan.",
            "Analitik: membantu memahami penggunaan dan performa produk. Digunakan setelah pengguna menyetujui.",
            "Pemasaran: digunakan untuk pengukuran kampanye atau iklan. Digunakan setelah pengguna menyetujui dan apabila fitur tersebut benar-benar dipasang.",
          ]}
        />
      </LegalSection>

      <LegalSection number="3" title="Penyimpanan yang Digunakan Saat Ini">
        <LegalList
          items={[
            "Sesi autentikasi yang dikelola oleh penyedia autentikasi.",
            "cv-kilat-builder-draft untuk memulihkan draft CV pada browser.",
            "cv-kilat-design-draft untuk memulihkan pengaturan desain.",
            "cv-kilat-cookie-consent-v1 untuk menyimpan pilihan cookie.",
            "cv-kilat-auth-return untuk mengembalikan pengguna ke halaman tujuan setelah login.",
          ]}
        />
      </LegalSection>

      <LegalSection number="4" title="Analitik dan Pemasaran">
        <p>
          Pada konfigurasi awal, CV Kilat hanya memerlukan teknologi esensial
          dan preferensi. Apabila alat analitik atau pemasaran ditambahkan,
          pemuatannya harus mengikuti pilihan yang tersimpan pada banner
          cookie.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Mengelola Pilihan">
        <p>
          Pengguna dapat menerima semua kategori, menggunakan hanya kategori
          esensial, atau mengatur pilihan melalui banner cookie. Preferensi
          juga dapat dihapus melalui pengaturan browser.
        </p>
        <p>
          Menghapus penyimpanan esensial dapat mengeluarkan pengguna dari akun,
          menghapus draft lokal, atau membuat beberapa fitur tidak bekerja.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Masa Simpan">
        <p>
          Masa simpan berbeda menurut fungsi. Sesi dapat berakhir otomatis,
          draft lokal bertahan sampai dihapus atau diganti, sedangkan pilihan
          cookie disimpan sampai pengguna mengubah atau menghapus data browser.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Perubahan">
        <p>
          Kebijakan ini akan diperbarui apabila kami menambah teknologi
          penyimpanan, analitik, iklan, atau penyedia baru.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Kontak">
        <p>
          Pertanyaan mengenai cookie dapat dikirim ke{" "}
          <strong>{LEGAL_CONFIG.privacyEmail}</strong>.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

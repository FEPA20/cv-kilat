import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import LegalPageShell from "../components/LegalPageShell";
import { LEGAL_CONFIG } from "../config/legalConfig";

const INITIAL_FORM = {
  name: "",
  email: "",
  subject: "Pertanyaan Umum",
  message: "",
  website: "",
};

export default function ContactPage({
  user = null,
  onBack = () => {},
  onNavigate = () => {},
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({
    type: "",
    text: "",
  });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
      form.subject.trim() &&
      form.message.trim().length >= 10 &&
      !loading
    );
  }, [form, loading]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.website) {
      setNotice({
        type: "success",
        text: "Pesan berhasil dikirim.",
      });
      return;
    }

    if (!canSubmit) {
      setNotice({
        type: "error",
        text: "Lengkapi nama, email, subjek, dan pesan minimal 10 karakter.",
      });
      return;
    }

    setLoading(true);
    setNotice({
      type: "",
      text: "",
    });

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          user_id: user || null,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          source: "website",
        });

      if (error) throw error;

      setForm(INITIAL_FORM);
      setNotice({
        type: "success",
        text:
          "Pesan berhasil dikirim. Tim CV Kilat akan meninjaunya secepat mungkin.",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setNotice({
        type: "error",
        text:
          "Pesan belum dapat dikirim. Pastikan tabel contact_messages sudah dibuat atau hubungi email support.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LegalPageShell
      eyebrow="Bantuan dan Pengaduan"
      title="Hubungi Kami"
      description="Sampaikan pertanyaan produk, masalah akun, permintaan privasi, laporan keamanan, atau masukan mengenai CV Kilat."
      version="1.0"
      onBack={onBack}
      onNavigate={onNavigate}
    >
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-4">
          <InfoCard
            title="Dukungan pengguna"
            value={LEGAL_CONFIG.supportEmail}
            text="Untuk bantuan akun, fitur CV, template, dan masalah teknis."
          />

          <InfoCard
            title="Privasi dan data"
            value={LEGAL_CONFIG.privacyEmail}
            text="Untuk akses, koreksi, ekspor, penghapusan data, atau keluhan privasi."
          />

          <InfoCard
            title="Alamat korespondensi"
            value={LEGAL_CONFIG.operatorAddress}
            text={LEGAL_CONFIG.operatorName}
          />

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Jangan mengirim kata sandi, kode OTP, secret key, atau data kartu
            pembayaran melalui formulir.
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 sm:p-7"
        >
          <div
            className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
            aria-hidden="true"
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              tabIndex="-1"
              autoComplete="off"
              value={form.website}
              onChange={(event) =>
                updateField("website", event.target.value)
              }
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama" htmlFor="contact-name">
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                disabled={loading}
                placeholder="Nama Anda"
                className={inputClass}
              />
            </Field>

            <Field label="Email" htmlFor="contact-email">
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                disabled={loading}
                placeholder="nama@email.com"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Topik" htmlFor="contact-subject">
            <select
              id="contact-subject"
              value={form.subject}
              onChange={(event) =>
                updateField("subject", event.target.value)
              }
              disabled={loading}
              className={inputClass}
            >
              <option>Pertanyaan Umum</option>
              <option>Masalah Akun</option>
              <option>Masalah Teknis</option>
              <option>Permintaan Privasi</option>
              <option>Penghapusan Data</option>
              <option>Laporan Keamanan</option>
              <option>Kerja Sama</option>
              <option>Masukan Produk</option>
            </select>
          </Field>

          <Field label="Pesan" htmlFor="contact-message">
            <textarea
              id="contact-message"
              rows="7"
              value={form.message}
              onChange={(event) =>
                updateField("message", event.target.value)
              }
              disabled={loading}
              placeholder="Jelaskan kebutuhan atau kendala Anda..."
              className={`${inputClass} resize-y`}
            />
          </Field>

          {notice.text && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                notice.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {notice.text}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3.5 font-extrabold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading && (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {loading ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      </div>
    </LegalPageShell>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60";

function Field({ label, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-5 block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({ title, value, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-600">
        {title}
      </p>
      <p className="mt-2 break-words font-extrabold text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

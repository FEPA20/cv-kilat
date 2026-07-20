import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function DeleteAccountPanel({
  user,
  onDeleted = () => {},
  onOpenLegal = () => {},
}) {
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (active) {
        setEmail(authUser?.email || "");
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const exportAccountData = async () => {
    if (!user) return;

    setLoading("export");
    setMessage({
      type: "",
      text: "",
    });

    try {
      const [
        authResult,
        cvResult,
        coverLetterResult,
      ] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from("cv_data")
          .select("*")
          .eq("user_id", user),
        supabase
          .from("cover_letters")
          .select("*")
          .eq("user_id", user),
      ]);

      if (cvResult.error) throw cvResult.error;

      const payload = {
        exported_at: new Date().toISOString(),
        account: {
          id: authResult.data?.user?.id || user,
          email: authResult.data?.user?.email || email,
          created_at:
            authResult.data?.user?.created_at || null,
          providers:
            authResult.data?.user?.app_metadata?.providers || [],
        },
        cvs: cvResult.data || [],
        cover_letters: coverLetterResult.error
          ? []
          : coverLetterResult.data || [],
        notes: coverLetterResult.error
          ? [
              "Data surat lamaran tidak dapat dibaca saat ekspor. Pastikan tabel cover_letters tersedia dan policy SELECT aktif.",
            ]
          : [],
      };

      const blob = new Blob(
        [JSON.stringify(payload, null, 2)],
        {
          type: "application/json",
        }
      );

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `cv-kilat-data-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setMessage({
        type: "success",
        text: "Salinan data akun berhasil diunduh.",
      });
    } catch (error) {
      console.error("Export account data error:", error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Data akun belum dapat diekspor. Silakan coba kembali.",
      });
    } finally {
      setLoading("");
    }
  };

  const deleteAccount = async () => {
    if (confirmation !== "HAPUS AKUN") {
      setMessage({
        type: "error",
        text:
          'Ketik tepat "HAPUS AKUN" untuk mengonfirmasi penghapusan.',
      });
      return;
    }

    const finalConfirmation = window.confirm(
      "Akun, CV, dan surat lamaran akan dihapus permanen. Tindakan ini tidak dapat dibatalkan. Lanjutkan?"
    );

    if (!finalConfirmation) return;

    setLoading("delete");
    setMessage({
      type: "",
      text: "",
    });

    try {
      const { data, error } = await supabase.functions.invoke(
        "delete-account",
        {
          body: {
            confirmation: "DELETE_MY_ACCOUNT",
          },
        }
      );

      if (error) throw error;

      if (!data?.success) {
        throw new Error(
          data?.error || "Penghapusan akun tidak berhasil."
        );
      }

      await supabase.auth.signOut();
      localStorage.removeItem("cv-kilat-builder-draft");
      localStorage.removeItem("cv-kilat-design-draft");
      sessionStorage.removeItem("cv-kilat-auth-return");

      setMessage({
        type: "success",
        text: "Akun berhasil dihapus.",
      });

      onDeleted();
    } catch (error) {
      console.error("Delete account error:", error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Akun belum dapat dihapus. Pastikan Edge Function delete-account sudah di-deploy.",
      });
    } finally {
      setLoading("");
    }
  };

  return (
    <section className="space-y-6">
      <article className="rounded-[26px] border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-600">
              Portabilitas data
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-950">
              Unduh salinan data akun
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Unduh data profil, CV, dan surat lamaran dalam format JSON sebelum
              menghapus akun atau untuk arsip pribadi.
            </p>
          </div>

          <button
            type="button"
            onClick={exportAccountData}
            disabled={Boolean(loading)}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "export" && <Spinner />}
            {loading === "export"
              ? "Menyiapkan..."
              : "Unduh Data"}
          </button>
        </div>
      </article>

      <article className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
          Hak dan kebijakan
        </p>
        <h2 className="mt-2 text-xl font-extrabold text-slate-950">
          Pelajari penggunaan data Anda
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <LegalButton
            label="Kebijakan Privasi"
            onClick={() => onOpenLegal("privacy")}
          />
          <LegalButton
            label="Syarat & Ketentuan"
            onClick={() => onOpenLegal("terms")}
          />
          <LegalButton
            label="Hubungi Kami"
            onClick={() => onOpenLegal("contact")}
          />
        </div>
      </article>

      <article className="rounded-[26px] border border-rose-200 bg-rose-50 p-6 sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-600">
          Zona berbahaya
        </p>
        <h2 className="mt-2 text-xl font-extrabold text-rose-950">
          Hapus akun secara permanen
        </h2>

        <p className="mt-3 text-sm leading-6 text-rose-900/75">
          Penghapusan akan menghapus akun autentikasi, CV, surat lamaran, dan
          data terkait yang dikelola CV Kilat. Data yang wajib disimpan menurut
          hukum atau yang masih berada dalam siklus backup dapat memiliki masa
          penghapusan tambahan.
        </p>

        {email && (
          <p className="mt-3 text-sm font-bold text-rose-900">
            Akun: {email}
          </p>
        )}

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold text-rose-900">
            Ketik HAPUS AKUN
          </span>
          <input
            type="text"
            value={confirmation}
            onChange={(event) =>
              setConfirmation(event.target.value)
            }
            disabled={Boolean(loading)}
            placeholder="HAPUS AKUN"
            className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        {message.text && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-6 ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-white text-rose-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="button"
          onClick={deleteAccount}
          disabled={
            confirmation !== "HAPUS AKUN" ||
            Boolean(loading)
          }
          className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-extrabold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "delete" && <Spinner />}
          {loading === "delete"
            ? "Menghapus akun..."
            : "Hapus Akun Permanen"}
        </button>
      </article>
    </section>
  );
}

function LegalButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
    >
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  );
}
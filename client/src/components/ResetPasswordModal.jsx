import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import LogoCVKilat from "./LogoCVKilat";

export default function ResetPasswordModal({
  onClose,
  onSuccess,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [loading, onClose]);

  const validate = () => {
    if (!password) {
      setMessage({
        type: "error",
        text: "Kata sandi baru wajib diisi.",
      });
      return false;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Kata sandi baru minimal 8 karakter.",
      });
      return false;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Konfirmasi kata sandi tidak sama.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setMessage({
      type: "",
      text: "",
    });

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      setMessage({
        type: "success",
        text:
          "Kata sandi berhasil diperbarui. Anda sekarang sudah masuk ke akun CV Kilat.",
      });

      window.setTimeout(() => {
        onSuccess?.();
      }, 900);
    } catch (error) {
      console.error("Update password error:", error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Kata sandi gagal diperbarui. Minta tautan reset baru dan coba kembali.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-slate-950/80
        px-4
        py-8
        backdrop-blur-md
      "
      role="dialog"
      aria-modal="true"
      aria-label="Buat kata sandi baru"
    >
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!loading) onClose?.();
        }}
      />

      <div className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0d172d] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-52 w-52 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-blue-500" />

        <div className="relative p-7 sm:p-9">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              absolute
              right-5
              top-5
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/5
              text-lg
              text-slate-400
              transition
              hover:bg-white/10
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label="Tutup"
          >
            ×
          </button>

          <div className="mb-7 flex justify-center">
            <LogoCVKilat variant="light" />
          </div>

          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
              <LockIcon className="h-7 w-7" />
            </span>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-white">
              Buat kata sandi baru
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Gunakan kata sandi yang kuat dan belum pernah digunakan pada akun
              ini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Kata sandi baru
              </label>

              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  placeholder="Minimal 8 karakter"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.06]
                    px-4
                    py-3.5
                    pr-14
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-500
                    focus:border-amber-400
                    focus:ring-4
                    focus:ring-amber-400/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-300 transition hover:text-amber-200"
                >
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-new-password"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Konfirmasi kata sandi baru
              </label>

              <input
                id="confirm-new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                disabled={loading}
                placeholder="Ulangi kata sandi baru"
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.06]
                  px-4
                  py-3.5
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-500
                  focus:border-amber-400
                  focus:ring-4
                  focus:ring-amber-400/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {message.text && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                  message.type === "success"
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-red-400/20 bg-red-400/10 text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-amber-400
                to-yellow-500
                px-5
                py-3.5
                font-bold
                text-slate-950
                shadow-lg
                shadow-amber-500/20
                transition
                hover:-translate-y-0.5
                hover:from-amber-300
                hover:to-yellow-400
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
              "
            >
              {loading && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
              )}

              {loading
                ? "Menyimpan..."
                : "Simpan kata sandi baru"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function LockIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 14v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

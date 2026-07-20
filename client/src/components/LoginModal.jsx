import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import LogoCVKilat from "./LogoCVKilat";
import { LEGAL_CONFIG } from "../config/legalConfig";

const INITIAL_MESSAGE = {
  type: "",
  text: "",
};

export default function LoginModal({
  onClose,
  onLogin,
  onOpenLegal = () => {},
  oauthReturnTo = "dashboard",
}) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [legalAccepted, setLegalAccepted] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState("");
  const [message, setMessage] =
    useState(INITIAL_MESSAGE);

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgotPassword = mode === "forgot";
  const busy = loading || Boolean(socialLoading);

  // Provider OAuth hanya ditampilkan jika sudah diaktifkan melalui .env.
  // Ini mencegah browser diarahkan ke error "provider is not enabled".
  const googleAuthEnabled =
    String(import.meta.env.VITE_ENABLE_GOOGLE_AUTH).toLowerCase() ===
    "true";

  const appleAuthEnabled =
    String(import.meta.env.VITE_ENABLE_APPLE_AUTH).toLowerCase() ===
    "true";

  const socialAuthAvailable =
    googleAuthEnabled || appleAuthEnabled;

  const modalTitle = useMemo(() => {
    if (isRegister) return "Buat akun CV Kilat";
    if (isForgotPassword) {
      return "Atur ulang kata sandi";
    }
    return "Selamat datang kembali";
  }, [isRegister, isForgotPassword]);

  const modalDescription = useMemo(() => {
    if (isRegister) {
      return "Daftar untuk menyimpan, mengedit, dan mengunduh CV profesional Anda.";
    }

    if (isForgotPassword) {
      return "Masukkan email akun Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.";
    }

    return "Masuk untuk melanjutkan mengedit, menyimpan, dan mengunduh CV Anda.";
  }, [isRegister, isForgotPassword]);

  useEffect(() => {
    setMessage(INITIAL_MESSAGE);
    setPassword("");
    setConfirmPassword("");

    if (mode === "forgot") {
      setLegalAccepted(false);
    }
  }, [mode]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !busy) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [busy, onClose]);

  const openLegal = (page) => {
    if (busy) return;
    onClose?.();
    onOpenLegal(page);
  };

  const validateEmail = () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessage({
        type: "error",
        text: "Email wajib diisi.",
      });
      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      setMessage({
        type: "error",
        text: "Format email belum valid.",
      });
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setMessage({
        type: "error",
        text: "Kata sandi wajib diisi.",
      });
      return false;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Kata sandi minimal 8 karakter.",
      });
      return false;
    }

    if (
      isRegister &&
      password !== confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "Konfirmasi kata sandi tidak sama.",
      });
      return false;
    }

    return true;
  };

  const validateLegalConsent = () => {
    if (!legalAccepted) {
      setMessage({
        type: "error",
        text:
          "Setujui Syarat dan Ketentuan serta Kebijakan Privasi untuk membuat akun.",
      });
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }

    setLoading(true);
    setMessage(INITIAL_MESSAGE);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) throw error;

      const userId = data?.user?.id;

      if (!userId) {
        throw new Error(
          "Data pengguna tidak ditemukan.",
        );
      }

      onLogin?.(userId);
    } catch (error) {
      console.error("Login error:", error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Login gagal. Periksa kembali email dan kata sandi Anda.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (
      !validateEmail() ||
      !validatePassword() ||
      !validateLegalConsent()
    ) {
      return;
    }

    setLoading(true);
    setMessage(INITIAL_MESSAGE);

    const acceptedAt = new Date().toISOString();

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo:
              `${window.location.origin}/`,
            data: {
              terms_accepted_at: acceptedAt,
              terms_version:
                LEGAL_CONFIG.termsVersion,
              privacy_accepted_at: acceptedAt,
              privacy_version:
                LEGAL_CONFIG.privacyVersion,
            },
          },
        });

      if (error) throw error;

      if (data?.session && data?.user?.id) {
        onLogin?.(data.user.id);
        return;
      }

      setMessage({
        type: "success",
        text:
          "Registrasi berhasil. Periksa email Anda untuk melakukan konfirmasi akun.",
      });
    } catch (error) {
      console.error("Register error:", error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Registrasi gagal. Silakan coba kembali.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    setMessage(INITIAL_MESSAGE);

    try {
      const recoveryUrl =
        `${window.location.origin}/?recovery=1`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: recoveryUrl,
          },
        );

      if (error) throw error;

      setMessage({
        type: "success",
        text:
          "Tautan reset kata sandi sudah dikirim. Periksa kotak masuk dan folder spam email Anda.",
      });
    } catch (error) {
      console.error(
        "Forgot password error:",
        error,
      );

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Tautan reset gagal dikirim. Silakan coba kembali.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    const providerEnabled =
      provider === "google"
        ? googleAuthEnabled
        : appleAuthEnabled;

    if (!providerEnabled) {
      setMessage({
        type: "error",
        text: `Masuk dengan ${
          provider === "google" ? "Google" : "Apple"
        } belum diaktifkan pada konfigurasi website.`,
      });
      return;
    }

    if (!validateLegalConsent()) return;

    setSocialLoading(provider);
    setMessage(INITIAL_MESSAGE);

    const consent = {
      acceptedAt: new Date().toISOString(),
      termsVersion: LEGAL_CONFIG.termsVersion,
      privacyVersion:
        LEGAL_CONFIG.privacyVersion,
    };

    try {
      sessionStorage.setItem(
        "cv-kilat-auth-return",
        oauthReturnTo || "dashboard",
      );

      sessionStorage.setItem(
        "cv-kilat-legal-consent",
        JSON.stringify(consent),
      );

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo:
              `${window.location.origin}/`,
          },
        });

      if (error) throw error;
    } catch (error) {
      console.error(
        `${provider} OAuth error:`,
        error,
      );

      sessionStorage.removeItem(
        "cv-kilat-auth-return",
      );
      sessionStorage.removeItem(
        "cv-kilat-legal-consent",
      );

      setMessage({
        type: "error",
        text:
          error?.message ||
          `Masuk dengan ${
            provider === "google"
              ? "Google"
              : "Apple"
          } gagal. Silakan coba kembali.`,
      });

      setSocialLoading("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isForgotPassword) {
      await handleForgotPassword();
      return;
    }

    if (isRegister) {
      await handleRegister();
      return;
    }

    await handleLogin();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/75 px-4 py-8 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={modalTitle}
    >
      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!busy) onClose?.();
        }}
      />

      <div className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0d172d] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-52 w-52 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-blue-500" />

        <div className="relative p-7 sm:p-9">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Tutup"
          >
            ×
          </button>

          <div className="mb-6 flex justify-center">
            <LogoCVKilat variant="light" />
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {modalTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
              {modalDescription}
            </p>
          </div>

          {!isForgotPassword && (
            <>
              <div className="mb-5 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.04] p-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  disabled={busy}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    isLogin
                      ? "bg-white text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMode("register")
                  }
                  disabled={busy}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    isRegister
                      ? "bg-white text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Register
                </button>
              </div>

              {!socialAuthAvailable && isLogin && (
                <div className="mb-5 rounded-xl border border-sky-400/15 bg-sky-400/10 px-4 py-3 text-xs leading-5 text-sky-200">
                  Login Google dan Apple akan tampil otomatis setelah
                  providernya diaktifkan melalui konfigurasi
                  <code className="mx-1 rounded bg-black/20 px-1.5 py-0.5">
                    .env
                  </code>
                  dan Supabase.
                </div>
              )}

              {(isRegister || socialAuthAvailable) && (
                <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                  <input
                    type="checkbox"
                    checked={legalAccepted}
                    onChange={(event) =>
                      setLegalAccepted(
                        event.target.checked,
                      )
                    }
                    disabled={busy}
                    className="mt-1 h-4 w-4 shrink-0 accent-amber-400"
                  />

                  <span className="text-xs leading-5 text-slate-400">
                    Saya menyetujui{" "}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        openLegal("terms");
                      }}
                      className="font-bold text-amber-300 hover:text-amber-200"
                    >
                      Syarat dan Ketentuan
                    </button>{" "}
                    serta{" "}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        openLegal("privacy");
                      }}
                      className="font-bold text-amber-300 hover:text-amber-200"
                    >
                      Kebijakan Privasi
                    </button>
                    . Persetujuan ini wajib untuk{" "}
                    {isRegister && socialAuthAvailable
                      ? "registrasi dan login sosial"
                      : isRegister
                        ? "registrasi"
                        : "login sosial"}
                    .
                  </span>
                </label>
              )}

              {socialAuthAvailable && (
                <>
                  <div className="grid gap-3">
                    {googleAuthEnabled && (
                      <SocialButton
                        provider="google"
                        loading={socialLoading}
                        disabled={
                          busy || !legalAccepted
                        }
                        onClick={() =>
                          handleSocialLogin("google")
                        }
                      />
                    )}

                    {appleAuthEnabled && (
                      <SocialButton
                        provider="apple"
                        loading={socialLoading}
                        disabled={
                          busy || !legalAccepted
                        }
                        onClick={() =>
                          handleSocialLogin("apple")
                        }
                      />
                    )}
                  </div>

                  <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                      atau email
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                </>
              )}
            </>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Field
              id="auth-email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={setEmail}
              disabled={busy}
            />

            {!isForgotPassword && (
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="auth-password"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Kata sandi
                  </label>

                  {isLogin && (
                    <button
                      type="button"
                      onClick={() =>
                        setMode("forgot")
                      }
                      disabled={busy}
                      className="text-xs font-bold text-amber-300 transition hover:text-amber-200"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>

                <input
                  id="auth-password"
                  type="password"
                  autoComplete={
                    isRegister
                      ? "new-password"
                      : "current-password"
                  }
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  disabled={busy}
                  className={inputClass}
                />
              </div>
            )}

            {isRegister && (
              <Field
                id="auth-confirm-password"
                label="Konfirmasi kata sandi"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi kata sandi"
                value={confirmPassword}
                onChange={setConfirmPassword}
                disabled={busy}
              />
            )}

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
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-3.5 font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:from-amber-300 hover:to-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading && (
                <LoadingSpinner dark />
              )}

              {loading
                ? "Memproses..."
                : isForgotPassword
                  ? "Kirim tautan reset"
                  : isRegister
                    ? "Buat Akun"
                    : "Masuk"}
            </button>

            {isForgotPassword && (
              <button
                type="button"
                onClick={() => setMode("login")}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Kembali ke login
              </button>
            )}
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-center text-xs text-slate-500">
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="hover:text-amber-300"
            >
              Syarat & Ketentuan
            </button>
            <button
              type="button"
              onClick={() =>
                openLegal("privacy")
              }
              className="hover:text-amber-300"
            >
              Kebijakan Privasi
            </button>
            <button
              type="button"
              onClick={() =>
                openLegal("contact")
              }
              className="hover:text-amber-300"
            >
              Bantuan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 disabled:cursor-not-allowed disabled:opacity-60";

function Field({
  id,
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-200"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        disabled={disabled}
        className={inputClass}
      />
    </div>
  );
}

function SocialButton({
  provider,
  loading,
  disabled,
  onClick,
}) {
  const isGoogle = provider === "google";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border px-4 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
        isGoogle
          ? "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
          : "border-white/15 bg-black text-white hover:bg-zinc-900"
      }`}
    >
      {loading === provider ? (
        <LoadingSpinner dark={isGoogle} />
      ) : isGoogle ? (
        <GoogleIcon className="h-5 w-5" />
      ) : (
        <AppleIcon className="h-5 w-5" />
      )}

      Masuk dengan {isGoogle ? "Google" : "Apple"}
    </button>
  );
}

function LoadingSpinner({ dark = false }) {
  return (
    <span
      className={`h-5 w-5 animate-spin rounded-full border-2 ${
        dark
          ? "border-slate-950/25 border-t-slate-950"
          : "border-white/25 border-t-white"
      }`}
    />
  );
}

function GoogleIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.34 2.98-7.37Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.4l-3.24-2.52c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.91A6 6 0 0 1 6.08 12c0-.66.11-1.31.31-1.91v-2.6H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.51l3.35-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.97 14.7 2 12 2a10 10 0 0 0-8.96 5.49l3.35 2.6C7.18 7.72 9.39 5.96 12 5.96Z"
      />
    </svg>
  );
}

function AppleIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.05 12.54c.02-2.02 1.65-2.99 1.72-3.03-.94-1.38-2.41-1.57-2.93-1.59-1.25-.13-2.44.73-3.07.73-.63 0-1.6-.71-2.63-.69-1.35.02-2.59.78-3.28 1.98-1.4 2.43-.36 6.02 1 7.99.67.96 1.46 2.04 2.5 2 1-.04 1.38-.65 2.59-.65s1.55.65 2.61.63c1.08-.02 1.76-.98 2.42-1.95.77-1.12 1.08-2.2 1.1-2.26-.02-.01-2.01-.77-2.03-3.16ZM15.03 6.6c.55-.67.92-1.6.82-2.53-.8.03-1.77.53-2.34 1.2-.51.59-.96 1.53-.84 2.43.89.07 1.81-.45 2.36-1.1Z" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M19 12H5M10 7l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
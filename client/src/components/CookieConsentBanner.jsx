import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "cv-kilat-cookie-consent-v1";

const DEFAULT_PREFERENCES = {
  essential: true,
  preferences: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

function getCookiePreferences() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(COOKIE_CONSENT_KEY)
    );

    return saved
      ? {
          ...DEFAULT_PREFERENCES,
          ...saved,
          essential: true,
        }
      : null;
  } catch {
    return null;
  }
}

function hasCookieConsent(category) {
  const preferences = getCookiePreferences();

  if (category === "essential") return true;
  return Boolean(preferences?.[category]);
}

export default function CookieConsentBanner({
  onOpenPolicy = () => {},
}) {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(
    DEFAULT_PREFERENCES
  );

  useEffect(() => {
    const saved = getCookiePreferences();

    if (!saved) {
      setVisible(true);
      return;
    }

    setPreferences(saved);
  }, []);

  const save = (nextPreferences) => {
    const payload = {
      ...DEFAULT_PREFERENCES,
      ...nextPreferences,
      essential: true,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify(payload)
    );

    window.dispatchEvent(
      new CustomEvent("cv-kilat-cookie-consent-changed", {
        detail: payload,
      })
    );

    setPreferences(payload);
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl rounded-[24px] border border-white/10 bg-[#0d172d]/95 p-5 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-lg font-extrabold">
              Pengaturan cookie CV Kilat
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Kami menggunakan penyimpanan esensial untuk login, keamanan, dan
              draft CV. Analitik serta pemasaran hanya digunakan sesuai pilihan
              Anda.
            </p>
            <button
              type="button"
              onClick={onOpenPolicy}
              className="mt-2 text-sm font-bold text-amber-300 hover:text-amber-200"
            >
              Baca Kebijakan Cookie
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                save({
                  essential: true,
                  preferences: true,
                  analytics: false,
                  marketing: false,
                })
              }
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              Hanya Esensial
            </button>

            <button
              type="button"
              onClick={() => setShowSettings((current) => !current)}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              Atur Pilihan
            </button>

            <button
              type="button"
              onClick={() =>
                save({
                  essential: true,
                  preferences: true,
                  analytics: true,
                  marketing: true,
                })
              }
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300"
            >
              Terima Semua
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <ConsentToggle
              label="Esensial"
              description="Login, keamanan, dan fungsi inti."
              checked
              disabled
            />

            <ConsentToggle
              label="Preferensi"
              description="Draft dan pilihan tampilan."
              checked={preferences.preferences}
              onChange={(checked) =>
                setPreferences((current) => ({
                  ...current,
                  preferences: checked,
                }))
              }
            />

            <ConsentToggle
              label="Analitik"
              description="Pengukuran penggunaan produk."
              checked={preferences.analytics}
              onChange={(checked) =>
                setPreferences((current) => ({
                  ...current,
                  analytics: checked,
                }))
              }
            />

            <ConsentToggle
              label="Pemasaran"
              description="Pengukuran iklan dan kampanye."
              checked={preferences.marketing}
              onChange={(checked) =>
                setPreferences((current) => ({
                  ...current,
                  marketing: checked,
                }))
              }
            />

            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="button"
                onClick={() => save(preferences)}
                className="w-full rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100"
              >
                Simpan Pilihan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsentToggle({
  label,
  description,
  checked,
  disabled = false,
  onChange = () => {},
}) {
  return (
    <label
      className={`flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      }`}
    >
      <span>
        <span className="block text-sm font-extrabold">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-400">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-amber-400"
      />
    </label>
  );
}

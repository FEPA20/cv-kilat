import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RatingModal({
  open = false,
  user = null,
  initialRating = 0,
  initialComment = "",
  onClose = () => {},
  onSaved = () => {},
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!open) return;

    setRating(Number(initialRating) || 0);
    setHoverRating(0);
    setComment(initialComment || "");
    setNotice(null);
  }, [open, initialRating, initialComment]);

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, saving, onClose]);

  if (!open) return null;

  const activeRating = hoverRating || rating;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setNotice({
        type: "error",
        text: "Silakan login terlebih dahulu untuk memberikan rating.",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      setNotice({
        type: "error",
        text: "Pilih rating antara 1 sampai 5 bintang.",
      });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const { error } = await supabase
        .from("app_ratings")
        .upsert(
          {
            user_id: user,
            rating,
            comment: comment.trim(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (error) {
        throw error;
      }

      setNotice({
        type: "success",
        text: "Terima kasih. Penilaian Anda berhasil disimpan.",
      });

      await onSaved({
        rating,
        comment: comment.trim(),
      });

      window.setTimeout(() => {
        onClose();
      }, 900);
    } catch (error) {
      console.error("Gagal menyimpan rating:", error);

      setNotice({
        type: "error",
        text:
          error?.message ||
          "Rating belum dapat disimpan. Silakan coba lagi.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-modal-title"
        className="w-full max-w-lg rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.32)] sm:p-8"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-600">
              Penilaian Pengguna
            </p>

            <h2
              id="rating-modal-title"
              className="mt-2 text-2xl font-black text-slate-900"
            >
              Bagaimana pengalaman Anda?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Penilaian Anda membantu kami meningkatkan CV Kilat.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            aria-label="Tutup formulir rating"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7"
        >
          <fieldset>
            <legend className="text-sm font-bold text-slate-700">
              Pilih jumlah bintang
            </legend>

            <div
              className="mt-4 flex justify-center gap-2"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= activeRating;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRating(value);
                      setNotice(null);
                    }}
                    onMouseEnter={() =>
                      setHoverRating(value)
                    }
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-4xl transition ${
                      active
                        ? "bg-amber-50 text-amber-400"
                        : "bg-slate-50 text-slate-300 hover:bg-amber-50 hover:text-amber-300"
                    }`}
                    aria-label={`${value} bintang`}
                    aria-pressed={rating === value}
                  >
                    ★
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-center text-sm font-semibold text-slate-600">
              {rating === 1 && "Sangat kurang"}
              {rating === 2 && "Kurang"}
              {rating === 3 && "Cukup"}
              {rating === 4 && "Baik"}
              {rating === 5 && "Sangat baik"}
              {!rating && "Belum memilih rating"}
            </p>
          </fieldset>

          <label className="mt-6 block">
            <span className="text-sm font-bold text-slate-700">
              Komentar
              <span className="ml-1 font-normal text-slate-400">
                (opsional)
              </span>
            </span>

            <textarea
              value={comment}
              onChange={(event) =>
                setComment(
                  event.target.value.slice(0, 500)
                )
              }
              rows={4}
              maxLength={500}
              placeholder="Ceritakan pengalaman Anda menggunakan CV Kilat..."
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />

            <span className="mt-1 block text-right text-xs text-slate-400">
              {comment.length}/500
            </span>
          </label>

          {notice ? (
            <div
              role="status"
              className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
                notice.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {notice.text}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Nanti Saja
            </button>

            <button
              type="submit"
              disabled={saving || rating < 1}
              className="rounded-2xl bg-[#ffc000] px-5 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-200 transition hover:bg-[#ffd038] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Menyimpan..."
                : "Kirim Penilaian"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
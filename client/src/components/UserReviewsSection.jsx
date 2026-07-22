import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function formatReviewDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function RatingStars({ rating }) {
  const safeRating = Math.max(
    0,
    Math.min(5, Number(rating) || 0)
  );

  return (
    <div
      className="flex gap-1"
      aria-label={`${safeRating} dari 5 bintang`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={
            value <= safeRating
              ? "text-lg leading-none text-amber-400"
              : "text-lg leading-none text-slate-600"
          }
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <article className="animate-pulse rounded-[24px] border border-white/10 bg-white/[0.05] p-6">
      <div className="h-5 w-32 rounded-full bg-white/10" />
      <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
      <div className="mt-2 h-4 w-[85%] rounded-full bg-white/10" />
      <div className="mt-2 h-4 w-[65%] rounded-full bg-white/10" />
      <div className="mt-6 h-3 w-28 rounded-full bg-white/10" />
    </article>
  );
}

export default function UserReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      setLoading(true);
      setLoadError(false);

      const { data, error } = await supabase.rpc(
        "get_public_app_reviews",
        {
          review_limit: 6,
        }
      );

      if (!active) return;

      if (error) {
        console.error(
          "Gagal mengambil ulasan pengguna:",
          error
        );

        setLoadError(true);
        setLoading(false);
        return;
      }

      setReviews(
        Array.isArray(data)
          ? data.filter(
              (item) =>
                String(item?.comment || "").trim()
                  .length > 0
            )
          : []
      );

      setLoading(false);
    };

    loadReviews();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      aria-labelledby="user-reviews-title"
      className="relative overflow-hidden bg-[#081326] px-6 py-24 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-40 top-12 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
            Ulasan Pengguna
          </span>

          <h2
            id="user-reviews-title"
            className="mt-5 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl"
          >
            Pengalaman pengguna bersama CV Kilat
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-400">
            Ulasan berikut berasal dari pengguna yang
            telah mencoba fitur CV Kilat dan sudah melalui
            proses moderasi.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </div>
        ) : null}

        {!loading && loadError ? (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-rose-300/15 bg-rose-300/[0.05] px-5 py-4 text-center text-sm text-rose-200">
            Ulasan belum dapat dimuat. Silakan coba
            kembali nanti.
          </div>
        ) : null}

        {!loading &&
        !loadError &&
        reviews.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl rounded-[24px] border border-white/10 bg-white/[0.05] px-6 py-10 text-center backdrop-blur">
            <div
              className="text-4xl"
              aria-hidden="true"
            >
              ⭐
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Belum ada ulasan yang ditampilkan
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Jadilah pengguna pertama yang memberikan
              pengalaman menggunakan CV Kilat.
            </p>
          </div>
        ) : null}

        {!loading &&
        !loadError &&
        reviews.length > 0 ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <article
                key={`${review.review_date || "review"}-${index}`}
                className="relative flex min-h-[250px] flex-col rounded-[24px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-300/25 hover:bg-white/[0.08]"
              >
                <div className="flex items-start justify-between gap-4">
                  <RatingStars
                    rating={review.rating}
                  />

                  <span
                    className="text-5xl font-black leading-none text-white/10"
                    aria-hidden="true"
                  >
                    “
                  </span>
                </div>

                <blockquote className="mt-5 flex-1 text-sm leading-7 text-slate-300">
                  “{String(review.comment).trim()}”
                </blockquote>

                <footer className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-white">
                    Pengguna CV Kilat
                  </p>

                  {formatReviewDate(
                    review.review_date
                  ) ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {formatReviewDate(
                        review.review_date
                      )}
                    </p>
                  ) : null}
                </footer>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
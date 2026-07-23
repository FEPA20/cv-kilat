import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

function ArrowIcon({ direction }) {
  const isLeft = direction === "left";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d={
          isLeft
            ? "M15 18l-6-6 6-6"
            : "M9 6l6 6-6 6"
        }
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavigationButton({
  direction,
  disabled,
  onClick,
}) {
  const label =
    direction === "left"
      ? "Ulasan sebelumnya"
      : "Ulasan berikutnya";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-white shadow-lg backdrop-blur transition duration-200 hover:border-amber-300/40 hover:bg-amber-300 hover:text-[#081326] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:bg-white/[0.07] disabled:hover:text-white"
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

function ReviewSkeleton() {
  return (
    <article className="w-[88%] flex-none animate-pulse snap-start rounded-[24px] border border-white/10 bg-white/[0.05] p-6 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
      <div className="h-5 w-32 rounded-full bg-white/10" />

      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded-full bg-white/10" />
        <div className="h-4 w-[88%] rounded-full bg-white/10" />
        <div className="h-4 w-[68%] rounded-full bg-white/10" />
      </div>

      <div className="mt-8 border-t border-white/10 pt-4">
        <div className="h-4 w-36 rounded-full bg-white/10" />
        <div className="mt-2 h-3 w-24 rounded-full bg-white/10" />
      </div>
    </article>
  );
}

function ReviewCard({ review }) {
  const reviewDate = formatReviewDate(
    review.review_date
  );

  return (
    <article className="group flex min-h-[270px] w-[88%] flex-none snap-start flex-col rounded-[24px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/[0.08] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
      <div className="flex items-start justify-between gap-4">
        <RatingStars rating={review.rating} />

        <span
          className="text-5xl font-black leading-none text-white/10 transition group-hover:text-amber-300/20"
          aria-hidden="true"
        >
          “
        </span>
      </div>

      <blockquote className="mt-5 line-clamp-5 flex-1 text-sm leading-7 text-slate-300">
        “{String(review.comment || "").trim()}”
      </blockquote>

      <footer className="mt-6 border-t border-white/10 pt-4">
        <p className="text-sm font-bold text-white">
          Pengguna CV Kilat
        </p>

        {reviewDate ? (
          <p className="mt-1 text-xs text-slate-500">
            {reviewDate}
          </p>
        ) : null}
      </footer>
    </article>
  );
}

export default function UserReviewsSection() {
  const carouselRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] =
    useState(false);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);
  const [canScrollRight, setCanScrollRight] =
    useState(false);

  const updateNavigation = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const maximumScroll =
      carousel.scrollWidth - carousel.clientWidth;

    setCanScrollLeft(carousel.scrollLeft > 4);

    setCanScrollRight(
      carousel.scrollLeft < maximumScroll - 4
    );
  }, []);

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      setLoading(true);
      setLoadError(false);

      const { data, error } = await supabase.rpc(
        "get_public_app_reviews",
        {
          review_limit: 12,
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

      const validReviews = Array.isArray(data)
        ? data.filter(
            (item) =>
              String(item?.comment || "").trim()
                .length > 0
          )
        : [];

      setReviews(validReviews);
      setLoading(false);
    };

    loadReviews();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return undefined;

    const handleUpdate = () => {
      window.requestAnimationFrame(
        updateNavigation
      );
    };

    handleUpdate();

    carousel.addEventListener(
      "scroll",
      handleUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      handleUpdate
    );

    return () => {
      carousel.removeEventListener(
        "scroll",
        handleUpdate
      );

      window.removeEventListener(
        "resize",
        handleUpdate
      );
    };
  }, [loading, reviews, updateNavigation]);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const scrollDistance =
      carousel.clientWidth * 0.85;

    carousel.scrollBy({
      left:
        direction === "left"
          ? -scrollDistance
          : scrollDistance,
      behavior: "smooth",
    });
  };

  const showCarousel =
    !loading &&
    !loadError &&
    reviews.length > 0;

  return (
    <section
      aria-labelledby="user-reviews-title"
      className="relative overflow-hidden bg-[#081326] px-6 py-24 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-40 top-12 h-[420px] w-[420px] rounded-full bg-sky-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-amber-400/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Ulasan Pengguna
            </span>

            <h2
              id="user-reviews-title"
              className="mt-5 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl"
            >
              Pengalaman pengguna bersama CV Kilat
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Ulasan berikut berasal dari pengguna
              yang telah mencoba fitur CV Kilat dan
              sudah melalui proses moderasi.
            </p>
          </div>

          {showCarousel ? (
            <div className="flex items-center gap-3">
              <NavigationButton
                direction="left"
                disabled={!canScrollLeft}
                onClick={() =>
                  scrollCarousel("left")
                }
              />

              <NavigationButton
                direction="right"
                disabled={!canScrollRight}
                onClick={() =>
                  scrollCarousel("right")
                }
              />
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-12 flex gap-5 overflow-hidden">
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
              Jadilah pengguna pertama yang
              memberikan pengalaman menggunakan CV
              Kilat.
            </p>
          </div>
        ) : null}

        {showCarousel ? (
          <>
            <div
              ref={carouselRef}
              className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {reviews.map((review, index) => (
                <ReviewCard
                  key={`${review.review_date || "review"}-${index}`}
                  review={review}
                />
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Geser atau gunakan tombol panah untuk
                melihat ulasan lainnya.
              </p>

              <p className="shrink-0 text-xs font-semibold text-slate-400">
                {reviews.length} ulasan
              </p>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
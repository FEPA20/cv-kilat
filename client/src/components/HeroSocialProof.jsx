import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import RatingModal from "./RatingModal";

const INITIAL_STATS = {
  userCount: 0,
  ratingCount: 0,
  averageRating: 0,
};

function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(
    Number(value) || 0
  );
}

function getUserId(user) {
  if (typeof user === "string") {
    return user;
  }

  return user?.id || null;
}

export default function HeroSocialProof({
  user = null,
  onLogin = () => {},
}) {
  const userId = getUserId(user);

  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [ratingModalOpen, setRatingModalOpen] =
    useState(false);

  const [loadingOwnRating, setLoadingOwnRating] =
    useState(false);

  const [ownRating, setOwnRating] = useState({
    rating: 0,
    comment: "",
  });

  const loadStats = useCallback(
    async ({ showLoading = true } = {}) => {
      if (showLoading) {
        setLoading(true);
      }

      const { data, error } = await supabase.rpc(
        "get_public_app_stats"
      );

      if (error) {
        console.error(
          "Gagal mengambil statistik CV Kilat:",
          error
        );

        setLoadError(true);
        setLoading(false);
        return;
      }

      const result = Array.isArray(data)
        ? data[0]
        : data;

      setStats({
        userCount:
          Number(result?.user_count) || 0,

        ratingCount:
          Number(result?.rating_count) || 0,

        averageRating:
          Number(result?.average_rating) || 0,
      });

      setLoadError(false);
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const stars = useMemo(() => {
    const roundedRating = Math.round(
      stats.averageRating
    );

    return Array.from(
      { length: 5 },
      (_, index) => index < roundedRating
    );
  }, [stats.averageRating]);

  const handleOpenRating = async () => {
    if (!userId) {
      onLogin();
      return;
    }

    setLoadingOwnRating(true);

    try {
      const { data, error } = await supabase
        .from("app_ratings")
        .select("rating, comment")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setOwnRating({
        rating: Number(data?.rating) || 0,
        comment: data?.comment || "",
      });

      setRatingModalOpen(true);
    } catch (error) {
      console.error(
        "Gagal membaca rating pengguna:",
        error
      );

      /*
       * Modal tetap dibuka agar pengguna masih dapat
       * mengirim rating baru melalui proses upsert.
       */
      setOwnRating({
        rating: 0,
        comment: "",
      });

      setRatingModalOpen(true);
    } finally {
      setLoadingOwnRating(false);
    }
  };

  const handleRatingSaved = async ({
    rating,
    comment,
  }) => {
    setOwnRating({
      rating,
      comment,
    });

    await loadStats({
      showLoading: false,
    });
  };

  if (loading) {
    return (
      <div
        className="mt-7 flex flex-wrap gap-3"
        aria-label="Memuat statistik pengguna"
      >
        <div className="h-16 w-52 animate-pulse rounded-2xl bg-white/70" />
        <div className="h-16 w-56 animate-pulse rounded-2xl bg-white/70" />
      </div>
    );
  }

  if (loadError) {
    return null;
  }

  return (
    <>
      <div className="mt-7 flex flex-wrap gap-3">
        <div className="inline-flex min-h-16 items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-xl"
            aria-hidden="true"
          >
            👥
          </span>

          <div>
            <p className="text-lg font-black leading-none text-slate-900">
              {formatNumber(stats.userCount)}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-600">
              Pengguna terdaftar
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loadingOwnRating}
          onClick={handleOpenRating}
          className="group inline-flex min-h-16 items-center gap-3 rounded-2xl border border-white/80 bg-white/75 px-4 py-3 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white hover:shadow-md disabled:cursor-wait disabled:opacity-70"
          aria-label={
            userId
              ? ownRating.rating > 0
                ? "Ubah rating Anda"
                : "Beri rating untuk CV Kilat"
              : "Login untuk memberikan rating"
          }
        >
          <div>
            <div
              className="flex gap-0.5"
              aria-label={
                stats.ratingCount > 0
                  ? `Rating ${stats.averageRating.toFixed(
                      1
                    )} dari 5`
                  : "Belum ada penilaian"
              }
            >
              {stars.map((active, index) => (
                <span
                  key={index}
                  className={
                    active
                      ? "text-lg leading-none text-amber-400"
                      : "text-lg leading-none text-slate-300 transition group-hover:text-amber-300"
                  }
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>

            {stats.ratingCount > 0 ? (
              <p className="mt-1 text-xs font-semibold text-slate-600">
                <strong className="text-slate-900">
                  {stats.averageRating.toFixed(1)}
                  /5
                </strong>

                {" dari "}

                {formatNumber(stats.ratingCount)}{" "}
                penilaian
              </p>
            ) : (
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Belum ada penilaian
              </p>
            )}

            <p className="mt-1 text-[11px] font-bold text-sky-600">
              {loadingOwnRating
                ? "Membuka formulir..."
                : userId
                  ? ownRating.rating > 0
                    ? "Ubah penilaian Anda"
                    : "Klik untuk beri rating"
                  : "Login untuk beri rating"}
            </p>
          </div>
        </button>
      </div>

      <RatingModal
        open={ratingModalOpen}
        user={userId}
        initialRating={ownRating.rating}
        initialComment={ownRating.comment}
        onClose={() =>
          setRatingModalOpen(false)
        }
        onSaved={handleRatingSaved}
      />
    </>
  );
}
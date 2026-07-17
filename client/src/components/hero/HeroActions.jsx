import LightningButton from "../ui/LightningButton";

export default function HeroActions() {
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">

      {/* Primary CTA */}
      <LightningButton
        className="
          flex items-center justify-center
          hover:scale-105
          active:scale-95
          transition-all
          duration-200
        "
      >
        <span className="mr-2 text-lg">⚡</span>
        Buat CV Gratis
      </LightningButton>

      {/* Secondary CTA */}
      <button
        type="button"
        className="
          flex items-center justify-center
          rounded-xl
          border
          border-slate-300
          bg-white/70
          px-6
          py-3
          font-semibold
          text-slate-900
          transition-all
          duration-200
          hover:scale-105
          active:scale-95
          hover:border-slate-400
          hover:bg-white
          hover:shadow-md
        "
      >
        Lihat Template
      </button>

    </div>
  );
}
import LightningCard from "../ui/LightningCard";

export default function HeroPreview() {
  return (
    <div className="relative flex justify-center lg:justify-end">

      {/* Glow background */}
      <div
        className="
          absolute
          -inset-4
          rounded-3xl
          bg-yellow-200/40
          blur-2xl
        "
      />

      <LightningCard
        className="
          relative
          w-full
          max-w-md
          p-6
          animate-[float_6s_ease-in-out_infinite]
        "
      >

        {/* ATS Badge */}
        <div
          className="
            absolute
            top-4
            right-4
            text-xs
            px-3
            py-1
            rounded-full
            bg-green-100
            text-green-700
            font-semibold
            shadow-sm
          "
        >
          ATS ✓
        </div>

        {/* Fake CV Preview */}
        <div className="space-y-4">

          <div className="h-6 w-32 rounded bg-slate-200"></div>

          <div className="h-4 w-full rounded bg-slate-200"></div>
          <div className="h-4 w-5/6 rounded bg-slate-200"></div>

          <div className="h-4 w-3/4 rounded bg-slate-200"></div>

          <div className="mt-6 space-y-2">
            <div className="h-3 w-full rounded bg-slate-200"></div>
            <div className="h-3 w-5/6 rounded bg-slate-200"></div>
            <div className="h-3 w-4/6 rounded bg-slate-200"></div>
          </div>

        </div>

      </LightningCard>

    </div>
  );
}
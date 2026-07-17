import LightningContainer from "../components/ui/LightningContainer";

export default function CTASection() {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <LightningContainer>

        <div className="mx-auto max-w-3xl text-center">

          <h2 className="text-4xl font-bold">
            Siap Buat CV Profesional Kamu?
          </h2>

          <p className="mt-4 text-lg text-slate-300">
            Mulai sekarang dan buat CV yang menarik perhatian HR hanya dalam beberapa menit.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

            {/* Primary CTA */}
            <button className="
              rounded-xl
              bg-yellow-500
              px-8
              py-3
              text-lg
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:scale-105
              hover:bg-yellow-600
              active:scale-95
            ">
              ⚡ Buat CV Sekarang
            </button>

            {/* Secondary */}
            <button className="
              rounded-xl
              border
              border-white/30
              px-8
              py-3
              text-lg
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-white/10
            ">
              Lihat Template
            </button>

          </div>

        </div>

      </LightningContainer>
    </section>
  );
}
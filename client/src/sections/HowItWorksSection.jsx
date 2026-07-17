import LightningContainer from "../components/ui/LightningContainer";

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-slate-50">
      <LightningContainer>

        {/* Title */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Cara Kerja CV Kilat
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Hanya 3 langkah mudah untuk mendapatkan CV profesional kamu.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-20">

          {/* Garis tengah */}
          <div className="
            absolute
            left-1/2
            top-0
            h-full
            w-[2px]
            -translate-x-1/2
            bg-slate-200
          " />

          <div className="space-y-16">

            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="
                z-10
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-yellow-500
                text-white
                font-bold
                shadow
              ">
                1
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Isi Data
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-600">
                Masukkan informasi diri kamu dengan mudah tanpa ribet.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="
                z-10
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-yellow-500
                text-white
                font-bold
                shadow
              ">
                2
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Pilih Template
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-600">
                Pilih desain CV yang sesuai dengan kebutuhan kamu.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="
                z-10
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-yellow-500
                text-white
                font-bold
                shadow
              ">
                3
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                Download & Kirim
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-600">
                CV siap digunakan untuk melamar kerja ke perusahaan impian.
              </p>
            </div>

          </div>

        </div>

      </LightningContainer>
    </section>
  );
}
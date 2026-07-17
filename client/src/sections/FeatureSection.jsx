import LightningContainer from "../components/ui/LightningContainer";

export default function FeatureSection() {
  return (
    <section className="py-24 bg-white">
      <LightningContainer>

        {/* Title */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Kenapa Pilih CV Kilat?
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Dibuat untuk membantu kamu membuat CV profesional dengan cepat,
            mudah, dan siap lolos sistem ATS perusahaan.
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {/* Feature Card */}
          {[
            {
              icon: "⚡",
              title: "Super Cepat",
              desc: "Buat CV hanya dalam hitungan menit tanpa ribet.",
            },
            {
              icon: "📄",
              title: "Template Profesional",
              desc: "Desain modern yang siap digunakan untuk melamar kerja.",
            },
            {
              icon: "✅",
              title: "ATS Friendly",
              desc: "CV kamu dioptimalkan agar lolos sistem screening HR.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="
                group
                relative
                rounded-2xl
                border
                border-slate-200
                p-6
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >

              {/* Glow effect */}
              <div className="
                absolute
                inset-0
                rounded-2xl
                bg-yellow-200/0
                opacity-0
                blur-xl
                transition-all
                duration-300
                group-hover:bg-yellow-200/40
                group-hover:opacity-100
              " />

              {/* Content */}
              <div className="relative z-10">
                <div className="text-3xl mb-4">{item.icon}</div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {item.desc}
                </p>
              </div>

            </div>
          ))}

        </div>

      </LightningContainer>
    </section>
  );
}
import LightningContainer from "../components/ui/LightningContainer";

import cv1 from "../assets/templates/cv1.png";
import cv2 from "../assets/templates/cv2.png";
import cv3 from "../assets/templates/cv3.png";

export default function TemplateSection() {
  const templates = [cv1, cv2, cv3];

  return (
    <section className="py-24 bg-white">
      <LightningContainer>

        {/* Title */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Template CV Profesional
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Pilih desain CV yang modern, rapi, dan siap digunakan untuk melamar kerja.
          </p>
        </div>

        {/* Template Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {templates.map((img, index) => (
            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >

              {/* Image Preview */}
              <img
                src={img}
                alt="CV Template"
                className="
                  w-full
                  h-[420px]
                  object-cover
                  transition
                  duration-300
                  group-hover:scale-105
                "
              />

              {/* Overlay */}
              <div className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/40
                opacity-0
                transition-all
                duration-300
                group-hover:opacity-100
              ">
                <button className="
                  rounded-xl
                  bg-yellow-500
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-yellow-600
                ">
                  Gunakan Template
                </button>
              </div>

            </div>
          ))}

        </div>

      </LightningContainer>
    </section>
  );
}
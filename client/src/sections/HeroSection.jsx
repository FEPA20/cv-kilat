import LightningContainer from "../components/ui/LightningContainer";

import HeroBadge from "../components/hero/HeroBadge";
import HeroTitle from "../components/hero/HeroTitle";
import HeroDescription from "../components/hero/HeroDescription";
import HeroActions from "../components/hero/HeroActions";
import HeroPreview from "../components/hero/HeroPreview";

export default function HeroSection() {
   return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-50">
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-48
          top-1/2
          h-[700px]
          w-[700px]
          -translate-y-1/2
          rounded-full
          bg-yellow-300/20
          blur-[140px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-48
          -top-48
          h-[420px]
          w-[420px]
          rounded-full
          bg-blue-200/20
          blur-[120px]
        "
      />

      <LightningContainer className="relative z-10 pt-32 pb-20 lg:pt-36 lg:pb-24">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <HeroBadge />

            <HeroTitle />

            <HeroDescription />

            <HeroActions />
          </div>

          <HeroPreview />
        </div>
      </LightningContainer>
    </section>
  );
}
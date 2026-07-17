export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24">

      {/* Background Effect */}

      <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl"></div>

      <LightningContainer>

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}

          <div>

            <HeroBadge />

            <HeroTitle />

            <HeroDescription />

            <HeroActions />

          </div>

          {/* Right */}

          <HeroPreview />

        </div>

      </LightningContainer>

    </section>
  );
}
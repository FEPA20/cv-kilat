import Navbar from "./layouts/Navbar";
import HeroSection from "./sections/HeroSection";
import FeatureSection from "./sections/FeatureSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import TemplateSection from "./sections/TemplateSection";
import CTASection from "./sections/CTASection";

export default function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <TemplateSection />
      <CTASection />
    </>
  );
}
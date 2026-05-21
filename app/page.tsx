import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GreenlandSection from "@/components/GreenlandSection";
import CTABanner from "@/components/CTABanner";
import BasedInGreenland from "@/components/BasedInGreenland";
import AboutPreview from "@/components/AboutPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <GreenlandSection />
      <CTABanner />
      <BasedInGreenland />
      <AboutPreview />
      <Footer />
    </main>
  );
}

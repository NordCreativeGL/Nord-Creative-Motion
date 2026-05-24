import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GreenlandSection from "@/components/GreenlandSection";
import CTABanner from "@/components/CTABanner";
import GlobeSection from "@/components/GlobeSection";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";

export default function Home() {
  return (
    <main className="bg-black">
      <ScrollManager />
      <HeroSection />
      <ServicesSection />
      <GreenlandSection />
      <CTABanner />
      <GlobeSection />
      <Footer />
    </main>
  );
}

import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GreenlandSection from "@/components/GreenlandSection";
import CTABanner from "@/components/CTABanner";
import BasedInGreenland from "@/components/BasedInGreenland";
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
      <BasedInGreenland />
      <Footer />
    </main>
  );
}

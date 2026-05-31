"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GreenlandSection from "@/components/GreenlandSection";
import CTABanner from "@/components/CTABanner";
import BasedInGreenland from "@/components/BasedInGreenland";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";
import SideNav from "@/components/SideNav";

export default function Home() {
  useEffect(() => {
    const prefetch = () => {
      const videos = [
        'https://cdn.nordcreative.dk/P1%20HEADER.mp4',
        'https://cdn.nordcreative.dk/P60%20HEADER.mp4',
        'https://cdn.nordcreative.dk/P68%20HEADER.mp4',
      ];
      videos.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'video';
        document.head.appendChild(link);
      });
    };
    const timer = setTimeout(prefetch, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-black">
      <ScrollManager />
      <SideNav />
      <div style={{ position: 'relative', zIndex: 0 }}>
        <HeroSection />
      </div>
      <ServicesSection />
      <GreenlandSection />
      <BasedInGreenland />
      <CTABanner />
      <Footer />
    </main>
  );
}

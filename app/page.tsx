"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import GreenlandSection from "@/components/GreenlandSection";
import CTABanner from "@/components/CTABanner";
import BasedInGreenland from "@/components/BasedInGreenland";
import Footer from "@/components/Footer";
import SideNav from "@/components/SideNav";
import StarfieldCanvas from '@/components/StarfieldCanvas'

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

    if (document.readyState === 'complete') {
      const timer = setTimeout(prefetch, 2000);
      return () => clearTimeout(timer);
    } else {
      const onLoad = () => {
        const timer = setTimeout(prefetch, 2000);
        return () => clearTimeout(timer);
      };
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  return (
    <main>
      <StarfieldCanvas />
      <SideNav />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ServicesSection />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <GreenlandSection />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <BasedInGreenland />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CTABanner />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </main>
  );
}

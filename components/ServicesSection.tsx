"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    type: "image" as const,
    src: "https://cdn.nordcreative.dk/IMG_5200.jpg",
    title: "Photography",
    description: "Professional photography that showcases your product, project, or business through strong visual storytelling.",
  },
  {
    type: "video" as const,
    src: "https://cdn.nordcreative.dk/P46%20%C3%98ST%20KYSTEN%20.mp4",
    title: "Drone & Aerial",
    description: "Aerial imagery that reveals landscapes, projects, and locations from powerful new perspectives.",
  },
  {
    type: "video" as const,
    src: "https://cdn.nordcreative.dk/P37.mp4",
    title: "Video production",
    description: "Cinematic shots that communicate your story and present your business, product, or project in a compelling way.",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const isFirstRender = useRef(true);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { lang } = useLang()

  const CARD_H = isMobile ? 'calc(88vw * 16 / 9)' : '84vh';
  const CARD_W = isMobile ? '88vw' : 'calc(84vh * 9 / 16)';

  useEffect(() => {
    const section = sectionRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    if (!section || !card1 || !card2 || !card3) return;

    const ctx = gsap.context(() => {
      const cardHeightPx = window.innerWidth < 1024
        ? window.innerHeight * 0.82
        : window.innerHeight * 0.84;
      if (window.innerWidth >= 1024) {
        gsap.set(card2, { y: cardHeightPx });
        gsap.set(card3, { y: cardHeightPx + 22 });
      }

      if (window.innerWidth >= 1024) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
          },
        });

        tl.to(card1, { scale: 0.94, duration: 1 }, 0.5)
          .to(card2, { y: 0, duration: 1 }, 0.5)
          .to(card2, { scale: 0.94, duration: 1 }, 1.5)
          .to(card3, { y: 0, duration: 1 }, 1.5);

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const idx = self.progress < 0.33 ? 0 : self.progress < 0.67 ? 1 : 2;
            setActiveCard(idx);
          },
        });
      }

      if (window.innerWidth >= 1024) {
        gsap.set([labelRef.current, accentRef.current, bodyRef.current], { opacity: 0 });
        gsap.set([line1Ref.current, line2Ref.current], {
          clipPath: 'inset(0 100% 0 0)',
          x: -10,
        });
      }

      if (window.innerWidth >= 1024) {
        gsap.set(card1Ref.current, { y: cardHeightPx });

        const entranceTl = gsap.timeline({ paused: true });

        entranceTl
          .to(labelRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
          .to(line1Ref.current, {
            clipPath: 'inset(0 0% 0 0)',
            x: 0,
            duration: 0.85,
            ease: 'power4.inOut',
          }, 0.15)
          .to(line2Ref.current, {
            clipPath: 'inset(0 0% 0 0)',
            x: 0,
            duration: 0.85,
            ease: 'power4.inOut',
          }, 0.30)
          .to(accentRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.85)
          .to(bodyRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.0)
          .to(card1Ref.current, { y: 0, duration: 1.0, ease: 'power3.out' }, 0.2);

        const hasAnimated = { current: false };

        const onScroll = () => {
          if (hasAnimated.current) return;
          const sectionTop = (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
          if (window.scrollY >= sectionTop - window.innerHeight * 0.5) {
            hasAnimated.current = true;
            entranceTl.play();
            window.removeEventListener('scroll', onScroll);
          }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!accentRef.current || !bodyRef.current) return
    gsap.fromTo(
      [accentRef.current, bodyRef.current],
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    )
  }, [activeCard])

  const t = {
    en: {
      eyebrow: 'What we offer',
      h1: 'Photo, video and websites',
      h2: 'Produced in Greenland.',
      c1t: 'Photography',
      c1d: 'Photography for businesses in Greenland — for websites, annual reports, press materials, and documentation. We plan the shoot, know the locations, and deliver images that show what you actually do.',
      c2t: 'Drone & Aerial',
      c2d: 'Aerial footage is often what makes the final result stand out. We use drone for location overviews, project documentation, and landscape footage — and it\'s consistently what clients react to most.',
      c3t: 'Video production',
      c3d: 'Film for your website, social media, or presentations — planned, filmed, and edited by us. Because we\'re already here, we spend less time on logistics and more time on the actual production.',
    },
    da: {
      eyebrow: 'Hvad vi tilbyder',
      h1: 'Foto, video og websites',
      h2: 'Produceret i Grønland.',
      c1t: 'Fotografering',
      c1d: 'Fotografering til virksomheder i Grønland — til websites, årsrapporter, pressemateriale og dokumentation. Vi planlægger optagelserne, kender lokaliteterne og leverer billeder der viser hvad I faktisk laver.',
      c2t: 'Drone & Luftfoto',
      c2d: 'Luftoptagelser er ofte det der giver det færdige produkt sit wow-øjeblik. Vi bruger drone til overblik over lokaliteter, projektdokumentation og landskabsoptagelser — og det er konsekvent det kunder reagerer mest på.',
      c3t: 'Videoproduktion',
      c3d: 'Film til dit website, sociale medier eller præsentationer — planlagt, filmet og redigeret af os. Fordi vi allerede er her, bruger vi mindre tid på logistik og mere tid på selve produktionen.',
    }
  }

  return (
    <div id="services" ref={sectionRef} style={{ height: isMobile ? 'auto' : '400vh' }} className="max-[1024px]:pt-16">
      <div
        style={{ position: "sticky", top: 0, height: isMobile ? 'auto' : '100vh', overflow: isMobile ? 'visible' : 'hidden' }}
        className="flex items-center max-[1024px]:flex max-[1024px]:justify-center max-[1024px]:relative max-[1024px]:items-start"
      >
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16 w-full grid grid-cols-2 max-[1024px]:grid-cols-1 gap-16 max-[1024px]:gap-8 min-[1900px]:gap-24 items-center h-full max-[1024px]:h-auto max-[1024px]:pt-8 max-[1024px]:items-start">

          {/* Left: text */}
          <div>
            <div ref={labelRef} className="text-sm tracking-[0.25em] uppercase text-white/50 mb-6">
              {t[lang].eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl min-[1900px]:text-[clamp(48px,3vw,68px)] font-light text-white mb-4 leading-tight">
              <div ref={line1Ref}><span style={{ display: 'block', whiteSpace: 'nowrap' }}>{t[lang].h1}</span><span style={{ display: 'block', whiteSpace: 'nowrap' }}>{t[lang].h2}</span></div>
              <div ref={line2Ref}></div>
            </h2>
            <div ref={accentRef} className="text-lg min-[1900px]:text-[clamp(18px,1.2vw,26px)] text-white font-semibold mb-3">
              {activeCard === 0 ? t[lang].c1t : activeCard === 1 ? t[lang].c2t : t[lang].c3t}
            </div>
            <div ref={bodyRef} className="text-lg min-[1900px]:text-[clamp(18px,1.2vw,26px)] text-white/60 leading-relaxed">
              {activeCard === 0 ? t[lang].c1d : activeCard === 1 ? t[lang].c2d : t[lang].c3d}
            </div>
          </div>

          {/* Right: 9:16 card stack */}
          <div className="flex justify-center items-center h-full max-[1024px]:relative max-[1024px]:w-full max-[1024px]:flex-col max-[1024px]:items-center max-[1024px]:gap-6 max-[1024px]:pt-4 max-[1024px]:pb-16 max-[1024px]:justify-center">
            <div style={{ position: "relative", width: isMobile ? '100%' : CARD_W, height: isMobile ? 'auto' : `calc(${CARD_H} + 44px)`, marginTop: isMobile ? '0px' : '48px' }}>

              {/* Card 1 */}
              <div
                ref={card1Ref}
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  top: isMobile ? undefined : 0,
                  left: isMobile ? undefined : 0,
                  right: isMobile ? undefined : 0,
                  width: isMobile ? '88vw' : undefined,
                  height: isMobile ? 'calc(88vw * 16 / 9)' : CARD_H,
                  marginBottom: isMobile ? '24px' : 0,
                  zIndex: 3,
                  borderRadius: 16, overflow: "hidden",
                  transformOrigin: "bottom center",
                }}
              >
                <img
                  src={services[0].src}
                  alt={services[0].title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Card 2 */}
              <div
                ref={card2Ref}
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  top: isMobile ? undefined : 0,
                  left: isMobile ? undefined : 0,
                  right: isMobile ? undefined : 0,
                  width: isMobile ? '88vw' : undefined,
                  height: isMobile ? 'calc(88vw * 16 / 9)' : CARD_H,
                  marginBottom: isMobile ? '24px' : 0,
                  zIndex: 4,
                  borderRadius: 16, overflow: "hidden",
                  transformOrigin: "bottom center",
                }}
              >
                <video
                  src={services[1].src}
                  preload="none"
                  autoPlay muted loop playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Card 3 */}
              <div
                ref={card3Ref}
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  top: isMobile ? undefined : 0,
                  left: isMobile ? undefined : 0,
                  right: isMobile ? undefined : 0,
                  width: isMobile ? '88vw' : undefined,
                  height: isMobile ? 'calc(88vw * 16 / 9)' : CARD_H,
                  marginBottom: isMobile ? '24px' : 0,
                  zIndex: 5,
                  borderRadius: 16, overflow: "hidden",
                  transformOrigin: "bottom center",
                }}
              >
                <video
                  src={services[2].src}
                  preload="none"
                  autoPlay muted loop playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

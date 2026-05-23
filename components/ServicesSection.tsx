"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    type: "image" as const,
    src: "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/IMG_5200.jpg",
    title: "Photography",
    description: "Professional photography that showcases your product, project, or business through strong visual storytelling.",
  },
  {
    type: "video" as const,
    src: "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P46%20%C3%98ST%20KYSTEN%20.mp4",
    title: "Drone & Aerial",
    description: "Aerial imagery that reveals landscapes, projects, and locations from powerful new perspectives.",
  },
  {
    type: "video" as const,
    src: "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P37.mp4",
    title: "Video production",
    description: "Cinematic shots that communicate your story and present your business, product, or project in a compelling way.",
  },
];

const CARD_H = "84vh";
const CARD_W = "calc(84vh * 9 / 16)";

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    if (!section || !card1 || !card2 || !card3) return;

    const ctx = gsap.context(() => {
      gsap.set(card2, { yPercent: 105 });
      gsap.set(card3, { yPercent: 105 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      tl.to(card1, { scale: 0.94, duration: 1 }, 0)
        .to(card2, { yPercent: 0, duration: 1 }, 0)
        .to(card2, { scale: 0.94, duration: 1 }, 1)
        .to(card3, { yPercent: 0, duration: 1 }, 1);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let isSnapping = false;
    let currentCard = 0;

    const smoothScrollTo = (targetY: number): Promise<void> => {
      return new Promise((resolve) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const duration = 900;
        const startTime = performance.now();
        const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          window.scrollTo(0, startY + diff * ease(progress));
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
    };

    const snapTo = async (cardIdx: number, y: number) => {
      isSnapping = true;
      (window as any).__snapLock = true;
      currentCard = cardIdx;
      await smoothScrollTo(y);
      await new Promise(r => setTimeout(r, 600));
      isSnapping = false;
      (window as any).__snapLock = false;
    };

    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const vh = window.innerHeight;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollY = window.scrollY;

      const snapPoints = [
        sectionTop,
        sectionTop + vh * 1.5,
        sectionTop + vh * 3,
      ];

      const inSection = scrollY >= sectionTop - 10 && scrollY <= sectionTop + vh * 3 + 10;
      if (!inSection) return;

      e.preventDefault();
      if (isSnapping || (window as any).__snapLock) return;

      for (let i = 0; i < snapPoints.length; i++) {
        if (Math.abs(scrollY - snapPoints[i]) < 40) currentCard = i;
      }

      if (e.deltaY > 0) {
        if (currentCard < 2) {
          snapTo(currentCard + 1, snapPoints[currentCard + 1]);
        } else {
          const next = section.nextElementSibling as HTMLElement;
          if (next) {
            isSnapping = true;
            (window as any).__snapLock = true;
            smoothScrollTo(next.getBoundingClientRect().top + window.scrollY).then(() => {
              isSnapping = false;
              (window as any).__snapLock = false;
            });
          }
        }
      } else {
        if (currentCard > 0) {
          snapTo(currentCard - 1, snapPoints[currentCard - 1]);
        } else {
          isSnapping = true;
          (window as any).__snapLock = true;
          smoothScrollTo(0).then(() => {
            isSnapping = false;
            (window as any).__snapLock = false;
          });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div id="services" ref={sectionRef} style={{ height: "400vh" }}>
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        className="bg-black flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-2 gap-16 items-center h-full">

          {/* Left: text */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-5">
              What we offer
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
              Visual work for brands, companies and projects with a story to tell
            </h2>
            <p className="text-base text-white/60 leading-relaxed">
              We create visual content for companies working in environments where
              access, logistics, and conditions require planning and flexibility —
              helping businesses stand out and gain visibility with customers and investors.
            </p>
          </div>

          {/* Right: 9:16 card stack */}
          <div className="flex justify-center items-center h-full">
            <div style={{ position: "relative", width: CARD_W, height: CARD_H }}>

              {/* Card 1 */}
              <div
                ref={card1Ref}
                style={{
                  position: "absolute", inset: 0, zIndex: 1,
                  borderRadius: 16, overflow: "hidden",
                  transformOrigin: "bottom center",
                }}
              >
                <img
                  src={services[0].src}
                  alt={services[0].title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "28px 24px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                }}>
                  <p className="text-white text-xl font-light mb-1">{services[0].title}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{services[0].description}</p>
                </div>
              </div>

              {/* Card 2 */}
              <div
                ref={card2Ref}
                style={{
                  position: "absolute", inset: 0, zIndex: 2,
                  borderRadius: 16, overflow: "hidden",
                  transformOrigin: "bottom center",
                }}
              >
                <video
                  src={services[1].src}
                  autoPlay muted loop playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "28px 24px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                }}>
                  <p className="text-white text-xl font-light mb-1">{services[1].title}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{services[1].description}</p>
                </div>
              </div>

              {/* Card 3 */}
              <div
                ref={card3Ref}
                style={{
                  position: "absolute", inset: 0, zIndex: 3,
                  borderRadius: 16, overflow: "hidden",
                  transformOrigin: "bottom center",
                }}
              >
                <video
                  src={services[2].src}
                  autoPlay muted loop playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "28px 24px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                }}>
                  <p className="text-white text-xl font-light mb-1">{services[2].title}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{services[2].description}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accentRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    if (!section || !card1 || !card2 || !card3) return;

    const ctx = gsap.context(() => {
      const cardHeightPx = window.innerHeight * 0.84;
      gsap.set(card2, { y: cardHeightPx });
      gsap.set(card3, { y: cardHeightPx + 22 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      tl.to(card1, { scale: 0.94, duration: 1 }, 0)
        .to(card2, { y: 0, duration: 1 }, 0)
        .to(card2, { scale: 0.94, duration: 1 }, 1)
        .to(card3, { y: 0, duration: 1 }, 1);

      const textEls = [
        labelRef.current,
        headingRef.current,
        accentRef.current,
        bodyRef.current,
      ].filter(Boolean);

      gsap.set(textEls, {
        opacity: 0,
        scale: 0.90,
        rotateX: 6,
        transformOrigin: "center center",
      });

      gsap.set(cardContainerRef.current, {
        opacity: 0,
        scale: 0.90,
        rotateX: 6,
        rotateY: 4,
        transformOrigin: "center center",
      });

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          once: true,
        },
      });

      entranceTl
        .to(textEls, {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        }, 0)
        .to(cardContainerRef.current, {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 0.9,
          ease: "power3.out",
        }, 0.25);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="services" ref={sectionRef} style={{ height: "400vh" }}>
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", perspective: "1200px" }}
        className="bg-black flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-2 gap-16 items-center h-full">

          {/* Left: text */}
          <div>
            <p ref={labelRef} className="text-sm tracking-[0.25em] uppercase text-white/50 mb-6">
              What we offer
            </p>
            <h2 ref={headingRef} className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
              Visual work for brands, companies and projects
            </h2>
            <p ref={accentRef} className="text-xl text-white/40 font-light mb-8">
              with a story to tell or a product to sell
            </p>
            <p ref={bodyRef} className="text-lg text-white/60 leading-relaxed">
              We create visual content for companies working in environments where
              access, logistics, and conditions require planning and flexibility —
              helping businesses stand out and gain visibility with customers and investors.
            </p>
          </div>

          {/* Right: 9:16 card stack */}
          <div className="flex justify-center items-center h-full">
            <div style={{ position: "relative", width: CARD_W, height: `calc(${CARD_H} + 44px)`, marginTop: "48px" }}>
              <div ref={cardContainerRef} style={{ position: "relative", width: CARD_W, height: CARD_H }}>

              {/* Card 1 */}
              <div
                ref={card1Ref}
                style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: CARD_H, zIndex: 3,
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
                  position: "absolute", top: 0, left: 0, right: 0, height: CARD_H, zIndex: 4,
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
                  position: "absolute", top: 0, left: 0, right: 0, height: CARD_H, zIndex: 5,
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
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

const CARD_H = "84vh";
const CARD_W = "calc(84vh * 9 / 16)";

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

      gsap.set([labelRef.current, accentRef.current, bodyRef.current], { opacity: 0 });
      gsap.set([line1Ref.current, line2Ref.current], {
        clipPath: 'inset(0 100% 0 0)',
        x: -10,
      });

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
        .to(card1Ref.current, {
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
        }, 0.2);

      const hasAnimated = { current: false };

      const onScroll = () => {
        if (hasAnimated.current) return;
        const sectionTop = (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
        if (window.scrollY >= sectionTop - 20) {
          hasAnimated.current = true;
          entranceTl.play();
          window.removeEventListener('scroll', onScroll);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="services" ref={sectionRef} style={{ height: "400vh" }}>
      <div
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
        className="bg-black flex items-center"
      >
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16 w-full grid grid-cols-2 gap-16 min-[1900px]:gap-24 items-center h-full">

          {/* Left: text */}
          <div>
            <div ref={labelRef} className="text-sm tracking-[0.25em] uppercase text-white/50 mb-6">
              What we offer
            </div>
            <h2 className="text-4xl md:text-5xl min-[1900px]:text-[clamp(48px,3vw,68px)] font-light text-white mb-4 leading-tight">
              <div ref={line1Ref}>Visual work for brands,</div>
              <div ref={line2Ref}>companies and projects</div>
            </h2>
            <div ref={accentRef} className="text-xl min-[1900px]:text-[clamp(20px,1.3vw,28px)] text-white/40 font-light mb-8">
              — with a story to tell or a product to sell
            </div>
            <div ref={bodyRef} className="text-lg min-[1900px]:text-[clamp(18px,1.2vw,26px)] text-white/60 leading-relaxed">
              We create visual content for companies working in environments where
              access, logistics, and conditions require planning and flexibility —
              helping businesses stand out and gain visibility with customers and investors.
            </div>
          </div>

          {/* Right: 9:16 card stack */}
          <div className="flex justify-center items-center h-full">
            <div style={{ position: "relative", width: CARD_W, height: `calc(${CARD_H} + 44px)`, marginTop: "48px" }}>

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
                  <p className="text-white text-xl min-[1900px]:text-[clamp(20px,1.3vw,28px)] font-light mb-1">{services[0].title}</p>
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
                  preload="none"
                  autoPlay muted loop playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "28px 24px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                }}>
                  <p className="text-white text-xl min-[1900px]:text-[clamp(20px,1.3vw,28px)] font-light mb-1">{services[1].title}</p>
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
                  preload="none"
                  autoPlay muted loop playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "28px 24px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                }}>
                  <p className="text-white text-xl min-[1900px]:text-[clamp(20px,1.3vw,28px)] font-light mb-1">{services[2].title}</p>
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

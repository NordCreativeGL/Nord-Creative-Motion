"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HeroSection() {
  const sectionRef      = useRef<HTMLElement>(null);
  const wordmarkRef     = useRef<SVGSVGElement>(null);
  const oGroupRef       = useRef<SVGGElement>(null);
  const needleGroupRef  = useRef<SVGGElement>(null);
  const videoRef        = useRef<HTMLVideoElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const taglineRef      = useRef<HTMLParagraphElement>(null);
  const scrollRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const navbar  = document.getElementById("site-nav");
    const video   = videoRef.current;
    const content = contentRef.current;
    const tagline = taglineRef.current;
    const scroll  = scrollRef.current;
    const section = sectionRef.current;

    if (!oGroupRef.current || !needleGroupRef.current) return;

    const ctx = gsap.context(() => {
      const SVG_CX    = 1260.4;
      const SVG_CY    = 100;
      const O_CX      = 310.6;
      const O_CY      = 80;
      const NEEDLE_CX = 2093.8;
      const NEEDLE_CY = 82;
      const S         = 8;

      gsap.set(oGroupRef.current, {
        transformOrigin: '310.6px 80px',
        x: SVG_CX - O_CX,
        y: SVG_CY - O_CY,
        scale: S,
        opacity: 1,
      });

      gsap.set(needleGroupRef.current, {
        transformOrigin: '2093.8px 82px',
        x: SVG_CX - NEEDLE_CX,
        y: SVG_CY - NEEDLE_CY,
        scale: S,
        opacity: 1,
      });

      gsap.set('.wm-letter', { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(needleGroupRef.current, {
        rotation: 720,
        transformOrigin: '2093.8px 82px',
        duration: 1.5,
        ease: 'none',
      })
      .add([
        gsap.to(oGroupRef.current, {
          x: 0, y: 0, scale: 1,
          transformOrigin: '310.6px 80px',
          duration: 1.2,
          ease: 'power2.inOut',
        }),
        gsap.to(needleGroupRef.current, {
          x: 0, y: 0, scale: 1, rotation: 0,
          transformOrigin: '2093.8px 82px',
          duration: 1.2,
          ease: 'power2.inOut',
        }),
      ])
      .to('.wm-letter', {
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
      }, '<0.2');

      tl.to(video,   { opacity: 1, duration: 1.5, ease: 'power2.out' }, '>0.4');
      if (tagline) tl.to(tagline, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '>0.8');
      if (navbar)  tl.to(navbar,  { opacity: 1, duration: 0.8, ease: 'power2.out' }, '<0.2');
      if (scroll)  tl.to(scroll,  { opacity: 1, duration: 0.6, ease: 'power2.out' }, '<0.2');

      if (content) {
        gsap.to(content, {
          opacity: 0, scale: 0.95, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top top", end: "45% top", scrub: 1,
          },
        });
      }
      if (video) {
        gsap.to(video, {
          scale: 1.08, ease: "none",
          scrollTrigger: {
            trigger: section, start: "top top", end: "bottom top", scrub: 1.5,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* ── Video ──────────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P19(1)A.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0, willChange: "transform, opacity" }}
      />

      {/* ── Dark overlay ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ── Content (fades/scales on scroll) ───────────────────────────── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5"
        style={{ willChange: "transform, opacity" }}
      >
        <div className="relative flex items-center justify-center" style={{ width: "100vw", maxWidth: "100vw", overflow: "visible" }}>

          <svg
            ref={wordmarkRef}
            viewBox="0 0 2520.80 200"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: 'clamp(320px, 72vw, 1100px)', height: 'auto', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path className="wm-letter" d="M32.400 150L25.600 150L25.600 10L31.200 10L130.600 137.600L130.600 10L137.400 10L137.400 150L131.800 150L32.400 22.400L32.400 150Z" fill="#ffffff"/>
            <path className="wm-letter" d="M490.800 150L484 150L484 10L532.600 10Q550 10 562.500 15.600Q575 21.200 581.600 31.500Q588.200 41.800 588.200 56.400Q588.200 71 581.600 81.400Q575 91.800 562.600 97.400L562.600 97.400Q558.800 99 554.600 100.200L554.600 100.200L590.400 150L582.400 150L547.800 101.800Q540.800 103 532.600 103L532.600 103L490.800 103L490.800 150ZM490.800 16.200L490.800 96.800L533 96.800Q556.600 96.800 569.100 86.200Q581.600 75.600 581.600 56.400Q581.600 37.200 569.100 26.700Q556.600 16.200 533 16.200L533 16.200L490.800 16.200Z" fill="#ffffff"/>
            <path className="wm-letter" d="M745.600 150L691.600 150L691.600 10L745.600 10Q768 10 784.600 19.100Q801.200 28.200 810.500 43.900Q819.800 59.600 819.800 80L819.800 80Q819.800 100.400 810.500 116.100Q801.200 131.800 784.600 140.900Q768 150 745.600 150L745.600 150ZM698.400 16.200L698.400 143.800L745.200 143.800Q765.800 143.800 781.100 135.600Q796.400 127.400 804.700 113Q813 98.600 813 80L813 80Q813 61.400 804.700 47Q796.400 32.600 781.100 24.400Q765.800 16.200 745.200 16.200L745.200 16.200L698.400 16.200Z" fill="#ffffff"/>
            <path className="wm-letter" d="M1157.400 150.800L1157.400 150.800Q1142.000 150.800 1128.800 145.500Q1115.600 140.200 1105.800 130.600Q1096.000 121 1090.600 108.100Q1085.200 95.200 1085.200 80L1085.200 80Q1085.200 64.800 1090.600 51.900Q1096.000 39 1105.800 29.400Q1115.600 19.800 1128.800 14.500Q1142.000 9.200 1157.400 9.200L1157.400 9.200Q1171.600 9.200 1184.200 13.800Q1196.800 18.400 1206.000 27.800L1206.000 27.800L1201.800 32.200Q1192.400 23.200 1181.300 19.300Q1170.200 15.400 1157.600 15.400L1157.600 15.400Q1143.600 15.400 1131.600 20.300Q1119.600 25.200 1110.700 34Q1101.800 42.800 1096.900 54.500Q1092.000 66.200 1092.000 80L1092.000 80Q1092.000 93.800 1096.900 105.500Q1101.800 117.200 1110.700 126Q1119.600 134.800 1131.600 139.700Q1143.600 144.600 1157.600 144.600L1157.600 144.600Q1170.200 144.600 1181.300 140.700Q1192.400 136.800 1201.800 127.600L1201.800 127.600L1206.000 132Q1196.800 141.400 1184.200 146.100Q1171.600 150.800 1157.400 150.800Z" fill="#ffffff"/>
            <path className="wm-letter" d="M1312.800 150L1306 150L1306 10L1354.600 10Q1372 10 1384.500 15.600Q1397 21.200 1403.600 31.500Q1410.200 41.800 1410.200 56.400Q1410.200 71 1403.600 81.400Q1397 91.800 1384.600 97.400L1384.600 97.400Q1380.800 99 1376.600 100.200L1376.600 100.200L1412.400 150L1404.400 150L1369.800 101.800Q1362.800 103 1354.600 103L1354.600 103L1312.800 103L1312.800 150ZM1312.800 16.200L1312.800 96.800L1355 96.800Q1378.600 96.800 1391.100 86.200Q1403.600 75.600 1403.600 56.400Q1403.600 37.200 1391.100 26.700Q1378.600 16.200 1355 16.200L1355 16.200L1312.800 16.200Z" fill="#ffffff"/>
            <path className="wm-letter" d="M1520.400 82L1520.400 143.800L1608.200 143.800L1608.200 150L1513.600 150L1513.600 10L1605.400 10L1605.400 16.200L1520.400 16.200L1520.400 75.800L1596.400 75.800L1596.400 82L1520.400 82Z" fill="#ffffff"/>
            <path className="wm-letter" d="M1694.400 150L1687 150L1751.800 10L1758.400 10L1823.200 150L1815.800 150L1797 109L1713.200 109L1694.400 150ZM1715.800 103.200L1794.400 103.200L1755.200 17.800L1715.800 103.200Z" fill="#ffffff"/>
            <path className="wm-letter" d="M1947.600 150L1941 150L1941 16.200L1889.600 16.200L1889.600 10L1999 10L1999 16.200L1947.600 16.200L1947.600 150Z" fill="#ffffff"/>
            <path className="wm-letter" d="M2258.800 150L2252.200 150L2189.400 10L2197 10L2255.800 141.200L2314.400 10L2321.600 10L2258.800 150Z" fill="#ffffff"/>
            <path className="wm-letter" d="M2419.600 82L2419.600 143.800L2507.400 143.800L2507.400 150L2412.800 150L2412.800 10L2504.600 10L2504.600 16.200L2419.600 16.200L2419.600 75.800L2495.600 75.800L2495.600 82L2419.600 82Z" fill="#ffffff"/>

            <g ref={oGroupRef} style={{ transformOrigin: '310.6px 80px' }}>
              <defs>
                <mask id="o-split" maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="2520.80" height="200" fill="white"/>
                  <rect x="301" y="0" width="20" height="200" fill="black"/>
                </mask>
              </defs>
              <path
                mask="url(#o-split)"
                d="M310.600 150.800L310.600 150.800Q295.200 150.800 282 145.500Q268.800 140.200 259 130.600Q249.200 121 243.800 108.100Q238.400 95.200 238.400 80L238.400 80Q238.400 64.800 243.800 51.900Q249.200 39 259 29.400Q268.800 19.800 282 14.500Q295.200 9.200 310.600 9.200L310.600 9.200Q326.200 9.200 339.400 14.500Q352.600 19.800 362.300 29.400Q372 39 377.500 51.900Q383 64.800 383 80L383 80Q383 95.200 377.500 108.100Q372 121 362.300 130.600Q352.600 140.200 339.400 145.500Q326.200 150.800 310.600 150.800ZM310.600 144.600L310.600 144.600Q324.600 144.600 336.600 139.800Q348.600 135 357.500 126.200Q366.400 117.400 371.300 105.700Q376.200 94 376.200 80L376.200 80Q376.200 66 371.300 54.300Q366.400 42.600 357.500 33.800Q348.600 25 336.600 20.200Q324.600 15.400 310.600 15.400L310.600 15.400Q296.800 15.400 284.800 20.200Q272.800 25 263.900 33.800Q255 42.600 250.100 54.300Q245.200 66 245.200 80L245.200 80Q245.200 94 250.100 105.700Q255 117.400 263.900 126.200Q272.800 135 284.800 139.800Q296.800 144.600 310.600 144.600Z"
                fill="#ffffff"
              />
            </g>

            <g ref={needleGroupRef} style={{ transformOrigin: '2093.8px 82px' }}>
              <polygon points="2093.8,8 2111.8,82 2093.8,156 2075.8,82" fill="#ffffff"/>
            </g>
          </svg>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-xs tracking-[0.3em] uppercase text-white/60"
          style={{ opacity: 0 }}
        >
          Video Production · Photography · Arctic Storytelling
        </p>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <div className="w-px h-10 bg-white/50" />
        <svg
          width="12"
          height="7"
          viewBox="0 0 12 7"
          fill="none"
          aria-hidden="true"
          className="animate-bounce"
        >
          <path
            d="M1 1L6 6L11 1"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

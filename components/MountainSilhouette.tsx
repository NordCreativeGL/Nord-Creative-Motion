"use client";
import { useEffect, useRef } from "react";

export default function MountainSilhouette() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const heroEl = document.getElementById("gl-hero");
    const lastEl = document.getElementById("gl-why");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.target === heroEl) {
          svg.style.opacity = e.isIntersecting ? "0" : "1";
        }
      });
    }, { threshold: 0.05 });
    if (heroEl) observer.observe(heroEl);

    function onScroll() {
      if (!lastEl) return;
      const pastContent = window.scrollY > lastEl.offsetTop + lastEl.offsetHeight - window.innerHeight * 0.3;
      if (pastContent) {
        svg.style.opacity = "0";
      } else if (!heroEl || window.scrollY > (heroEl.offsetHeight * 0.9)) {
        svg.style.opacity = "1";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    const onHeroExpanded = () => { svg.style.opacity = "1"; };
    window.addEventListener("heroExpanded", onHeroExpanded);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("heroExpanded", onHeroExpanded);
      observer.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1728 500"
      preserveAspectRatio="none"
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "50vh",
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <defs>
        <linearGradient id="gradL1" gradientUnits="userSpaceOnUse" x1="0" y1="272" x2="0" y2="500">
          <stop offset="0%" stopColor="#1c1c2a" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="gradL2" gradientUnits="userSpaceOnUse" x1="0" y1="225" x2="0" y2="500">
          <stop offset="0%" stopColor="#141420" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="gradL3" gradientUnits="userSpaceOnUse" x1="0" y1="145" x2="0" y2="500">
          <stop offset="0%" stopColor="#0d0d18" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="gradL4" gradientUnits="userSpaceOnUse" x1="0" y1="88" x2="0" y2="500">
          <stop offset="0%" stopColor="#080810" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="gradL5" gradientUnits="userSpaceOnUse" x1="0" y1="68" x2="0" y2="500">
          <stop offset="0%" stopColor="#040408" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      <path
        d="M 0,500 L 0,378 L 98,295 L 215,378 L 355,278 L 472,378 L 612,272 L 728,378 L 875,272 L 988,378 L 1128,278 L 1245,378 L 1395,272 L 1512,378 L 1668,500 L 1728,500 Z"
        fill="url(#gradL1)"
      />
      <path
        d="M 0,500 L 0,365 L 85,248 L 195,362 L 318,228 L 348,228 L 468,362 L 612,238 L 728,362 L 875,225 L 988,362 L 1128,235 L 1248,362 L 1392,228 L 1512,362 L 1688,500 L 1728,500 Z"
        fill="url(#gradL2)"
      />
      <path
        d="M 0,500 L 0,288 L 88,195 L 175,285 L 302,148 L 412,275 L 558,168 L 652,275 L 798,155 L 892,272 L 1038,162 L 1132,272 L 1298,145 L 1405,268 L 1668,500 L 1728,500 Z"
        fill="url(#gradL3)"
      />
      <path
        d="M 0,500 L 0,318 L 72,228 L 125,155 L 195,248 L 308,90 L 335,90 L 455,262 L 515,135 L 592,252 L 672,108 Q 740,78 808,108 L 905,262 L 952,148 L 1028,262 L 1175,108 L 1285,265 L 1388,178 L 1728,418 L 1728,500 Z"
        fill="url(#gradL4)"
      />
      <path d="M 335,90 L 455,262 L 455,500 L 335,500 Z" fill="#000000" fillOpacity="0.30" />
      <path d="M 808,108 L 905,262 L 905,500 L 808,500 Z" fill="#000000" fillOpacity="0.28" />
      <path
        d="M 0,500 L 0,308 L 95,195 L 155,265 L 222,152 Q 280,125 338,152 L 418,275 L 555,70 L 648,258 L 745,168 L 838,292 L 968,105 L 998,105 L 1108,285 L 1215,178 L 1305,298 L 1428,192 L 1458,192 L 1728,392 L 1728,500 Z"
        fill="url(#gradL5)"
      />
      <path d="M 555,70 L 648,258 L 648,500 L 555,500 Z" fill="#000000" fillOpacity="0.30" />
      <path d="M 998,105 L 1108,285 L 1108,500 L 998,500 Z" fill="#000000" fillOpacity="0.28" />
    </svg>
  );
}

"use client";
import { useEffect, useRef } from "react";

export default function MountainSilhouette() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    let heroExpanded = false;
    const workingEl = document.getElementById("gl-working");
    const lastEl = document.getElementById("gl-why");

    function updateOpacity() {
      if (!svgEl || !workingEl || !lastEl) return;
      const pastHero = window.scrollY >= workingEl.offsetTop * 0.5;
      const pastEnd = window.scrollY > lastEl.offsetTop + lastEl.offsetHeight - window.innerHeight * 0.3;
      svgEl.style.opacity = (heroExpanded && pastHero && !pastEnd) ? "1" : "0";
    }

    function onHeroExpanded() {
      heroExpanded = true;
      updateOpacity();
    }

    window.addEventListener("heroExpanded", onHeroExpanded);
    window.addEventListener("scroll", updateOpacity, { passive: true });
    updateOpacity();

    return () => {
      window.removeEventListener("heroExpanded", onHeroExpanded);
      window.removeEventListener("scroll", updateOpacity);
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
        left: 0,
        width: "100%",
        height: "50vh",
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.3s ease",
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
        d="M 0,500 L 0,375 L 105,272 L 132,272 L 275,375 L 432,265 L 460,265 L 612,375 L 755,268 L 782,268 L 930,375 L 1068,272 L 1095,272 L 1235,375 L 1382,268 L 1408,268 L 1728,500 Z"
        fill="url(#gradL1)"
      />
      <path
        d="M 0,500 L 0,352 L 78,278 L 102,278 L 195,358 L 298,225 L 328,225 L 442,358 L 568,248 L 598,248 L 718,358 L 858,228 L 892,228 L 1012,355 L 1148,242 L 1182,242 L 1318,358 L 1448,235 L 1482,235 L 1728,500 Z"
        fill="url(#gradL2)"
      />
      <path
        d="M 0,500 L 0,265 L 88,178 L 115,178 L 242,278 L 372,145 L 408,145 L 555,270 L 685,172 L 718,172 L 868,282 L 1032,152 L 1068,152 L 1222,272 L 1362,162 L 1395,162 L 1728,500 Z"
        fill="url(#gradL3)"
      />
      <path
        d="M 0,500 L 0,282 L 105,165 L 135,165 L 278,295 L 405,88 L 442,88 L 588,282 L 728,155 L 760,155 L 912,298 L 1060,95 L 1098,95 L 1255,282 L 1398,168 L 1432,168 L 1728,500 Z"
        fill="url(#gradL4)"
      />
      <path
        d="M 0,500 L 0,300 L 72,198 L 98,198 L 148,255 L 235,138 L 262,138 L 345,268 L 418,172 L 445,172 L 520,292 L 608,68 L 638,68 L 750,272 L 828,162 L 858,162 L 952,298 L 1048,122 L 1082,122 L 1198,282 L 1305,195 L 1338,195 L 1452,338 L 1562,218 L 1598,218 L 1728,338 L 1728,500 Z"
        fill="url(#gradL5)"
      />
    </svg>
  );
}

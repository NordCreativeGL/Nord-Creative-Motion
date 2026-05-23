"use client";

import { useEffect } from "react";

export default function ScrollManager() {
  useEffect(() => {
    let isSnapping = false;

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

    const snapTo = async (y: number) => {
      isSnapping = true;
      (window as any).__snapLock = true;
      await smoothScrollTo(y);
      await new Promise((r) => setTimeout(r, 600));
      isSnapping = false;
      (window as any).__snapLock = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isSnapping || (window as any).__snapLock) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const servicesEl = document.getElementById("services");
      if (!servicesEl) return;

      const servicesTop = servicesEl.getBoundingClientRect().top + scrollY;
      const servicesEnd = servicesTop + vh * 3;

      if (scrollY <= servicesEnd + 50) return;

      const snapEls = Array.from(
        document.querySelectorAll("[data-snap]")
      ) as HTMLElement[];
      if (!snapEls.length) return;

      const snapPoints = snapEls.map(
        (el) => Math.round(el.getBoundingClientRect().top + scrollY)
      );

      let currentIdx = -1;
      for (let i = 0; i < snapPoints.length; i++) {
        const next = snapPoints[i + 1] ?? Infinity;
        if (scrollY >= snapPoints[i] - 50 && scrollY < next - 50) {
          currentIdx = i;
          break;
        }
      }

      if (currentIdx === -1) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        if (currentIdx < snapPoints.length - 1) {
          snapTo(snapPoints[currentIdx + 1]);
        }
      } else {
        if (currentIdx > 0) {
          snapTo(snapPoints[currentIdx - 1]);
        } else {
          snapTo(servicesEnd);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return null;
}

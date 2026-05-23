"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [visible, setVisible] = React.useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      if (currentScrollY < lastScrollY.current) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > heroHeight) {
        setVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-colors duration-300 transition-transform duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-sm" : "bg-transparent"
      } ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="/">
          <Image
            src="/logo-icon.png"
            alt="Nord Creative"
            height={100}
            width={100}
            className="object-contain"
            priority
          />
        </a>
        <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          <a href="/" className="transition hover:text-white">Home</a>
          <a href="/greenland" className="transition hover:text-white">Greenland</a>
          <a href="/beyond-the-arctic" className="transition hover:text-white">Beyond the Arctic</a>
          <a href="/about" className="transition hover:text-white">About</a>
        </nav>

          href="mailto:contact@nordcreative.dk"
          className="hidden rounded-full border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white hover:text-black md:block"
        >
          Work with us
        </a>
      </div>
    </header>
  );
}

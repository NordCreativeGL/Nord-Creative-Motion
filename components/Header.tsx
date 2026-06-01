"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const [visible, setVisible] = React.useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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
      } else if (currentScrollY > lastScrollY.current && currentScrollY > heroHeight * 0.5) {
        setVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-colors duration-300 ${
          scrolled ? "bg-black/70 backdrop-blur-sm" : "bg-transparent"
        }`}
        style={{
          transform: (!visible && !menuOpen) ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            style={{ display: 'block' }}
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.location.href = '/';
              }
            }}
          >
            <Image
              src="/logo-icon.png"
              alt="Nord Creative"
              height={50}
              width={50}
              className="object-contain"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <Link href="/" className="transition hover:text-white" onClick={(e) => { if (pathname === '/') { e.preventDefault(); window.location.href = '/'; } }}>Home</Link>
            <Link href="/greenland" className="transition hover:text-white" onClick={(e) => { if (pathname === '/greenland') { e.preventDefault(); window.location.href = '/greenland'; } }}>Greenland</Link>
            <Link href="/beyond-the-arctic" className="transition hover:text-white" onClick={(e) => { if (pathname === '/beyond-the-arctic') { e.preventDefault(); window.location.href = '/beyond-the-arctic'; } }}>Beyond the Arctic</Link>
            <Link href="/about" className="transition hover:text-white" onClick={(e) => { if (pathname === '/about') { e.preventDefault(); window.location.href = '/about'; } }}>About</Link>
          </nav>
          <a
            href="mailto:contact@nordcreative.dk"
            className="hidden rounded-full border border-white/20 px-5 py-2 text-sm text-white transition hover:bg-white hover:text-black md:block"
          >
            Work with us
          </a>
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[6px] w-10 h-10"
            style={{ zIndex: 1001, position: 'relative' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <span style={{ color: 'white', fontSize: '20px', fontWeight: 300, lineHeight: 1 }}>✕</span>
            ) : (
              <>
                <span className="block w-5 h-px bg-white" />
                <span className="block w-5 h-px bg-white" />
                <span className="block w-5 h-px bg-white" />
              </>
            )}
          </button>
        </div>
      </header>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        {[
          { label: 'Home', href: '/' },
          { label: 'Greenland', href: '/greenland' },
          { label: 'Beyond the Arctic', href: '/beyond-the-arctic' },
          { label: 'About', href: '/about' },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              window.location.href = href;
            }}
            style={{
              color: 'white',
              fontSize: 'clamp(32px, 8vw, 48px)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </a>
        ))}
        <a
          href="mailto:contact@nordcreative.dk"
          style={{
            color: 'white',
            fontSize: 'clamp(13px, 3.5vw, 16px)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            marginTop: '16px',
            opacity: 0.5,
          }}
        >
          Work with us
        </a>
      </div>
    </>
  );
}

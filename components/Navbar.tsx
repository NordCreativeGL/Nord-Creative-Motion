"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/greenland", label: "Greenland" },
  { href: "/beyond-the-arctic", label: "Beyond the Arctic" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      id="site-nav"
      initial={{ opacity: 0 }}
      className={`fixed top-0 left-0 right-0 z-[1000] backdrop-blur-md transition-all duration-500 ${
        scrolled ? "border-b border-white/10" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo-icon-transparent.png"
            alt="NordCreative"
            width={48}
            height={48}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
            >
              <Link
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.72 }}
          href="mailto:contact@nordcreative.dk"
          className="text-sm text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
        >
          Work with us
        </motion.a>
      </div>
    </motion.nav>
  );
}

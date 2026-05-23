"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer id="footer" data-snap="true" className="border-t border-white/10 py-16 bg-black min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-6">
        <Image
          src="/logo-wordmark-transparent.png"
          alt="NordCreative"
          width={200}
          height={60}
          className="w-[200px] h-auto"
        />

        <p className="text-xs tracking-[0.2em] uppercase text-white/40">
          Limits are for the uncreative
        </p>

        <p className="text-sm text-white/50">
          contact@nordcreative.dk · +45 30 49 30 46 · +45 50 55 64 97
        </p>

        <div className="flex items-center gap-8">
          <a
            href="https://instagram.com/nordcreative"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white transition-colors duration-200"
          >
            Instagram
          </a>
          <a
            href="https://youtube.com/@nordcreative"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white transition-colors duration-200"
          >
            YouTube
          </a>
          <a
            href="https://linkedin.com/company/nordcreative"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white transition-colors duration-200"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

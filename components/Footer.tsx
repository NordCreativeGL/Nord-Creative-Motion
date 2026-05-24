"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer id="footer" data-snap="true" className="border-t border-white/10 py-16 bg-black min-h-[25vh] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-6">
        <Image
          src="/logo-wordmark-transparent.png"
          alt="NordCreative"
          width={612}
          height={184}
          style={{ width: '734px', height: 'auto', objectFit: 'contain', marginTop: '-90px', marginBottom: '-90px' }}
        />

        <p className="text-white/40" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          Limits are for the uncreative
        </p>

        <p className="text-sm text-white/50">
          <a href="mailto:contact@nordcreative.dk" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">contact@nordcreative.dk</a>
          {' · '}
          <a href="tel:+299245441" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">+299 245441</a>
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

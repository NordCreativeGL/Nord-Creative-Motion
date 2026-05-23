"use client";

import { motion } from "framer-motion";

export default function CTABanner() {
  return (
    <section id="cta" data-snap="true" className="py-32 bg-black min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white">
            Planning a project in Greenland?
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-lg mt-4">
            Tell us about your project — we'll help define what's possible and
            how to approach it.
          </p>
          <a
            href="mailto:contact@nordcreative.dk"
            className="border border-white/30 px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition duration-300 mt-8 block w-fit"
          >
            Work with us
          </a>
        </motion.div>
      </div>
    </section>
  );
}

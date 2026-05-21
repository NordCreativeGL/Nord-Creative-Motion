"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-5">
            About us
          </p>
          <h2 className="text-4xl font-light text-white mb-6">
            We are Oskar & Johanna
          </h2>
          <Link
            href="/about"
            className="text-white/70 underline underline-offset-4 hover:text-white transition-colors duration-200"
          >
            Read more about us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

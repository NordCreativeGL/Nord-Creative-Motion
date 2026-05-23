"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const videos = [
  "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P10.mp4",
  "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P21.mp4",
  "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P69%20N.mp4",
];

export default function GreenlandSection() {
  return (
    <section id="greenland" data-snap="true" className="py-24 bg-black min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-5">
            Greenland
          </p>
          <h2 className="text-4xl md:text-6xl font-light text-white max-w-3xl mb-6">
            Visual work made for atmosphere, trust and attention
          </h2>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
            Commercial visuals and Arctic environments, created for companies
            and brands in Greenland.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {videos.map((src) => (
            <motion.div
              key={src}
              variants={itemVariants}
              className="aspect-video rounded-2xl overflow-hidden border border-white/10"
            >
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Link
            href="/greenland"
            className="text-white/70 underline underline-offset-4 hover:text-white transition-colors duration-200"
          >
            Explore our work in Greenland
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

export default function BasedInGreenland() {
  return (
    <section id="based-in-greenland" data-snap="true" className="py-24 bg-black min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-xs tracking-[0.2em] uppercase text-white/50 mb-14"
        >
          Based in Greenland
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-light text-white mb-6">
              We live here. We work here.
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              We are based in Qaqortoq in South Greenland, where we live and
              work close to the nature that inspires us every day. We are
              available for projects across all of Greenland — from remote
              landscapes to towns and industrial sites — creating photography
              and film that document people, places, and projects in their
              natural context. This allows us to operate efficiently in
              locations where production is often limited by logistics and
              conditions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="rounded-2xl overflow-hidden border border-white/10"
          >
            <video
              src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/BEAUTY.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

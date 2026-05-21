"use client";

import { motion, type Variants } from "framer-motion";

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

const services = [
  {
    type: "image" as const,
    src: "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/IMG_5200.jpg",
    title: "Photography",
    description:
      "Professional photography that showcases your product, project, or business through strong visual storytelling.",
  },
  {
    type: "video" as const,
    src: "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P46%20%C3%98ST%20KYSTEN%20.mp4",
    title: "Drone & Aerial",
    description:
      "Aerial imagery that reveals landscapes, projects, and locations from powerful new perspectives.",
  },
  {
    type: "video" as const,
    src: "https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P37.mp4",
    title: "Video production",
    description:
      "Cinematic shots that communicate your story and present your business, product, or project in a compelling way.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-5">
            What we offer
          </p>
          <h2 className="text-4xl md:text-6xl font-light text-white max-w-3xl mb-6">
            Visual work for brands, companies and projects with a story to tell
          </h2>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
            We create visual content for companies working in environments where
            access, logistics, and conditions require planning and flexibility —
            helping businesses stand out and gain visibility with customers and
            investors.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-900"
            >
              <div className="aspect-video">
                {service.type === "image" ? (
                  <img
                    src={service.src}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={service.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="px-5 pb-6">
                <h3 className="text-xl font-light text-white mt-4">
                  {service.title}
                </h3>
                <p className="text-white/60 mt-2 text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

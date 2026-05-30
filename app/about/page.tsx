import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/ScrollManager";
export default function About() {
  return (
    <main className="min-h-screen text-white">
      <ScrollManager />
      <Header />

      <section id="about-hero" data-snap="true" className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/P68%20HEADER.mp4"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pb-20">
          <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-4">About us</p>
          <h1 className="text-5xl md:text-6xl font-light text-white">We are Oskar & Johanna</h1>
        </div>
      </section>

      {/* Story */}
      <section id="about-text" data-snap="true" className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-6">
              <p className="text-xl text-white/70 leading-relaxed">Before Nord Creative, we had different careers — Oskar as a police officer, Johanna in real estate. What we shared was a life spent outdoors, and a growing interest in photography and video as a way of documenting what we experienced.</p>
              <p className="text-xl text-white/70 leading-relaxed">That interest gradually became something more. Alongside our previous careers, we took on smaller projects — and at some point, the work became serious enough that we chose to follow it fully.</p>
              <p className="text-xl text-white/70 leading-relaxed">That path brought us to Greenland. We are now based in Qaqortoq in the south of Greenland, where we live and work year-round. It's a place that continues to shape both how we live and how we work.</p>
              <p className="text-xl text-white/70 leading-relaxed">Working in Greenland has shaped how we approach production. The Arctic environment requires awareness, planning, and the ability to adapt — both creatively and in terms of safety. This is something we bring into every project. Today, we work with companies looking to create visual content in environments that require both structure and flexibility.</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mt-8">Let's tell a story</h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] w-full">
            <Image
              src="/IMG_3883.jpg"
              alt="Oskar & Johanna"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about-cta" data-snap="true" className="bg-black pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-zinc-900">
            <Image
              src="https://pub-fa494a3b296345cdb20796e5eafa3316.r2.dev/CTA%20about.jpg"
              alt="Planning a project in Greenland"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6">Planning a project in Greenland?</h2>
              <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">Tell us about your project — we'll shape a realistic approach to make it happen.</p>
              <a href="mailto:contact@nordcreative.dk" className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 text-white text-sm tracking-widest uppercase hover:bg-white/10 transition-colors">Work with us</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";
import Image from "next/image";
import Footer from "@/components/Footer";
import SideNav from "@/components/SideNav";
import { useLang } from '@/contexts/LanguageContext'
export default function About() {
  const { lang } = useLang()

  const t = {
    en: {
      heroEyebrow: 'About us',
      heroH1: 'We are Oskar & Johanna',
      nav1: 'Our story',
      nav2: 'Contact',
      eyebrow: 'OUR STORY',
      p1: "Before Nord Creative, we had different careers — Oskar as a police officer, Johanna in real estate. Photography, video and web development have always been hobbies for both of us.",
      p2: "That interest gradually became something more. Alongside our previous careers, we took on smaller projects — and at some point, the work became serious enough that we chose to follow it fully.",
      p3: "That path brought us to Greenland. We now live in Qaqortoq in the south of Greenland, where we work year-round. It's a place that continues to shape both how we live and how we work.",
      p4: "Working in Greenland has shaped how we approach production. The Arctic environment requires awareness, planning, and the ability to adapt — both creatively and in terms of safety. This is something we bring into every project. Today, we work with companies in Greenland — and with others who come here to produce.",
      ctaH: 'Planning a project in Greenland?',
      ctaB: "Tell us about your project — we'll figure out the right approach.",
      ctaBtn: 'Work with us',
    },
    da: {
      heroEyebrow: 'Om os',
      heroH1: 'Vi er Oskar & Johanna',
      nav1: 'Vores historie',
      nav2: 'Kontakt',
      eyebrow: 'VORES HISTORIE',
      p1: 'Inden Nord Creative havde vi forskellige karrierer — Oskar som politibetjent, Johanna i ejendomsbranchen. Fotografering, video og hjemmesideudvikling er noget vi begge altid har haft som hobby.',
      p2: 'Den interesse voksede gradvist til noget mere. Sideløbende med vores tidligere karrierer tog vi mindre projekter på os — og på et tidspunkt var arbejdet seriøst nok til, at vi valgte at følge det fuldt ud.',
      p3: 'Den vej bragte os til Grønland. Vi bor nu i Qaqortoq i det sydlige Grønland, hvor vi arbejder året rundt. Det er et sted, der præger både hvordan vi lever og arbejder.',
      p4: 'At arbejde i Grønland har formet, hvordan vi griber produktioner an. Det arktiske miljø kræver opmærksomhed, planlægning og evnen til at tilpasse sig — både kreativt og sikkerhedsmæssigt. Det tager vi med ind i hvert projekt. I dag arbejder vi med virksomheder i Grønland — og med andre, der kommer hertil for at producere.',
      ctaH: 'Planlægger du et projekt i Grønland?',
      ctaB: 'Fortæl os om dit projekt — vi finder den rigtige tilgang.',
      ctaBtn: 'Arbejd med os',
    }
  }

  return (
    <main className="min-h-screen text-white">
      <SideNav items={[
        { label: t[lang].nav1, id: 'about-text' },
        { label: t[lang].nav2, id: 'about-cta' },
      ]} />
      <section id="about-hero" data-snap="true" className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://cdn.nordcreative.dk/P68%20HEADER.mp4"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pb-20">
          <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-4">{t[lang].heroEyebrow}</p>
          <h1 className="text-5xl md:text-6xl min-[1900px]:text-[clamp(28px,2.78vw,68px)] font-light text-white">{t[lang].heroH1}</h1>
        </div>
      </section>

      {/* Story */}
      <section id="about-text" data-snap="true" className="bg-black min-h-screen flex items-center">
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16 py-16 grid grid-cols-1 min-[1024px]:grid-cols-2 gap-16 min-[1900px]:gap-24 items-center w-full">
          <div className="flex flex-col justify-between h-full">
            <p className="text-sm tracking-[0.25em] uppercase text-white/50 mb-4">{t[lang].eyebrow}</p>
            <Image
              src="/logos/final/svg/nord-creative-wordmark-needle-white.svg"
              alt="Nord Creative"
              width={612}
              height={184}
              className="block self-start h-10 min-[1900px]:h-12 w-auto mb-4 opacity-90"
            />
            <div className="space-y-6">
              <p className="text-[clamp(1.125rem,1.15vw,1.5rem)] text-white/60 leading-relaxed">{t[lang].p1}</p>
              <p className="text-[clamp(1.125rem,1.15vw,1.5rem)] text-white/60 leading-relaxed">{t[lang].p2}</p>
              <p className="text-[clamp(1.125rem,1.15vw,1.5rem)] text-white/60 leading-relaxed">{t[lang].p3}</p>
              <p className="text-[clamp(1.125rem,1.15vw,1.5rem)] text-white/60 leading-relaxed">{t[lang].p4}</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] w-full">
            <Image
              src="/IMG_3883.jpg"
              alt="Oskar & Johanna"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about-cta" data-snap="true" className="bg-black pt-8 pb-24">
        <div className="max-w-7xl min-[1900px]:max-w-[1700px] mx-auto px-6 min-[1900px]:px-16">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] bg-zinc-900 max-[1024px]:aspect-auto max-[1024px]:min-h-[340px]">
            <Image
              src="https://cdn.nordcreative.dk/CTA%20about.jpg"
              alt="Planning a project in Greenland"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-4xl md:text-5xl min-[1900px]:text-[clamp(28px,2.78vw,68px)] font-light text-white mb-6">{t[lang].ctaH}</h2>
              <p className="text-lg min-[1900px]:text-[clamp(1.125rem,1.15vw,1.5rem)] text-white/70 leading-relaxed mb-8 max-w-xl min-[1900px]:max-w-2xl">{t[lang].ctaB}</p>
              <a href="mailto:contact@nordcreative.dk" className="inline-flex items-center justify-center px-11 py-5 rounded-full border border-white/20 text-white text-[17px] hover:bg-white/10 transition-colors" style={{ textTransform: 'none', letterSpacing: 'normal' }}>{t[lang].ctaBtn}</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

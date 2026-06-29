'use client'

import Image from 'next/image'

function scrollTo(id: string) {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex items-center bg-bc-gray-900 overflow-hidden"
      style={{ height: 'calc(100vh - 108px)', minHeight: '600px' }}
    >
      {/* Imagen de portada */}
      <Image
        src="/hero.jpg"
        alt="Blue Chic — Colección 2026"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: '70% 20%' }}
      />
      {/* Overlays para legibilidad del texto sobre la imagen */}
      <div className="absolute inset-0 bg-gradient-to-r from-bc-black/80 via-bc-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bc-black/40 to-transparent" />

      <div className="relative z-10 px-20 max-w-[680px]">
        <div className="text-[10px] tracking-[4px] uppercase text-bc-accent font-light mb-4">
          Colección Temporada 2026
        </div>

        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-light text-bc-white leading-none mb-6">
          Tu estilo,
          <br />
          <em className="italic">tu identidad</em>
        </h1>

        <p className="text-bc-gray-200 text-sm md:text-base font-light leading-relaxed tracking-wide mb-10 max-w-sm">
          Prendas seleccionadas con criterio. Elegancia sin esfuerzo para la
          mujer que sabe lo que quiere.
        </p>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => scrollTo('#coleccion')}
            className="px-8 py-3.5 bg-bc-white text-bc-black text-[11px] tracking-[3px] uppercase font-light hover:bg-bc-accent hover:text-bc-white transition-colors duration-300"
          >
            Conocer colección
          </button>
          <button
            onClick={() => scrollTo('#sobre-mi')}
            className="px-8 py-3.5 border border-bc-white/50 text-bc-white text-[11px] tracking-[3px] uppercase font-light hover:border-bc-white transition-colors duration-300"
          >
            Nuestra historia
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bc-white/40">
        <span className="text-[9px] tracking-[3px] uppercase">Scroll</span>
        <div className="w-px h-12 bg-bc-white/20 relative overflow-hidden">
          <div className="w-full h-1/2 bg-bc-white/60 animate-bounce absolute top-0" />
        </div>
      </div>
    </section>
  )
}

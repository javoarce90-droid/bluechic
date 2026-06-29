import Image from 'next/image'

export default function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 px-6 bg-bc-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[3/4] bg-bc-gray-100 overflow-hidden">
          <Image
            src="/about.jpg"
            alt="La persona detrás de Blue Chic"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            style={{ objectPosition: 'center 15%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <div className="font-display text-2xl font-light text-bc-white italic">
              &ldquo;La moda pasa, el estilo queda&rdquo;
            </div>
            <div className="text-[10px] tracking-[2px] uppercase text-bc-gray-300 mt-2">
              — Yves Saint Laurent
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-[10px] tracking-[4px] uppercase text-bc-accent font-light">
            Sobre mí
          </div>
          <h2 className="font-display text-5xl font-light text-bc-black leading-tight">
            La persona
            <br />
            detrás de la marca
          </h2>

          <blockquote className="border-l-2 border-bc-accent pl-6">
            <p className="font-display text-xl font-light italic text-bc-gray-700 leading-relaxed">
              &ldquo;Creo que toda mujer merece sentirse extraordinaria en su
              día a día. Por eso selecciono cada prenda pensando en vos.&rdquo;
            </p>
          </blockquote>

          <p className="text-bc-gray-500 text-sm leading-relaxed font-light tracking-wide">
            Soy emprendedora, amante de la moda y convencida de que el estilo
            no tiene que ser complejo ni costoso. Blue Chic nació de mi pasión
            por conectar a las mujeres con prendas que las hagan sentir
            seguras, cómodas y únicas.
          </p>
          <p className="text-bc-gray-500 text-sm leading-relaxed font-light tracking-wide">
            Cada temporada investigo tendencias y selecciono
            personalmente las piezas que forman parte de nuestra colección.
            No hacemos fast fashion — hacemos moda con propósito.
          </p>

          <div className="pt-4">
            <div className="font-display text-2xl font-light text-bc-black">
              Fundadora de Blue Chic
            </div>
            <div className="text-[10px] tracking-[2px] uppercase text-bc-gray-500 mt-1">
              @bluechic.ok
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function BrandSection() {
  return (
    <section id="marca" className="bg-bc-black py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="text-[10px] tracking-[4px] uppercase text-bc-accent font-light">
            Nuestra filosofía
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-bc-white leading-tight">
            Vestir con
            <br />
            <em className="italic text-bc-accent">intención</em>
          </h2>
          <p className="text-bc-gray-300 text-sm leading-relaxed font-light tracking-wide max-w-md">
            En Blue Chic creemos que la moda es un lenguaje. Cada prenda que
            seleccionamos cuenta una historia de elegancia sin esfuerzo, de
            calidad que se siente y de estilo que trasciende temporadas.
          </p>
          <p className="text-bc-gray-300 text-sm leading-relaxed font-light tracking-wide max-w-md">
            Trabajamos con talles reales, materiales nobles y siluetas que
            abrazan el cuerpo de la mujer argentina en toda su diversidad.
          </p>
          <div className="flex gap-12 pt-4">
            {[
              { value: '3+', label: 'Años de trayectoria' },
              { value: '500+', label: 'Clientas satisfechas' },
              { value: '100%', label: 'Selección curada' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-3xl font-light text-bc-accent">
                  {value}
                </div>
                <div className="text-[10px] tracking-[2px] uppercase text-bc-gray-500 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] bg-bc-gray-900 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-bc-gray-900 to-bc-gray-700 flex items-end p-4">
              <span className="text-[10px] tracking-[2px] uppercase text-bc-gray-500">
                Colección 2026
              </span>
            </div>
          </div>
          <div className="aspect-[3/4] bg-bc-gray-900 overflow-hidden mt-8">
            <div className="w-full h-full bg-gradient-to-br from-bc-gray-700 to-bc-gray-900 flex items-end p-4">
              <span className="text-[10px] tracking-[2px] uppercase text-bc-gray-500">
                Detalles únicos
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

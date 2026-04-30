'use client'

import { useState } from 'react'

export default function ContactSection() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <section id="contacto" className="py-24 px-6 bg-bc-gray-900">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Left */}
        <div className="space-y-8">
          <div className="text-[10px] tracking-[4px] uppercase text-bc-accent font-light">
            Estamos aquí
          </div>
          <h2 className="font-display text-5xl font-light text-bc-white leading-tight">
            Hablemos
          </h2>
          <p className="text-bc-gray-300 text-sm leading-relaxed font-light tracking-wide">
            ¿Tenés alguna consulta sobre talles, disponibilidad o envíos?
            Escribinos y te respondemos a la brevedad.
          </p>

          <div className="space-y-5 pt-4">
            {[
              { icon: '✉', label: 'Email', value: 'hola@bluechic.com.ar' },
              { icon: '📱', label: 'WhatsApp', value: '+54 9 11 0000-0000' },
              { icon: '📍', label: 'Ubicación', value: 'Buenos Aires, Argentina' },
              { icon: '🕐', label: 'Horario', value: 'Lun–Vie, 10:00–18:00' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex gap-4 items-start">
                <span className="text-lg w-6 text-center">{icon}</span>
                <div>
                  <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-0.5">
                    {label}
                  </div>
                  <div className="text-bc-gray-200 text-sm font-light tracking-wide">
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <a
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-bc-gray-600 text-bc-gray-200 text-[10px] tracking-[3px] uppercase font-light hover:border-bc-white hover:text-bc-white transition-colors"
            >
              <span>Escribir por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="font-display text-4xl font-light text-bc-white mb-3">
                  ¡Gracias!
                </div>
                <p className="text-bc-gray-300 text-sm font-light tracking-wide">
                  Tu mensaje fue enviado. Te contactamos pronto.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-2">
                    Nombre
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-transparent border-b border-bc-gray-700 text-bc-white text-sm font-light py-2 focus:border-bc-accent outline-none transition-colors tracking-wide placeholder:text-bc-gray-700"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full bg-transparent border-b border-bc-gray-700 text-bc-white text-sm font-light py-2 focus:border-bc-accent outline-none transition-colors tracking-wide placeholder:text-bc-gray-700"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-2">
                  Asunto
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-transparent border-b border-bc-gray-700 text-bc-white text-sm font-light py-2 focus:border-bc-accent outline-none transition-colors tracking-wide placeholder:text-bc-gray-700"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div>
                <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-2">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-bc-gray-700 text-bc-white text-sm font-light py-2 focus:border-bc-accent outline-none transition-colors tracking-wide placeholder:text-bc-gray-700 resize-none"
                  placeholder="Escribí tu consulta..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 bg-bc-accent text-bc-white text-[10px] tracking-[3px] uppercase font-light hover:bg-bc-white hover:text-bc-black transition-colors duration-300"
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

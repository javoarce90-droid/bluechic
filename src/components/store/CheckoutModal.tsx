'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { createOrder } from '@/lib/actions/orders'
import { createCheckoutPreference } from '@/lib/actions/mercadopago'

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

type Step = 'form' | 'success'

export default function CheckoutModal() {
  const { items, isCheckoutOpen, closeCheckout, clearCart, subtotal } = useCartStore()
  const [step, setStep] = useState<Step>('form')
  const [payment, setPayment] = useState<'mp' | 'transfer'>('mp')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [payError, setPayError] = useState('')

  const sub = subtotal()
  const freeShipping = sub >= 200000
  const total = freeShipping ? sub : sub + 5000

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setPayError('')

    const form = e.currentTarget
    const data = new FormData(form)

    const result = await createOrder({
      firstName: data.get('firstName') as string,
      lastName: data.get('lastName') as string,
      email: data.get('email') as string,
      phone: data.get('phone') as string,
      address: data.get('address') as string,
      city: data.get('city') as string,
      province: data.get('province') as string,
      postal: data.get('postal') as string,
      apt: data.get('apt') as string,
      paymentMethod: payment,
      items,
    })

    if (!result.success || !result.orderNumber || !result.orderId) {
      setIsSubmitting(false)
      setPayError(result.error || 'No se pudo crear el pedido.')
      return
    }

    // Mercado Pago: creamos la preferencia y redirigimos a la pantalla de pago
    if (payment === 'mp') {
      const pref = await createCheckoutPreference(result.orderId)
      if (pref.success && pref.initPoint) {
        clearCart()
        window.location.href = pref.initPoint
        return
      }
      setIsSubmitting(false)
      setPayError(pref.error || 'No se pudo iniciar el pago con Mercado Pago.')
      return
    }

    // Transferencia: mostramos los datos para transferir
    setIsSubmitting(false)
    setOrderNumber(result.orderNumber)
    setStep('success')
    clearCart()
  }

  function handleClose() {
    closeCheckout()
    setStep('form')
    setPayment('mp')
    setOrderNumber('')
    setPayError('')
  }

  if (!isCheckoutOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[2500] bg-bc-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[2501] overflow-y-auto flex items-start justify-center p-4 pt-10">
        <div className="bg-bc-white w-full max-w-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-bc-gray-200">
            <h2 className="font-display text-2xl font-light text-bc-black">
              {step === 'success' ? 'Pedido confirmado' : 'Finalizar compra'}
            </h2>
            <button onClick={handleClose} className="text-bc-gray-500 hover:text-bc-black transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Success */}
          {step === 'success' ? (
            <div className="p-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-bc-accent/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-bc-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="font-display text-4xl font-light text-bc-black mb-2">
                  ¡Gracias por tu compra!
                </div>
                <div className="text-bc-gray-500 text-sm font-light tracking-wide">
                  Pedido nro.{' '}
                  <span className="font-medium text-bc-black">{orderNumber}</span>
                </div>
              </div>
              <p className="text-bc-gray-500 text-sm font-light leading-relaxed max-w-md mx-auto">
                {payment === 'transfer'
                  ? 'Por favor enviá el comprobante de transferencia por WhatsApp para confirmar tu pedido.'
                  : 'Recibirás la confirmación por email. ¡Estamos preparando tu pedido!'}
              </p>
              {payment === 'transfer' && (
                <div className="bg-bc-gray-100 p-5 text-sm font-light space-y-1 text-left max-w-xs mx-auto">
                  <div className="text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-3">
                    Datos de transferencia
                  </div>
                  <div><span className="text-bc-gray-500">CBU:</span> 0000000000000000000000</div>
                  <div><span className="text-bc-gray-500">Alias:</span> BLUECHIC.MODA</div>
                  <div><span className="text-bc-gray-500">Titular:</span> Blue Chic</div>
                  <div><span className="text-bc-gray-500">Monto:</span> {formatPrice(total)}</div>
                </div>
              )}
              {payment === 'transfer' && (
                <a
                  href="https://wa.me/5491158508509"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 text-[11px] tracking-[3px] uppercase font-light"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  Enviar comprobante
                </a>
              )}
              <button
                onClick={handleClose}
                className="block w-full mt-2 py-3 border border-bc-gray-300 text-[10px] tracking-[3px] uppercase text-bc-gray-700 hover:text-bc-black transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="p-8 space-y-8">
                {/* Personal data */}
                <div>
                  <h3 className="text-[10px] tracking-[3px] uppercase text-bc-gray-500 mb-4">
                    Datos personales
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field name="firstName" label="Nombre" required />
                    <Field name="lastName" label="Apellido" required />
                    <Field name="email" label="Email" type="email" required />
                    <Field name="phone" label="Teléfono" type="tel" required />
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <h3 className="text-[10px] tracking-[3px] uppercase text-bc-gray-500 mb-4">
                    Dirección de entrega
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Field name="address" label="Calle y número" required />
                    </div>
                    <Field name="apt" label="Piso / Depto (opcional)" />
                    <Field name="city" label="Ciudad" required />
                    <Field name="province" label="Provincia" required />
                    <Field name="postal" label="Código postal" required />
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <h3 className="text-[10px] tracking-[3px] uppercase text-bc-gray-500 mb-4">
                    Método de pago
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'mp', icon: '💳', label: 'Mercado Pago' },
                      { id: 'transfer', icon: '🏦', label: 'Transferencia' },
                    ].map(({ id, icon, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPayment(id as 'mp' | 'transfer')}
                        className={`flex items-center gap-3 p-4 border transition-colors text-left
                          ${payment === id
                            ? 'border-bc-black bg-bc-gray-100'
                            : 'border-bc-gray-200 hover:border-bc-gray-400'
                          }`}
                      >
                        <span className="text-xl">{icon}</span>
                        <span className="text-sm font-light tracking-wide text-bc-black">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {payment === 'mp' && (
                    <div className="mt-3 p-4 bg-blue-50 text-sm text-blue-700 font-light">
                      Al confirmar el pedido te enviaremos el link de pago por email y WhatsApp.
                    </div>
                  )}

                  {payment === 'transfer' && (
                    <div className="mt-3 p-4 bg-bc-gray-100 text-sm font-light space-y-1 text-bc-gray-700">
                      <div><span className="font-medium">CBU:</span> 0000000000000000000000</div>
                      <div><span className="font-medium">Alias:</span> BLUECHIC.MODA</div>
                      <div className="text-bc-gray-500 text-xs mt-2">
                        Enviá el comprobante por WhatsApp una vez realizada la transferencia.
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="border-t border-bc-gray-200 pt-5 space-y-2">
                  <div className="flex justify-between text-sm font-light text-bc-gray-500">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
                    <span>{formatPrice(sub)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-light text-bc-gray-500">
                    <span>Envío</span>
                    <span>{freeShipping ? 'Gratis' : formatPrice(5000)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-bc-gray-200">
                    <span className="text-[10px] tracking-[2px] uppercase text-bc-gray-500">Total</span>
                    <span className="font-display text-2xl font-light text-bc-black">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8">
                {payError && (
                  <div className="mb-3 text-red-500 text-xs tracking-wide text-center">
                    {payError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-[11px] tracking-[3px] uppercase font-light transition-colors
                    ${isSubmitting
                      ? 'bg-bc-gray-300 text-bc-gray-500 cursor-not-allowed'
                      : 'bg-bc-black text-bc-white hover:bg-bc-accent'
                    }`}
                >
                  {isSubmitting
                    ? 'Procesando...'
                    : payment === 'mp'
                      ? 'Pagar con Mercado Pago'
                      : 'Confirmar pedido'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

function Field({
  name,
  label,
  type = 'text',
  required = false,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border border-bc-gray-200 px-3 py-2.5 text-sm font-light text-bc-black focus:border-bc-black outline-none transition-colors bg-transparent"
      />
    </div>
  )
}

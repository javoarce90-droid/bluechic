import Link from 'next/link'

const COPY: Record<
  string,
  { title: string; message: string; accent: boolean }
> = {
  success: {
    title: '¡Pago aprobado!',
    message:
      'Recibimos tu pago. Te enviaremos la confirmación por email y estamos preparando tu pedido.',
    accent: true,
  },
  pending: {
    title: 'Pago pendiente',
    message:
      'Tu pago está siendo procesado. Apenas se acredite vas a recibir la confirmación por email.',
    accent: false,
  },
  failure: {
    title: 'No se pudo procesar el pago',
    message:
      'El pago no se completó. Podés volver a intentarlo o contactarnos por WhatsApp.',
    accent: false,
  },
}

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; order?: string }>
}) {
  const { status = 'pending', order } = await searchParams
  const copy = COPY[status] ?? COPY.pending

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-24 bg-bc-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div
          className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
            copy.accent ? 'bg-bc-accent/10' : 'bg-bc-gray-100'
          }`}
        >
          <span className="text-2xl">{status === 'success' ? '✓' : status === 'failure' ? '✕' : '⏳'}</span>
        </div>

        <h1 className="font-display text-4xl font-light text-bc-black">
          {copy.title}
        </h1>

        {order && (
          <p className="text-bc-gray-500 text-sm font-light tracking-wide">
            Pedido nro. <span className="font-medium text-bc-black">{order}</span>
          </p>
        )}

        <p className="text-bc-gray-500 text-sm font-light leading-relaxed">
          {copy.message}
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3 bg-bc-black text-bc-white text-[10px] tracking-[3px] uppercase font-light hover:bg-bc-accent transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { StoreSettings } from '@/types'
import { updateStoreSettings } from '@/lib/actions/settings'

export default function PaymentSettingsClient({
  initialSettings,
}: {
  initialSettings: StoreSettings
}) {
  const router = useRouter()
  const [form, setForm] = useState<StoreSettings>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof StoreSettings>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await updateStoreSettings(form)
    setSaving(false)
    if (!res.success) {
      setError(res.error || 'Error al guardar')
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light text-bc-black">Pagos</h1>
        <p className="text-sm text-bc-gray-500 mt-1">
          Configurá los datos que ve el cliente al pagar
        </p>
      </div>

      {error && (
        <div className="mb-6 text-red-500 text-xs tracking-wide">{error}</div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
        {/* Transferencia */}
        <div className="bg-white border border-bc-gray-200 p-6 space-y-4">
          <h2 className="text-[10px] tracking-[2px] uppercase text-bc-gray-500">
            Transferencia bancaria
          </h2>
          <Field label="CBU / CVU" value={form.transfer_cbu} onChange={(v) => set('transfer_cbu', v)} placeholder="0000000000000000000000" />
          <Field label="Alias" value={form.transfer_alias} onChange={(v) => set('transfer_alias', v)} placeholder="BLUECHIC.MODA" />
          <Field label="Titular" value={form.transfer_holder} onChange={(v) => set('transfer_holder', v)} placeholder="Nombre y apellido" />
          <Field label="Banco" value={form.transfer_bank} onChange={(v) => set('transfer_bank', v)} placeholder="Ej: Banco Galicia" />
        </div>

        {/* Mercado Pago */}
        <div className="bg-white border border-bc-gray-200 p-6 space-y-4">
          <h2 className="text-[10px] tracking-[2px] uppercase text-bc-gray-500">
            Mercado Pago
          </h2>
          <p className="text-xs text-bc-gray-400 font-light leading-relaxed">
            El pago online ya funciona con la integración. Acá podés cargar tu
            alias de Mercado Pago para que el cliente también pueda transferirte
            directo si prefiere.
          </p>
          <Field label="Alias de Mercado Pago" value={form.mp_alias} onChange={(v) => set('mp_alias', v)} placeholder="tu.alias.mp" />
        </div>

        <div className="lg:col-span-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-bc-black text-bc-white text-[10px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && (
            <span className="text-xs text-green-600 tracking-wide">
              ✓ Guardado
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-bc-gray-200 px-3 py-2 text-sm font-light focus:border-bc-black outline-none"
      />
    </div>
  )
}

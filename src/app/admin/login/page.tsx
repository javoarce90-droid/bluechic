'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales inválidas. Verificá tu email y contraseña.')
      setLoading(false)
      return
    }

    router.push('/admin/productos')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bc-gray-100 flex items-center justify-center p-4">
      <div className="bg-bc-white w-full max-w-sm p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="font-display text-3xl font-light tracking-[4px] uppercase text-bc-black mb-1">
            Blue<span className="text-bc-accent">·</span>Chic
          </div>
          <div className="text-[10px] tracking-[3px] uppercase text-bc-gray-500">
            Panel administrativo
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-bc-gray-200 px-3 py-2.5 text-sm font-light text-bc-black focus:border-bc-black outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[9px] tracking-[2px] uppercase text-bc-gray-500 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-bc-gray-200 px-3 py-2.5 text-sm font-light text-bc-black focus:border-bc-black outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs tracking-wide">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-[10px] tracking-[3px] uppercase font-light transition-colors
              ${loading
                ? 'bg-bc-gray-300 text-bc-gray-500 cursor-not-allowed'
                : 'bg-bc-black text-bc-white hover:bg-bc-accent'
              }`}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

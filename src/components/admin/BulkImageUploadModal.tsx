'use client'

import { useState } from 'react'
import { uploadImagesByName } from '@/lib/actions/storage'

export default function BulkImageUploadModal({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: () => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<
    { name: string; error?: string }[] | null
  >(null)

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    setResults(null)
    setFiles(Array.from(e.target.files ?? []))
  }

  async function handleUpload() {
    if (files.length === 0) return
    setUploading(true)
    const fd = new FormData()
    for (const f of files) fd.append('files', f)
    const res = await uploadImagesByName(fd)
    setUploading(false)
    setResults(res.results)
    if (res.uploaded > 0) onDone()
  }

  const okCount = results?.filter((r) => !r.error).length ?? 0
  const failCount = results?.filter((r) => r.error).length ?? 0

  return (
    <>
      <div className="fixed inset-0 z-[3000] bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-[3001] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-light text-bc-black mb-2">
            Subir imágenes en lote
          </h2>
          <p className="text-sm text-bc-gray-500 font-light mb-6">
            Cada archivo se guarda con su <strong>nombre exacto</strong>. Si en
            el CSV pusiste ese mismo nombre (ej.{' '}
            <code className="text-bc-black">pants-black-1.jpg</code>), la foto
            queda enlazada al producto automáticamente.
          </p>

          <label className="block w-full border border-dashed border-bc-gray-300 px-4 py-8 text-center cursor-pointer text-[10px] tracking-[2px] uppercase text-bc-gray-500 hover:border-bc-black hover:text-bc-black transition-colors mb-5">
            {files.length > 0
              ? `${files.length} archivo${files.length !== 1 ? 's' : ''} seleccionado${files.length !== 1 ? 's' : ''}`
              : 'Elegir imágenes'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={pick}
              className="hidden"
            />
          </label>

          {files.length > 0 && !results && (
            <ul className="mb-5 max-h-40 overflow-y-auto divide-y divide-bc-gray-100">
              {files.map((f) => (
                <li
                  key={f.name}
                  className="text-xs text-bc-gray-600 font-light py-1.5"
                >
                  {f.name}
                </li>
              ))}
            </ul>
          )}

          {results && (
            <div className="mb-5 border border-bc-gray-200 p-4">
              <div className="text-sm text-bc-black font-light mb-2">
                ✓ {okCount} subida{okCount !== 1 ? 's' : ''}
                {failCount > 0 && ` · ${failCount} con error`}
              </div>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {results.map((r) => (
                  <li
                    key={r.name}
                    className={`text-xs font-light ${r.error ? 'text-red-600' : 'text-bc-gray-500'}`}
                  >
                    {r.error ? `✕ ${r.name}: ${r.error}` : `✓ ${r.name}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {!results && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="flex-1 py-3 bg-bc-black text-bc-white text-[10px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors disabled:opacity-50"
              >
                {uploading ? 'Subiendo...' : `Subir ${files.length} imagen${files.length !== 1 ? 'es' : ''}`}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-bc-gray-200 text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:text-bc-black transition-colors"
            >
              {results ? 'Cerrar' : 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

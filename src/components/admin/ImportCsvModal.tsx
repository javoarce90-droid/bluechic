'use client'

import { useState } from 'react'
import {
  importProductsCsv,
  type ImportRow,
  type ImportResult,
} from '@/lib/actions/import'

const HEADERS = [
  'nombre',
  'categoria',
  'coleccion',
  'precio',
  'descripcion',
  'talles',
  'colores',
  'stock',
  'imagenes',
  'destacado',
] as const

const TEMPLATE = `nombre,categoria,coleccion,precio,descripcion,talles,colores,stock,imagenes,destacado
Pants Black,Pantalones,Invierno,57000,"Pantalón de eco cuero con cinto, sofisticado y moderno",36|38|40,Marrón|Negro,3,https://misfotos.com/pants-1.jpg|https://misfotos.com/pants-2.jpg,no
Body Escote V,Bodies,Juvenil,32000,Body de modal con escote en V,S|M|L,Negro,5,,si
`

// Parser CSV mínimo que respeta comillas dobles (para descripciones con comas)
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let cur: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      cur.push(field)
      field = ''
    } else if (ch === '\n') {
      cur.push(field)
      rows.push(cur)
      cur = []
      field = ''
    } else if (ch !== '\r') {
      field += ch
    }
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field)
    rows.push(cur)
  }
  return rows
}

const splitList = (s: string) =>
  s
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean)

interface ParseOutput {
  rows: ImportRow[]
  errors: string[]
}

function buildRows(text: string): ParseOutput {
  const errors: string[] = []
  const grid = parseCsv(text).filter((r) => r.some((c) => c.trim() !== ''))
  if (grid.length === 0) return { rows: [], errors: ['El archivo está vacío.'] }

  const header = grid[0].map((h) => h.trim().toLowerCase())
  const idx = (name: string) => header.indexOf(name)
  const missing = HEADERS.filter(
    (h) => h !== 'destacado' && h !== 'imagenes' && idx(h) === -1
  )
  if (missing.length > 0) {
    return {
      rows: [],
      errors: [`Faltan columnas obligatorias: ${missing.join(', ')}`],
    }
  }

  const rows: ImportRow[] = []
  for (let i = 1; i < grid.length; i++) {
    const cols = grid[i]
    const get = (name: string) => (idx(name) >= 0 ? (cols[idx(name)] ?? '').trim() : '')
    const rowNum = i + 1

    const nombre = get('nombre')
    const precio = parseFloat(get('precio'))
    const talles = splitList(get('talles'))
    const colores = splitList(get('colores'))

    if (!nombre) {
      errors.push(`Fila ${rowNum}: falta el nombre.`)
      continue
    }
    if (isNaN(precio)) {
      errors.push(`Fila ${rowNum} (${nombre}): precio inválido.`)
      continue
    }
    if (talles.length === 0 || colores.length === 0) {
      errors.push(`Fila ${rowNum} (${nombre}): necesita al menos un talle y un color.`)
      continue
    }

    const destacado = ['si', 'sí', 'true', '1', 'x'].includes(
      get('destacado').toLowerCase()
    )

    rows.push({
      nombre,
      categoria: get('categoria'),
      coleccion: get('coleccion'),
      precio,
      descripcion: get('descripcion'),
      talles,
      colores,
      stock: parseInt(get('stock')) || 0,
      imagenes: splitList(get('imagenes')),
      destacado,
    })
  }

  return { rows, errors }
}

function downloadTemplate() {
  const blob = new Blob([TEMPLATE], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'plantilla-productos-bluechic.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function ImportCsvModal({
  onClose,
  onDone,
}: {
  onClose: () => void
  onDone: () => void
}) {
  const [parsed, setParsed] = useState<ParseOutput | null>(null)
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setResult(null)
    const text = await file.text()
    setParsed(buildRows(text))
  }

  async function handleImport() {
    if (!parsed || parsed.rows.length === 0) return
    setImporting(true)
    const res = await importProductsCsv(parsed.rows)
    setImporting(false)
    setResult(res)
    if (res.created > 0) onDone()
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30" onClick={onClose} />
      <div className="fixed inset-0 z-[61] flex items-start justify-center p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-xl p-8 my-8">
          <h2 className="text-xl font-light text-bc-black mb-2">
            Importar productos (CSV)
          </h2>
          <p className="text-sm text-bc-gray-500 font-light mb-6">
            Una fila por producto. Talles, colores e imágenes separados por{' '}
            <code className="text-bc-black">|</code>. El stock se aplica a cada
            combinación talle × color. Las categorías, colecciones y colores que
            no existan se crean solos.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={downloadTemplate}
              className="px-4 py-2.5 border border-bc-gray-200 text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:border-bc-black hover:text-bc-black transition-colors"
            >
              Descargar plantilla
            </button>
            <label className="px-4 py-2.5 bg-bc-black text-bc-white text-[10px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors cursor-pointer">
              {fileName || 'Elegir archivo CSV'}
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Errores de validación */}
          {parsed && parsed.errors.length > 0 && (
            <div className="mb-5 border border-red-200 bg-red-50 p-4 max-h-40 overflow-y-auto">
              <div className="text-[10px] tracking-[2px] uppercase text-red-600 mb-2">
                Revisá estas filas
              </div>
              <ul className="space-y-1">
                {parsed.errors.map((err, i) => (
                  <li key={i} className="text-xs text-red-600 font-light">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {parsed && parsed.rows.length > 0 && !result && (
            <div className="mb-5">
              <div className="text-[10px] tracking-[2px] uppercase text-bc-gray-500 mb-2">
                {parsed.rows.length} producto
                {parsed.rows.length !== 1 ? 's' : ''} listo
                {parsed.rows.length !== 1 ? 's' : ''} para importar
              </div>
              <div className="border border-bc-gray-200 max-h-52 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-bc-gray-100 text-bc-gray-500">
                      <th className="text-left px-3 py-2 font-normal">Nombre</th>
                      <th className="text-left px-3 py-2 font-normal">Precio</th>
                      <th className="text-left px-3 py-2 font-normal">Talles</th>
                      <th className="text-left px-3 py-2 font-normal">Colores</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.map((r, i) => (
                      <tr key={i} className="border-t border-bc-gray-100">
                        <td className="px-3 py-1.5 text-bc-black">{r.nombre}</td>
                        <td className="px-3 py-1.5 text-bc-gray-600">{r.precio}</td>
                        <td className="px-3 py-1.5 text-bc-gray-600">
                          {r.talles.join(', ')}
                        </td>
                        <td className="px-3 py-1.5 text-bc-gray-600">
                          {r.colores.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resultado */}
          {result && (
            <div className="mb-5 border border-bc-gray-200 p-4">
              <div className="text-sm text-bc-black font-light mb-1">
                ✓ {result.created} producto
                {result.created !== 1 ? 's' : ''} importado
                {result.created !== 1 ? 's' : ''}.
              </div>
              {result.errors.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-600 font-light">
                      Fila {e.row}: {e.error}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {!result && (
              <button
                type="button"
                onClick={handleImport}
                disabled={importing || !parsed || parsed.rows.length === 0}
                className="flex-1 py-3 bg-bc-black text-bc-white text-[10px] tracking-[2px] uppercase font-light hover:bg-bc-accent transition-colors disabled:opacity-50"
              >
                {importing
                  ? 'Importando...'
                  : `Importar ${parsed?.rows.length ?? 0} producto${
                      (parsed?.rows.length ?? 0) !== 1 ? 's' : ''
                    }`}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-bc-gray-200 text-[10px] tracking-[2px] uppercase text-bc-gray-700 hover:text-bc-black transition-colors"
            >
              {result ? 'Cerrar' : 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

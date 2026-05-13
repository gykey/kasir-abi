import { useState } from 'react'
import { Archive, AlertTriangle, CheckCircle, XCircle, Plus, Minus, Search } from 'lucide-react'
import { seedProducts, formatRupiah } from '../data/seedData'

const StockBadge = ({ stok }) => {
  if (stok === 0) return <span className="badge-danger flex items-center gap-1"><XCircle className="w-3 h-3" />Habis</span>
  if (stok <= 5) return <span className="badge-danger flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Kritis</span>
  if (stok <= 15) return <span className="badge-warning flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Sedikit</span>
  return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" />Aman</span>
}

const StockBar = ({ stok, max = 100 }) => {
  const pct = Math.min(100, (stok / max) * 100)
  const color = stok === 0 ? 'bg-red-500' : stok <= 5 ? 'bg-red-500' : stok <= 15 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="w-full bg-dark-700 rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function Stok() {
  const [products, setProducts] = useState(seedProducts)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')

  const filtered = products.filter(p => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'Semua' ? true :
      filter === 'Aman' ? p.stok > 15 :
      filter === 'Sedikit' ? p.stok > 0 && p.stok <= 15 :
      filter === 'Habis' ? p.stok === 0 : true
    return matchSearch && matchFilter
  })

  const updateStok = (id, delta) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, stok: Math.max(0, p.stok + delta) } : p
    ))
  }

  const setStokManual = (id, val) => {
    const num = parseInt(val)
    if (!isNaN(num) && num >= 0) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stok: num } : p))
    }
  }

  const habis = products.filter(p => p.stok === 0).length
  const kritis = products.filter(p => p.stok > 0 && p.stok <= 5).length
  const sedikit = products.filter(p => p.stok > 5 && p.stok <= 15).length
  const aman = products.filter(p => p.stok > 15).length

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Stok Aman', value: aman, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
          { label: 'Stok Sedikit', value: sedikit, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: AlertTriangle },
          { label: 'Stok Kritis', value: kritis, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
          { label: 'Stok Habis', value: habis, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-dark-500">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {(habis > 0 || kritis > 0) && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400">Perhatian: Stok Kritis!</p>
            <p className="text-xs text-dark-400 mt-0.5">
              {habis > 0 && `${habis} produk stok habis, `}
              {kritis > 0 && `${kritis} produk stok kritis. `}
              Segera lakukan restok.
            </p>
          </div>
        </div>
      )}

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['Semua', 'Aman', 'Sedikit', 'Habis'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                filter === f
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-dark-700 text-dark-400 border-dark-600 hover:border-dark-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stock table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-dark-700 flex items-center gap-2">
          <Archive className="w-4 h-4 text-primary-400" />
          <h3 className="font-semibold text-dark-50">Manajemen Stok</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700/50">
              <tr>
                {['Produk', 'Kategori', 'Harga', 'Stok Saat Ini', 'Level', 'Ubah Stok'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-dark-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50">
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-dark-700/30 transition-colors ${p.stok === 0 ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="text-sm font-medium text-dark-100">{p.nama_produk}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-info">{p.kategori}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary-400 font-semibold">{formatRupiah(p.harga)}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1.5">
                      <span className="text-sm font-bold text-dark-50">{p.stok} pcs</span>
                      <StockBar stok={p.stok} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StockBadge stok={p.stok} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStok(p.id, -1)}
                        className="w-7 h-7 rounded-lg bg-dark-700 hover:bg-red-500/20 hover:text-red-400 text-dark-400 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={p.stok}
                        onChange={(e) => setStokManual(p.id, e.target.value)}
                        className="w-14 text-center bg-dark-700 border border-dark-600 text-dark-50 text-sm rounded-lg py-1 focus:outline-none focus:border-primary-500"
                        min="0"
                      />
                      <button
                        onClick={() => updateStok(p.id, 1)}
                        className="w-7 h-7 rounded-lg bg-dark-700 hover:bg-green-500/20 hover:text-green-400 text-dark-400 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-dark-500">
              <Archive className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tidak ada data stok</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

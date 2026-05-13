import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, X, Upload, Package } from 'lucide-react'
import { seedProducts, formatRupiah } from '../data/seedData'

const emptyForm = {
  nama_produk: '', harga: '', stok: '', kategori: '', emoji: '📦', gambar_url: ''
}

const ProductModal = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState(product || emptyForm)
  const isEdit = !!product

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, harga: parseInt(form.harga), stok: parseInt(form.stok), id: form.id || Date.now() })
  }

  const emojis = ['🥔', '🍟', '🍜', '🍪', '🧇', '🍫', '🌽', '🥓', '🧀', '⭐', '🫙', '🍬', '🍡', '🥜', '🍿', '📦']

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-50">
              {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h3>
            <button onClick={onClose} className="text-dark-400 hover:text-dark-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Emoji picker */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Ikon Produk</label>
              <div className="flex flex-wrap gap-2">
                {emojis.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${
                      form.emoji === e
                        ? 'bg-primary-500/20 border-2 border-primary-500'
                        : 'bg-dark-700 border-2 border-transparent hover:border-dark-500'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Nama Produk</label>
                <input
                  type="text"
                  value={form.nama_produk}
                  onChange={(e) => setForm(f => ({ ...f, nama_produk: e.target.value }))}
                  placeholder="Contoh: Chitato Sapi Panggang"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Harga (Rp)</label>
                <input
                  type="number"
                  value={form.harga}
                  onChange={(e) => setForm(f => ({ ...f, harga: e.target.value }))}
                  placeholder="5000"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Stok</label>
                <input
                  type="number"
                  value={form.stok}
                  onChange={(e) => setForm(f => ({ ...f, stok: e.target.value }))}
                  placeholder="50"
                  className="input-field"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Kategori</label>
                <select
                  value={form.kategori}
                  onChange={(e) => setForm(f => ({ ...f, kategori: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {['Keripik', 'Biskuit', 'Wafer', 'Mie Instan', 'Snack Jagung', 'Coklat', 'Lainnya'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upload area (UI only) */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Gambar Produk</label>
              <div className="border-2 border-dashed border-dark-600 rounded-xl p-4 text-center hover:border-primary-500/50 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-dark-500 mx-auto mb-2" />
                <p className="text-xs text-dark-500">Klik untuk upload gambar</p>
                <p className="text-xs text-dark-600 mt-1">PNG, JPG, WEBP maks. 2MB</p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                Batal
              </button>
              <button type="submit" className="btn-primary flex-1">
                {isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function Produk() {
  const [products, setProducts] = useState(seedProducts)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = products.filter(p =>
    p.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
    p.kategori.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (data) => {
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === data.id ? data : p))
    } else {
      setProducts(prev => [...prev, data])
    }
    setModalOpen(false)
    setEditProduct(null)
  }

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setModalOpen(true)
  }

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kategori produk..."
            className="input-field pl-9"
          />
        </div>
        <button
          id="add-product-btn"
          onClick={() => { setEditProduct(null); setModalOpen(true) }}
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Produk', value: products.length, color: 'text-primary-400' },
          { label: 'Keripik', value: products.filter(p => p.kategori === 'Keripik').length, color: 'text-blue-400' },
          { label: 'Biskuit', value: products.filter(p => p.kategori === 'Biskuit').length, color: 'text-purple-400' },
          { label: 'Stok Habis', value: products.filter(p => p.stok === 0).length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-dark-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-dark-700 flex items-center justify-between">
          <h3 className="font-semibold text-dark-50 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-400" />
            Daftar Produk
          </h3>
          <span className="badge-info">{filtered.length} produk</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700/50">
              <tr>
                {['Produk', 'Kategori', 'Harga', 'Stok', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-dark-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-dark-700/30 transition-colors animate-fade-in">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="text-sm font-medium text-dark-100">{p.nama_produk}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-info">{p.kategori}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-primary-400">{formatRupiah(p.harga)}</td>
                  <td className="px-4 py-3 text-sm text-dark-300">{p.stok} pcs</td>
                  <td className="px-4 py-3">
                    <span className={
                      p.stok === 0 ? 'badge-danger' :
                      p.stok <= 10 ? 'badge-warning' :
                      'badge-success'
                    }>
                      {p.stok === 0 ? 'Habis' : p.stok <= 10 ? 'Sedikit' : 'Aman'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-dark-500">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tidak ada produk ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <ProductModal
          product={editProduct}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditProduct(null) }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '360px' }}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-dark-50 mb-2">Hapus Produk?</h3>
              <p className="text-sm text-dark-400 mb-5">
                Produk ini akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Batal</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

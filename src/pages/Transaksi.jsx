import { useState, useRef } from 'react'
import { Search, Plus, Minus, Trash2, ShoppingCart, X, CreditCard, Banknote, Printer, CheckCircle } from 'lucide-react'
import { seedProducts, categories, formatRupiah } from '../data/seedData'

const ProductCard = ({ product, onAdd }) => (
  <div
    className="card p-3 flex flex-col gap-2 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-200 cursor-pointer group"
    onClick={() => onAdd(product)}
  >
    <div className="aspect-square bg-dark-700 rounded-xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-200">
      {product.emoji}
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-dark-50 leading-tight line-clamp-2">{product.nama_produk}</p>
      <p className="text-[10px] text-dark-500 mt-0.5">{product.kategori}</p>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-sm font-bold text-primary-400">{formatRupiah(product.harga)}</p>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
        product.stok === 0 ? 'bg-red-500/20 text-red-400' :
        product.stok <= 5 ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-green-500/20 text-green-400'
      }`}>
        {product.stok === 0 ? 'Habis' : `${product.stok}`}
      </span>
    </div>
    <button className="w-full bg-primary-500/10 hover:bg-primary-500 text-primary-400 hover:text-white text-xs font-medium py-1.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1">
      <Plus className="w-3 h-3" /> Tambah
    </button>
  </div>
)

const StrukModal = ({ onClose, items, total, metode, bayar, kembalian, transaksiId }) => {
  const printRef = useRef()
  const now = new Date()

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-sm" style={{ maxWidth: '380px' }}>
        <div className="p-5">
          {/* Success header */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-dark-50">Transaksi Berhasil!</h3>
            <p className="text-sm text-dark-500">#{String(transaksiId).padStart(6, '0')}</p>
          </div>

          {/* Struk */}
          <div className="print-area bg-dark-700 rounded-xl p-4 text-sm space-y-1 border border-dark-600">
            <div className="text-center mb-3">
              <p className="font-bold text-dark-50">🛒 MASBY SNACK</p>
              <p className="text-xs text-dark-500">Jl. Snack Enak No. 1</p>
              <p className="text-xs text-dark-500">{now.toLocaleString('id-ID')}</p>
              <div className="border-t border-dashed border-dark-600 mt-2 pt-2" />
            </div>
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="text-dark-300 truncate max-w-[150px]">{item.nama_produk}</span>
                <span className="text-dark-400 mx-2">x{item.qty}</span>
                <span className="text-dark-200 shrink-0">{formatRupiah(item.harga * item.qty)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-dark-600 mt-2 pt-2 space-y-1">
              <div className="flex justify-between font-bold text-dark-50">
                <span>TOTAL</span>
                <span>{formatRupiah(total)}</span>
              </div>
              <div className="flex justify-between text-xs text-dark-400">
                <span>Bayar ({metode})</span>
                <span>{formatRupiah(bayar)}</span>
              </div>
              {metode === 'Tunai' && (
                <div className="flex justify-between text-xs text-green-400">
                  <span>Kembalian</span>
                  <span>{formatRupiah(kembalian)}</span>
                </div>
              )}
            </div>
            <div className="text-center pt-3">
              <p className="text-xs text-dark-500">Terima kasih sudah belanja!</p>
              <p className="text-xs text-dark-600">Masby Snack — Lebih Hemat, Lebih Enak</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={handlePrint} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
              <Printer className="w-4 h-4" /> Cetak
            </button>
            <button id="close-struk-btn" onClick={onClose} className="btn-primary flex-1 text-sm">
              Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const PaymentModal = ({ total, onConfirm, onClose }) => {
  const [metode, setMetode] = useState('Tunai')
  const [bayar, setBayar] = useState('')
  const kembalian = parseInt(bayar || '0') - total

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-50">Pembayaran</h3>
            <button onClick={onClose} className="text-dark-400 hover:text-dark-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-dark-700 rounded-xl p-4 mb-4 text-center">
            <p className="text-dark-400 text-sm">Total Pembayaran</p>
            <p className="text-3xl font-bold text-primary-400 mt-1">{formatRupiah(total)}</p>
          </div>

          {/* Metode */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-300 mb-2">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMetode('Tunai')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                  metode === 'Tunai'
                    ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                    : 'border-dark-600 bg-dark-700 text-dark-400 hover:border-dark-500'
                }`}
              >
                <Banknote className="w-4 h-4" /> Tunai
              </button>
              <button
                onClick={() => setMetode('QRIS')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                  metode === 'QRIS'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-dark-600 bg-dark-700 text-dark-400 hover:border-dark-500'
                }`}
              >
                <CreditCard className="w-4 h-4" /> QRIS
              </button>
            </div>
          </div>

          {/* QRIS Display */}
          {metode === 'QRIS' && (
            <div className="bg-white rounded-xl p-4 mb-4 text-center">
              <div className="w-36 h-36 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <div className="grid grid-cols-7 gap-0.5 p-1">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-xs font-medium">Scan QR di atas untuk membayar</p>
              <p className="text-gray-500 text-xs mt-1">{formatRupiah(total)}</p>
            </div>
          )}

          {/* Tunai input */}
          {metode === 'Tunai' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Jumlah Bayar</label>
              <input
                type="number"
                value={bayar}
                onChange={(e) => setBayar(e.target.value)}
                placeholder="Masukkan jumlah uang"
                className="input-field text-lg font-semibold"
              />
              {/* Quick amounts */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {[5000, 10000, 20000, 50000, 100000].map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      const rounded = Math.ceil(total / v) * v
                      setBayar(String(rounded))
                    }}
                    className="text-xs px-2.5 py-1 bg-dark-700 border border-dark-600 rounded-lg text-dark-400 hover:border-primary-500 hover:text-primary-400 transition-colors"
                  >
                    {formatRupiah(v)}
                  </button>
                ))}
              </div>
              {kembalian >= 0 && bayar && (
                <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5 flex justify-between">
                  <span className="text-sm text-dark-400">Kembalian</span>
                  <span className="text-sm font-bold text-green-400">{formatRupiah(kembalian)}</span>
                </div>
              )}
            </div>
          )}

          <button
            id="confirm-payment-btn"
            onClick={() => onConfirm(metode, parseInt(bayar || total.toString()), kembalian)}
            disabled={metode === 'Tunai' && (!bayar || kembalian < 0)}
            className="btn-primary w-full py-3 text-sm font-semibold"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Transaksi() {
  const [products, setProducts] = useState(seedProducts)
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [showPayment, setShowPayment] = useState(false)
  const [showStruk, setShowStruk] = useState(false)
  const [lastTransaction, setLastTransaction] = useState(null)

  const filtered = products.filter(p => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'Semua' || p.kategori === activeCategory
    return matchSearch && matchCat
  })

  const addToCart = (product) => {
    if (product.stok === 0) return
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        if (exists.qty >= product.stok) return prev
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter(i => i.qty > 0)
    )
  }

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const total = cart.reduce((sum, i) => sum + i.harga * i.qty, 0)

  const handleConfirmPayment = (metode, bayar, kembalian) => {
    const txId = Math.floor(Math.random() * 999999)
    setLastTransaction({ metode, bayar, kembalian, id: txId })
    setShowPayment(false)
    setShowStruk(true)
  }

  const handleCloseStruk = () => {
    setShowStruk(false)
    setCart([])
    setLastTransaction(null)
  }

  const allCategories = ['Semua', ...new Set(seedProducts.map(p => p.kategori))]

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Products area */}
      <div className="flex-1 flex flex-col min-w-0 gap-4 overflow-hidden">
        {/* Search & filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              id="search-product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk snack..."
              className="input-field pl-9"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-700 text-dark-400 hover:text-dark-200 border border-dark-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-dark-500">
              <span className="text-4xl">🔍</span>
              <p className="mt-2 text-sm">Produk tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart sidebar */}
      <div className="w-72 xl:w-80 shrink-0 flex flex-col card">
        {/* Cart header */}
        <div className="p-4 border-b border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary-400" />
            <h3 className="font-semibold text-dark-50">Keranjang</h3>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Hapus Semua
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-dark-600">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Keranjang kosong</p>
              <p className="text-xs mt-1">Klik produk untuk menambahkan</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-dark-700 rounded-xl p-3 flex gap-2">
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-dark-100 truncate">{item.nama_produk}</p>
                  <p className="text-xs text-primary-400 font-semibold mt-0.5">{formatRupiah(item.harga)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-dark-600 hover:bg-dark-500 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold text-dark-50 w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-dark-600 hover:bg-dark-500 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="ml-auto text-xs font-semibold text-dark-200">
                      {formatRupiah(item.harga * item.qty)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-dark-600 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart footer */}
        <div className="p-4 border-t border-dark-700 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-dark-400">Subtotal ({cart.reduce((s,i) => s + i.qty, 0)} item)</span>
            <span className="text-lg font-bold text-dark-50">{formatRupiah(total)}</span>
          </div>
          <button
            id="checkout-btn"
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Bayar Sekarang
          </button>
        </div>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          onConfirm={handleConfirmPayment}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* Struk modal */}
      {showStruk && lastTransaction && (
        <StrukModal
          items={cart}
          total={total}
          metode={lastTransaction.metode}
          bayar={lastTransaction.bayar}
          kembalian={lastTransaction.kembalian}
          transaksiId={lastTransaction.id}
          onClose={handleCloseStruk}
        />
      )}
    </div>
  )
}

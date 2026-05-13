import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'

const pageTitle = {
  '/dashboard': 'Dashboard',
  '/transaksi': 'Transaksi',
  '/produk': 'Kelola Produk',
  '/stok': 'Manajemen Stok',
  '/laporan': 'Laporan Penjualan',
}

export default function Header() {
  const location = useLocation()
  const title = pageTitle[location.pathname] || 'Masby Snack'
  
  const now = new Date()
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <header className="h-16 bg-dark-800/80 backdrop-blur-sm border-b border-dark-700 flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="lg:hidden w-10" /> {/* Space for mobile hamburger */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-dark-50 truncate">{title}</h2>
        <p className="text-xs text-dark-500 hidden sm:block">{dateStr}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            placeholder="Cari..."
            className="bg-dark-700 border border-dark-600 text-sm text-dark-200 placeholder-dark-500 rounded-xl pl-9 pr-4 py-2 w-48 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <button className="relative w-9 h-9 bg-dark-700 border border-dark-600 rounded-xl flex items-center justify-center hover:border-dark-500 transition-colors">
          <Bell className="w-4 h-4 text-dark-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>
        <div className="w-9 h-9 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
          <span className="text-sm font-bold text-primary-400">A</span>
        </div>
      </div>
    </header>
  )
}

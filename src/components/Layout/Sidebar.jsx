import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Package, LayoutDashboard, ShoppingCart, Archive,
  BarChart3, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transaksi', label: 'Transaksi', icon: ShoppingCart },
  { to: '/produk', label: 'Kelola Produk', icon: Package },
  { to: '/stok', label: 'Manajemen Stok', icon: Archive },
  { to: '/laporan', label: 'Laporan', icon: BarChart3 },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { signOut, displayName, userRole } = useAuth()
  const navigate = useNavigate()

  // Badge warna sesuai role
  const roleBadge = {
    admin: 'bg-primary-500/20 text-primary-400',
    owner: 'bg-purple-500/20 text-purple-400',
    kasir: 'bg-green-500/20 text-green-400',
  }[userRole] || 'bg-dark-700 text-dark-400'

  // Inisial nama untuk avatar
  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-dark-700 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center shrink-0">
          <Package className="w-5 h-5 text-primary-400" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-dark-50 text-sm leading-tight">Masby Snack</p>
            <p className="text-dark-500 text-xs">Sistem Kasir</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-dark-600 text-xs font-medium px-3 py-2 uppercase tracking-wider">Menu</p>
        )}
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : ''}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
            {!collapsed && (
              <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-dark-700 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 mb-1 bg-dark-700/50 rounded-xl">
            {/* Avatar */}
            <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-400">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-dark-50 truncate">{displayName}</p>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md capitalize ${roleBadge}`}>
                {userRole}
              </span>
            </div>
          </div>
        )}
        <button
          id="logout-btn"
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Keluar' : ''}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-dark-800 border-r border-dark-700 transition-all duration-300 shrink-0 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-20 translate-x-full z-10 w-5 h-8 bg-dark-700 border border-dark-600 rounded-r-lg flex items-center justify-center hover:bg-dark-600 transition-colors"
          style={{ marginLeft: collapsed ? '4rem' : '14rem', transition: 'margin 0.3s' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-dark-400" /> : <X className="w-3 h-3 text-dark-400" />}
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-dark-800 border border-dark-700 rounded-xl flex items-center justify-center"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-56 bg-dark-800 border-r border-dark-700 z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

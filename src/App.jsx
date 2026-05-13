import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transaksi from './pages/Transaksi'
import Produk from './pages/Produk'
import Stok from './pages/Stok'
import Laporan from './pages/Laporan'

// Loading screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4">
    <div className="w-10 h-10 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"
      style={{ borderWidth: '3px' }} />
    <p className="text-dark-400 text-sm">Memuat...</p>
  </div>
)

// Protected route — redirect to /login jika belum login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Public route — redirect ke dashboard jika sudah login
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public: login & register */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Protected: semua halaman utama */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transaksi" element={<Transaksi />} />
            <Route path="produk" element={<Produk />} />
            <Route path="stok" element={<Stok />} />
            <Route path="laporan" element={<Laporan />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}


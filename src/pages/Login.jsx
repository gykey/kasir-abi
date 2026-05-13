import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Package, Eye, EyeOff, Loader2, AlertCircle,
  CheckCircle, User, Mail, Lock, ShieldCheck
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ─── Shared background ────────────────────────────────────────────────────────
const Background = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
  </div>
)

// ─── Logo section ─────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 border border-primary-500/30 rounded-3xl mb-4 glow-orange">
      <Package className="w-10 h-10 text-primary-400" />
    </div>
    <h1 className="text-3xl font-bold gradient-text">Masby Snack</h1>
    <p className="text-dark-400 mt-1 text-sm">Sistem Kasir Makanan Ringan</p>
  </div>
)

// ─── Password strength indicator ─────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  if (!password) return null
  const checks = [
    { label: 'Min. 8 karakter', ok: password.length >= 8 },
    { label: 'Huruf besar', ok: /[A-Z]/.test(password) },
    { label: 'Angka', ok: /[0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const bar = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? bar[score - 1] : 'bg-dark-600'}`} />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map(c => (
          <span key={c.label} className={`text-xs flex items-center gap-1 ${c.ok ? 'text-green-400' : 'text-dark-500'}`}>
            <CheckCircle className="w-2.5 h-2.5" /> {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── LOGIN FORM ───────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email atau password salah.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Email belum dikonfirmasi. Cek inbox Anda.')
      } else {
        setError(error.message)
      }
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-dark-50 mb-1">Selamat Datang 👋</h2>
      <p className="text-dark-400 text-sm mb-6">Masuk ke akun kasir Anda</p>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kasir@masbysnack.com"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          id="login-btn"
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Masuk...</> : 'Masuk'}
        </button>
      </form>

      <p className="text-center text-sm text-dark-500 mt-5">
        Belum punya akun?{' '}
        <button onClick={onSwitch} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Daftar sekarang
        </button>
      </p>
    </>
  )
}

// ─── REGISTER FORM ────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }) {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [konfirm, setKonfirm] = useState('')
  const [role, setRole] = useState('kasir')
  const [showPass, setShowPass] = useState(false)
  const [showKonfirm, setShowKonfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // Validasi
    if (password !== konfirm) {
      setError('Konfirmasi password tidak cocok.')
      return
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password, nama, role)
    if (error) {
      if (error.message.includes('already registered')) {
        setError('Email sudah terdaftar. Silakan login.')
      } else {
        setError(error.message)
      }
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-4 animate-fade-in">
        <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-dark-50 mb-2">Pendaftaran Berhasil!</h3>
        <p className="text-sm text-dark-400 mb-1">
          Kami telah mengirim link konfirmasi ke:
        </p>
        <p className="text-sm font-semibold text-primary-400 mb-4">{email}</p>
        <p className="text-xs text-dark-500 mb-6">
          Buka email Anda dan klik link konfirmasi sebelum login.
        </p>
        <button onClick={onSwitch} className="btn-primary w-full py-2.5">
          Kembali ke Halaman Login
        </button>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-dark-50 mb-1">Buat Akun Baru ✨</h2>
      <p className="text-dark-400 text-sm mb-6">Daftarkan diri Anda sebagai kasir</p>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Nama */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              id="reg-nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Anda"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@masbysnack.com"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Role / Jabatan</label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <select
              id="reg-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              id="reg-password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 karakter"
              className="input-field pl-10 pr-10"
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Konfirmasi Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              id="reg-konfirm"
              type={showKonfirm ? 'text' : 'password'}
              value={konfirm}
              onChange={(e) => setKonfirm(e.target.value)}
              placeholder="Ulangi password"
              className={`input-field pl-10 pr-10 ${
                konfirm && konfirm !== password ? 'border-red-500/50 focus:border-red-500' : ''
              }`}
              required
            />
            <button type="button" onClick={() => setShowKonfirm(!showKonfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors">
              {showKonfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {konfirm && konfirm !== password && (
            <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Password tidak cocok
            </p>
          )}
          {konfirm && konfirm === password && (
            <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Password cocok
            </p>
          )}
        </div>

        <button
          id="register-btn"
          type="submit"
          disabled={loading || (konfirm && konfirm !== password)}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Mendaftar...</> : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="text-center text-sm text-dark-500 mt-5">
        Sudah punya akun?{' '}
        <button onClick={onSwitch} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          Masuk di sini
        </button>
      </p>
    </>
  )
}

// ─── MAIN LOGIN PAGE ─────────────────────────────────────────────────────────
export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'register'

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Background />

      <div className="w-full max-w-md relative animate-fade-in">
        <Logo />

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-dark-800 border border-dark-700 rounded-2xl mb-4">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-primary-500 text-white shadow-lg'
                : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Card */}
        <div className="glass-card p-8 animate-fade-in" key={mode}>
          {mode === 'login'
            ? <LoginForm onSwitch={() => setMode('register')} />
            : <RegisterForm onSwitch={() => setMode('login')} />
          }
        </div>

        <p className="text-center text-dark-600 text-xs mt-6">
          © 2025 Masby Snack. All rights reserved.
        </p>
      </div>
    </div>
  )
}

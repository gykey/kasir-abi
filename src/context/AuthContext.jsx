import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Login dengan email + password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  // Daftar akun baru — nama & role disimpan di user_metadata
  const signUp = async (email, password, nama, role = 'kasir') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nama_lengkap: nama,
          role: role,
        },
      },
    })
    return { data, error }
  }

  // Logout
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Helper: ambil nama tampilan dari metadata
  const displayName = user?.user_metadata?.nama_lengkap || user?.email || 'Pengguna'
  const userRole = user?.user_metadata?.role || 'kasir'

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, displayName, userRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

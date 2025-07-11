'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Check if we're in demo mode (when Supabase is not properly configured)
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                     process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co'

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - don't auto-login, wait for user action
      setLoading(false)
      return
    }

    // Real Supabase mode
    let supabase: any
    try {
      supabase = createClient()
    } catch (error) {
      console.error('Error creating Supabase client:', error)
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [isDemoMode])

  const signIn = async (email: string, password: string) => {
    if (isDemoMode) {
      // Demo mode login
      if (email === 'demo@stomatracker.com' || email === 'test@example.com') {
        const demoUser = {
          id: 'demo-user-123',
          email: email,
          user_metadata: { name: 'Demo User' },
          created_at: new Date().toISOString(),
          app_metadata: {},
          aud: 'authenticated',
          role: 'authenticated'
        } as User
        
        const demoSession = {
          access_token: 'demo-token',
          token_type: 'bearer',
          user: demoUser,
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          refresh_token: 'demo-refresh'
        } as Session

        setUser(demoUser)
        setSession(demoSession)
        return { error: null }
      } else {
        return { error: { message: 'Demo mode: Use demo@stomatracker.com or test@example.com' } }
      }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    if (isDemoMode) {
      // Demo mode signup - automatically create user
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        user_metadata: { name: userData?.name || 'New Demo User' },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      } as User
      
      const demoSession = {
        access_token: 'demo-token',
        token_type: 'bearer',
        user: demoUser,
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        refresh_token: 'demo-refresh'
      } as Session

      setUser(demoUser)
      setSession(demoSession)
      return { error: null }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null)
      setSession(null)
      return
    }

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string) => {
    if (isDemoMode) {
      return { error: null }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { ArrowRightIcon, UserIcon, SparklesIcon, HeartIcon, ClockIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="relative z-10 text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Beautiful gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Subtle animated overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      
      {/* Floating orbs for depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with auth status */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl font-bold text-white mb-4 drop-shadow-lg"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Stoma Assistant
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/90 drop-shadow-md"
            >
              Your intelligent health companion that learns, adapts, and guides you
            </motion.p>
          </div>
          
          <div className="absolute top-0 right-0">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
              >
                <UserIcon className="h-5 w-5" />
                Dashboard
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth"
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {user ? (
          <>
            {/* Redirect to dashboard if user is authenticated */}
            <div className="text-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Go to Dashboard
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Landing page content for unauthenticated users */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 mb-8"
              >
                <h2 className="text-3xl font-bold text-white mb-6">
                  Meet Your Intelligent Health Assistant
                </h2>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  Unlike traditional health apps, our assistant learns from your patterns, provides contextual insights, 
                  and proactively guides you toward better health outcomes. It's like having a personal health coach 
                  that understands your unique colostomy journey.
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    href="/auth/login"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Feature showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20"
              >
                <div className="mb-4">
                  <SparklesIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Context-Aware Prompts</h3>
                <p className="text-white/70">
                  Get personalized suggestions based on time of day, your patterns, and health goals.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20"
              >
                <div className="mb-4">
                  <ClockIcon className="h-8 w-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Frictionless Logging</h3>
                <p className="text-white/70">
                  One-tap meal templates, voice notes, and photo logging make tracking effortless.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20"
              >
                <div className="mb-4">
                  <HeartIcon className="h-8 w-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Intelligent Insights</h3>
                <p className="text-white/70">
                  Discover hidden patterns, predict meal outcomes, and receive proactive recommendations.
                </p>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

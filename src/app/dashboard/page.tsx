'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { SmartEntryLogger } from '@/components/intelligent/SmartEntryLogger'

// Entry types for flexible logging
const ENTRY_TYPES = [
  { key: 'breakfast', label: 'Breakfast', icon: '🍳', color: 'from-yellow-400 to-orange-500' },
  { key: 'lunch', label: 'Lunch', icon: '🥗', color: 'from-green-400 to-teal-500' },
  { key: 'dinner', label: 'Dinner', icon: '🍽️', color: 'from-purple-400 to-pink-500' },
  { key: 'snack', label: 'Snack', icon: '🍪', color: 'from-blue-400 to-cyan-500' },
  { key: 'drinks', label: 'Drinks', icon: '🥤', color: 'from-cyan-400 to-blue-500' },
  { key: 'medication', label: 'Medication', icon: '💊', color: 'from-red-400 to-pink-500' },
  { key: 'supplements', label: 'Supplements', icon: '🌿', color: 'from-emerald-400 to-green-500' },
  { key: 'bowel', label: 'Bowel Movement', icon: '🚽', color: 'from-brown-400 to-amber-500' },
  { key: 'gas', label: 'Gas', icon: '💨', color: 'from-gray-400 to-slate-500' },
  { key: 'mood', label: 'Mood', icon: '😊', color: 'from-pink-400 to-rose-500' },
  { key: 'symptoms', label: 'Symptoms', icon: '⚠️', color: 'from-red-400 to-orange-500' },
  { key: 'energy', label: 'Energy Level', icon: '⚡', color: 'from-yellow-400 to-amber-500' },
  { key: 'sleep', label: 'Sleep', icon: '😴', color: 'from-indigo-400 to-purple-500' },
  { key: 'stress', label: 'Stress', icon: '😰', color: 'from-red-400 to-pink-500' },
  { key: 'exercise', label: 'Exercise', icon: '🏃', color: 'from-green-400 to-emerald-500' },
  { key: 'irrigation', label: 'Irrigation', icon: '💧', color: 'from-blue-400 to-teal-500' },
  { key: 'first_gas', label: 'First Gas After Irrigation', icon: '🌬️', color: 'from-gray-400 to-blue-500' },
  { key: 'first_motion', label: 'First Motion After Irrigation', icon: '🔄', color: 'from-amber-400 to-orange-500' },
  { key: 'motion_feeling', label: 'Feeling of Motion', icon: '🤔', color: 'from-purple-400 to-indigo-500' },
  { key: 'constipation', label: 'Constipation', icon: '🚫', color: 'from-red-400 to-rose-500' },
  { key: 'diarrhea', label: 'Diarrhea', icon: '💧', color: 'from-blue-400 to-cyan-500' },
]

interface LogEntry {
  id: string
  type: string
  description: string
  timestamp: Date
  aiFlags?: string[]
  riskLevel?: 'low' | 'medium' | 'high'
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [showSmartLogger, setShowSmartLogger] = useState(false)
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)

  // Load entries when component mounts
  useEffect(() => {
    loadEntries()
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const loadEntries = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/entries?userId=${user.id}&limit=20`)
      const data = await response.json()
      
      if (data.success) {
        // Convert the entries to match our LogEntry interface
        const transformedEntries: LogEntry[] = data.data.map((entry: any) => ({
          id: entry.id,
          type: entry.type,
          description: entry.description,
          timestamp: new Date(entry.timestamp),
          aiFlags: entry.ai_flags || [],
          riskLevel: entry.risk_level || 'low'
        }))
        setEntries(transformedEntries)
      }
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEntriesLogged = async (newEntries: any[]) => {
    // Convert the entries and add them to the list
    const transformedEntries: LogEntry[] = newEntries.map((entry: any) => ({
      id: Date.now() + Math.random().toString(), // temporary ID
      type: entry.type,
      description: entry.description,
      timestamp: new Date(entry.timestamp),
      aiFlags: [],
      riskLevel: 'low'
    }))
    
    setEntries(prev => [...transformedEntries, ...prev])
    setShowSmartLogger(false)
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEntryTypeInfo = (key: string) => {
    return ENTRY_TYPES.find(type => type.key === key)
  }

  return (
    <div className="min-h-screen relative">
      {/* Beautiful gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Health Diary</h1>
            <p className="text-white/80 mt-1">
              Welcome back, {user?.email?.split('@')[0] || 'User'}!
            </p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            <span>↗</span>
            Sign Out
          </button>
        </div>

        {/* Quick Log Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowSmartLogger(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 mb-4"
          >
            <span>+</span>
            Log Something
          </button>
          
          {/* Navigation to Analytics */}
          <button
            onClick={() => router.push('/analytics')}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>📊</span>
            View Analytics
          </button>
        </div>

        {/* Recent Entries */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Entries</h2>
            {loading && (
              <div className="text-white/60 text-sm flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </div>
            )}
          </div>
          
          {loading && entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white/60 text-lg">Loading your entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No entries yet</p>
              <p className="text-white/40 mt-2">Start by logging your first meal or symptom!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => {
                const entryType = getEntryTypeInfo(entry.type)
                return (
                  <div
                    key={entry.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 bg-gradient-to-r ${entryType?.color} rounded-lg`}>
                        <span className="text-2xl">{entryType?.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{entryType?.label}</h3>
                          <span className="text-white/60 text-sm flex items-center gap-1">
                            <span>🕒</span>
                            {formatDateTime(entry.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-white/80 mb-3">{entry.description}</p>
                        
                        {entry.aiFlags && entry.aiFlags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {entry.aiFlags.map((flag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {entry.riskLevel && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60">AI Risk Level:</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              entry.riskLevel === 'high' ? 'bg-red-500/20 text-red-300' :
                              entry.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {entry.riskLevel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Smart Entry Logger */}
        {showSmartLogger && (
          <SmartEntryLogger
            onEntriesLogged={handleEntriesLogged}
            onClose={() => setShowSmartLogger(false)}
          />
        )}
      </div>
    </div>
  )
}

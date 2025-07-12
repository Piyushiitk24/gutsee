'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import EnhancedSmartEntryLogger from '@/components/intelligent/EnhancedSmartEntryLogger'
import { motion, AnimatePresence } from 'framer-motion'

export default function TestPage() {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<{
    auth: boolean;
    database: boolean;
    gemini: boolean;
    entries: any[];
  }>({
    auth: false,
    database: false,
    gemini: false,
    entries: []
  })
  const [showSmartLogger, setShowSmartLogger] = useState(false)
  const [testEntries, setTestEntries] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      runTests()
    }
  }, [user])

  const runTests = async () => {
    console.log('Running tests...')
    
    // Test 1: Authentication
    const authTest = !!user
    console.log('Auth test:', authTest)
    
    // Test 2: Database connection
    let databaseTest = false
    let entriesData = []
    
    if (user) {
      try {
        const response = await fetch(`/api/entries?limit=5`)
        const data = await response.json()
        databaseTest = data.success
        entriesData = data.data || []
        console.log('Database test:', databaseTest)
      } catch (error) {
        console.error('Database test failed:', error)
      }
    }
    
    // Test 3: Gemini API
    let geminiTest = false
    if (user) {
      try {
        const response = await fetch('/api/ai/parse-multi-entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: 'I had scrambled eggs with toast for breakfast',
            timestamp: new Date().toISOString()
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          geminiTest = data.success
          console.log('Gemini test:', geminiTest, data)
        }
      } catch (error) {
        console.error('Gemini test failed:', error)
      }
    }
    
    setTestResults({
      auth: authTest,
      database: databaseTest,
      gemini: geminiTest,
      entries: entriesData
    })
  }

  const handleEntriesLogged = async (entries: any[]) => {
    console.log('Logging entries:', entries)
    
    for (const entry of entries) {
      try {
        const response = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: entry.type,
            description: entry.description,
            timestamp: entry.timestamp,
            confidence: entry.confidence
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('Entry saved successfully:', result)
          setTestEntries(prev => [...prev, result.data])
        } else {
          const errorData = await response.json()
          console.error('Failed to save entry:', errorData)
        }
      } catch (error) {
        console.error('Error saving entry:', error)
      }
    }
    
    setShowSmartLogger(false)
    // Refresh the test results to show new entries
    runTests()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">System Test</h1>
          <p>Please log in with your Google account to run tests</p>
          <button
            onClick={() => window.location.href = '/auth/login'}
            className="mt-4 bg-purple-600 px-6 py-2 rounded-lg text-white hover:bg-purple-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Smart Entry Logger Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Authentication</h3>
              <div className={`text-2xl font-bold ${testResults.auth ? 'text-green-400' : 'text-red-400'}`}>
                {testResults.auth ? '✅ PASS' : '❌ FAIL'}
              </div>
              <p className="text-white/60 text-sm mt-2">
                User: {user?.email || 'Not logged in'}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
              <div className={`text-2xl font-bold ${testResults.database ? 'text-green-400' : 'text-red-400'}`}>
                {testResults.database ? '✅ PASS' : '❌ FAIL'}
              </div>
              <p className="text-white/60 text-sm mt-2">
                Entries: {testResults.entries.length}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Gemini AI</h3>
              <div className={`text-2xl font-bold ${testResults.gemini ? 'text-green-400' : 'text-red-400'}`}>
                {testResults.gemini ? '✅ PASS' : '❌ FAIL'}
              </div>
              <p className="text-white/60 text-sm mt-2">
                AI parsing
              </p>
            </div>
          </div>

          {/* Smart Entry Logger Demo */}
          <div className="mb-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Smart Entry Logger</h2>
                <p className="text-white/70">Test AI parsing and food database search</p>
              </div>
              <button
                onClick={() => setShowSmartLogger(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Open Logger
              </button>
            </div>
          </div>

          {/* Test Entries */}
          {testEntries.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Test Entries</h3>
              <div className="space-y-3">
                {testEntries.map((entry: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-medium capitalize">{entry.type}</span>
                        {entry.confidence_score && (
                          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                            {Math.round(entry.confidence_score * 100)}% confidence
                          </span>
                        )}
                      </div>
                      <span className="text-white/60 text-xs">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mb-2">{entry.description}</p>
                    {entry.ai_flags && entry.ai_flags.length > 0 && (
                      <div className="text-xs text-white/60">
                        Flags: {entry.ai_flags.join(', ')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Recent Database Entries</h3>
            {testResults.entries.length > 0 ? (
              <div className="space-y-2">
                {testResults.entries.map((entry: any, index: number) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-purple-400 font-medium">{entry.type}</span>
                        <p className="text-white/80 text-sm">{entry.description}</p>
                      </div>
                      <span className="text-white/60 text-xs">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60">No entries found</p>
            )}
          </div>
          
          <div className="mt-8 flex gap-4">
            <button
              onClick={runTests}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Run Tests Again
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/food-test'}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Food Database Test
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Smart Entry Logger Modal */}
      <AnimatePresence>
        {showSmartLogger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <EnhancedSmartEntryLogger
                onEntriesLogged={handleEntriesLogged}
                onClose={() => setShowSmartLogger(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

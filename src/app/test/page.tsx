'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

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

  useEffect(() => {
    runTests()
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
        const response = await fetch(`/api/entries?userId=${user.id}&limit=5`)
        const data = await response.json()
        databaseTest = data.success
        entriesData = data.data || []
        console.log('Database test:', databaseTest)
      } catch (error) {
        console.error('Database test failed:', error)
      }
    }
    
    // Test 3: Gemini API (test by creating a simple entry)
    let geminiTest = false
    if (user) {
      try {
        const response = await fetch('/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'breakfast',
            description: 'Test entry for Gemini API',
            timestamp: new Date().toISOString(),
            userId: user.id
          })
        })
        const data = await response.json()
        geminiTest = data.success
        console.log('Gemini test:', geminiTest)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">System Test</h1>
          <p>Please log in to run tests</p>
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
          <h1 className="text-3xl font-bold text-white mb-6">System Test Results</h1>
          
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
                API integration test
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Recent Entries</h3>
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
          </div>
        </div>
      </div>
    </div>
  )
}

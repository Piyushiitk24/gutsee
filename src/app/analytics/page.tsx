'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface AnalyticsData {
  totalEntries: number
  entryTypes: { [key: string]: number }
  riskLevels: { [key: string]: number }
  patterns: string[]
  insights: string[]
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadAnalytics()
    }
  }, [user])

  const loadAnalytics = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Load recent entries for analysis
      const response = await fetch(`/api/entries?userId=${user.id}&limit=100`)
      const data = await response.json()
      
      if (data.success) {
        const entries = data.data
        
        // Calculate analytics
        const entryTypes: { [key: string]: number } = {}
        const riskLevels: { [key: string]: number } = {}
        
        entries.forEach((entry: any) => {
          entryTypes[entry.type] = (entryTypes[entry.type] || 0) + 1
          riskLevels[entry.risk_level] = (riskLevels[entry.risk_level] || 0) + 1
        })
        
        // Generate insights
        const insights = generateInsights(entries)
        const patterns = detectPatterns(entries)
        
        setAnalytics({
          totalEntries: entries.length,
          entryTypes,
          riskLevels,
          patterns,
          insights
        })
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateInsights = (entries: any[]): string[] => {
    const insights: string[] = []
    
    // Find most common entry type
    const entryTypes: { [key: string]: number } = {}
    entries.forEach(entry => {
      entryTypes[entry.type] = (entryTypes[entry.type] || 0) + 1
    })
    
    const mostCommon = Object.entries(entryTypes)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (mostCommon) {
      insights.push(`You log ${mostCommon[0]} most frequently (${mostCommon[1]} times)`)
    }
    
    // Check for high-risk entries
    const highRiskEntries = entries.filter(entry => entry.risk_level === 'high')
    if (highRiskEntries.length > 0) {
      insights.push(`${highRiskEntries.length} high-risk entries detected - consider reviewing these foods`)
    }
    
    // Check for patterns in timing
    const foodEntries = entries.filter(entry => 
      ['breakfast', 'lunch', 'dinner', 'snack'].includes(entry.type)
    )
    
    if (foodEntries.length > 0) {
      insights.push(`You have logged ${foodEntries.length} food entries for analysis`)
    }
    
    return insights
  }

  const detectPatterns = (entries: any[]): string[] => {
    const patterns: string[] = []
    
    // Look for gas patterns after certain foods
    const gasEntries = entries.filter(entry => entry.type === 'gas')
    const foodEntries = entries.filter(entry => 
      ['breakfast', 'lunch', 'dinner', 'snack'].includes(entry.type)
    )
    
    if (gasEntries.length > 0 && foodEntries.length > 0) {
      patterns.push('Gas episodes may be related to recent meals - track timing for better insights')
    }
    
    // Look for high-risk food patterns
    const highRiskFoods = entries.filter(entry => 
      entry.risk_level === 'high' && 
      ['breakfast', 'lunch', 'dinner', 'snack'].includes(entry.type)
    )
    
    if (highRiskFoods.length > 2) {
      patterns.push('Multiple high-risk foods detected - consider gradual dietary adjustments')
    }
    
    return patterns
  }

  const getEntryTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
      drinks: 'Drinks',
      medication: 'Medication',
      supplements: 'Supplements',
      bowel: 'Bowel Movement',
      gas: 'Gas',
      mood: 'Mood',
      symptoms: 'Symptoms',
      energy: 'Energy Level',
      sleep: 'Sleep',
      stress: 'Stress',
      exercise: 'Exercise',
      irrigation: 'Irrigation',
      // Add more as needed
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Loading analytics...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <span>←</span>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-white/80">Insights from your health tracking data</p>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Entries */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-2">Total Entries</h3>
              <p className="text-3xl font-bold text-purple-400">{analytics.totalEntries}</p>
            </div>

            {/* Most Common Entry Type */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-2">Most Logged</h3>
              {Object.entries(analytics.entryTypes).length > 0 && (
                <div>
                  <p className="text-xl font-bold text-green-400">
                    {getEntryTypeLabel(
                      Object.entries(analytics.entryTypes)
                        .sort(([,a], [,b]) => b - a)[0][0]
                    )}
                  </p>
                  <p className="text-white/60 text-sm">
                    {Object.entries(analytics.entryTypes)
                      .sort(([,a], [,b]) => b - a)[0][1]} times
                  </p>
                </div>
              )}
            </div>

            {/* Risk Level Distribution */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-2">Risk Levels</h3>
              <div className="space-y-2">
                {Object.entries(analytics.riskLevels).map(([level, count]) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${
                      level === 'high' ? 'text-red-400' :
                      level === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                    <span className="text-white/80">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Entry Type Breakdown */}
        {analytics && Object.keys(analytics.entryTypes).length > 0 && (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Entry Type Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(analytics.entryTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="bg-white/5 rounded-lg p-3">
                    <div className="text-sm text-white/80">{getEntryTypeLabel(type)}</div>
                    <div className="text-lg font-bold text-white">{count}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {analytics && analytics.insights.length > 0 && (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">AI Insights</h3>
            <div className="space-y-3">
              {analytics.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">💡</span>
                  <p className="text-white/80">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patterns */}
        {analytics && analytics.patterns.length > 0 && (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Detected Patterns</h3>
            <div className="space-y-3">
              {analytics.patterns.map((pattern, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">📊</span>
                  <p className="text-white/80">{pattern}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {analytics && analytics.totalEntries === 0 && (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
            <p className="text-white/60 text-lg mb-4">No data available yet</p>
            <p className="text-white/40">Start logging your meals and symptoms to see analytics here!</p>
          </div>
        )}
      </div>
    </div>
  )
}

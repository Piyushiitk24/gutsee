'use client'

import { useState } from 'react'
import { 
  ChartBarIcon, 
  CalendarDaysIcon, 
  LightBulbIcon,
  CameraIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { InteractiveTimeline } from './InteractiveTimeline'
import { TestATheory } from './TestATheory'
import { CorrelationHeatmap } from './CorrelationHeatmap'
import { MultiModalLogging } from './MultiModalLogging'
import { MealRiskScorer } from './MealRiskScorer'
import { SafeFoodsLibrary } from './SafeFoodsLibrary'

interface AdvancedAnalyticsDashboardProps {
  userHistory: any[]
  dashboardStats: any
}

type ActiveView = 'timeline' | 'theories' | 'correlations' | 'risk-scorer' | 'safe-foods' | 'logging'

export function AdvancedAnalyticsDashboard({ userHistory, dashboardStats }: AdvancedAnalyticsDashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>('timeline')
  const [showLogging, setShowLogging] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf')

  // Sample timeline events
  const sampleEvents = [
    {
      id: '1',
      type: 'meal' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      title: 'Lunch - Rice Bowl',
      description: 'White rice with grilled chicken and steamed vegetables',
      tags: ['lunch', 'rice', 'chicken'],
      severity: 'low' as const,
      correlationScore: 0.8,
      data: { calories: 420, ingredients: ['rice', 'chicken', 'carrots'] }
    },
    {
      id: '2',
      type: 'output' as const,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      title: 'Output Event',
      description: 'Normal consistency, 150ml volume',
      tags: ['output', 'normal'],
      severity: 'low' as const,
      correlationScore: 0.6,
      data: { volume: 150, consistency: 'normal' }
    },
    {
      id: '3',
      type: 'gas' as const,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      title: 'Gas Production',
      description: 'Mild gas production after breakfast',
      tags: ['gas', 'mild'],
      severity: 'medium' as const,
      correlationScore: 0.4,
      data: { intensity: 3, duration: 15 }
    }
  ]

  const analyticsViews = [
    {
      id: 'timeline' as const,
      title: 'Interactive Timeline',
      description: 'Explore your health data over time',
      icon: CalendarDaysIcon,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'theories' as const,
      title: 'Test a Theory',
      description: 'Design and run experiments',
      icon: LightBulbIcon,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'correlations' as const,
      title: 'Correlation Analysis',
      description: 'Discover hidden patterns',
      icon: ChartBarIcon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'risk-scorer' as const,
      title: 'Meal Risk Scorer',
      description: 'Predict meal outcomes',
      icon: ExclamationTriangleIcon,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'safe-foods' as const,
      title: 'Safe Foods Library',
      description: 'Your trusted food database',
      icon: HeartIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'logging' as const,
      title: 'Multi-Modal Logging',
      description: 'Photo, voice, and smart logging',
      icon: CameraIcon,
      color: 'from-cyan-500 to-blue-500'
    }
  ]

  const handleEventClick = (event: any) => {
    console.log('Event clicked:', event)
  }

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters)
  }

  const handleCorrelationAnalysis = (event: any) => {
    console.log('Correlation analysis requested for:', event)
  }

  const handleCorrelationCellClick = (var1: string, var2: string, correlation: number) => {
    console.log('Correlation cell clicked:', { var1, var2, correlation })
  }

  const handleCreateTheory = (theory: any) => {
    console.log('Theory created:', theory)
  }

  const handleUpdateTheory = (theoryId: string, updates: any) => {
    console.log('Theory updated:', { theoryId, updates })
  }

  const handleDeleteTheory = (theoryId: string) => {
    console.log('Theory deleted:', theoryId)
  }

  const handleMealLogged = (meal: any) => {
    console.log('Meal logged:', meal)
    setShowLogging(false)
  }

  const handleRiskAnalyzed = (analysis: any) => {
    console.log('Risk analysis:', analysis)
  }

  const handleFoodSelect = (food: any) => {
    console.log('Food selected:', food)
  }

  const handleAddToMeal = (food: any) => {
    console.log('Food added to meal:', food)
  }

  const handleExportData = async () => {
    // Simulate data export
    console.log(`Exporting data as ${exportFormat}...`)
    
    // In a real app, this would generate and download the file
    const data = {
      timeRange,
      format: exportFormat,
      events: sampleEvents,
      stats: dashboardStats,
      exportDate: new Date().toISOString()
    }
    
    // Create a mock download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stoma-tracker-export-${timeRange}.${exportFormat}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShareInsights = () => {
    // Simulate sharing insights with healthcare provider
    console.log('Sharing insights with healthcare provider...')
    
    const insights = {
      keyFindings: [
        'Rice-based meals show 85% success rate',
        'Stress levels correlate with output frequency (r=0.71)',
        'Morning meals have 40% better tolerance'
      ],
      riskFactors: ['High-fiber foods', 'Evening meals', 'Stress periods'],
      recommendations: ['Continue rice-based diet', 'Stress management', 'Earlier dinner times'],
      period: timeRange
    }
    
    // In a real app, this would open email/sharing interface
    console.log('Insights to share:', insights)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h2>
            <p className="text-white/70">Deep insights into your health patterns</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-white/10 text-white rounded-xl px-3 py-2 text-sm border border-white/20"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={() => setShowLogging(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
            >
              <CameraIcon className="h-4 w-4 mr-2 inline" />
              Quick Log
            </button>
          </div>
        </div>

        {/* Analytics View Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {analyticsViews.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 ${
                activeView === view.id
                  ? `bg-gradient-to-r ${view.color} text-white`
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <view.icon className="h-6 w-6 mb-2" />
              <h3 className="font-semibold text-sm mb-1">{view.title}</h3>
              <p className="text-xs opacity-80">{view.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Export and Share Tools */}
      <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-4 border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-white/60" />
            <span className="text-white/80 text-sm">Professional Tools:</span>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/20"
            >
              <option value="pdf">PDF Report</option>
              <option value="csv">CSV Data</option>
              <option value="json">JSON Export</option>
            </select>
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 bg-white/10 text-white/80 px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-all duration-200"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleShareInsights}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <ShareIcon className="h-4 w-4" />
              <span>Share with Provider</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active View Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'timeline' && (
            <InteractiveTimeline
              events={sampleEvents}
              onEventClick={handleEventClick}
              onFilterChange={handleFilterChange}
              onCorrelationAnalysis={handleCorrelationAnalysis}
            />
          )}

          {activeView === 'theories' && (
            <TestATheory
              existingData={userHistory}
              onCreateTheory={handleCreateTheory}
              onUpdateTheory={handleUpdateTheory}
              onDeleteTheory={handleDeleteTheory}
            />
          )}

          {activeView === 'correlations' && (
            <CorrelationHeatmap
              data={[]} // Will use sample data from component
              onCellClick={handleCorrelationCellClick}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          )}

          {activeView === 'risk-scorer' && (
            <div className="space-y-6">
              <MealRiskScorer
                meal={{
                  name: 'Sample Pasta Meal',
                  ingredients: ['pasta', 'tomato sauce', 'cheese', 'garlic'],
                  prepMethod: 'boiled',
                  servingSize: '1 cup',
                  plannedTime: '18:30'
                }}
                userHistory={userHistory}
                onRiskAnalyzed={handleRiskAnalyzed}
              />
              
              <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Quick Meal Analysis</h3>
                <p className="text-white/70 mb-4">
                  Enter a meal to get instant risk analysis and recommendations.
                </p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g., Rice with chicken and vegetables"
                    className="flex-1 px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none"
                  />
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'safe-foods' && (
            <SafeFoodsLibrary
              userHistory={userHistory}
              onFoodSelect={handleFoodSelect}
              onAddToMeal={handleAddToMeal}
            />
          )}

          {activeView === 'logging' && (
            <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="text-center py-12">
                <CameraIcon className="h-16 w-16 mx-auto mb-4 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white mb-4">Multi-Modal Logging</h3>
                <p className="text-white/70 mb-6">
                  Use your camera, voice, or barcode scanner to log meals instantly.
                </p>
                <button
                  onClick={() => setShowLogging(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl text-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                >
                  Start Logging
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Multi-Modal Logging Modal */}
      <AnimatePresence>
        {showLogging && (
          <MultiModalLogging
            onMealLogged={handleMealLogged}
            onClose={() => setShowLogging(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

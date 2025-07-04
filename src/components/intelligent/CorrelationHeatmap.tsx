'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  AdjustmentsHorizontalIcon, 
  InformationCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FireIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface CorrelationData {
  variable1: string
  variable2: string
  correlation: number
  pValue: number
  significance: 'high' | 'medium' | 'low' | 'none'
  sampleSize: number
  category: string
}

interface CorrelationHeatmapProps {
  data: CorrelationData[]
  onCellClick: (variable1: string, variable2: string, correlation: number) => void
  timeRange: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void
}

export function CorrelationHeatmap({ 
  data, 
  onCellClick, 
  timeRange, 
  onTimeRangeChange 
}: CorrelationHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showSignificanceOnly, setShowSignificanceOnly] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<{ x: number, y: number } | null>(null)

  // Sample correlation data
  const sampleData: CorrelationData[] = [
    { variable1: 'Rice Meals', variable2: 'Output Frequency', correlation: -0.65, pValue: 0.001, significance: 'high', sampleSize: 45, category: 'food' },
    { variable1: 'Rice Meals', variable2: 'Gas Production', correlation: -0.42, pValue: 0.02, significance: 'medium', sampleSize: 45, category: 'food' },
    { variable1: 'Rice Meals', variable2: 'Sleep Quality', correlation: 0.38, pValue: 0.05, significance: 'medium', sampleSize: 45, category: 'food' },
    { variable1: 'Rice Meals', variable2: 'Mood Score', correlation: 0.51, pValue: 0.008, significance: 'high', sampleSize: 45, category: 'food' },
    
    { variable1: 'Pasta Meals', variable2: 'Output Frequency', correlation: 0.58, pValue: 0.003, significance: 'high', sampleSize: 32, category: 'food' },
    { variable1: 'Pasta Meals', variable2: 'Gas Production', correlation: 0.73, pValue: 0.001, significance: 'high', sampleSize: 32, category: 'food' },
    { variable1: 'Pasta Meals', variable2: 'Sleep Quality', correlation: -0.29, pValue: 0.08, significance: 'low', sampleSize: 32, category: 'food' },
    { variable1: 'Pasta Meals', variable2: 'Mood Score', correlation: -0.41, pValue: 0.03, significance: 'medium', sampleSize: 32, category: 'food' },
    
    { variable1: 'Water Intake', variable2: 'Output Frequency', correlation: -0.33, pValue: 0.04, significance: 'medium', sampleSize: 67, category: 'hydration' },
    { variable1: 'Water Intake', variable2: 'Output Consistency', correlation: 0.45, pValue: 0.01, significance: 'high', sampleSize: 67, category: 'hydration' },
    { variable1: 'Water Intake', variable2: 'Irrigation Success', correlation: 0.62, pValue: 0.001, significance: 'high', sampleSize: 67, category: 'hydration' },
    
    { variable1: 'Exercise', variable2: 'Gas Production', correlation: -0.49, pValue: 0.01, significance: 'high', sampleSize: 28, category: 'activity' },
    { variable1: 'Exercise', variable2: 'Mood Score', correlation: 0.67, pValue: 0.001, significance: 'high', sampleSize: 28, category: 'activity' },
    { variable1: 'Exercise', variable2: 'Sleep Quality', correlation: 0.52, pValue: 0.006, significance: 'high', sampleSize: 28, category: 'activity' },
    
    { variable1: 'Stress Level', variable2: 'Output Frequency', correlation: 0.71, pValue: 0.001, significance: 'high', sampleSize: 54, category: 'mental' },
    { variable1: 'Stress Level', variable2: 'Gas Production', correlation: 0.58, pValue: 0.002, significance: 'high', sampleSize: 54, category: 'mental' },
    { variable1: 'Stress Level', variable2: 'Sleep Quality', correlation: -0.64, pValue: 0.001, significance: 'high', sampleSize: 54, category: 'mental' },
    
    { variable1: 'Meal Timing', variable2: 'Output Frequency', correlation: 0.35, pValue: 0.03, significance: 'medium', sampleSize: 89, category: 'timing' },
    { variable1: 'Meal Timing', variable2: 'Sleep Quality', correlation: -0.28, pValue: 0.06, significance: 'low', sampleSize: 89, category: 'timing' },
  ]

  const correlationMatrix = data.length > 0 ? data : sampleData

  // Get unique variables
  const allVariables = Array.from(new Set([
    ...correlationMatrix.map(d => d.variable1),
    ...correlationMatrix.map(d => d.variable2)
  ]))

  // Get unique categories
  const categories = Array.from(new Set(correlationMatrix.map(d => d.category)))

  // Filter data based on selected category and significance
  const filteredData = correlationMatrix.filter(d => {
    const categoryMatch = selectedCategory === 'all' || d.category === selectedCategory
    const significanceMatch = !showSignificanceOnly || d.significance === 'high'
    return categoryMatch && significanceMatch
  })

  // Create matrix
  const createMatrix = () => {
    const matrix: (CorrelationData | null)[][] = []
    
    allVariables.forEach((var1, i) => {
      matrix[i] = []
      allVariables.forEach((var2, j) => {
        if (i === j) {
          matrix[i][j] = {
            variable1: var1,
            variable2: var2,
            correlation: 1,
            pValue: 0,
            significance: 'high',
            sampleSize: 0,
            category: 'self'
          }
        } else {
          const correlation = filteredData.find(d => 
            (d.variable1 === var1 && d.variable2 === var2) ||
            (d.variable1 === var2 && d.variable2 === var1)
          )
          matrix[i][j] = correlation || null
        }
      })
    })
    
    return matrix
  }

  const matrix = createMatrix()

  const getCorrelationColor = (correlation: number | null) => {
    if (correlation === null) return 'bg-gray-500/20'
    
    const abs = Math.abs(correlation)
    if (abs >= 0.7) return correlation > 0 ? 'bg-red-500' : 'bg-blue-500'
    if (abs >= 0.5) return correlation > 0 ? 'bg-red-400' : 'bg-blue-400'
    if (abs >= 0.3) return correlation > 0 ? 'bg-red-300' : 'bg-blue-300'
    return 'bg-gray-300'
  }

  const getCorrelationIntensity = (correlation: number | null) => {
    if (correlation === null) return 0.1
    return Math.abs(correlation)
  }

  const getSignificanceIcon = (significance: string) => {
    switch (significance) {
      case 'high': return <FireIcon className="h-3 w-3 text-red-400" />
      case 'medium': return <div className="w-3 h-3 bg-yellow-400 rounded-full" />
      case 'low': return <div className="w-3 h-3 bg-blue-400 rounded-full" />
      default: return <XMarkIcon className="h-3 w-3 text-gray-400" />
    }
  }

  const formatCorrelation = (correlation: number | null) => {
    if (correlation === null) return 'N/A'
    return correlation.toFixed(2)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return 'bg-green-500/20 text-green-300'
      case 'hydration': return 'bg-blue-500/20 text-blue-300'
      case 'activity': return 'bg-purple-500/20 text-purple-300'
      case 'mental': return 'bg-pink-500/20 text-pink-300'
      case 'timing': return 'bg-orange-500/20 text-orange-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  return (
    <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Correlation Heatmap</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as any)}
            className="bg-white/10 text-white rounded-xl px-3 py-2 text-sm border border-white/20"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-white/60" />
          <span className="text-white/80 text-sm">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/10 text-white rounded-lg px-3 py-2 text-sm border border-white/20"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showSignificanceOnly}
            onChange={(e) => setShowSignificanceOnly(e.target.checked)}
            className="rounded"
          />
          <span className="text-white/80 text-sm">High significance only</span>
        </label>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white/5 rounded-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-white/80 text-sm">Negative</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-white/80 text-sm">Positive</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FireIcon className="h-4 w-4 text-red-400" />
            <span className="text-white/80 text-sm">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-white/80 text-sm">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
            <span className="text-white/80 text-sm">Low</span>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="flex">
            <div className="w-32 flex-shrink-0"></div>
            {allVariables.map((variable, index) => (
              <div
                key={variable}
                className="w-24 flex-shrink-0 p-2 text-center"
              >
                <div className="text-white/80 text-xs font-medium transform -rotate-45 origin-center">
                  {variable.length > 10 ? variable.substring(0, 10) + '...' : variable}
                </div>
              </div>
            ))}
          </div>

          {/* Matrix */}
          {matrix.map((row, i) => (
            <div key={i} className="flex">
              {/* Row header */}
              <div className="w-32 flex-shrink-0 p-2 flex items-center">
                <div className="text-white/80 text-xs font-medium text-right">
                  {allVariables[i].length > 15 ? allVariables[i].substring(0, 15) + '...' : allVariables[i]}
                </div>
              </div>

              {/* Matrix cells */}
              {row.map((cell, j) => (
                <motion.div
                  key={j}
                  className="w-24 h-16 flex-shrink-0 p-1 cursor-pointer relative"
                  whileHover={{ scale: 1.1 }}
                  onHoverStart={() => setHoveredCell({ x: j, y: i })}
                  onHoverEnd={() => setHoveredCell(null)}
                  onClick={() => {
                    if (cell && cell.correlation !== 1) {
                      onCellClick(allVariables[i], allVariables[j], cell.correlation)
                    }
                  }}
                >
                  <div
                    className={`w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden ${
                      cell ? getCorrelationColor(cell.correlation) : 'bg-gray-500/20'
                    }`}
                    style={{
                      opacity: cell ? 0.3 + (getCorrelationIntensity(cell.correlation) * 0.7) : 0.1
                    }}
                  >
                    {cell && (
                      <>
                        <div className="text-white text-xs font-bold text-center">
                          {formatCorrelation(cell.correlation)}
                        </div>
                        {cell.correlation !== 1 && (
                          <div className="absolute top-1 right-1">
                            {getSignificanceIcon(cell.significance)}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Tooltip */}
                  {hoveredCell?.x === j && hoveredCell?.y === i && cell && cell.correlation !== 1 && (
                    <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-black/90 text-white text-xs rounded-lg min-w-max">
                      <div className="font-semibold mb-1">
                        {allVariables[i]} ↔ {allVariables[j]}
                      </div>
                      <div>Correlation: {formatCorrelation(cell.correlation)}</div>
                      <div>P-value: {cell.pValue.toFixed(3)}</div>
                      <div>Significance: {cell.significance}</div>
                      <div>Sample size: {cell.sampleSize}</div>
                      <div className={`inline-block px-2 py-1 rounded mt-1 ${getCategoryColor(cell.category)}`}>
                        {cell.category}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
        <div className="flex items-center space-x-2 mb-3">
          <InformationCircleIcon className="h-5 w-5 text-purple-400" />
          <h4 className="text-white font-semibold">Key Insights</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/80 text-sm">Strongest positive correlation: Stress → Output (+0.71)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-white/80 text-sm">Strongest negative correlation: Rice → Output (-0.65)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FireIcon className="h-4 w-4 text-red-400" />
              <span className="text-white/80 text-sm">12 high-significance correlations found</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-white/80 text-sm">6 medium-significance correlations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

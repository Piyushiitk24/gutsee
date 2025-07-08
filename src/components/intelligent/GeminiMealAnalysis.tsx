// Enhanced Meal Analysis component with Gemini AI integration

'use client'

import { useState, useEffect } from 'react'
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  BeakerIcon,
  ClockIcon,
  HeartIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface GeminiMealAnalysisProps {
  ingredients: string[]
  mealName?: string
  mealTime?: Date
  userHistory?: any
  onAnalysisComplete?: (analysis: any) => void
}

interface IngredientRisk {
  ingredient: string
  category: string
  gutBehavior: 'gas-producing' | 'metabolism-boosting' | 'gut-friendly' | 'potentially-problematic'
  riskLevel: 'low' | 'medium' | 'high'
  description: string
  recommendations: string[]
  alternatives?: string[]
}

interface MealAnalysisResult {
  ingredients: IngredientRisk[]
  overallRisk: 'low' | 'medium' | 'high'
  gasProducingScore: number
  metabolismScore: number
  recommendations: string[]
  timingAdvice: string
  portionAdvice: string
  summary: string
}

export function GeminiMealAnalysis({ 
  ingredients, 
  mealName, 
  mealTime,
  userHistory,
  onAnalysisComplete 
}: GeminiMealAnalysisProps) {
  const [analysis, setAnalysis] = useState<MealAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (ingredients.length > 0) {
      performAnalysis()
    }
  }, [ingredients])

  const performAnalysis = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/analyze-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze meal')
      }

      const result = await response.json()

      if (result.success && result.data) {
        setAnalysis(result.data)
        onAnalysisComplete?.(result.data)
      } else {
        throw new Error('Invalid analysis result')
      }
    } catch (err) {
      console.error('Analysis error:', err)
      setError('Failed to analyze meal. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getBehaviorIcon = (behavior: string) => {
    switch (behavior) {
      case 'gas-producing': return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
      case 'metabolism-boosting': return <BoltIcon className="h-4 w-4 text-blue-500" />
      case 'gut-friendly': return <HeartIcon className="h-4 w-4 text-green-500" />
      case 'potentially-problematic': return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      default: return <BeakerIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-green-600'
    if (score <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-purple-600 animate-pulse" />
            <span className="text-purple-700 font-medium">Analyzing meal with Gemini AI...</span>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          Checking ingredients for gut health impact, gas production, and metabolic effects
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <span className="text-red-700 font-medium">Analysis Error</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={performAnalysis}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
        >
          Retry Analysis
        </button>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Meal Analysis</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(analysis.overallRisk)}`}>
          {analysis.overallRisk.toUpperCase()} RISK
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/70 rounded-lg p-4 mb-4">
        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Risk Scores */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Gas Production</span>
            <span className={`text-lg font-bold ${getScoreColor(analysis.gasProducingScore)}`}>
              {analysis.gasProducingScore}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                analysis.gasProducingScore <= 3 ? 'bg-green-500' :
                analysis.gasProducingScore <= 6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(analysis.gasProducingScore / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Metabolism Boost</span>
            <span className={`text-lg font-bold ${getScoreColor(10 - analysis.metabolismScore)}`}>
              {analysis.metabolismScore}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="h-2 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(analysis.metabolismScore / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Ingredients Analysis */}
      <div className="mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
        >
          <span className="font-medium text-gray-800">Ingredient Breakdown ({analysis.ingredients.length})</span>
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2"
          >
            {analysis.ingredients.map((ingredient, index) => (
              <div key={index} className="bg-white/70 rounded-lg p-3 border border-white/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getBehaviorIcon(ingredient.gutBehavior)}
                    <span className="font-medium text-gray-800">{ingredient.ingredient}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(ingredient.riskLevel)}`}>
                    {ingredient.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{ingredient.description}</p>
                {ingredient.recommendations.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <strong>Tips:</strong> {ingredient.recommendations.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <div className="bg-white/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-gray-800">Timing Advice</span>
          </div>
          <p className="text-sm text-gray-700">{analysis.timingAdvice}</p>
        </div>

        <div className="bg-white/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <BeakerIcon className="h-4 w-4 text-green-600" />
            <span className="font-medium text-gray-800">Portion Advice</span>
          </div>
          <p className="text-sm text-gray-700">{analysis.portionAdvice}</p>
        </div>

        {analysis.recommendations.length > 0 && (
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircleIcon className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-gray-800">General Recommendations</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  InformationCircleIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface MealRiskFactor {
  id: string
  name: string
  category: 'ingredient' | 'timing' | 'preparation' | 'quantity' | 'combination'
  riskLevel: number // 0-10
  confidence: number
  description: string
  historicalData: {
    timesEaten: number
    problemRate: number
    lastProblem: Date | null
  }
}

interface MealRiskAnalysis {
  overallRisk: number
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  factors: MealRiskFactor[]
  recommendations: string[]
  safeTimes: string[]
  alternatives: Array<{
    name: string
    riskReduction: number
    description: string
  }>
}

interface MealRiskScorerProps {
  meal: {
    name: string
    ingredients: string[]
    prepMethod?: string
    servingSize?: string
    plannedTime?: string
  }
  userHistory: any[]
  onRiskAnalyzed: (analysis: MealRiskAnalysis) => void
}

export function MealRiskScorer({ meal, userHistory, onRiskAnalyzed }: MealRiskScorerProps) {
  const [analysis, setAnalysis] = useState<MealRiskAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedFactor, setSelectedFactor] = useState<MealRiskFactor | null>(null)

  // Analyze meal risk
  const analyzeMealRisk = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock risk analysis based on common problematic foods
    const riskFactors: MealRiskFactor[] = []
    let totalRisk = 0
    
    // Analyze ingredients
    meal.ingredients.forEach(ingredient => {
      const ingredientLower = ingredient.toLowerCase()
      let ingredientRisk = 0
      let description = ''
      
      // High-risk ingredients
      if (ingredientLower.includes('fiber') || ingredientLower.includes('whole grain')) {
        ingredientRisk = 7
        description = 'High-fiber foods can increase output frequency'
      } else if (ingredientLower.includes('spicy') || ingredientLower.includes('pepper')) {
        ingredientRisk = 6
        description = 'Spicy foods may cause digestive irritation'
      } else if (ingredientLower.includes('dairy') || ingredientLower.includes('milk')) {
        ingredientRisk = 5
        description = 'Dairy can cause digestive issues in some people'
      } else if (ingredientLower.includes('bean') || ingredientLower.includes('legume')) {
        ingredientRisk = 6
        description = 'Beans and legumes can increase gas production'
      } else if (ingredientLower.includes('raw') || ingredientLower.includes('salad')) {
        ingredientRisk = 4
        description = 'Raw foods can be harder to digest'
      } else if (ingredientLower.includes('rice') || ingredientLower.includes('chicken')) {
        ingredientRisk = 1
        description = 'Well-tolerated, low-risk food'
      } else {
        ingredientRisk = 2
        description = 'Moderate risk - monitor response'
      }
      
      riskFactors.push({
        id: `ingredient-${ingredient}`,
        name: ingredient,
        category: 'ingredient',
        riskLevel: ingredientRisk,
        confidence: 0.85,
        description,
        historicalData: {
          timesEaten: Math.floor(Math.random() * 20) + 5,
          problemRate: ingredientRisk / 10,
          lastProblem: ingredientRisk > 5 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null
        }
      })
      
      totalRisk += ingredientRisk
    })
    
    // Analyze timing
    if (meal.plannedTime) {
      const hour = parseInt(meal.plannedTime.split(':')[0])
      let timingRisk = 0
      let timingDescription = ''
      
      if (hour >= 18) {
        timingRisk = 4
        timingDescription = 'Evening meals may affect sleep and overnight comfort'
      } else if (hour >= 12 && hour < 14) {
        timingRisk = 1
        timingDescription = 'Lunch time is typically well-tolerated'
      } else if (hour >= 6 && hour < 10) {
        timingRisk = 2
        timingDescription = 'Morning meals generally have good tolerance'
      } else {
        timingRisk = 3
        timingDescription = 'Unusual meal timing may affect digestion'
      }
      
      riskFactors.push({
        id: 'timing',
        name: 'Meal Timing',
        category: 'timing',
        riskLevel: timingRisk,
        confidence: 0.7,
        description: timingDescription,
        historicalData: {
          timesEaten: Math.floor(Math.random() * 15) + 10,
          problemRate: timingRisk / 10,
          lastProblem: timingRisk > 3 ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) : null
        }
      })
      
      totalRisk += timingRisk
    }
    
    // Calculate overall risk
    const avgRisk = totalRisk / riskFactors.length
    const overallRisk = Math.min(Math.max(avgRisk, 0), 10)
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (overallRisk >= 6) riskLevel = 'high'
    else if (overallRisk >= 3) riskLevel = 'medium'
    
    // Generate recommendations
    const recommendations = []
    if (overallRisk >= 6) {
      recommendations.push('Consider postponing this meal or choosing alternatives')
      recommendations.push('Have irrigation supplies ready')
      recommendations.push('Avoid eating close to bedtime')
    } else if (overallRisk >= 3) {
      recommendations.push('Monitor symptoms closely after eating')
      recommendations.push('Consider smaller portion sizes')
      recommendations.push('Stay hydrated')
    } else {
      recommendations.push('This meal appears to be well-tolerated')
      recommendations.push('Continue with normal portions')
    }
    
    // Generate safe times
    const safeTimes = ['12:00 PM - 1:00 PM', '6:00 AM - 9:00 AM']
    if (overallRisk < 4) {
      safeTimes.push('6:00 PM - 7:00 PM')
    }
    
    // Generate alternatives
    const alternatives = [
      {
        name: 'Rice with Grilled Chicken',
        riskReduction: 60,
        description: 'Well-tolerated protein and carbs'
      },
      {
        name: 'White Bread Toast',
        riskReduction: 70,
        description: 'Simple, easily digestible'
      },
      {
        name: 'Banana and Crackers',
        riskReduction: 50,
        description: 'Gentle on the digestive system'
      }
    ]
    
    const mockAnalysis: MealRiskAnalysis = {
      overallRisk,
      riskLevel,
      confidence: 0.8,
      factors: riskFactors,
      recommendations,
      safeTimes,
      alternatives
    }
    
    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)
    onRiskAnalyzed(mockAnalysis)
  }

  useEffect(() => {
    if (meal.ingredients.length > 0) {
      analyzeMealRisk()
    }
  }, [meal])

  const getRiskColor = (level: number | string) => {
    if (typeof level === 'string') {
      switch (level) {
        case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30'
        case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
        case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30'
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      }
    } else {
      if (level >= 6) return 'bg-red-500/20 text-red-300 border-red-500/30'
      if (level >= 3) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      return 'bg-green-500/20 text-green-300 border-green-500/30'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return ExclamationTriangleIcon
      case 'medium': return ClockIcon
      case 'low': return CheckCircleIcon
      default: return InformationCircleIcon
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ingredient': return SparklesIcon
      case 'timing': return ClockIcon
      case 'preparation': return FireIcon
      case 'quantity': return ChartBarIcon
      default: return InformationCircleIcon
    }
  }

  if (isAnalyzing) {
    return (
      <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="text-center py-8">
          <div className="animate-spin w-12 h-12 border-3 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Meal Risk</h3>
          <p className="text-white/70">Evaluating ingredients, timing, and historical data...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  const RiskIcon = getRiskIcon(analysis.riskLevel)

  return (
    <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <RiskIcon className="h-6 w-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Meal Risk Analysis</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-white/60 hover:text-white transition-colors"
        >
          <InformationCircleIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Overall Risk Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${getRiskColor(analysis.riskLevel)}`}>
              <span className="text-2xl font-bold">{analysis.overallRisk.toFixed(1)}</span>
            </div>
            <div>
              <h4 className="text-white font-semibold">{meal.name}</h4>
              <p className={`text-sm font-medium ${getRiskColor(analysis.riskLevel).split(' ')[1]}`}>
                {analysis.riskLevel.toUpperCase()} RISK
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm">Confidence</p>
            <p className="text-white font-semibold">{Math.round(analysis.confidence * 100)}%</p>
          </div>
        </div>

        {/* Risk Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              analysis.riskLevel === 'high' ? 'bg-gradient-to-r from-red-400 to-red-600' :
              analysis.riskLevel === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
              'bg-gradient-to-r from-green-400 to-emerald-500'
            }`}
            style={{ width: `${(analysis.overallRisk / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Top Risk Factors */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Top Risk Factors</h4>
        <div className="space-y-2">
          {analysis.factors
            .sort((a, b) => b.riskLevel - a.riskLevel)
            .slice(0, 3)
            .map(factor => {
              const CategoryIcon = getCategoryIcon(factor.category)
              return (
                <div
                  key={factor.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-200"
                  onClick={() => setSelectedFactor(factor)}
                >
                  <div className="flex items-center space-x-3">
                    <CategoryIcon className="h-5 w-5 text-white/60" />
                    <div>
                      <p className="text-white font-medium">{factor.name}</p>
                      <p className="text-white/60 text-sm">{factor.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(factor.riskLevel)}`}>
                      {factor.riskLevel.toFixed(1)}
                    </span>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Recommendations</h4>
        <div className="space-y-2">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 bg-white/5 rounded-xl">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-white/80 text-sm">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Times */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Recommended Times</h4>
        <div className="flex flex-wrap gap-2">
          {analysis.safeTimes.map((time, index) => (
            <span key={index} className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-lg">
              {time}
            </span>
          ))}
        </div>
      </div>

      {/* Alternatives */}
      {analysis.riskLevel !== 'low' && (
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Safer Alternatives</h4>
          <div className="space-y-2">
            {analysis.alternatives.map((alt, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                <div>
                  <p className="text-white font-medium">{alt.name}</p>
                  <p className="text-white/60 text-sm">{alt.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 text-sm font-medium">
                    -{alt.riskReduction}% risk
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-white/60 inline ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFactor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedFactor(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedFactor.name}</h3>
                <button
                  onClick={() => setSelectedFactor(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/80 text-sm mb-2">Risk Level</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          selectedFactor.riskLevel >= 6 ? 'bg-red-500' :
                          selectedFactor.riskLevel >= 3 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(selectedFactor.riskLevel / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold">
                      {selectedFactor.riskLevel.toFixed(1)}/10
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-white/80 text-sm mb-2">Description</p>
                  <p className="text-white">{selectedFactor.description}</p>
                </div>

                <div>
                  <p className="text-white/80 text-sm mb-2">Historical Data</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Times eaten:</span>
                      <span className="text-white">{selectedFactor.historicalData.timesEaten}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Problem rate:</span>
                      <span className="text-white">{Math.round(selectedFactor.historicalData.problemRate * 100)}%</span>
                    </div>
                    {selectedFactor.historicalData.lastProblem && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Last problem:</span>
                        <span className="text-white">
                          {selectedFactor.historicalData.lastProblem.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFactor(null)}
                  className="w-full bg-white/10 text-white/80 py-2 px-4 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

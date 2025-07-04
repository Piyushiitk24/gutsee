'use client'

import { useState, useEffect } from 'react'
import { 
  LightBulbIcon, 
  ChartBarIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface Theory {
  id: string
  title: string
  description: string
  hypothesis: string
  variables: {
    independent: string[]
    dependent: string[]
  }
  testDuration: number // days
  status: 'draft' | 'active' | 'completed' | 'abandoned'
  startDate?: Date
  endDate?: Date
  results?: {
    confidence: number
    conclusion: string
    dataPoints: number
    correlations: Array<{
      variable: string
      correlation: number
      pValue: number
    }>
  }
  createdAt: Date
  tags: string[]
}

interface TestATheoryProps {
  existingData: any[]
  onCreateTheory: (theory: Partial<Theory>) => void
  onUpdateTheory: (theoryId: string, updates: Partial<Theory>) => void
  onDeleteTheory: (theoryId: string) => void
}

export function TestATheory({ 
  existingData, 
  onCreateTheory, 
  onUpdateTheory, 
  onDeleteTheory 
}: TestATheoryProps) {
  const [theories, setTheories] = useState<Theory[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTheory, setSelectedTheory] = useState<Theory | null>(null)
  const [newTheory, setNewTheory] = useState<Partial<Theory>>({
    title: '',
    description: '',
    hypothesis: '',
    variables: { independent: [], dependent: [] },
    testDuration: 14,
    tags: []
  })

  // Sample theories for demonstration
  useEffect(() => {
    const sampleTheories: Theory[] = [
      {
        id: '1',
        title: 'Rice vs Pasta Impact',
        description: 'Testing if rice-based meals cause fewer output events than pasta-based meals',
        hypothesis: 'Rice-based meals will result in 30% fewer output events within 6 hours compared to pasta-based meals',
        variables: {
          independent: ['meal_type', 'portion_size'],
          dependent: ['output_frequency', 'output_volume', 'gas_production']
        },
        testDuration: 21,
        status: 'active',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        tags: ['food', 'output', 'carbohydrates']
      },
      {
        id: '2',
        title: 'Morning vs Evening Meals',
        description: 'Comparing digestive response between morning and evening meals',
        hypothesis: 'Morning meals will have 40% better digestive tolerance than evening meals',
        variables: {
          independent: ['meal_timing', 'meal_size'],
          dependent: ['digestive_comfort', 'output_timing', 'sleep_quality']
        },
        testDuration: 28,
        status: 'completed',
        startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        results: {
          confidence: 0.85,
          conclusion: 'Morning meals showed 32% better tolerance with statistical significance',
          dataPoints: 84,
          correlations: [
            { variable: 'meal_timing', correlation: 0.67, pValue: 0.02 },
            { variable: 'digestive_comfort', correlation: 0.82, pValue: 0.001 }
          ]
        },
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        tags: ['timing', 'digestion', 'comfort']
      },
      {
        id: '3',
        title: 'Hydration Impact',
        description: 'Testing the effect of increased water intake on output consistency',
        hypothesis: 'Increasing water intake by 500ml daily will improve output consistency by 25%',
        variables: {
          independent: ['water_intake'],
          dependent: ['output_consistency', 'output_volume', 'irrigation_effectiveness']
        },
        testDuration: 14,
        status: 'draft',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['hydration', 'output', 'consistency']
      }
    ]
    setTheories(sampleTheories)
  }, [])

  const handleCreateTheory = () => {
    if (newTheory.title && newTheory.hypothesis) {
      const theory: Theory = {
        id: Date.now().toString(),
        title: newTheory.title!,
        description: newTheory.description || '',
        hypothesis: newTheory.hypothesis!,
        variables: newTheory.variables!,
        testDuration: newTheory.testDuration || 14,
        status: 'draft',
        createdAt: new Date(),
        tags: newTheory.tags || []
      }
      
      setTheories([...theories, theory])
      onCreateTheory(theory)
      setNewTheory({
        title: '',
        description: '',
        hypothesis: '',
        variables: { independent: [], dependent: [] },
        testDuration: 14,
        tags: []
      })
      setShowCreateForm(false)
    }
  }

  const handleStartTheory = (theoryId: string) => {
    const updatedTheories = theories.map(theory => {
      if (theory.id === theoryId) {
        const updatedTheory = {
          ...theory,
          status: 'active' as const,
          startDate: new Date(),
          endDate: new Date(Date.now() + theory.testDuration * 24 * 60 * 60 * 1000)
        }
        onUpdateTheory(theoryId, updatedTheory)
        return updatedTheory
      }
      return theory
    })
    setTheories(updatedTheories)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-300'
      case 'active': return 'bg-blue-500/20 text-blue-300'
      case 'completed': return 'bg-green-500/20 text-green-300'
      case 'abandoned': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return ClockIcon
      case 'active': return ChartBarIcon
      case 'completed': return CheckCircleIcon
      case 'abandoned': return XCircleIcon
      default: return ClockIcon
    }
  }

  const calculateProgress = (theory: Theory) => {
    if (!theory.startDate || !theory.endDate) return 0
    const now = new Date()
    const start = theory.startDate.getTime()
    const end = theory.endDate.getTime()
    const current = now.getTime()
    
    if (current < start) return 0
    if (current > end) return 100
    
    return Math.round(((current - start) / (end - start)) * 100)
  }

  const addVariable = (type: 'independent' | 'dependent', variable: string) => {
    if (variable.trim()) {
      setNewTheory(prev => ({
        ...prev,
        variables: {
          ...prev.variables!,
          [type]: [...(prev.variables?.[type] || []), variable.trim()]
        }
      }))
    }
  }

  const removeVariable = (type: 'independent' | 'dependent', index: number) => {
    setNewTheory(prev => ({
      ...prev,
      variables: {
        ...prev.variables!,
        [type]: prev.variables?.[type]?.filter((_, i) => i !== index) || []
      }
    }))
  }

  return (
    <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <LightBulbIcon className="h-6 w-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Test a Theory</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New Theory</span>
        </button>
      </div>

      {/* Theories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {theories.map(theory => {
          const StatusIcon = getStatusIcon(theory.status)
          const progress = calculateProgress(theory)
          
          return (
            <motion.div
              key={theory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedTheory(theory)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <StatusIcon className="h-5 w-5 text-white/80" />
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(theory.status)}`}>
                    {theory.status}
                  </span>
                </div>
                <span className="text-white/60 text-xs">
                  {theory.testDuration} days
                </span>
              </div>

              <h4 className="font-semibold text-white mb-2">{theory.title}</h4>
              <p className="text-white/70 text-sm mb-3 line-clamp-2">
                {theory.description}
              </p>

              {theory.status === 'active' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {theory.results && (
                <div className="bg-green-500/20 rounded-lg p-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-300">Confidence</span>
                    <span className="text-green-300 font-semibold">
                      {Math.round(theory.results.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1 mb-3">
                {theory.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-lg">
                    {tag}
                  </span>
                ))}
                {theory.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-lg">
                    +{theory.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">
                  Created {theory.createdAt.toLocaleDateString()}
                </span>
                {theory.status === 'draft' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartTheory(theory.id)
                    }}
                    className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-xs hover:bg-blue-500/30 transition-all duration-200"
                  >
                    Start Test
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Create Theory Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Create New Theory</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Theory Title</label>
                  <input
                    type="text"
                    value={newTheory.title}
                    onChange={(e) => setNewTheory(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none"
                    placeholder="e.g., Impact of fiber on output frequency"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Description</label>
                  <textarea
                    value={newTheory.description}
                    onChange={(e) => setNewTheory(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none h-24 resize-none"
                    placeholder="Describe what you want to test..."
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Hypothesis</label>
                  <textarea
                    value={newTheory.hypothesis}
                    onChange={(e) => setNewTheory(prev => ({ ...prev, hypothesis: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none h-24 resize-none"
                    placeholder="e.g., Increasing fiber intake by 10g daily will reduce output frequency by 20%"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Independent Variables</label>
                    <div className="space-y-2">
                      {(newTheory.variables?.independent || []).map((variable, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 px-3 py-2 bg-white/10 text-white rounded-lg text-sm">
                            {variable}
                          </span>
                          <button
                            onClick={() => removeVariable('independent', index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        placeholder="Add independent variable..."
                        className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/60 rounded-lg border border-white/20 focus:border-purple-400 focus:outline-none text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addVariable('independent', e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Dependent Variables</label>
                    <div className="space-y-2">
                      {(newTheory.variables?.dependent || []).map((variable, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="flex-1 px-3 py-2 bg-white/10 text-white rounded-lg text-sm">
                            {variable}
                          </span>
                          <button
                            onClick={() => removeVariable('dependent', index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        placeholder="Add dependent variable..."
                        className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/60 rounded-lg border border-white/20 focus:border-purple-400 focus:outline-none text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addVariable('dependent', e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Test Duration (days)</label>
                  <input
                    type="number"
                    value={newTheory.testDuration}
                    onChange={(e) => setNewTheory(prev => ({ ...prev, testDuration: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none"
                    min="1"
                    max="365"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCreateTheory}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    Create Theory
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 bg-white/10 text-white/80 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theory Details Modal */}
      <AnimatePresence>
        {selectedTheory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedTheory(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{selectedTheory.title}</h3>
                <button
                  onClick={() => setSelectedTheory(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-white/80 text-sm mb-2">Description</h4>
                  <p className="text-white">{selectedTheory.description}</p>
                </div>

                <div>
                  <h4 className="text-white/80 text-sm mb-2">Hypothesis</h4>
                  <p className="text-white">{selectedTheory.hypothesis}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white/80 text-sm mb-2">Independent Variables</h4>
                    <div className="space-y-1">
                      {selectedTheory.variables.independent.map((variable, index) => (
                        <div key={index} className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm">
                          {variable}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white/80 text-sm mb-2">Dependent Variables</h4>
                    <div className="space-y-1">
                      {selectedTheory.variables.dependent.map((variable, index) => (
                        <div key={index} className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm">
                          {variable}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedTheory.results && (
                  <div>
                    <h4 className="text-white/80 text-sm mb-2">Results</h4>
                    <div className="bg-green-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-green-300">Confidence Level</span>
                        <span className="text-green-300 font-semibold">
                          {Math.round(selectedTheory.results.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-white mb-3">{selectedTheory.results.conclusion}</p>
                      <div className="text-sm text-white/80">
                        Data Points: {selectedTheory.results.dataPoints}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  {selectedTheory.status === 'draft' && (
                    <button
                      onClick={() => {
                        handleStartTheory(selectedTheory.id)
                        setSelectedTheory(null)
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                    >
                      Start Test
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedTheory(null)}
                    className="px-6 py-2 bg-white/10 text-white/80 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

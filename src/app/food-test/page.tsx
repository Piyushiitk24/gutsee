'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import EnhancedSmartEntryLogger from '@/components/intelligent/EnhancedSmartEntryLogger'
import FoodAPILogger from '@/components/intelligent/FoodAPILogger'
import HybridFoodSearch from '@/components/intelligent/HybridFoodSearch'
import { motion, AnimatePresence } from 'framer-motion'

export default function FoodDatabaseTestPage() {
  const { user } = useAuth()
  const [activeDemo, setActiveDemo] = useState<'none' | 'legacy' | 'api' | 'hybrid'>('none')

  const demos = [
    {
      id: 'legacy',
      title: 'Legacy System',
      subtitle: 'Manual foodDatabase.ts (Your Current System)',
      description: 'AI parsing with 50 manually curated foods',
      color: 'from-purple-500 to-pink-500',
      pros: ['AI natural language parsing', 'Quick for known foods'],
      cons: ['Limited to 50 foods', 'Manual maintenance', 'No ingredient details']
    },
    {
      id: 'api',
      title: 'Professional APIs',
      subtitle: 'Open Food Facts + USDA (Previous Solution)',
      description: 'Direct access to 3+ million professional food databases',
      color: 'from-blue-500 to-green-500',
      pros: ['3+ million foods', 'Professional data', 'Zero maintenance'],
      cons: ['No stoma-specific insights', 'Generic recommendations']
    },
    {
      id: 'hybrid',
      title: '🚀 Hybrid System',
      subtitle: 'Professional Data + Stoma Insights (Recommended)',
      description: 'Best of both worlds: comprehensive data + medical specialization',
      color: 'from-emerald-500 to-teal-500',
      pros: ['3+ million foods', 'Stoma safety ratings', 'Digestibility scores', 'Preparation tips'],
      cons: ['Requires database setup (one-time)']
    }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Food Database Comparison</h1>
          <p>Please log in to test the food database systems</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Food Database Comparison</h1>
            <p className="text-white/70 text-lg">
              Compare three approaches: Manual Database vs Professional APIs vs Hybrid System
            </p>
          </div>

          {/* Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {demos.map((demo) => (
              <motion.div
                key={demo.id}
                className={`bg-gradient-to-br ${demo.color} rounded-2xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105`}
                onClick={() => setActiveDemo(demo.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{demo.title}</h3>
                  <p className="text-white/90 text-sm font-medium mb-2">{demo.subtitle}</p>
                  <p className="text-white/80 text-sm">{demo.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">✅ Pros:</h4>
                    <ul className="text-xs text-white/80 space-y-1">
                      {demo.pros.map((pro, index) => (
                        <li key={index}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">❌ Cons:</h4>
                    <ul className="text-xs text-white/80 space-y-1">
                      {demo.cons.map((con, index) => (
                        <li key={index}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Test {demo.title}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="mb-8 bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/80 border-b border-white/20">
                    <th className="text-left py-2 px-4">Feature</th>
                    <th className="text-center py-2 px-4">Legacy System</th>
                    <th className="text-center py-2 px-4">Professional APIs</th>
                    <th className="text-center py-2 px-4">🚀 Hybrid System</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4 font-medium">Food Database Size</td>
                    <td className="text-center py-2 px-4">50 foods</td>
                    <td className="text-center py-2 px-4">3+ million</td>
                    <td className="text-center py-2 px-4 text-green-400">3+ million</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4 font-medium">Ingredient Details</td>
                    <td className="text-center py-2 px-4 text-red-400">Basic</td>
                    <td className="text-center py-2 px-4 text-green-400">Complete</td>
                    <td className="text-center py-2 px-4 text-green-400">Complete</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4 font-medium">Stoma Safety Ratings</td>
                    <td className="text-center py-2 px-4 text-red-400">No</td>
                    <td className="text-center py-2 px-4 text-red-400">No</td>
                    <td className="text-center py-2 px-4 text-green-400">Yes</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4 font-medium">Digestibility Scores</td>
                    <td className="text-center py-2 px-4 text-red-400">No</td>
                    <td className="text-center py-2 px-4 text-red-400">No</td>
                    <td className="text-center py-2 px-4 text-green-400">1-10 scale</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4 font-medium">Preparation Tips</td>
                    <td className="text-center py-2 px-4 text-red-400">No</td>
                    <td className="text-center py-2 px-4 text-red-400">No</td>
                    <td className="text-center py-2 px-4 text-green-400">Specialized</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4 font-medium">Maintenance Required</td>
                    <td className="text-center py-2 px-4 text-red-400">High</td>
                    <td className="text-center py-2 px-4 text-green-400">None</td>
                    <td className="text-center py-2 px-4 text-green-400">Minimal</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Cost</td>
                    <td className="text-center py-2 px-4 text-green-400">Free</td>
                    <td className="text-center py-2 px-4 text-green-400">Free</td>
                    <td className="text-center py-2 px-4 text-green-400">Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Test Suggestions */}
          <div className="mb-8 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">🧪 Quick Test Suggestions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Search: "paneer butter masala"</h4>
                <p className="text-white/70 text-sm">Compare results across all systems</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Search: "brown rice"</h4>
                <p className="text-white/70 text-sm">See stoma-specific safety warnings</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Search: "cabbage"</h4>
                <p className="text-white/70 text-sm">Check gas production warnings</p>
              </div>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Demo Modals */}
      <AnimatePresence>
        {activeDemo === 'legacy' && (
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
                onEntriesLogged={(entries) => {
                  console.log('Legacy system entries:', entries);
                  setActiveDemo('none');
                }}
                onClose={() => setActiveDemo('none')}
              />
            </motion.div>
          </motion.div>
        )}

        {activeDemo === 'api' && (
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
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setActiveDemo('none')}
                className="absolute top-4 right-4 z-10 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors"
              >
                ✕
              </button>
              <FoodAPILogger 
                onEntryCreated={(entry) => {
                  console.log('API system entry:', entry);
                  setActiveDemo('none');
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {activeDemo === 'hybrid' && (
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
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setActiveDemo('none')}
                className="absolute top-4 right-4 z-10 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors"
              >
                ✕
              </button>
              <HybridFoodSearch
                onFoodSelect={(food) => {
                  console.log('Hybrid system food selected:', food);
                  setActiveDemo('none');
                }}
                onClose={() => setActiveDemo('none')}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useAuth } from '@/context/AuthContext'
import { SmartAssistantInterface } from '@/components/intelligent/SmartAssistantInterface'
import { SmartPromptSystem } from '@/components/intelligent/SmartPromptSystem'
import { IntelligentMealLogger } from '@/components/intelligent/IntelligentMealLogger'
import { SmartAssistantChat } from '@/components/intelligent/SmartAssistantChat'
import { GeminiMealAnalysis } from '@/components/intelligent/GeminiMealAnalysis'
import { ArrowRightOnRectangleIcon, SparklesIcon, BeakerIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [userPatterns, setUserPatterns] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<'assistant' | 'meal-logger' | 'analytics' | 'ai-chat'>('ai-chat')
  const [testIngredients, setTestIngredients] = useState<string[]>([])
  const [recentMeals, setRecentMeals] = useState<any[]>([])
  const [recentOutputs, setRecentOutputs] = useState<any[]>([])

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const data = await response.json()
        setDashboardStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    }

    // Fetch recent meals and outputs for AI analysis
    const fetchRecentData = async () => {
      try {
        const [mealsResponse, outputsResponse] = await Promise.all([
          fetch('/api/meals'),
          fetch('/api/outputs')
        ])
        
        const mealsData = await mealsResponse.json()
        const outputsData = await outputsResponse.json()
        
        setRecentMeals(mealsData.data || [])
        setRecentOutputs(outputsData.data || [])
      } catch (error) {
        console.error('Error fetching recent data:', error)
      }
    }

    // Fetch user patterns (mock data for now)
    const fetchPatterns = async () => {
      setUserPatterns({
        usualIrrigationTime: 7,
        preferredBreakfastTime: 8,
        favoriteBreakfast: 'Rice Bowl',
        breakfastSuccessRate: 92,
        averageAfternoonMood: 7,
        recentTriggers: ['dairy'],
        stressLevel: 4,
        sleepQuality: 7,
        mealPatterns: {
          0: ['rice-bowl', 'chicken-rice'], // Sunday
          1: ['rice-bowl', 'safe-lunch'], // Monday
          // ... other days
        },
        newPatternDetected: {
          description: 'eating earlier seems to improve your evening comfort',
          confidence: 87
        }
      })
    }

    fetchStats()
    fetchRecentData()
    fetchPatterns()
  }, [])

  const handleMealAnalysis = (ingredients: string[]) => {
    setTestIngredients(ingredients)
    setActiveSection('analytics')
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handlePromptAction = (action: string, data?: any) => {
    console.log('Prompt action:', action, data)
    // Handle different prompt actions
    switch (action) {
      case 'log-irrigation':
        // Open irrigation modal
        break
      case 'log-meal':
        setActiveSection('meal-logger')
        break
      case 'show-analytics':
        setActiveSection('analytics')
        break
      default:
        break
    }
  }

  const handleMealLog = (meal: any) => {
    console.log('Meal logged:', meal)
    // In real app, would save to database
  }

  const mockMealTemplates = [
    {
      id: '1',
      name: 'Morning Rice Bowl',
      description: 'Your go-to safe breakfast',
      ingredients: ['white rice', 'salt', 'water'],
      category: 'breakfast' as const,
      frequency: 15,
      lastEaten: new Date(Date.now() - 24 * 60 * 60 * 1000),
      riskScore: 'low' as const,
      successRate: 94,
      avgOutputDelay: 18,
      compatibleWith: ['chicken', 'light vegetables'],
      tags: ['safe', 'quick', 'reliable'],
      timeOfDayOptimal: [7, 8, 9]
    },
    {
      id: '2',
      name: 'Chicken & Rice Lunch',
      description: 'Proven midday combination',
      ingredients: ['chicken breast', 'white rice', 'light seasoning'],
      category: 'lunch' as const,
      frequency: 12,
      lastEaten: new Date(Date.now() - 48 * 60 * 60 * 1000),
      riskScore: 'low' as const,
      successRate: 89,
      avgOutputDelay: 16,
      compatibleWith: ['carrots', 'potatoes'],
      tags: ['filling', 'safe', 'protein'],
      timeOfDayOptimal: [12, 13, 14]
    }
  ]

  return (
    <div className="min-h-screen relative">
      {/* Beautiful gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Subtle animated overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      
      {/* Floating orbs for depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with user info and sign out */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2"
            >
              <SparklesIcon className="h-8 w-8 text-purple-400" />
              Smart Health Assistant
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 mt-1"
            >
              Welcome back, {user?.email || 'User'}! Let's make today amazing.
            </motion.p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            {[
              { key: 'ai-chat', label: 'AI Chat', icon: '💬' },
              { key: 'assistant', label: 'Assistant', icon: '🤖' },
              { key: 'meal-logger', label: 'Smart Logger', icon: '🍽️' },
              { key: 'analytics', label: 'Insights', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key as any)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 text-sm ${
                  activeSection === tab.key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Smart Prompt System - Always visible */}
        <div className="mb-8">
          <SmartPromptSystem 
            currentTime={new Date()}
            userPatterns={userPatterns || {}}
            dashboardStats={dashboardStats || {}}
            onPromptAction={handlePromptAction}
          />
        </div>

        {/* Main Content Area */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'ai-chat' && (
            <div className="grid gap-6">
              <SmartAssistantChat 
                userHistory={userPatterns}
                recentMeals={recentMeals}
                recentOutputs={recentOutputs}
                onActionRequested={(action, data) => console.log('Action requested:', action, data)}
              />
              
              {testIngredients.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BeakerIcon className="h-5 w-5" />
                    Ingredient Analysis Results
                  </h3>
                  <GeminiMealAnalysis 
                    ingredients={testIngredients}
                    mealName="Test Meal"
                    onAnalysisComplete={(analysis) => console.log('Analysis complete:', analysis)}
                  />
                </div>
              )}
            </div>
          )}

          {activeSection === 'assistant' && (
            <SmartAssistantInterface 
              user={user} 
              dashboardStats={dashboardStats || {}} 
            />
          )}

          {activeSection === 'meal-logger' && (
            <IntelligentMealLogger
              currentTime={new Date()}
              userPatterns={userPatterns || {}}
              recentMeals={recentMeals}
              templates={mockMealTemplates}
              onLogMeal={handleMealLog}
              onCreateTemplate={(meal) => console.log('Create template:', meal)}
            />
          )}

          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <SparklesIcon className="h-6 w-6" />
                  Gemini AI Meal Analysis
                </h2>
                <p className="text-white/70 mb-6">Test ingredient analysis with our AI-powered system</p>
                
                <div className="grid gap-4">
                  <button
                    onClick={() => handleMealAnalysis(['white rice', 'chicken breast', 'salt'])}
                    className="p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-left"
                  >
                    <div className="text-white font-medium">Test: Safe Meal</div>
                    <div className="text-white/60 text-sm">Rice + Chicken + Salt</div>
                  </button>
                  
                  <button
                    onClick={() => handleMealAnalysis(['beans', 'broccoli', 'onion', 'garlic'])}
                    className="p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-left"
                  >
                    <div className="text-white font-medium">Test: High Gas Risk</div>
                    <div className="text-white/60 text-sm">Beans + Broccoli + Onion + Garlic</div>
                  </button>
                  
                  <button
                    onClick={() => handleMealAnalysis(['green tea', 'ginger', 'turmeric', 'honey'])}
                    className="p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-left"
                  >
                    <div className="text-white font-medium">Test: Metabolism Boost</div>
                    <div className="text-white/60 text-sm">Green Tea + Ginger + Turmeric + Honey</div>
                  </button>
                </div>
              </div>
              
              {testIngredients.length > 0 && (
                <GeminiMealAnalysis 
                  ingredients={testIngredients}
                  mealName="Test Meal"
                  onAnalysisComplete={(analysis) => console.log('Analysis complete:', analysis)}
                />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

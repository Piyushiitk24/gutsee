'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CalendarDaysIcon,
  ClockIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { parseMultiCategoryEntry } from '@/lib/gemini'

interface SmartEntryLoggerProps {
  onEntriesLogged: (entries: any[]) => void
  onClose: () => void
}

interface FoodItem {
  id: string
  name: string
  category: string
  commonPortions: { size: string; weight: number }[]
  riskLevel: 'low' | 'medium' | 'high'
  ingredients?: string[]
}

// Mock food database - in real app this would come from API
const FOOD_DATABASE: FoodItem[] = [
  {
    id: '1',
    name: 'Scrambled Eggs',
    category: 'Protein',
    commonPortions: [
      { size: '1 egg', weight: 50 },
      { size: '2 eggs', weight: 100 },
      { size: '3 eggs', weight: 150 },
      { size: '4 eggs', weight: 200 }
    ],
    riskLevel: 'low',
    ingredients: ['eggs', 'butter', 'salt']
  },
  {
    id: '2',
    name: 'Cheese Omelet',
    category: 'Protein',
    commonPortions: [
      { size: '1 egg omelet', weight: 80 },
      { size: '2 egg omelet', weight: 150 },
      { size: '3 egg omelet', weight: 220 }
    ],
    riskLevel: 'low',
    ingredients: ['eggs', 'cheese', 'butter']
  },
  {
    id: '3',
    name: 'Plain Omelet',
    category: 'Protein',
    commonPortions: [
      { size: '1 egg omelet', weight: 60 },
      { size: '2 egg omelet', weight: 120 },
      { size: '3 egg omelet', weight: 180 }
    ],
    riskLevel: 'low',
    ingredients: ['eggs', 'butter']
  },
  {
    id: '4',
    name: 'White Rice',
    category: 'Carbs',
    commonPortions: [
      { size: '1/2 cup cooked', weight: 80 },
      { size: '1 cup cooked', weight: 160 },
      { size: '1.5 cups cooked', weight: 240 }
    ],
    riskLevel: 'low'
  },
  {
    id: '5',
    name: 'Multigrain Toast',
    category: 'Carbs',
    commonPortions: [
      { size: '1 slice', weight: 30 },
      { size: '2 slices', weight: 60 },
      { size: '3 slices', weight: 90 }
    ],
    riskLevel: 'medium'
  },
  {
    id: '6',
    name: 'Protein Shake',
    category: 'Drinks',
    commonPortions: [
      { size: '1 scoop', weight: 30 },
      { size: '1.5 scoops', weight: 45 },
      { size: '2 scoops', weight: 60 }
    ],
    riskLevel: 'low'
  }
]

export function SmartEntryLogger({ onEntriesLogged, onClose }: SmartEntryLoggerProps) {
  const [mode, setMode] = useState<'natural' | 'traditional'>('natural')
  
  // Natural language mode
  const [naturalDescription, setNaturalDescription] = useState('')
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [entryTime, setEntryTime] = useState(new Date().toTimeString().slice(0, 5))
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedEntries, setParsedEntries] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)
  
  // Traditional mode
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([])
  const [selectedFoods, setSelectedFoods] = useState<Array<{
    food: FoodItem
    portion: { size: string; weight: number }
    quantity: number
  }>>([])
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  // Filter foods based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = FOOD_DATABASE.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.ingredients?.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredFoods(filtered)
    } else {
      setFilteredFoods([])
    }
  }, [searchQuery])

  // Recording timer
  useEffect(() => {
    let interval: any
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev: number) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isVoiceRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const audioChunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        // Here you would typically send to speech-to-text API
        // For now, we'll simulate with the example text
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const exampleText = "I had scrambled eggs with 4 eggs, 2 green chilies, grated cheese, little bell pepper, 2 black peppers, cooked in 1 spoon butter, and 2 multigrain toasts at 7:30am. Before that at 7am, I had 1 scoop of protein shake. At 8AM I did my irrigation which was not very smooth - water wasn't going inside easily but I feel like I emptied properly. Later around 9am I had some gas."
        
        setNaturalDescription(exampleText)
        stream.getTracks().forEach(track => track.stop())
        
        // Auto-process the transcribed text
        setTimeout(() => {
          handleProcessNaturalLanguage()
        }, 500)
      }
      
      mediaRecorder.start()
      setIsVoiceRecording(true)
    } catch (error) {
      console.error('Error starting voice recording:', error)
    }
  }

  const handleStopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsVoiceRecording(false)
    }
  }

  const handleProcessNaturalLanguage = async () => {
    if (!naturalDescription.trim()) return
    
    setIsProcessing(true)
    try {
      const baseTimestamp = new Date(`${entryDate}T${entryTime}`)
      const result = await parseMultiCategoryEntry(naturalDescription, baseTimestamp)
      
      setParsedEntries(result.entries || [])
      setShowPreview(true)
    } catch (error) {
      console.error('Error processing natural language:', error)
      // Fallback to single entry
      setParsedEntries([{
        type: 'breakfast',
        description: naturalDescription,
        timestamp: new Date(`${entryDate}T${entryTime}`),
        confidence: 0.7
      }])
      setShowPreview(true)
    }
    setIsProcessing(false)
  }

  const handleAddFood = (food: FoodItem, portion: { size: string; weight: number }) => {
    const existing = selectedFoods.find((sf: any) => sf.food.id === food.id && sf.portion.size === portion.size)
    if (existing) {
      setSelectedFoods(selectedFoods.map((sf: any) => 
        sf.food.id === food.id && sf.portion.size === portion.size
          ? { ...sf, quantity: sf.quantity + 1 }
          : sf
      ))
    } else {
      setSelectedFoods([...selectedFoods, { food, portion, quantity: 1 }])
    }
    setSearchQuery('')
  }

  const handleRemoveFood = (foodId: string, portionSize: string) => {
    setSelectedFoods(selectedFoods.filter((sf: any) => 
      !(sf.food.id === foodId && sf.portion.size === portionSize)
    ))
  }

  const handleUpdateQuantity = (foodId: string, portionSize: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFood(foodId, portionSize)
      return
    }
    setSelectedFoods(selectedFoods.map((sf: any) => 
      sf.food.id === foodId && sf.portion.size === portionSize
        ? { ...sf, quantity }
        : sf
    ))
  }

  const handleTraditionalSubmit = () => {
    if (selectedFoods.length === 0) return
    
    const entries = selectedFoods.map((sf: any) => ({
      type: sf.food.category.toLowerCase(),
      description: `${sf.food.name} - ${sf.quantity} × ${sf.portion.size}`,
      timestamp: new Date(`${entryDate}T${entryTime}`),
      confidence: 1.0,
      details: {
        foodId: sf.food.id,
        foodName: sf.food.name,
        portion: sf.portion,
        quantity: sf.quantity,
        totalWeight: sf.portion.weight * sf.quantity,
        riskLevel: sf.food.riskLevel,
        ingredients: sf.food.ingredients || []
      }
    }))
    
    onEntriesLogged(entries)
  }

  const handleNaturalSubmit = () => {
    if (parsedEntries.length === 0) return
    onEntriesLogged(parsedEntries)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'high': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Smart Entry Logger</h2>
                <p className="text-sm text-white/70">Log your day naturally or traditionally</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center">✕</div>
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setMode('natural')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'natural'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <DocumentTextIcon className="h-4 w-4" />
              Natural Language
            </button>
            <button
              onClick={() => setMode('traditional')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'traditional'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              Traditional Search
            </button>
          </div>
        </div>

        {/* Date & Time Controls */}
        <div className="px-6 py-4 border-b border-white/20 bg-white/5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5 text-white/60" />
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-purple-400 focus:outline-none [color-scheme:dark]"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-white/60" />
              <input
                type="time"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-purple-400 focus:outline-none [color-scheme:dark]"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="text-white/60 text-sm bg-white/10 px-3 py-2 rounded-lg">
              📅 {new Date(`${entryDate}T${entryTime}`).toLocaleDateString()} at {new Date(`${entryDate}T${entryTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {mode === 'natural' ? (
            <div className="p-6 space-y-6 pb-8">
              {/* Natural Language Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Describe Your Day</h3>
                  <div className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                    AI-Powered
                  </div>
                </div>
                
                <div className="relative">
                  <textarea
                    value={naturalDescription}
                    onChange={(e) => setNaturalDescription(e.target.value)}
                    placeholder="✨ Describe everything that happened! Our AI will automatically sort it into categories:

Example: 'Had scrambled eggs with 4 eggs, 2 green chilies, grated cheese, little bell pepper, 2 black peppers, cooked in 1 spoon butter, and 2 multigrain toasts at 7:30am. Before that at 7am, I had 1 scoop of protein shake. At 8AM I did my irrigation which was not very smooth - water wasn't going inside easily but I feel like I emptied properly. Later I had some gas around 9am.'

🤖 AI will create separate entries for: Breakfast (7:30am), Drinks (7am), Irrigation (8am), and Gas (9am)"
                    className="w-full h-40 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none resize-none text-sm leading-relaxed"
                  />
                  
                  {/* Voice Recording Button & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={isVoiceRecording ? handleStopVoiceRecording : handleStartVoiceRecording}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                          isVoiceRecording
                            ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        <MicrophoneIcon className="h-5 w-5" />
                        {isVoiceRecording ? `Stop Recording (${formatTime(recordingTime)})` : 'Voice Input'}
                      </button>
                      
                      <button
                        onClick={() => {
                          const demoText = "I had scrambled eggs with 4 eggs, 2 green chilies, grated cheese, little bell pepper, 2 black peppers, cooked in 1 spoon butter, and 2 multigrain toasts at 7:30am. Before that at 7am, I had 1 scoop of protein shake. At 8AM I did my irrigation which was not very smooth - water wasn't going inside easily but I feel like I emptied properly. Later around 9am I had some gas."
                          setNaturalDescription(demoText)
                          setTimeout(() => handleProcessNaturalLanguage(), 500)
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all"
                      >
                        <SparklesIcon className="h-4 w-4" />
                        Try Demo
                      </button>
                    </div>
                    
                    {isVoiceRecording && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span>Recording... speak naturally about your day</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleProcessNaturalLanguage}
                    disabled={!naturalDescription.trim() || isProcessing}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        AI is analyzing...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5" />
                        Parse with AI
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <InformationCircleIcon className="h-4 w-4 text-blue-300" />
                    <span className="text-blue-300 font-medium text-sm">💡 Pro Tips for Natural Language Entry</span>
                  </div>
                  <div className="text-xs text-blue-200/80 space-y-1">
                    <div>• <strong>Include timing:</strong> "at 7am", "before breakfast", "2 hours later"</div>
                    <div>• <strong>Be specific:</strong> "4 eggs", "1 scoop protein", "not very smooth"</div>
                    <div>• <strong>Mention everything:</strong> meals, drinks, irrigation, gas, medications</div>
                    <div>• <strong>Use natural language:</strong> "I had...", "felt like...", "was not smooth"</div>
                  </div>
                </div>
              </div>

              {/* Preview Parsed Entries */}
              <AnimatePresence>
                {showPreview && parsedEntries.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">AI Parsed Your Entry</h3>
                      <div className="text-xs text-white/60 bg-green-500/20 px-2 py-1 rounded-full">
                        {parsedEntries.length} entries detected
                      </div>
                    </div>

                    {/* Category Summary */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="h-4 w-4 text-purple-300" />
                        <span className="text-purple-300 font-medium text-sm">Smart Categorization</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parsedEntries.reduce((acc: string[], entry) => {
                          if (!acc.includes(entry.type)) acc.push(entry.type)
                          return acc
                        }, []).map((type) => {
                          const getTypeInfo = (type: string) => {
                            switch (type.toLowerCase()) {
                              case 'breakfast':
                              case 'lunch': 
                              case 'dinner':
                              case 'snack':
                                return { icon: '🍽️', color: 'bg-orange-500/30 text-orange-200' }
                              case 'drinks':
                                return { icon: '🥤', color: 'bg-blue-500/30 text-blue-200' }
                              case 'irrigation':
                                return { icon: '🚿', color: 'bg-cyan-500/30 text-cyan-200' }
                              case 'gas':
                              case 'bowel':
                                return { icon: '💨', color: 'bg-purple-500/30 text-purple-200' }
                              case 'medication':
                              case 'supplements':
                                return { icon: '💊', color: 'bg-green-500/30 text-green-200' }
                              case 'symptoms':
                                return { icon: '🩺', color: 'bg-red-500/30 text-red-200' }
                              default:
                                return { icon: '📝', color: 'bg-gray-500/30 text-gray-200' }
                            }
                          }
                          const info = getTypeInfo(type)
                          return (
                            <span key={type} className={`${info.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                              {info.icon} {type}
                            </span>
                          )
                        })}
                      </div>
                      <p className="text-xs text-white/70 mt-2">
                        🎯 Our AI automatically separated your description into {parsedEntries.length} specific health entries!
                      </p>
                    </div>

                    <div className="space-y-3">
                      {parsedEntries.map((entry, index) => {
                        const getEntryIcon = (type: string) => {
                          switch (type.toLowerCase()) {
                            case 'breakfast':
                            case 'lunch': 
                            case 'dinner':
                            case 'snack':
                              return '🍽️'
                            case 'drinks':
                              return '🥤'
                            case 'irrigation':
                              return '🚿'
                            case 'gas':
                            case 'bowel':
                              return '💨'
                            case 'medication':
                            case 'supplements':
                              return '💊'
                            case 'symptoms':
                              return '🩺'
                            default:
                              return '📝'
                          }
                        }

                        const getEntryColor = (type: string) => {
                          switch (type.toLowerCase()) {
                            case 'breakfast':
                            case 'lunch': 
                            case 'dinner':
                            case 'snack':
                              return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                            case 'drinks':
                              return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            case 'irrigation':
                              return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                            case 'gas':
                            case 'bowel':
                              return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            case 'medication':
                            case 'supplements':
                              return 'bg-green-500/20 text-green-300 border-green-500/30'
                            case 'symptoms':
                              return 'bg-red-500/20 text-red-300 border-red-500/30'
                            default:
                              return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }
                        }

                        return (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`rounded-xl p-4 border ${getEntryColor(entry.type)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getEntryIcon(entry.type)}</span>
                                <div>
                                  <span className="font-medium capitalize flex items-center gap-2">
                                    {entry.type}
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                      {Math.round(entry.confidence * 100)}% confident
                                    </span>
                                  </span>
                                  <span className="text-xs opacity-75">
                                    Auto-detected category
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs opacity-75">
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm mb-2 leading-relaxed">{entry.description}</p>
                            {entry.details && (
                              <div className="text-xs opacity-75 space-y-1">
                                {entry.details.ingredients && (
                                  <div className="flex flex-wrap gap-1">
                                    <span className="font-medium">Ingredients:</span>
                                    {entry.details.ingredients.map((ing: string, i: number) => (
                                      <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs">
                                        {ing}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {entry.details.cookingMethod && (
                                  <div>
                                    <span className="font-medium">Method:</span> {entry.details.cookingMethod}
                                  </div>
                                )}
                                {entry.details.quantity && (
                                  <div>
                                    <span className="font-medium">Quantity:</span> {entry.details.quantity}
                                  </div>
                                )}
                                {entry.details.quality && (
                                  <div>
                                    <span className="font-medium">Quality:</span> {entry.details.quality}
                                  </div>
                                )}
                                {entry.details.notes && (
                                  <div>
                                    <span className="font-medium">Notes:</span> {entry.details.notes}
                                  </div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>

                    <button
                      onClick={handleNaturalSubmit}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="h-5 w-5" />
                      Log All Entries
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="p-6 space-y-6 pb-8">
              {/* Traditional Search */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MagnifyingGlassIcon className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Search Foods</h3>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type food name... (e.g., omelet, rice, toast)"
                    className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-xl px-4 py-3 focus:border-blue-400 focus:outline-none"
                  />
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                </div>

                {/* Search Results */}
                {filteredFoods.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredFoods.map(food => (
                      <div key={food.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{food.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(food.riskLevel)}`}>
                              {food.riskLevel}
                            </span>
                          </div>
                          <span className="text-xs text-white/60">{food.category}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {food.commonPortions.map(portion => (
                            <button
                              key={portion.size}
                              onClick={() => handleAddFood(food, portion)}
                              className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                            >
                              <PlusIcon className="h-3 w-3" />
                              {portion.size}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Foods */}
              {selectedFoods.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Selected Foods</h3>
                    <div className="text-xs text-white/60 bg-green-500/20 px-2 py-1 rounded-full">
                      {selectedFoods.length} items
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedFoods.map(sf => (
                      <div key={`${sf.food.id}-${sf.portion.size}`} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white font-medium">{sf.food.name}</span>
                            <span className="text-white/60 text-sm ml-2">({sf.portion.size})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(sf.food.id, sf.portion.size, sf.quantity - 1)}
                              className="w-6 h-6 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-white font-medium w-8 text-center">{sf.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(sf.food.id, sf.portion.size, sf.quantity + 1)}
                              className="w-6 h-6 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 flex items-center justify-center"
                            >
                              +
                            </button>
                            <button
                              onClick={() => handleRemoveFood(sf.food.id, sf.portion.size)}
                              className="w-6 h-6 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleTraditionalSubmit}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckIcon className="h-5 w-5" />
                    Log Selected Foods
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

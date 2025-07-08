// Smart Assistant Chat component with Gemini AI integration

'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  PaperAirplaneIcon,
  MicrophoneIcon,
  StopIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  HeartIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    analysisType?: 'symptom' | 'meal' | 'pattern' | 'recommendation'
    confidence?: number
    sources?: string[]
  }
}

interface SmartAssistantChatProps {
  userHistory?: any
  recentMeals?: any[]
  recentOutputs?: any[]
  onActionRequested?: (action: string, data: any) => void
}

export function SmartAssistantChat({ 
  userHistory, 
  recentMeals = [], 
  recentOutputs = [],
  onActionRequested 
}: SmartAssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your intelligent stoma care assistant powered by Gemini AI. I can help you analyze your symptoms, understand food reactions, and provide personalized recommendations. What would you like to know?",
      timestamp: new Date(),
      metadata: { analysisType: 'recommendation', confidence: 1.0 }
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsProcessing(true)

    try {
      const response = await getAIResponse(userMessage.content)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: response.metadata
      }

      setMessages(prev => [...prev, assistantMessage])

      // Handle any actions the AI suggests (if available) - currently not implemented
      // if ('suggestedAction' in response && response.suggestedAction) {
      //   onActionRequested?.(response.suggestedAction.type, response.suggestedAction.data)
      // }
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        timestamp: new Date(),
        metadata: { analysisType: 'recommendation', confidence: 0.5 }
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const getAIResponse = async (userInput: string) => {
    // Determine the type of query and route accordingly
    const queryType = analyzeQueryType(userInput)

    switch (queryType) {
      case 'symptom-analysis':
        return await getSymptomAnalysis(userInput)
      case 'meal-inquiry':
        return await getMealGuidance(userInput)
      case 'pattern-analysis':
        return await getPatternInsights(userInput)
      default:
        return await getGeneralResponse(userInput)
    }
  }

  const analyzeQueryType = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('pain') || lowerInput.includes('discomfort') || 
        lowerInput.includes('bloat') || lowerInput.includes('gas') ||
        lowerInput.includes('symptom') || lowerInput.includes('feel')) {
      return 'symptom-analysis'
    }
    
    if (lowerInput.includes('eat') || lowerInput.includes('food') || 
        lowerInput.includes('meal') || lowerInput.includes('ingredient')) {
      return 'meal-inquiry'
    }
    
    if (lowerInput.includes('pattern') || lowerInput.includes('trend') || 
        lowerInput.includes('analysis') || lowerInput.includes('track')) {
      return 'pattern-analysis'
    }
    
    return 'general'
  }

  const getSymptomAnalysis = async (userInput: string) => {
    try {
      const response = await fetch('/api/ai/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: [userInput],
          recentMeals,
          outputs: recentOutputs
        })
      })

      const result = await response.json()
      
      if (result.success && result.data) {
        const analysis = result.data
        return {
          content: `Based on your symptoms and recent activity, here's my analysis:\n\n${analysis.analysis}\n\n**Possible causes:** ${analysis.possibleCauses.join(', ')}\n\n**Recommendations:**\n${analysis.recommendations.map((rec: string) => `• ${rec}`).join('\n')}`,
          metadata: { 
            analysisType: 'symptom' as const, 
            confidence: analysis.severity === 'high' ? 0.9 : 0.7 
          }
        }
      }
    } catch (error) {
      console.error('Symptom analysis error:', error)
    }

    return {
      content: "I understand you're experiencing some symptoms. While I can provide general guidance, it's important to monitor your symptoms and consult with your healthcare provider if they persist or worsen.",
      metadata: { analysisType: 'recommendation' as const, confidence: 0.6 }
    }
  }

  const getMealGuidance = async (userInput: string) => {
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userHistory,
          preferences: { query: userInput }
        })
      })

      const result = await response.json()
      
      if (result.success && result.data) {
        const recommendations = result.data
        return {
          content: `Here are my personalized meal recommendations based on your question:\n\n${recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n\n')}`,
          metadata: { analysisType: 'meal' as const, confidence: 0.8 }
        }
      }
    } catch (error) {
      console.error('Meal guidance error:', error)
    }

    return {
      content: "For meal planning, I recommend focusing on easily digestible foods, staying hydrated, and eating smaller, more frequent meals. Would you like specific suggestions for any particular meal or dietary concern?",
      metadata: { analysisType: 'meal' as const, confidence: 0.6 }
    }
  }

  const getPatternInsights = async (userInput: string) => {
    // Analyze user's data patterns
    const insights = analyzeUserPatterns()
    
    return {
      content: `Based on your tracking data, here are some patterns I've noticed:\n\n${insights.join('\n\n')}`,
      metadata: { analysisType: 'pattern' as const, confidence: 0.75 }
    }
  }

  const getGeneralResponse = async (userInput: string) => {
    return {
      content: "I'm here to help with your stoma care questions! I can assist with:\n\n• Analyzing symptoms and their potential causes\n• Providing meal recommendations and ingredient analysis\n• Identifying patterns in your health data\n• Offering personalized care tips\n\nWhat specific aspect would you like help with?",
      metadata: { analysisType: 'recommendation' as const, confidence: 0.8 }
    }
  }

  const analyzeUserPatterns = () => {
    const insights = []
    
    // Analyze meal patterns
    if (recentMeals.length > 0) {
      const avgMealsPerDay = recentMeals.length / 7 // Assuming last week
      insights.push(`📊 You're averaging ${avgMealsPerDay.toFixed(1)} meals per day, which is ${avgMealsPerDay >= 3 ? 'good' : 'consider adding more frequent, smaller meals'}`)
    }
    
    // Analyze output patterns
    if (recentOutputs.length > 0) {
      const recentOutputCount = recentOutputs.length
      insights.push(`💧 You've recorded ${recentOutputCount} stoma outputs recently. Regular monitoring helps identify patterns.`)
    }
    
    if (insights.length === 0) {
      insights.push("📈 Start logging more data to help me identify helpful patterns and provide better personalized recommendations!")
    }
    
    return insights
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageIcon = (metadata?: ChatMessage['metadata']) => {
    if (!metadata?.analysisType) return <SparklesIcon className="h-4 w-4" />
    
    switch (metadata.analysisType) {
      case 'symptom': return <ExclamationCircleIcon className="h-4 w-4" />
      case 'meal': return <HeartIcon className="h-4 w-4" />
      case 'pattern': return <ChartBarIcon className="h-4 w-4" />
      default: return <LightBulbIcon className="h-4 w-4" />
    }
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400'
    if (confidence >= 0.8) return 'text-green-500'
    if (confidence >= 0.6) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="flex flex-col h-96 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-100">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-6 w-6 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Smart Assistant</h3>
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Powered by Gemini AI</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/80 text-gray-800 border border-white/50'
              }`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="text-purple-600">
                      {getMessageIcon(message.metadata)}
                    </div>
                    {message.metadata?.confidence && (
                      <div className={`text-xs ${getConfidenceColor(message.metadata.confidence)}`}>
                        {Math.round(message.metadata.confidence * 100)}% confidence
                      </div>
                    )}
                  </div>
                )}
                <div className="text-sm whitespace-pre-line">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/80 text-gray-800 px-4 py-2 rounded-lg border border-white/50">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm">Analyzing with Gemini AI...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-purple-100">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about symptoms, foods, or patterns..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

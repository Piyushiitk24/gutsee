'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  CameraIcon, 
  MicrophoneIcon, 
  QrCodeIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface MultiModalLoggingProps {
  onMealLogged: (meal: any) => void
  onClose: () => void
}

interface FoodRecognition {
  name: string
  confidence: number
  calories: number
  servingSize: string
  ingredients: string[]
  riskLevel: 'low' | 'medium' | 'high'
  tags: string[]
}

interface VoiceTranscription {
  text: string
  confidence: number
  parsedFood: {
    name: string
    quantity: string
    time: string
    notes: string
  }
}

export function MultiModalLogging({ onMealLogged, onClose }: MultiModalLoggingProps) {
  const [activeMode, setActiveMode] = useState<'photo' | 'voice' | 'barcode' | 'ingredient'>('photo')
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recognizedFood, setRecognizedFood] = useState<FoodRecognition | null>(null)
  const [voiceTranscription, setVoiceTranscription] = useState<VoiceTranscription | null>(null)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [ingredientBreakdown, setIngredientBreakdown] = useState<string[]>([])
  const [customIngredient, setCustomIngredient] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0)
      
      const imageData = canvas.toDataURL('image/jpeg')
      setCapturedImage(imageData)
      analyzeFoodImage(imageData)
    }
  }

  // Analyze food image (simulated AI)
  const analyzeFoodImage = async (imageData: string) => {
    setIsProcessing(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulated food recognition results
    const mockResults: FoodRecognition = {
      name: 'Grilled Chicken with Rice',
      confidence: 0.89,
      calories: 420,
      servingSize: '1 cup rice + 150g chicken',
      ingredients: ['white rice', 'chicken breast', 'olive oil', 'salt', 'pepper'],
      riskLevel: 'low',
      tags: ['protein', 'carbs', 'low-fiber']
    }
    
    setRecognizedFood(mockResults)
    setIsProcessing(false)
  }

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const audioChunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        transcribeAudio(audioBlob)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Transcribe audio (simulated)
  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    
    // Simulate transcription delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulated transcription results
    const mockTranscription: VoiceTranscription = {
      text: "I had a bowl of rice with grilled chicken for lunch around 12:30 PM. It was about a cup of rice and a small piece of chicken. I felt good after eating it.",
      confidence: 0.92,
      parsedFood: {
        name: 'Rice with Grilled Chicken',
        quantity: '1 cup rice + small chicken piece',
        time: '12:30 PM',
        notes: 'Felt good after eating'
      }
    }
    
    setVoiceTranscription(mockTranscription)
    setIsProcessing(false)
  }

  // Scan barcode (simulated)
  const scanBarcode = async () => {
    setIsProcessing(true)
    
    // Simulate barcode scanning
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockBarcode = '012345678901'
    setScannedBarcode(mockBarcode)
    
    // Simulate product lookup
    const mockProduct = {
      name: 'Organic Brown Rice',
      brand: 'Nature\'s Best',
      servingSize: '1/4 cup dry',
      calories: 170,
      ingredients: ['organic brown rice'],
      riskLevel: 'low' as const
    }
    
    setRecognizedFood({
      ...mockProduct,
      confidence: 0.95,
      tags: ['organic', 'whole-grain', 'low-risk']
    })
    
    setIsProcessing(false)
  }

  // Break down ingredients
  const analyzeIngredients = () => {
    const ingredients = ingredientBreakdown.join(', ')
    // Simulate ingredient analysis
    const mockAnalysis = {
      name: `Mixed Meal (${ingredientBreakdown.length} ingredients)`,
      confidence: 0.95,
      calories: ingredientBreakdown.length * 50, // Rough estimate
      servingSize: '1 portion',
      ingredients: ingredientBreakdown,
      riskLevel: ingredientBreakdown.some(ing => 
        ing.toLowerCase().includes('fiber') || 
        ing.toLowerCase().includes('bean') ||
        ing.toLowerCase().includes('spicy')
      ) ? 'medium' as const : 'low' as const,
      tags: ['custom', 'mixed']
    }
    
    setRecognizedFood(mockAnalysis)
  }

  // Add custom ingredient
  const addIngredient = () => {
    if (customIngredient.trim() && !ingredientBreakdown.includes(customIngredient.trim())) {
      setIngredientBreakdown([...ingredientBreakdown, customIngredient.trim()])
      setCustomIngredient('')
    }
  }

  // Remove ingredient
  const removeIngredient = (index: number) => {
    setIngredientBreakdown(ingredientBreakdown.filter((_, i) => i !== index))
  }

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get risk level color
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-300'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300'
      case 'high': return 'bg-red-500/20 text-red-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  // Handle meal logging
  const handleLogMeal = () => {
    const mealData = {
      method: activeMode,
      ...(recognizedFood && { food: recognizedFood }),
      ...(voiceTranscription && { transcription: voiceTranscription }),
      ...(scannedBarcode && { barcode: scannedBarcode }),
      timestamp: new Date(),
      confidence: recognizedFood?.confidence || voiceTranscription?.confidence || 0
    }
    
    onMealLogged(mealData)
    onClose()
  }

  useEffect(() => {
    if (activeMode === 'photo') {
      initializeCamera()
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [activeMode])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Multi-Modal Food Logging</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'photo', label: 'Photo Recognition', icon: CameraIcon },
            { id: 'voice', label: 'Voice Logging', icon: MicrophoneIcon },
            { id: 'barcode', label: 'Barcode Scan', icon: QrCodeIcon },
            { id: 'ingredient', label: 'Ingredient Breakdown', icon: SparklesIcon }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeMode === mode.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <mode.icon className="h-4 w-4" />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {activeMode === 'photo' && (
              <div className="space-y-4">
                <div className="relative bg-black/20 rounded-2xl overflow-hidden aspect-video">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="flex space-x-2">
                  {!capturedImage ? (
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      <CameraIcon className="h-5 w-5 mr-2 inline" />
                      Capture Photo
                    </button>
                  ) : (
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="flex-1 bg-white/10 text-white/80 py-3 px-4 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200"
                    >
                      Retake Photo
                    </button>
                  )}
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/10 text-white/80 py-3 px-4 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => {
                        const imageData = e.target?.result as string
                        setCapturedImage(imageData)
                        analyzeFoodImage(imageData)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            )}

            {activeMode === 'voice' && (
              <div className="space-y-4">
                <div className="bg-black/20 rounded-2xl p-8 text-center">
                  <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isRecording ? 'bg-red-500/20 animate-pulse' : 'bg-white/10'
                  }`}>
                    <MicrophoneIcon className={`h-12 w-12 ${
                      isRecording ? 'text-red-400' : 'text-white/60'
                    }`} />
                  </div>
                  
                  {isRecording ? (
                    <div className="text-white">
                      <div className="text-2xl font-bold mb-2">{formatTime(recordingTime)}</div>
                      <div className="text-white/80">Recording...</div>
                    </div>
                  ) : (
                    <div className="text-white/80">
                      Tap to start recording your meal description
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      <MicrophoneIcon className="h-5 w-5 mr-2 inline" />
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-red-600 transition-all duration-200"
                    >
                      <StopIcon className="h-5 w-5 mr-2 inline" />
                      Stop Recording
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeMode === 'barcode' && (
              <div className="space-y-4">
                <div className="bg-black/20 rounded-2xl p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                    <QrCodeIcon className="h-12 w-12 text-white/60" />
                  </div>
                  <div className="text-white/80 mb-4">
                    Scan product barcode for instant nutrition info
                  </div>
                  {scannedBarcode && (
                    <div className="text-white text-sm">
                      Scanned: {scannedBarcode}
                    </div>
                  )}
                </div>

                <button
                  onClick={scanBarcode}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  <QrCodeIcon className="h-5 w-5 mr-2 inline" />
                  Scan Barcode
                </button>
              </div>
            )}

            {activeMode === 'ingredient' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm">Add Ingredients</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customIngredient}
                      onChange={(e) => setCustomIngredient(e.target.value)}
                      placeholder="e.g., white rice, chicken breast..."
                      className="flex-1 px-4 py-2 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                    />
                    <button
                      onClick={addIngredient}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm">Ingredients ({ingredientBreakdown.length})</label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {ingredientBreakdown.map((ingredient, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 p-2 rounded-lg">
                        <span className="text-white text-sm">{ingredient}</span>
                        <button
                          onClick={() => removeIngredient(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {ingredientBreakdown.length > 0 && (
                  <button
                    onClick={analyzeIngredients}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2 inline" />
                    Analyze Ingredients
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {isProcessing && (
              <div className="bg-white/10 rounded-2xl p-6 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="text-white/80">Processing...</div>
              </div>
            )}

            {recognizedFood && (
              <div className="bg-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">{recognizedFood.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${getRiskColor(recognizedFood.riskLevel)}`}>
                    {recognizedFood.riskLevel} risk
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Confidence:</span>
                    <span className="text-white ml-2">{Math.round(recognizedFood.confidence * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-white/60">Calories:</span>
                    <span className="text-white ml-2">{recognizedFood.calories}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-white/60">Serving:</span>
                    <span className="text-white ml-2">{recognizedFood.servingSize}</span>
                  </div>
                </div>

                <div>
                  <span className="text-white/60 text-sm">Ingredients:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recognizedFood.ingredients.map((ingredient, index) => (
                      <span key={index} className="px-2 py-1 bg-white/10 text-white text-xs rounded-lg">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-white/60 text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recognizedFood.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {voiceTranscription && (
              <div className="bg-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Voice Transcription</h3>
                  <span className="text-white/60 text-sm">
                    {Math.round(voiceTranscription.confidence * 100)}% confidence
                  </span>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/80 text-sm italic">"{voiceTranscription.text}"</p>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-white/60">Parsed Food:</span>
                    <span className="text-white ml-2">{voiceTranscription.parsedFood.name}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Quantity:</span>
                    <span className="text-white ml-2">{voiceTranscription.parsedFood.quantity}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Time:</span>
                    <span className="text-white ml-2">{voiceTranscription.parsedFood.time}</span>
                  </div>
                  {voiceTranscription.parsedFood.notes && (
                    <div>
                      <span className="text-white/60">Notes:</span>
                      <span className="text-white ml-2">{voiceTranscription.parsedFood.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(recognizedFood || voiceTranscription) && (
              <div className="flex space-x-2">
                <button
                  onClick={handleLogMeal}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2 inline" />
                  Log Meal
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/10 text-white/80 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

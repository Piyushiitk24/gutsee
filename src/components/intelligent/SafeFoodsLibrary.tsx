'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  ClockIcon,
  FunnelIcon,
  StarIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface SafeFood {
  id: string
  name: string
  category: 'protein' | 'carbs' | 'vegetable' | 'fruit' | 'dairy' | 'snack' | 'beverage'
  riskLevel: 'very-low' | 'low' | 'medium'
  successRate: number // 0-100%
  timesEaten: number
  lastEaten?: Date
  avgDigestionTime: number // hours
  calories: number
  servingSize: string
  preparation: string[]
  benefits: string[]
  cautions: string[]
  bestTimes: string[]
  tags: string[]
  personalNotes?: string
  isFavorite: boolean
}

interface SafeFoodsLibraryProps {
  userHistory: any[]
  onFoodSelect: (food: SafeFood) => void
  onAddToMeal: (food: SafeFood) => void
}

export function SafeFoodsLibrary({ userHistory, onFoodSelect, onAddToMeal }: SafeFoodsLibraryProps) {
  const [foods, setFoods] = useState<SafeFood[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'success-rate' | 'last-eaten' | 'times-eaten'>('success-rate')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedFood, setSelectedFood] = useState<SafeFood | null>(null)

  // Sample safe foods data
  useEffect(() => {
    const sampleFoods: SafeFood[] = [
      {
        id: '1',
        name: 'White Rice',
        category: 'carbs',
        riskLevel: 'very-low',
        successRate: 95,
        timesEaten: 67,
        lastEaten: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        avgDigestionTime: 3,
        calories: 205,
        servingSize: '1 cup cooked',
        preparation: ['boiled', 'steamed', 'rice cooker'],
        benefits: ['Easy to digest', 'Low fiber', 'Gentle on stomach', 'Quick energy'],
        cautions: ['Monitor portion size'],
        bestTimes: ['lunch', 'dinner'],
        tags: ['staple', 'mild', 'filling'],
        isFavorite: true
      },
      {
        id: '2',
        name: 'Grilled Chicken Breast',
        category: 'protein',
        riskLevel: 'very-low',
        successRate: 92,
        timesEaten: 45,
        lastEaten: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        avgDigestionTime: 4,
        calories: 165,
        servingSize: '3 oz',
        preparation: ['grilled', 'baked', 'poached'],
        benefits: ['High protein', 'Low fat', 'Well-tolerated', 'Satisfying'],
        cautions: ['Avoid overcooking', 'Remove skin'],
        bestTimes: ['lunch', 'dinner'],
        tags: ['protein', 'lean', 'safe'],
        isFavorite: true
      },
      {
        id: '3',
        name: 'Bananas',
        category: 'fruit',
        riskLevel: 'very-low',
        successRate: 88,
        timesEaten: 32,
        lastEaten: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        avgDigestionTime: 2,
        calories: 105,
        servingSize: '1 medium',
        preparation: ['fresh', 'mashed'],
        benefits: ['Potassium rich', 'Natural sugars', 'Soft texture', 'Quick energy'],
        cautions: ['Very ripe may cause gas'],
        bestTimes: ['breakfast', 'snack'],
        tags: ['sweet', 'soft', 'potassium'],
        isFavorite: false
      },
      {
        id: '4',
        name: 'White Bread Toast',
        category: 'carbs',
        riskLevel: 'low',
        successRate: 85,
        timesEaten: 28,
        lastEaten: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        avgDigestionTime: 2,
        calories: 80,
        servingSize: '1 slice',
        preparation: ['toasted light', 'toasted medium'],
        benefits: ['Quick digestion', 'Comfortable', 'Versatile'],
        cautions: ['Avoid heavy toppings'],
        bestTimes: ['breakfast', 'snack'],
        tags: ['simple', 'quick'],
        isFavorite: false
      },
      {
        id: '5',
        name: 'Scrambled Eggs',
        category: 'protein',
        riskLevel: 'low',
        successRate: 82,
        timesEaten: 24,
        lastEaten: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        avgDigestionTime: 3,
        calories: 155,
        servingSize: '2 large eggs',
        preparation: ['scrambled soft', 'poached'],
        benefits: ['Complete protein', 'Nutrients', 'Satisfying'],
        cautions: ['Cook thoroughly', 'Use minimal oil'],
        bestTimes: ['breakfast', 'lunch'],
        tags: ['protein', 'breakfast', 'nutrients'],
        isFavorite: true
      },
      {
        id: '6',
        name: 'Steamed Carrots',
        category: 'vegetable',
        riskLevel: 'low',
        successRate: 78,
        timesEaten: 19,
        lastEaten: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        avgDigestionTime: 3,
        calories: 25,
        servingSize: '1/2 cup',
        preparation: ['steamed', 'boiled soft'],
        benefits: ['Beta carotene', 'Soft when cooked', 'Low calorie'],
        cautions: ['Cook until very soft'],
        bestTimes: ['lunch', 'dinner'],
        tags: ['vegetable', 'vitamin-a', 'colorful'],
        isFavorite: false
      },
      {
        id: '7',
        name: 'Plain Crackers',
        category: 'snack',
        riskLevel: 'very-low',
        successRate: 90,
        timesEaten: 41,
        lastEaten: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        avgDigestionTime: 1,
        calories: 60,
        servingSize: '6 crackers',
        preparation: ['plain', 'with minimal toppings'],
        benefits: ['Quick snack', 'Settles stomach', 'Portable'],
        cautions: ['Check salt content'],
        bestTimes: ['snack', 'between meals'],
        tags: ['snack', 'portable', 'mild'],
        isFavorite: true
      },
      {
        id: '8',
        name: 'Herbal Tea',
        category: 'beverage',
        riskLevel: 'very-low',
        successRate: 96,
        timesEaten: 89,
        lastEaten: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        avgDigestionTime: 0.5,
        calories: 0,
        servingSize: '1 cup',
        preparation: ['hot', 'warm', 'room temperature'],
        benefits: ['Hydrating', 'Soothing', 'No calories', 'Relaxing'],
        cautions: ['Avoid caffeine varieties late'],
        bestTimes: ['anytime', 'between meals'],
        tags: ['hydration', 'soothing', 'zero-calorie'],
        isFavorite: true
      }
    ]
    setFoods(sampleFoods)
  }, [])

  const categories = [
    { id: 'all', label: 'All Foods', icon: '🍽️' },
    { id: 'protein', label: 'Protein', icon: '🥩' },
    { id: 'carbs', label: 'Carbs', icon: '🍚' },
    { id: 'vegetable', label: 'Vegetables', icon: '🥕' },
    { id: 'fruit', label: 'Fruits', icon: '🍌' },
    { id: 'dairy', label: 'Dairy', icon: '🥛' },
    { id: 'snack', label: 'Snacks', icon: '🍪' },
    { id: 'beverage', label: 'Beverages', icon: '☕' }
  ]

  const filteredFoods = foods
    .filter(food => {
      const matchesSearch = searchTerm === '' || 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory
      const matchesFavorites = !showFavoritesOnly || food.isFavorite
      return matchesSearch && matchesCategory && matchesFavorites
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'success-rate': return b.successRate - a.successRate
        case 'last-eaten': return (b.lastEaten?.getTime() || 0) - (a.lastEaten?.getTime() || 0)
        case 'times-eaten': return b.timesEaten - a.timesEaten
        default: return 0
      }
    })

  const toggleFavorite = (foodId: string) => {
    setFoods(foods.map(food => 
      food.id === foodId ? { ...food, isFavorite: !food.isFavorite } : food
    ))
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-low': return 'bg-green-500/20 text-green-300'
      case 'low': return 'bg-blue-500/20 text-blue-300'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-low': return CheckCircleIcon
      case 'low': return InformationCircleIcon
      case 'medium': return ExclamationTriangleIcon
      default: return InformationCircleIcon
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category)
    return categoryData?.icon || '🍽️'
  }

  const formatLastEaten = (date: Date | undefined) => {
    if (!date) return 'Never'
    const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <HeartIcon className="h-6 w-6 text-green-400" />
          <h3 className="text-2xl font-bold text-white">Safe Foods Library</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm">{filteredFoods.length} foods</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-white/60 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 text-white rounded-xl px-4 py-3 border border-white/20 focus:border-purple-400 focus:outline-none"
          >
            <option value="success-rate">Success Rate</option>
            <option value="name">Name</option>
            <option value="last-eaten">Last Eaten</option>
            <option value="times-eaten">Times Eaten</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              showFavoritesOnly
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <StarIcon className="h-4 w-4" />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map(food => {
          const RiskIcon = getRiskIcon(food.riskLevel)
          
          return (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedFood(food)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getCategoryIcon(food.category)}</span>
                  <div className="flex items-center space-x-1">
                    <RiskIcon className="h-4 w-4 text-green-400" />
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(food.riskLevel)}`}>
                      {food.successRate}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(food.id)
                  }}
                  className={`transition-colors ${
                    food.isFavorite ? 'text-pink-400' : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <StarIcon className={`h-5 w-5 ${food.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h4 className="font-semibold text-white mb-2">{food.name}</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-white/60 mb-3">
                <div>
                  <span>Eaten: {food.timesEaten}x</span>
                </div>
                <div>
                  <span>Last: {formatLastEaten(food.lastEaten)}</span>
                </div>
                <div>
                  <span>Calories: {food.calories}</span>
                </div>
                <div>
                  <span>Digests: {food.avgDigestionTime}h</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {food.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-lg">
                    {tag}
                  </span>
                ))}
                {food.tags.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-lg">
                    +{food.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToMeal(food)
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs py-2 px-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  <PlusIcon className="h-3 w-3 mr-1 inline" />
                  Add to Meal
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFoodSelect(food)
                  }}
                  className="bg-white/10 text-white/80 text-xs py-2 px-3 rounded-lg hover:bg-white/20 transition-all duration-200"
                >
                  Details
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12 text-white/60">
          <HeartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No foods found matching your criteria</p>
        </div>
      )}

      {/* Food Details Modal */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedFood(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(selectedFood.category)}</span>
                  <h3 className="text-2xl font-bold text-white">{selectedFood.name}</h3>
                  <button
                    onClick={() => toggleFavorite(selectedFood.id)}
                    className={`transition-colors ${
                      selectedFood.isFavorite ? 'text-pink-400' : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    <StarIcon className={`h-6 w-6 ${selectedFood.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3">Success Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Success Rate:</span>
                        <span className="text-green-400 font-semibold">{selectedFood.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Times Eaten:</span>
                        <span className="text-white">{selectedFood.timesEaten}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Last Eaten:</span>
                        <span className="text-white">{formatLastEaten(selectedFood.lastEaten)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Avg. Digestion:</span>
                        <span className="text-white">{selectedFood.avgDigestionTime}h</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3">Nutrition</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Calories:</span>
                        <span className="text-white">{selectedFood.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Serving Size:</span>
                        <span className="text-white">{selectedFood.servingSize}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Benefits</h4>
                    <div className="space-y-1">
                      {selectedFood.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircleIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-white/80">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedFood.cautions.length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Cautions</h4>
                      <div className="space-y-1">
                        {selectedFood.cautions.map((caution, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                            <span className="text-white/80">{caution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-white font-semibold mb-2">Best Times</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedFood.bestTimes.map(time => (
                        <span key={time} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Preparation</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedFood.preparation.map(prep => (
                        <span key={prep} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
                          {prep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onAddToMeal(selectedFood)
                    setSelectedFood(null)
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  <PlusIcon className="h-4 w-4 mr-2 inline" />
                  Add to Meal
                </button>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="px-6 py-3 bg-white/10 text-white/80 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200"
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

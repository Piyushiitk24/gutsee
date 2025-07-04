'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon, 
  StarIcon, 
  PlusIcon,
  CheckIcon,
  BoltIcon,
  HeartIcon,
  SparklesIcon,
  ChevronRightIcon,
  PhotoIcon,
  MicrophoneIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface SmartMealTemplate {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  frequency: number;
  lastEaten: Date | null;
  riskScore: 'low' | 'medium' | 'high';
  successRate: number;
  avgOutputDelay: number; // hours
  compatibleWith: string[]; // other foods that work well with this
  tags: string[]; // 'quick', 'safe', 'filling', etc.
  timeOfDayOptimal: number[]; // hours when this meal works best
}

interface IntelligentMealLoggerProps {
  currentTime: Date;
  userPatterns: any;
  recentMeals: any[];
  templates: SmartMealTemplate[];
  onLogMeal: (meal: any) => void;
  onCreateTemplate: (meal: any) => void;
}

export function IntelligentMealLogger({ 
  currentTime, 
  userPatterns, 
  recentMeals, 
  templates, 
  onLogMeal, 
  onCreateTemplate 
}: IntelligentMealLoggerProps) {
  const [activeMode, setActiveMode] = useState<'smart-suggestions' | 'quick-templates' | 'multi-modal' | 'manual'>('smart-suggestions');
  const [selectedTemplate, setSelectedTemplate] = useState<SmartMealTemplate | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const suggestions = generateSmartSuggestions(currentTime, userPatterns, recentMeals, templates);
    setSmartSuggestions(suggestions);
  }, [currentTime, userPatterns, recentMeals, templates]);

  const generateSmartSuggestions = (time: Date, patterns: any, recent: any[], templates: SmartMealTemplate[]) => {
    const hour = time.getHours();
    const dayOfWeek = time.getDay();
    const suggestions = [];

    // Determine current meal type
    const currentMealType = getCurrentMealType(hour);
    
    // 1. TIME-BASED SUGGESTIONS
    const timeAppropriateTemplates = templates.filter(t => 
      t.category === currentMealType && 
      t.timeOfDayOptimal.includes(hour)
    );

    // 2. PATTERN-BASED SUGGESTIONS
    const patternMatches = timeAppropriateTemplates.filter(t => {
      // Check if user typically eats this at this time
      const dayPattern = patterns.mealPatterns?.[dayOfWeek];
      return dayPattern?.includes(t.id);
    });

    // 3. SAFETY-FIRST SUGGESTIONS
    const safeMeals = timeAppropriateTemplates
      .filter(t => t.riskScore === 'low' && t.successRate > 85)
      .sort((a, b) => b.successRate - a.successRate);

    // 4. QUICK REPEAT SUGGESTIONS
    const quickRepeats = recent
      .filter(meal => meal.wasSuccessful && meal.category === currentMealType)
      .slice(0, 2);

    // 5. PREDICTIVE SUGGESTIONS
    const nextMealPrediction = predictOptimalMeal(patterns, hour, recent);

    // Build suggestion list
    if (patternMatches.length > 0) {
      suggestions.push({
        type: 'pattern',
        title: 'Your usual choice',
        subtitle: `You typically have this for ${currentMealType}`,
        meals: patternMatches.slice(0, 2),
        confidence: 'high',
        icon: StarIcon,
        gradient: 'from-purple-400 to-pink-500'
      });
    }

    if (nextMealPrediction) {
      suggestions.push({
        type: 'prediction',
        title: 'Optimized for you',
        subtitle: nextMealPrediction.reasoning,
        meals: [nextMealPrediction.meal],
        confidence: nextMealPrediction.confidence,
        icon: BoltIcon,
        gradient: 'from-blue-400 to-cyan-500'
      });
    }

    if (safeMeals.length > 0) {
      suggestions.push({
        type: 'safe',
        title: 'Safe choices',
        subtitle: `${safeMeals[0].successRate}% success rate`,
        meals: safeMeals.slice(0, 3),
        confidence: 'high',
        icon: ShieldCheckIcon,
        gradient: 'from-green-400 to-emerald-500'
      });
    }

    if (quickRepeats.length > 0) {
      suggestions.push({
        type: 'repeat',
        title: 'Quick repeat',
        subtitle: 'Recently successful meals',
        meals: quickRepeats,
        confidence: 'medium',
        icon: CheckIcon,
        gradient: 'from-amber-400 to-orange-500'
      });
    }

    return suggestions;
  };

  const getCurrentMealType = (hour: number): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    if (hour < 11) return 'breakfast';
    if (hour < 14) return 'lunch';
    if (hour < 17) return 'snack';
    return 'dinner';
  };

  const predictOptimalMeal = (patterns: any, hour: number, recent: any[]) => {
    // AI-powered meal prediction (mock implementation)
    const timeFactors = {
      irrigation: patterns.hoursSinceIrrigation,
      stress: patterns.currentStressLevel,
      sleep: patterns.lastNightSleep,
      activity: patterns.todayActivity
    };

    // Example prediction logic
    if (timeFactors.irrigation > 16 && timeFactors.stress < 5) {
      return {
        meal: {
          name: 'Power Bowl',
          description: 'Rice, chicken, light vegetables',
          riskScore: 'low',
          reasoning: 'Long output-free period + low stress = safe to try more variety'
        },
        confidence: 'high',
        reasoning: 'Perfect timing for a more substantial meal'
      };
    }

    if (timeFactors.stress > 7) {
      return {
        meal: {
          name: 'Comfort Rice',
          description: 'Simple white rice with salt',
          riskScore: 'low',
          reasoning: 'High stress detected - stick to the safest option'
        },
        confidence: 'high',
        reasoning: 'Stress levels suggest keeping it simple'
      };
    }

    return null;
  };

  const handleQuickLog = (template: SmartMealTemplate) => {
    const mealData = {
      ...template,
      timestamp: currentTime,
      loggedVia: 'one-touch',
      confidence: 'high'
    };
    
    onLogMeal(mealData);
    
    // Show success feedback
    setSelectedTemplate(template);
    setTimeout(() => setSelectedTemplate(null), 2000);
  };

  const handleVoiceLog = () => {
    setIsVoiceMode(true);
    // Mock voice recognition
    setTimeout(() => {
      setIsVoiceMode(false);
      // Process: "I had chicken and rice for lunch"
      onLogMeal({
        name: 'Chicken and Rice',
        ingredients: ['chicken breast', 'white rice'],
        category: getCurrentMealType(currentTime.getHours()),
        timestamp: currentTime,
        loggedVia: 'voice',
        confidence: 'medium'
      });
    }, 3000);
  };

  const handlePhotoLog = () => {
    // Mock photo analysis
    const mockAnalysis = {
      detectedFoods: ['rice', 'chicken', 'broccoli'],
      confidence: 0.85,
      nutritionalInfo: {
        carbs: 'medium',
        protein: 'high',
        fiber: 'low'
      }
    };

    onLogMeal({
      name: 'Photo Meal',
      ingredients: mockAnalysis.detectedFoods,
      category: getCurrentMealType(currentTime.getHours()),
      timestamp: currentTime,
      loggedVia: 'photo',
      confidence: 'medium',
      analysis: mockAnalysis
    });
  };

  const getRiskColor = (riskScore: string) => {
    switch (riskScore) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Smart Meal Logger</h2>
            <p className="text-sm text-white/70">AI-powered suggestions for {getCurrentMealType(currentTime.getHours())}</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-white/10 rounded-lg p-1">
          {['smart-suggestions', 'multi-modal'].map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode as any)}
              className={`px-3 py-1 text-xs rounded transition-all ${
                activeMode === mode
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {mode === 'smart-suggestions' ? 'Smart' : 'Multi'}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Suggestions Mode */}
      {activeMode === 'smart-suggestions' && (
        <div className="space-y-4">
          {smartSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <suggestion.icon className="h-4 w-4 text-white/80" />
                <h3 className="font-medium text-white">{suggestion.title}</h3>
                <span className="text-xs text-white/60">• {suggestion.subtitle}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  suggestion.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                  suggestion.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {suggestion.confidence}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestion.meals.map((meal: any, mealIndex: number) => (
                  <motion.button
                    key={meal.id || mealIndex}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickLog(meal)}
                    className={`p-4 bg-gradient-to-r ${suggestion.gradient} bg-opacity-20 backdrop-blur-sm border border-white/20 rounded-xl text-left transition-all hover:border-white/30 group`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white group-hover:scale-105 transition-transform">
                        {meal.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        {meal.riskScore && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(meal.riskScore)}`}>
                            {meal.riskScore}
                          </span>
                        )}
                        <ChevronRightIcon className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <p className="text-sm text-white/80 mb-2">{meal.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>Used {meal.frequency || 'recently'} times</span>
                      {meal.successRate && <span>{meal.successRate}% success</span>}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Multi-Modal Mode */}
      {activeMode === 'multi-modal' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceLog}
            disabled={isVoiceMode}
            className={`p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-center transition-all ${
              isVoiceMode ? 'animate-pulse' : 'hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            <MicrophoneIcon className="h-8 w-8 text-white mx-auto mb-2" />
            <h3 className="font-medium text-white mb-1">Voice Log</h3>
            <p className="text-sm text-white/80">
              {isVoiceMode ? 'Listening...' : 'Say what you ate'}
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePhotoLog}
            className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-center hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            <PhotoIcon className="h-8 w-8 text-white mx-auto mb-2" />
            <h3 className="font-medium text-white mb-1">Photo Log</h3>
            <p className="text-sm text-white/80">Snap your meal</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveMode('manual')}
            className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-center hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <PlusIcon className="h-8 w-8 text-white mx-auto mb-2" />
            <h3 className="font-medium text-white mb-1">Manual Log</h3>
            <p className="text-sm text-white/80">Type it out</p>
          </motion.button>
        </div>
      )}

      {/* Success Feedback */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-center text-white shadow-2xl">
              <CheckIcon className="h-12 w-12 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-1">Logged Successfully!</h3>
              <p className="text-white/90">{selectedTemplate.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

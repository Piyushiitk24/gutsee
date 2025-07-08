'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon, 
  BoltIcon, 
  HeartIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  ChevronRightIcon,
  XMarkIcon,
  StarIcon,
  ChartBarIcon, // Using instead of TrendingUpIcon
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface SmartPrompt {
  id: string;
  type: 'action' | 'insight' | 'suggestion' | 'celebration' | 'alert';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  context: string;
  icon: React.ElementType;
  gradient: string;
  action: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

interface SmartPromptSystemProps {
  currentTime: Date;
  userPatterns: any;
  dashboardStats: any;
  onPromptAction: (action: string, data?: any) => void;
}

export function SmartPromptSystem({ 
  currentTime, 
  userPatterns, 
  dashboardStats, 
  onPromptAction 
}: SmartPromptSystemProps) {
  const [activePrompts, setActivePrompts] = useState<SmartPrompt[]>([]);
  const [dismissedPrompts, setDismissedPrompts] = useState<string[]>([]);

  useEffect(() => {
    const prompts = generateIntelligentPrompts(currentTime, userPatterns, dashboardStats);
    const filteredPrompts = prompts.filter(prompt => !dismissedPrompts.includes(prompt.id));
    setActivePrompts(filteredPrompts);
  }, [currentTime, userPatterns, dashboardStats, dismissedPrompts]);

  const generateIntelligentPrompts = (time: Date, patterns: any, stats: any): SmartPrompt[] => {
    const prompts: SmartPrompt[] = [];
    const hour = time.getHours();
    const dayOfWeek = time.getDay();
    const timeKey = `${hour}:${Math.floor(time.getMinutes() / 15) * 15}`;

    // 1. TIME-BASED CONTEXTUAL PROMPTS
    
    // Morning routine optimization
    if (hour >= 6 && hour < 10) {
      if (!stats.todayIrrigationLogged && patterns.usualIrrigationTime) {
        const timeDiff = Math.abs(hour - patterns.usualIrrigationTime);
        if (timeDiff <= 1) {
          prompts.push({
            id: 'irrigation-time',
            type: 'action',
            priority: 'high',
            title: 'Perfect irrigation timing! 🌅',
            message: `Based on your pattern, this is your optimal irrigation time`,
            context: `You usually irrigate at ${patterns.usualIrrigationTime}:00`,
            icon: CheckCircleIcon,
            gradient: 'from-blue-400 to-cyan-500',
            action: {
              label: 'Log Irrigation',
              onClick: () => onPromptAction('log-irrigation', { time: 'morning' })
            },
            secondaryAction: {
              label: 'Not yet',
              onClick: () => dismissPrompt('irrigation-time')
            },
            dismissible: true
          });
        }
      }

      // Breakfast suggestion based on patterns
      if (!stats.todayBreakfastLogged && patterns.preferredBreakfastTime) {
        const isBreakfastTime = Math.abs(hour - patterns.preferredBreakfastTime) <= 1;
        if (isBreakfastTime) {
          prompts.push({
            id: 'breakfast-suggestion',
            type: 'suggestion',
            priority: 'medium',
            title: 'Breakfast time!',
            message: `Your usual breakfast is ${patterns.favoriteBreakfast || 'white rice and chicken'}`,
            context: `Success rate: ${patterns.breakfastSuccessRate || 92}%`,
            icon: ClockIcon,
            gradient: 'from-amber-400 to-orange-500',
            action: {
              label: 'Quick Log',
              onClick: () => onPromptAction('log-favorite-breakfast')
            },
            secondaryAction: {
              label: 'Log Different',
              onClick: () => onPromptAction('log-meal', { type: 'breakfast' })
            },
            dismissible: true
          });
        }
      }
    }

    // 2. PATTERN-BASED INSIGHTS
    
    // Streak celebration
    if (stats.currentStreak > 0 && stats.currentStreak % 7 === 0) {
      prompts.push({
        id: 'streak-celebration',
        type: 'celebration',
        priority: 'high',
        title: `🎉 ${stats.currentStreak} day streak!`,
        message: `You're crushing your goals! This is your longest streak yet.`,
        context: `Average: ${stats.avgStreak || 4} days`,
        icon: StarIcon,
        gradient: 'from-purple-400 to-pink-500',
        action: {
          label: 'View Progress',
          onClick: () => onPromptAction('view-streak-details')
        },
        dismissible: true,
        autoHide: true,
        autoHideDelay: 10000
      });
    }

    // 3. PREDICTIVE PROMPTS
    
    // Meal risk assessment
    if (hour >= 11 && hour < 14 && !stats.todayLunchLogged) {
      const riskFactors = calculateMealRisk(patterns, 'lunch');
      if (riskFactors.score > 6) {
        prompts.push({
          id: 'high-risk-meal-warning',
          type: 'alert',
          priority: 'urgent',
          title: 'Meal Risk Alert',
          message: `Your planned lunch has a ${riskFactors.score}/10 risk score`,
          context: `Main concerns: ${riskFactors.factors.join(', ')}`,
          icon: ExclamationTriangleIcon,
          gradient: 'from-red-400 to-orange-500',
          action: {
            label: 'See Safe Options',
            onClick: () => onPromptAction('show-safe-meals', { type: 'lunch' })
          },
          secondaryAction: {
            label: 'Risk it',
            onClick: () => onPromptAction('log-meal', { type: 'lunch', acknowledged: true })
          },
          dismissible: true
        });
      }
    }

    // 4. WELLNESS CHECK-INS
    
    // Afternoon mood check
    if (hour >= 14 && hour < 17 && !stats.todayMoodLogged) {
      prompts.push({
        id: 'afternoon-wellness',
        type: 'suggestion',
        priority: 'low',
        title: 'Quick wellness check',
        message: `How are you feeling? Your energy usually peaks around now.`,
        context: `Average afternoon mood: ${patterns.averageAfternoonMood || 7}/10`,
        icon: HeartIcon,
        gradient: 'from-pink-400 to-rose-500',
        action: {
          label: 'Quick Check',
          onClick: () => onPromptAction('mood-check')
        },
        dismissible: true
      });
    }

    // 5. LEARNING OPPORTUNITIES
    
    // New pattern discovery
    if (patterns.newPatternDetected) {
      prompts.push({
        id: 'pattern-discovery',
        type: 'insight',
        priority: 'medium',
        title: 'New pattern discovered!',
        message: `We noticed ${patterns.newPatternDetected.description}`,
        context: `Confidence: ${patterns.newPatternDetected.confidence}%`,
        icon: LightBulbIcon,
        gradient: 'from-yellow-400 to-orange-500',
        action: {
          label: 'Tell me more',
          onClick: () => onPromptAction('view-pattern', { pattern: patterns.newPatternDetected })
        },
        dismissible: true
      });
    }

    // 6. PERSONALIZED TIPS
    
    // Hydration reminder based on output patterns
    if (stats.hoursSinceLastOutput > 12 && !stats.todayHydrationLogged) {
      prompts.push({
        id: 'hydration-reminder',
        type: 'suggestion',
        priority: 'medium',
        title: 'Staying hydrated? 💧',
        message: `You're doing great with output-free time! Don't forget to hydrate.`,
        context: `${stats.hoursSinceLastOutput} hours output-free`,
        icon: BoltIcon,
        gradient: 'from-blue-400 to-cyan-500',
        action: {
          label: 'Log Water',
          onClick: () => onPromptAction('log-hydration')
        },
        dismissible: true
      });
    }

    // Sort by priority and limit to 3 active prompts
    return prompts
      .sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 3);
  };

  const calculateMealRisk = (patterns: any, mealType: string) => {
    // Mock risk calculation - in real app would use ML/AI
    const riskFactors = [];
    let score = 0;

    if (patterns.recentTriggers?.includes('dairy')) {
      riskFactors.push('dairy sensitivity');
      score += 3;
    }

    if (patterns.stressLevel > 7) {
      riskFactors.push('high stress');
      score += 2;
    }

    if (patterns.sleepQuality < 6) {
      riskFactors.push('poor sleep');
      score += 2;
    }

    return { score, factors: riskFactors };
  };

  const dismissPrompt = (promptId: string) => {
    setDismissedPrompts(prev => [...prev, promptId]);
    setActivePrompts(prev => prev.filter(p => p.id !== promptId));
  };

  const handlePromptAction = (prompt: SmartPrompt) => {
    prompt.action.onClick();
    if (prompt.autoHide) {
      dismissPrompt(prompt.id);
    }
  };

  const getPromptIcon = (type: SmartPrompt['type']) => {
    switch (type) {
      case 'celebration':
        return '🎉';
      case 'alert':
        return '⚠️';
      case 'insight':
        return '💡';
      case 'suggestion':
        return '💭';
      default:
        return '✨';
    }
  };

  const getPromptColor = (priority: SmartPrompt['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500/50 bg-red-500/10';
      case 'high':
        return 'border-orange-500/50 bg-orange-500/10';
      case 'medium':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low':
        return 'border-blue-500/50 bg-blue-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  useEffect(() => {
    // Auto-hide prompts
    activePrompts.forEach(prompt => {
      if (prompt.autoHide && prompt.autoHideDelay) {
        setTimeout(() => {
          dismissPrompt(prompt.id);
        }, prompt.autoHideDelay);
      }
    });
  }, [activePrompts]);

  if (activePrompts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {activePrompts.map((prompt) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 shadow-2xl ${getPromptColor(prompt.priority)}`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`p-2 rounded-lg bg-gradient-to-r ${prompt.gradient} flex-shrink-0`}>
                <prompt.icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm">
                    {getPromptIcon(prompt.type)} {prompt.title}
                  </h3>
                  {prompt.priority === 'urgent' && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-sm mb-1">{prompt.message}</p>
                <p className="text-white/60 text-xs">{prompt.context}</p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handlePromptAction(prompt)}
                    className={`px-4 py-2 bg-gradient-to-r ${prompt.gradient} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1`}
                  >
                    {prompt.action.label}
                    <ChevronRightIcon className="h-3 w-3" />
                  </button>
                  
                  {prompt.secondaryAction && (
                    <button
                      onClick={prompt.secondaryAction.onClick}
                      className="px-3 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {prompt.secondaryAction.label}
                    </button>
                  )}
                </div>
              </div>

              {/* Dismiss button */}
              {prompt.dismissible && (
                <button
                  onClick={() => dismissPrompt(prompt.id)}
                  className="text-white/50 hover:text-white/80 transition-colors flex-shrink-0"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

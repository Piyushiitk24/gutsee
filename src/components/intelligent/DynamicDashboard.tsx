'use client';

import React, { useState, useEffect } from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  ClockIcon, 
  SparklesIcon,
  PlusCircleIcon,
  ChevronRightIcon,
  HeartIcon,
  BoltIcon,
  FaceSmileIcon,
  DropletIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { FloatingActionButton } from './FloatingActionButton';
import { LiveStatusBar } from './LiveStatusBar';
import { ContextualPrompt } from './ContextualPrompt';
import { OneTapMealTemplates } from './OneTapMealTemplates';
import { QuickMoodLogger } from './QuickMoodLogger';
import { AdvancedAnalyticsDashboard } from './AdvancedAnalyticsDashboard';

interface DynamicDashboardProps {
  user: any;
  dashboardStats: any;
}

export function DynamicDashboard({ user, dashboardStats }: DynamicDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastIrrigation, setLastIrrigation] = useState<Date | null>(null);
  const [hoursSinceIrrigation, setHoursSinceIrrigation] = useState(0);
  const [contextualPrompts, setContextualPrompts] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate contextual prompts based on time of day and user patterns
    const prompts = calculateContextualPrompts(currentTime, lastIrrigation, dashboardStats);
    setContextualPrompts(prompts);
  }, [currentTime, lastIrrigation, dashboardStats]);

  const calculateContextualPrompts = (time: Date, lastIrrigation: Date | null, stats: any) => {
    const hour = time.getHours();
    const prompts = [];

    // Morning routine (6-10 AM)
    if (hour >= 6 && hour < 10) {
      if (!stats.todayIrrigationLogged) {
        prompts.push({
          type: 'irrigation',
          priority: 'high',
          title: 'Log Morning Irrigation',
          subtitle: 'How was your irrigation quality today?',
          icon: CheckCircleIcon,
          gradient: 'from-blue-400 to-cyan-500',
          action: 'log-irrigation'
        });
      }
      
      if (!stats.todayBreakfastLogged) {
        prompts.push({
          type: 'meal',
          priority: 'medium',
          title: 'What\'s for breakfast?',
          subtitle: 'Log your morning meal',
          icon: ClockIcon,
          gradient: 'from-amber-400 to-orange-500',
          action: 'log-breakfast'
        });
      }
    }

    // Lunch time (11 AM - 2 PM)
    if (hour >= 11 && hour < 14) {
      if (!stats.todayLunchLogged) {
        prompts.push({
          type: 'meal',
          priority: 'high',
          title: 'What did you have for lunch?',
          subtitle: 'Quick log your midday meal',
          icon: ClockIcon,
          gradient: 'from-green-400 to-emerald-500',
          action: 'log-lunch'
        });
      }
    }

    // Afternoon check-in (2-5 PM)
    if (hour >= 14 && hour < 17) {
      prompts.push({
        type: 'wellness',
        priority: 'low',
        title: 'How are you feeling?',
        subtitle: 'Quick mood & symptom check',
        icon: HeartIcon,
        gradient: 'from-pink-400 to-rose-500',
        action: 'mood-check'
      });
    }

    // Dinner time (5-8 PM)
    if (hour >= 17 && hour < 20) {
      if (!stats.todayDinnerLogged) {
        prompts.push({
          type: 'meal',
          priority: 'high',
          title: 'Dinner time!',
          subtitle: 'Log your evening meal',
          icon: ClockIcon,
          gradient: 'from-purple-400 to-violet-500',
          action: 'log-dinner'
        });
      }
    }

    // Evening reflection (8-11 PM)
    if (hour >= 20 && hour < 23) {
      prompts.push({
        type: 'reflection',
        priority: 'low',
        title: 'How was your day?',
        subtitle: 'Quick daily reflection',
        icon: SparklesIcon,
        gradient: 'from-indigo-400 to-purple-500',
        action: 'daily-reflection'
      });
    }

    return prompts.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const handlePromptAction = (action: string) => {
    switch (action) {
      case 'log-irrigation':
        // Open irrigation modal
        break;
      case 'log-breakfast':
      case 'log-lunch':
      case 'log-dinner':
        // Open meal modal with appropriate meal type
        break;
      case 'mood-check':
        // Open quick mood logger
        break;
      case 'daily-reflection':
        // Open reflection modal
        break;
      default:
        break;
    }
  };

  const handleQuickLog = (type: string) => {
    switch (type) {
      case 'meal':
        // Open meal logger
        break;
      case 'output':
        // Open output logger
        break;
      case 'gas':
        // Open gas logger
        break;
      case 'irrigation':
        // Open irrigation logger
        break;
      case 'photo':
        // Open photo capture
        break;
      case 'voice':
        // Open voice recorder
        break;
      default:
        break;
    }
  };

  const handleMoodLog = async (mood: any) => {
    // Handle mood logging
    console.log('Mood logged:', mood);
  };

  const getCurrentMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    const hour = currentTime.getHours();
    if (hour < 11) return 'breakfast';
    if (hour < 14) return 'lunch';
    if (hour < 17) return 'snack';
    return 'dinner';
  };

  // Convert contextual prompts to the format expected by ContextualPrompt
  const formattedPrompts = contextualPrompts.map(prompt => ({
    id: prompt.action,
    type: prompt.type as 'suggestion' | 'warning' | 'info' | 'insight',
    title: prompt.title,
    message: prompt.subtitle,
    priority: prompt.priority as 'high' | 'medium' | 'low',
    action: {
      label: 'Take Action',
      onClick: () => handlePromptAction(prompt.action)
    }
  }));

  // Sample meal templates (in real app, these would come from props/API)
  const mealTemplates = [
    {
      id: '1',
      name: 'Rice & Chicken',
      description: 'White rice with grilled chicken breast',
      ingredients: ['white rice', 'chicken breast', 'salt', 'pepper'],
      lastEaten: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      frequency: 12,
      riskScore: 'low' as const,
      category: getCurrentMealType()
    },
    {
      id: '2',
      name: 'Banana & Toast',
      description: 'White bread toast with banana',
      ingredients: ['white bread', 'banana', 'butter'],
      lastEaten: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      frequency: 8,
      riskScore: 'low' as const,
      category: getCurrentMealType()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Live Status Bar */}
      <LiveStatusBar 
        lastIrrigation={lastIrrigation}
        hoursSinceIrrigation={hoursSinceIrrigation}
        dailyStats={{
          meals: dashboardStats?.todayMeals || 0,
          outputs: dashboardStats?.todayOutputs || 0,
          gas: dashboardStats?.todayGas || 0,
          irrigations: dashboardStats?.todayIrrigations || 0
        }}
      />

      {/* Contextual Prompts */}
      <ContextualPrompt prompts={formattedPrompts} />

      {/* One-Tap Meal Templates */}
      <OneTapMealTemplates 
        templates={mealTemplates}
        onSelectTemplate={(template: any) => console.log('Selected template:', template)}
        currentMealType={getCurrentMealType()}
      />

      {/* Quick Mood Logger */}
      <QuickMoodLogger onMoodLog={handleMoodLog} />

      {/* Smart Insights Card */}
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-6 w-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Smart Insights</h3>
          </div>
          <button className="text-white/60 hover:text-white transition-colors">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="backdrop-blur-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Pattern Detected</p>
                <p className="text-white/70 text-sm">Rice meals → 85% success rate</p>
              </div>
              <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                <BoltIcon className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Potential Trigger</p>
                <p className="text-white/70 text-sm">Garlic → 60% gas correlation</p>
              </div>
              <div className="w-12 h-12 bg-amber-400/20 rounded-full flex items-center justify-center">
                <FaceSmileIcon className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Dashboard */}
      <AdvancedAnalyticsDashboard 
        userHistory={[]}
        dashboardStats={dashboardStats}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onQuickLog={handleQuickLog} />
    </div>
  );
}

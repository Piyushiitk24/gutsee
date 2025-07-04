'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  BoltIcon, 
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  PlayIcon,
  ChevronRightIcon,
  MicrophoneIcon,
  PhotoIcon,
  PlusCircleIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  BeakerIcon,
  BookOpenIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import { ContextualPrompt } from './ContextualPrompt';
import { OneTapMealTemplates } from './OneTapMealTemplates';
import { FloatingActionButton } from './FloatingActionButton';
import { QuickMoodLogger } from './QuickMoodLogger';
import { LiveStatusBar } from './LiveStatusBar';

interface SmartAssistantInterfaceProps {
  user: any;
  dashboardStats: any;
}

export function SmartAssistantInterface({ user, dashboardStats }: SmartAssistantInterfaceProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [assistantMessages, setAssistantMessages] = useState<any[]>([]);
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [contextualInsights, setContextualInsights] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate contextual insights based on user data
    const insights = generateContextualInsights(currentTime, dashboardStats);
    setContextualInsights(insights);
    
    // Initialize assistant conversation
    const initialMessage = generateWelcomeMessage(currentTime, user);
    setAssistantMessages([initialMessage]);
  }, [currentTime, dashboardStats, user]);

  const generateWelcomeMessage = (time: Date, user: any) => {
    const hour = time.getHours();
    let greeting = '';
    let context = '';

    if (hour < 12) {
      greeting = 'Good morning';
      context = 'Ready to start your day right?';
    } else if (hour < 17) {
      greeting = 'Good afternoon';
      context = 'How\'s your day going?';
    } else {
      greeting = 'Good evening';
      context = 'Winding down for the night?';
    }

    return {
      id: 'welcome',
      type: 'assistant',
      content: `${greeting}, ${user?.name || 'there'}! ${context}`,
      timestamp: time,
      suggestions: [
        { text: 'Log a meal', action: 'log-meal' },
        { text: 'Check my progress', action: 'show-progress' },
        { text: 'How am I doing?', action: 'show-insights' },
        { text: 'Quick mood check', action: 'mood-check' }
      ]
    };
  };

  const generateContextualInsights = (time: Date, stats: any) => {
    const insights = [];
    
    // Pattern recognition insights
    if (stats?.currentStreak > 0) {
      insights.push({
        id: 'streak',
        type: 'success',
        icon: ArrowTrendingUpIcon,
        title: `${stats.currentStreak} day streak! 🎉`,
        description: 'You\'re on a great roll with your irrigation schedule.',
        action: 'view-streak-details',
        priority: 'high'
      });
    }

    // Meal timing insights
    const hour = time.getHours();
    if (hour >= 7 && hour < 10 && !stats?.todayBreakfastLogged) {
      insights.push({
        id: 'breakfast-reminder',
        type: 'gentle-reminder',
        icon: ClockIcon,
        title: 'Breakfast time!',
        description: 'Your usual breakfast time is around now. What are you having?',
        action: 'log-breakfast',
        priority: 'medium'
      });
    }

    // Predictive insights
    if (stats?.avgOutputFreeTime < 20) {
      insights.push({
        id: 'optimization-tip',
        type: 'insight',
        icon: LightBulbIcon,
        title: 'Optimization opportunity',
        description: 'Based on your patterns, eating rice 2 hours earlier might extend your output-free time.',
        action: 'view-optimization',
        priority: 'medium'
      });
    }

    return insights;
  };

  const handleUserInput = (input: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    // Generate AI response (mock for now)
    const aiResponse = generateAIResponse(input);
    
    setAssistantMessages(prev => [...prev, userMessage, aiResponse]);
    setUserInput('');
  };

  const generateAIResponse = (input: string) => {
    // Simple rule-based responses (in real app, would use AI)
    const responses = {
      'log meal': {
        content: 'I\'d be happy to help you log a meal! What did you have?',
        suggestions: [
          { text: 'Breakfast', action: 'log-breakfast' },
          { text: 'Lunch', action: 'log-lunch' },
          { text: 'Dinner', action: 'log-dinner' },
          { text: 'Snack', action: 'log-snack' }
        ]
      },
      'how am i doing': {
        content: 'You\'re doing great! Your streak is at 3 days, and your success rate is 64%. Want to see more details?',
        suggestions: [
          { text: 'Show detailed progress', action: 'show-progress' },
          { text: 'View patterns', action: 'show-patterns' },
          { text: 'Set new goals', action: 'set-goals' }
        ]
      },
      'default': {
        content: 'I\'m here to help! You can ask me about logging meals, checking your progress, or getting personalized insights.',
        suggestions: [
          { text: 'Log something', action: 'show-quick-log' },
          { text: 'Show my stats', action: 'show-stats' },
          { text: 'Health insights', action: 'show-insights' }
        ]
      }
    };

    const response = responses[input.toLowerCase() as keyof typeof responses] || responses['default'];
    
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    };
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Mock voice input - in real app would use Web Speech API
    setTimeout(() => {
      setIsListening(false);
      handleUserInput('How am I doing today?');
    }, 2000);
  };

  const handleSuggestionClick = (action: string) => {
    switch (action) {
      case 'log-meal':
        // Open meal logging interface
        break;
      case 'show-progress':
        // Show progress details
        break;
      case 'show-insights':
        // Show insights modal
        break;
      case 'mood-check':
        // Open mood logger
        break;
      default:
        break;
    }
  };

  const getCurrentMealType = () => {
    const hour = currentTime.getHours();
    if (hour < 11) return 'breakfast';
    if (hour < 14) return 'lunch';
    if (hour < 17) return 'snack';
    return 'dinner';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Live Status Bar */}
      <LiveStatusBar 
        lastIrrigation={new Date(Date.now() - (dashboardStats?.hoursSinceIrrigation || 8) * 60 * 60 * 1000)}
        hoursSinceIrrigation={dashboardStats?.hoursSinceIrrigation || 8}
        dailyStats={{
          meals: dashboardStats?.todayMeals || 0,
          outputs: dashboardStats?.todayOutputs || 0,
          gas: dashboardStats?.todayGasSessions || 0,
          irrigations: dashboardStats?.todayIrrigations || 0
        }}
      />

      {/* Smart Assistant Chat Interface */}
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <SparklesIcon className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Your AI Assistant</h2>
            <p className="text-sm text-white/70">Smart, contextual, and always learning</p>
          </div>
        </div>

        {/* Assistant Messages */}
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {assistantMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion.action)}
                          className="text-xs bg-white/20 hover:bg-white/30 rounded-full px-2 py-1 transition-colors"
                        >
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserInput(userInput)}
              placeholder="Ask me anything about your health..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-full transition-all ${
              isListening 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <MicrophoneIcon className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => handleUserInput(userInput)}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <ChevronRightIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Contextual Insights */}
      {contextualInsights.length > 0 && (
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Smart Insights</h3>
          </div>
          <div className="space-y-3">
            {contextualInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => handleSuggestionClick(insight.action)}
              >
                <div className={`p-2 rounded-lg ${
                  insight.type === 'success' ? 'bg-green-500/20 text-green-400' :
                  insight.type === 'insight' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  <insight.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{insight.title}</h4>
                  <p className="text-sm text-white/70">{insight.description}</p>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-white/50" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* One-Tap Meal Templates */}
        <OneTapMealTemplates
          templates={[
            {
              id: '1',
              name: 'Morning Rice Bowl',
              description: 'Your usual safe breakfast',
              ingredients: ['white rice', 'salt', 'water'],
              category: 'breakfast' as const,
              frequency: 12,
              lastEaten: new Date(Date.now() - 24 * 60 * 60 * 1000),
              riskScore: 'low' as const
            },
            {
              id: '2',
              name: 'Chicken & Rice',
              description: 'Proven safe lunch option',
              ingredients: ['chicken breast', 'white rice', 'salt'],
              category: 'lunch' as const,
              frequency: 8,
              lastEaten: new Date(Date.now() - 48 * 60 * 60 * 1000),
              riskScore: 'medium' as const
            }
          ]}
          onSelectTemplate={(template) => console.log('Selected template:', template)}
          currentMealType={getCurrentMealType()}
        />

        {/* Quick Mood Logger */}
        <QuickMoodLogger onMoodLog={(mood) => console.log('Mood logged:', mood)} />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onQuickLog={(type) => console.log('Quick log:', type)} />
    </div>
  );
}

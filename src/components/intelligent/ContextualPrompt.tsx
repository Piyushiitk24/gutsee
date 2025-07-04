'use client';

import React from 'react';
import { 
  LightBulbIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  SparklesIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ContextualPromptProps {
  prompts: Array<{
    id: string;
    type: 'suggestion' | 'warning' | 'info' | 'insight';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
}

export function ContextualPrompt({ prompts }: ContextualPromptProps) {
  const getPromptIcon = (type: string) => {
    switch (type) {
      case 'warning': return ExclamationTriangleIcon;
      case 'info': return InformationCircleIcon;
      case 'insight': return SparklesIcon;
      default: return LightBulbIcon;
    }
  };

  const getPromptColors = (type: string) => {
    switch (type) {
      case 'warning': return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        text: 'text-orange-800'
      };
      case 'info': return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        text: 'text-blue-800'
      };
      case 'insight': return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        text: 'text-purple-800'
      };
      default: return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        text: 'text-green-800'
      };
    }
  };

  const sortedPrompts = prompts.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  if (sortedPrompts.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="text-center">
          <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            You're all caught up!
          </h3>
          <p className="text-gray-600">
            No new insights or recommendations at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedPrompts.map((prompt, index) => {
        const Icon = getPromptIcon(prompt.type);
        const colors = getPromptColors(prompt.type);
        
        return (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${colors.bg} ${colors.border} border rounded-2xl p-4 shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 bg-white rounded-lg ${colors.icon}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${colors.text} mb-1`}>
                  {prompt.title}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {prompt.message}
                </p>
                {prompt.action && (
                  <button
                    onClick={prompt.action.onClick}
                    className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${colors.text} hover:underline`}
                  >
                    {prompt.action.label}
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

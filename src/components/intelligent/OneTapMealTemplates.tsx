'use client';

import React, { useState } from 'react';
import { 
  ClockIcon, 
  StarIcon, 
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface MealTemplate {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  lastEaten: Date | null;
  frequency: number;
  riskScore: 'low' | 'medium' | 'high';
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface OneTapMealTemplatesProps {
  templates: MealTemplate[];
  onSelectTemplate: (template: MealTemplate) => void;
  currentMealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export function OneTapMealTemplates({ 
  templates, 
  onSelectTemplate, 
  currentMealType 
}: OneTapMealTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const getRiskColor = (riskScore: string) => {
    switch (riskScore) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = templates
    .filter(template => template.category === currentMealType)
    .sort((a, b) => {
      // Sort by frequency (most used first) and then by risk score (lowest first)
      if (a.frequency !== b.frequency) {
        return b.frequency - a.frequency;
      }
      const riskOrder = { low: 1, medium: 2, high: 3 };
      return riskOrder[a.riskScore] - riskOrder[b.riskScore];
    });

  const handleTemplateSelect = (template: MealTemplate) => {
    setSelectedTemplate(template.id);
    setTimeout(() => {
      onSelectTemplate(template);
      setSelectedTemplate(null);
    }, 300);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Quick {currentMealType.charAt(0).toUpperCase() + currentMealType.slice(1)} Options
        </h3>
        <span className="text-sm text-gray-500">
          {filteredTemplates.length} saved meals
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredTemplates.slice(0, 6).map((template) => (
          <motion.button
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className="text-left p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 group-hover:text-purple-900">
                {template.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(template.riskScore)}`}>
                  {template.riskScore}
                </span>
                <AnimatePresence>
                  {selectedTemplate === template.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckIcon className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {template.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <StarIcon className="h-3 w-3" />
                <span>Used {template.frequency} times</span>
              </div>
              {template.lastEaten && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>
                    {Math.round((Date.now() - template.lastEaten.getTime()) / (1000 * 60 * 60 * 24))}d ago
                  </span>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <h4 className="text-gray-800 font-medium mb-1">
            No saved {currentMealType} templates
          </h4>
          <p className="text-gray-600 text-sm">
            Log a few meals to see quick options here
          </p>
        </div>
      )}
    </div>
  );
}

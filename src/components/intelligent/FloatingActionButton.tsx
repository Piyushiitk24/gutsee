'use client';

import React, { useState } from 'react';
import { 
  PlusIcon, 
  CameraIcon, 
  MicrophoneIcon, 
  ClockIcon,
  BeakerIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingActionButtonProps {
  onQuickLog: (type: string) => void;
}

export function FloatingActionButton({ onQuickLog }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { id: 'meal', label: 'Log Meal', icon: ClockIcon, color: 'bg-emerald-500' },
    { id: 'output', label: 'Log Output', icon: BeakerIcon, color: 'bg-blue-500' },
    { id: 'gas', label: 'Log Gas', icon: SparklesIcon, color: 'bg-purple-500' },
    { id: 'irrigation', label: 'Log Irrigation', icon: BeakerIcon, color: 'bg-orange-500' },
    { id: 'photo', label: 'Take Photo', icon: CameraIcon, color: 'bg-pink-500' },
    { id: 'voice', label: 'Voice Note', icon: MicrophoneIcon, color: 'bg-indigo-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  x: 20,
                  transition: { delay: (quickActions.length - index - 1) * 0.05 }
                }}
                onClick={() => {
                  onQuickLog(action.id);
                  setIsOpen(false);
                }}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-full ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <PlusIcon className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}

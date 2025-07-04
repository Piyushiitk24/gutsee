'use client';

import React, { useState } from 'react';
import { 
  FaceSmileIcon, 
  FaceFrownIcon, 
  ExclamationTriangleIcon,
  HeartIcon,
  BoltIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface MoodEntry {
  energy: number; // 1-5
  comfort: number; // 1-5
  anxiety: number; // 1-5
  notes?: string;
}

interface QuickMoodLoggerProps {
  onMoodLog: (mood: MoodEntry) => void;
}

export function QuickMoodLogger({ onMoodLog }: QuickMoodLoggerProps) {
  const [mood, setMood] = useState<MoodEntry>({
    energy: 3,
    comfort: 3,
    anxiety: 3,
    notes: ''
  });
  const [isLogging, setIsLogging] = useState(false);

  const moodOptions = [
    { key: 'energy', label: 'Energy', icon: BoltIcon, color: 'text-yellow-600' },
    { key: 'comfort', label: 'Comfort', icon: HeartIcon, color: 'text-pink-600' },
    { key: 'anxiety', label: 'Anxiety', icon: CloudIcon, color: 'text-blue-600' },
  ];

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return '😔';
    if (value <= 3) return '😐';
    if (value <= 4) return '🙂';
    return '😊';
  };

  const handleMoodChange = (key: keyof MoodEntry, value: number) => {
    setMood(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLogging(true);
    try {
      await onMoodLog(mood);
      // Reset form
      setMood({ energy: 3, comfort: 3, anxiety: 3, notes: '' });
    } catch (error) {
      console.error('Error logging mood:', error);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <FaceSmileIcon className="h-6 w-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">Quick Mood Check</h3>
      </div>

      <div className="space-y-4">
        {moodOptions.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${color}`} />
                <label className="text-sm font-medium text-gray-700">
                  {label}
                </label>
              </div>
              <span className="text-lg">
                {getMoodEmoji(mood[key as keyof MoodEntry] as number)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  onClick={() => handleMoodChange(key as keyof MoodEntry, value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    mood[key as keyof MoodEntry] === value
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {mood[key as keyof MoodEntry] === value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full bg-purple-500 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            value={mood.notes}
            onChange={(e) => setMood(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="How are you feeling today?"
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
            rows={2}
          />
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={isLogging}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLogging ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Logging...
            </div>
          ) : (
            'Log Mood'
          )}
        </motion.button>
      </div>
    </div>
  );
}

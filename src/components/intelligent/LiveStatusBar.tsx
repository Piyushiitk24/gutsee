'use client';

import React from 'react';
import { 
  ClockIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface LiveStatusBarProps {
  lastIrrigation: Date | null;
  hoursSinceIrrigation: number;
  dailyStats: {
    meals: number;
    outputs: number;
    gas: number;
    irrigations: number;
  };
}

export function LiveStatusBar({ 
  lastIrrigation, 
  hoursSinceIrrigation, 
  dailyStats 
}: LiveStatusBarProps) {
  const getIrrigationStatus = () => {
    if (!lastIrrigation) {
      return { status: 'warning', message: 'No irrigation today', color: 'text-orange-500' };
    }
    
    if (hoursSinceIrrigation > 24) {
      return { status: 'danger', message: 'Irrigation overdue', color: 'text-red-500' };
    } else if (hoursSinceIrrigation > 20) {
      return { status: 'warning', message: 'Irrigation due soon', color: 'text-orange-500' };
    } else {
      return { status: 'good', message: 'Irrigation on track', color: 'text-green-500' };
    }
  };

  const getHydrationStatus = () => {
    // Simple heuristic based on output frequency
    if (dailyStats.outputs < 3) {
      return { status: 'warning', message: 'Low output - check hydration', color: 'text-orange-500' };
    } else if (dailyStats.outputs > 8) {
      return { status: 'warning', message: 'High output - monitor closely', color: 'text-orange-500' };
    } else {
      return { status: 'good', message: 'Output levels normal', color: 'text-green-500' };
    }
  };

  const irrigationStatus = getIrrigationStatus();
  const hydrationStatus = getHydrationStatus();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Live Status</h3>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Irrigation Status */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ClockIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Irrigation</p>
            <p className={`text-sm font-medium ${irrigationStatus.color}`}>
              {irrigationStatus.message}
            </p>
            {lastIrrigation && (
              <p className="text-xs text-gray-500">
                {Math.round(hoursSinceIrrigation)}h ago
              </p>
            )}
          </div>
        </div>

        {/* Hydration Status */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-50 rounded-lg">
            <HeartIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Hydration</p>
            <p className={`text-sm font-medium ${hydrationStatus.color}`}>
              {hydrationStatus.message}
            </p>
            <p className="text-xs text-gray-500">
              {dailyStats.outputs} outputs today
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Today:</span>
          <div className="flex gap-4">
            <span className="text-green-600">{dailyStats.meals} meals</span>
            <span className="text-blue-600">{dailyStats.outputs} outputs</span>
            <span className="text-purple-600">{dailyStats.gas} gas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ClipboardListIcon, TrendingUpIcon, CalendarIcon } from 'lucide-react';

export function DashboardOverview() {
  const [currentStreak] = useState(3);
  const [totalDays] = useState(28);
  const [avgOutputFreeTime] = useState(18.5);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last 30 days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUpIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-blue-600">{currentStreak} days</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">24+ hour output-free periods</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((currentStreak / totalDays) * 100)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Days with 24+ hour success</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClipboardListIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg. Output-Free</p>
              <p className="text-2xl font-bold text-purple-600">{avgOutputFreeTime}h</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Average hours between irrigation and output</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Progress Toward Goal</h3>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStreak / totalDays) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Goal: 70% success rate (currently {Math.round((currentStreak / totalDays) * 100)}%)
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ClipboardListIcon, TrendingUpIcon, CalendarIcon } from 'lucide-react';

export function DashboardOverview() {
  const [currentStreak] = useState(3);
  const [totalDays] = useState(28);
  const [avgOutputFreeTime] = useState(18.5);

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Overview
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"></div>
          <span className="text-sm text-gray-600/80">Last 30 days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg">
              <TrendingUpIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600/80">Current Streak</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentStreak} days
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">24+ hour output-free periods</p>
        </div>

        <div className="backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600/80">Success Rate</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                {Math.round((currentStreak / totalDays) * 100)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Days with 24+ hour success</p>
        </div>

        <div className="backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg">
              <ClipboardListIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600/80">Avg. Output-Free</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {avgOutputFreeTime}h
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Average hours between irrigation and output</p>
        </div>
      </div>

      <div className="mt-8 backdrop-blur-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 mr-2"></div>
          Progress Toward Goal
        </h3>
        <div className="relative w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-shimmer"></div>
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ width: `${(currentStreak / totalDays) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Goal: 70% success rate (currently {Math.round((currentStreak / totalDays) * 100)}%)
        </p>
      </div>
    </div>
  );
}

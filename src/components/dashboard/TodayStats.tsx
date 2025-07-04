'use client';

import { useState } from 'react';
import { 
  TrendingUpIcon, 
  TrendingDownIcon, 
  MinusIcon,
  UtensilsIcon,
  DropletIcon,
  ActivityIcon,
  TimerIcon
} from 'lucide-react';

export function TodayStats() {
  const [stats] = useState({
    mealsLogged: 2,
    targetMeals: 3,
    outputEvents: 0,
    gasLevel: 3, // 1-10 scale
    hoursSinceIrrigation: 8,
    hydrationLevel: 7, // 1-10 scale
    overallMood: 8 // 1-10 scale
  });

  const getTrendIcon = (current: number, target: number) => {
    if (current === target) return MinusIcon;
    return current > target ? TrendingUpIcon : TrendingDownIcon;
  };

  const statCards = [
    {
      title: 'Meals Logged',
      value: stats.mealsLogged,
      target: stats.targetMeals,
      unit: '',
      icon: UtensilsIcon,
      description: 'Daily food intake',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Output Events',
      value: stats.outputEvents,
      target: 0,
      unit: '',
      icon: DropletIcon,
      description: 'Stoma output today',
      color: 'bg-blue-50 text-blue-600',
      reverse: true
    },
    {
      title: 'Gas Level',
      value: stats.gasLevel,
      target: 3,
      unit: '/10',
      icon: ActivityIcon,
      description: 'Current intensity',
      color: 'bg-purple-50 text-purple-600',
      reverse: true
    },
    {
      title: 'Hours Since Irrigation',
      value: stats.hoursSinceIrrigation,
      target: 24,
      unit: 'h',
      icon: TimerIcon,
      description: 'Progress to 24h goal',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Today&apos;s Stats</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const TrendIcon = getTrendIcon(stat.value, stat.target);
          const isOnTarget = stat.reverse ? 
            stat.value <= stat.target : 
            stat.value >= stat.target;

          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <TrendIcon className={`h-4 w-4 ${
                  isOnTarget ? 'text-green-500' : 'text-gray-400'
                }`} />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                  <span className="text-sm text-gray-500 ml-1">
                    {stat.unit}
                  </span>
                </p>
                <p className="text-xs text-gray-500">{stat.description}</p>
                {stat.target && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Target: {stat.target}{stat.unit}</span>
                    <span className={`ml-2 ${
                      isOnTarget ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {isOnTarget ? '✓' : '○'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Progress Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Today&apos;s Progress</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Meal logging</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.mealsLogged / stats.targetMeals) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700">
                {stats.mealsLogged}/{stats.targetMeals}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Output-free time</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.hoursSinceIrrigation / 24) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700">
                {stats.hoursSinceIrrigation}/24h
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Overall mood</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.overallMood / 10) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700">
                {stats.overallMood}/10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

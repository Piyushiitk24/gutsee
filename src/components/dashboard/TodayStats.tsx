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
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Output Events',
      value: stats.outputEvents,
      target: 0,
      unit: '',
      icon: DropletIcon,
      description: 'Stoma output today',
      gradient: 'from-blue-400 to-cyan-500',
      reverse: true
    },
    {
      title: 'Gas Level',
      value: stats.gasLevel,
      target: 3,
      unit: '/10',
      icon: ActivityIcon,
      description: 'Current intensity',
      gradient: 'from-purple-400 to-violet-500',
      reverse: true
    },
    {
      title: 'Hours Since Irrigation',
      value: stats.hoursSinceIrrigation,
      target: 24,
      unit: 'h',
      icon: TimerIcon,
      description: 'Progress to 24h goal',
      gradient: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <div className="glass-card backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">
          Today&apos;s Stats
        </h2>
        <div className="text-sm text-white/80 backdrop-blur-sm bg-white/10 rounded-lg px-3 py-1">
          Friday, July 4, 2025
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const TrendIcon = getTrendIcon(stat.value, stat.target);
          const isOnTarget = stat.reverse ? 
            stat.value <= stat.target : 
            stat.value >= stat.target;

          return (
            <div key={index} className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <TrendIcon className={`h-5 w-5 ${
                  isOnTarget ? 'text-green-500' : 'text-yellow-500'
                }`} />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600/80">{stat.title}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                  <span className="text-lg text-gray-500 ml-1">
                    {stat.unit}
                  </span>
                </p>
                <p className="text-xs text-gray-500">{stat.description}</p>
                {stat.target && (
                  <div className="flex items-center text-xs text-gray-500 pt-2">
                    <span>Target: {stat.target}{stat.unit}</span>
                    <span className={`ml-2 text-lg ${
                      isOnTarget ? 'text-green-500' : 'text-yellow-500'
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
      <div className="backdrop-blur-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
        <h3 className="font-semibold text-gray-800 mb-6 flex items-center text-lg">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 mr-3 animate-pulse"></div>
          Today&apos;s Progress
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Meal logging</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-white/20 rounded-full h-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-shimmer"></div>
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${(stats.mealsLogged / stats.targetMeals) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent min-w-[3rem]">
                {stats.mealsLogged}/{stats.targetMeals}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Output-free time</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${Math.min((stats.hoursSinceIrrigation / 24) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent min-w-[3rem]">
                {stats.hoursSinceIrrigation}/24h
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Overall mood</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${(stats.overallMood / 10) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent min-w-[3rem]">
                {stats.overallMood}/10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

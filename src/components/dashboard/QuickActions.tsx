'use client';

import { useState } from 'react';
import { 
  UtensilsIcon, 
  DropletIcon, 
  ActivityIcon, 
  TimerIcon
} from 'lucide-react';

export function QuickActions() {
  const [lastIrrigation] = useState(new Date());
  const [hoursSinceIrrigation] = useState(8);

  const actions = [
    {
      icon: UtensilsIcon,
      label: 'Log Meal',
      description: 'Quick food entry',
      gradient: 'from-green-400 to-emerald-500',
      href: '/meals/new'
    },
    {
      icon: DropletIcon,
      label: 'Log Output',
      description: 'Record stoma output',
      gradient: 'from-blue-400 to-cyan-500',
      href: '/outputs/new'
    },
    {
      icon: ActivityIcon,
      label: 'Log Gas',
      description: 'Track gas production',
      gradient: 'from-purple-400 to-violet-500',
      href: '/gas/new'
    },
    {
      icon: TimerIcon,
      label: 'Irrigation',
      description: 'Log irrigation session',
      gradient: 'from-orange-400 to-red-500',
      href: '/irrigation/new'
    }
  ];

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Quick Actions
        </h2>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 rounded-full bg-white/30"></div>
        </div>
      </div>

      {/* Time Since Last Irrigation */}
      <div className="backdrop-blur-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600/80">Time Since Irrigation</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {hoursSinceIrrigation}h
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Last irrigation</p>
            <p className="text-sm text-gray-700">
              {lastIrrigation.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Target: 24h</span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              {Math.round((hoursSinceIrrigation / 24) * 100)}%
            </span>
          </div>
          <div className="relative w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-shimmer"></div>
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out shadow-lg ${
                hoursSinceIrrigation >= 24 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'
              }`}
              style={{ width: `${Math.min((hoursSinceIrrigation / 24) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`w-full group relative overflow-hidden backdrop-blur-lg bg-gradient-to-r ${action.gradient} rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
            onClick={() => {
              console.log(`Navigating to ${action.href}`);
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center text-white">
              <div className="p-2 bg-white/20 rounded-xl mr-4">
                <action.icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">{action.label}</p>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-white/20">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 mr-2"></div>
          Today&apos;s Activity
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm backdrop-blur-sm bg-white/5 rounded-lg p-3">
            <span className="text-gray-600">Meals logged:</span>
            <span className="font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">2</span>
          </div>
          <div className="flex justify-between text-sm backdrop-blur-sm bg-white/5 rounded-lg p-3">
            <span className="text-gray-600">Output events:</span>
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">0</span>
          </div>
          <div className="flex justify-between text-sm backdrop-blur-sm bg-white/5 rounded-lg p-3">
            <span className="text-gray-600">Gas sessions:</span>
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

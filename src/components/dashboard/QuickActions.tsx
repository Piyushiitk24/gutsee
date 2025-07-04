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
      color: 'bg-green-500 hover:bg-green-600',
      href: '/meals/new'
    },
    {
      icon: DropletIcon,
      label: 'Log Output',
      description: 'Record stoma output',
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/outputs/new'
    },
    {
      icon: ActivityIcon,
      label: 'Log Gas',
      description: 'Track gas production',
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/gas/new'
    },
    {
      icon: TimerIcon,
      label: 'Irrigation',
      description: 'Log irrigation session',
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '/irrigation/new'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
      </div>

      {/* Time Since Last Irrigation */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Time Since Irrigation</p>
            <p className="text-2xl font-bold text-gray-900">{hoursSinceIrrigation}h</p>
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
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Target: 24h</span>
            <span>{Math.round((hoursSinceIrrigation / 24) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                hoursSinceIrrigation >= 24 ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min((hoursSinceIrrigation / 24) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`w-full flex items-center p-4 rounded-lg text-white transition-colors ${action.color}`}
            onClick={() => {
              // For now, just log the action
              console.log(`Navigating to ${action.href}`);
            }}
          >
            <action.icon className="h-6 w-6 mr-3" />
            <div className="text-left">
              <p className="font-medium">{action.label}</p>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Today&apos;s Activity</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Meals logged:</span>
            <span className="font-medium">2</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Output events:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Gas sessions:</span>
            <span className="font-medium">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

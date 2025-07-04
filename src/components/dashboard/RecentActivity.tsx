'use client';

import { useState } from 'react';
import { ClockIcon, UtensilsIcon, DropletIcon, ActivityIcon } from 'lucide-react';

export function RecentActivity() {
  const [activities] = useState([
    {
      id: 1,
      type: 'meal',
      icon: UtensilsIcon,
      title: 'Logged breakfast',
      description: 'Oatmeal with banana and honey',
      time: '8:30 AM',
      timeAgo: '2 hours ago',
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 2,
      type: 'gas',
      icon: ActivityIcon,
      title: 'Gas session recorded',
      description: 'Intensity: 3/10, Duration: 15 min',
      time: '7:45 AM',
      timeAgo: '3 hours ago',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 3,
      type: 'irrigation',
      icon: DropletIcon,
      title: 'Morning irrigation',
      description: 'Quality: Good, Duration: 20 min',
      time: '6:00 AM',
      timeAgo: '5 hours ago',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 4,
      type: 'meal',
      icon: UtensilsIcon,
      title: 'Logged dinner',
      description: 'Grilled chicken with rice and vegetables',
      time: 'Yesterday 7:30 PM',
      timeAgo: '14 hours ago',
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 5,
      type: 'output',
      icon: DropletIcon,
      title: 'Output recorded',
      description: 'Volume: 150ml, Consistency: Soft',
      time: 'Yesterday 6:15 PM',
      timeAgo: '15 hours ago',
      color: 'text-orange-600 bg-orange-50'
    }
  ]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 ml-2">
                  {activity.timeAgo}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing last 5 activities</span>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            View timeline →
          </button>
        </div>
      </div>
    </div>
  );
}

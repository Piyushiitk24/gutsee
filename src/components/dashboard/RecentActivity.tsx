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
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 2,
      type: 'gas',
      icon: ActivityIcon,
      title: 'Gas session recorded',
      description: 'Intensity: 3/10, Duration: 15 min',
      time: '7:45 AM',
      timeAgo: '3 hours ago',
      gradient: 'from-purple-400 to-violet-500'
    },
    {
      id: 3,
      type: 'irrigation',
      icon: DropletIcon,
      title: 'Morning irrigation',
      description: 'Quality: Good, Duration: 20 min',
      time: '6:00 AM',
      timeAgo: '5 hours ago',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: 4,
      type: 'meal',
      icon: UtensilsIcon,
      title: 'Logged dinner',
      description: 'Grilled chicken with rice and vegetables',
      time: 'Yesterday 7:30 PM',
      timeAgo: '14 hours ago',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 5,
      type: 'output',
      icon: DropletIcon,
      title: 'Output recorded',
      description: 'Volume: 150ml, Consistency: Soft',
      time: 'Yesterday 6:15 PM',
      timeAgo: '15 hours ago',
      gradient: 'from-orange-400 to-red-500'
    }
  ]);

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
          Recent Activity
        </h2>
        <button className="backdrop-blur-sm bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="group backdrop-blur-lg bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-start space-x-4">
              <div className={`p-3 bg-gradient-to-br ${activity.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <activity.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 ml-2 backdrop-blur-sm bg-white/10 rounded-lg px-2 py-1">
                    {activity.timeAgo}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {activity.description}
                </p>
                <div className="flex items-center mt-2">
                  <ClockIcon className="h-3 w-3 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/20">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 mr-2"></div>
            Showing last 5 activities
          </span>
          <button className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300">
            View timeline →
          </button>
        </div>
      </div>
    </div>
  );
}

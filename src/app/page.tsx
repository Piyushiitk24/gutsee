import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TodayStats } from '@/components/dashboard/TodayStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Beautiful gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Subtle animated overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      
      {/* Floating orbs for depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Stoma Tracker
            </span>
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            Your comprehensive colostomy management companion
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Overview - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <DashboardOverview />
          </div>
          
          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Today's Stats and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodayStats />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

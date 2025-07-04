import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TodayStats } from '@/components/dashboard/TodayStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { DesignShowcase } from '@/components/ui/DesignShowcase';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Multi-layer Parallax Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 animate-gradient-xy"></div>
      
      {/* Secondary animated background layer */}
      <div className="fixed inset-0 bg-gradient-to-tr from-pink-800/30 via-purple-800/30 to-cyan-800/30 animate-gradient-xy animation-delay-2000"></div>
      
      {/* Third parallax layer */}
      <div className="fixed inset-0 bg-gradient-to-tl from-indigo-800/20 via-violet-800/20 to-blue-800/20 animate-gradient-radial animation-delay-3000"></div>
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Subtle floating orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-bubble-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-bubble-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-teal-500/15 to-emerald-500/15 rounded-full blur-3xl animate-bubble-float animation-delay-4000"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 animate-float-slow">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
              Stoma Tracker
            </span>
          </h1>
          <p className="text-xl text-white/90 animate-float-medium animation-delay-1000 drop-shadow-lg">
            Your comprehensive colostomy management companion
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-shimmer"></div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Overview - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 animate-float-slow animation-delay-1000">
            <DashboardOverview />
          </div>
          
          {/* Quick Actions */}
          <div className="lg:col-span-1 animate-float-medium animation-delay-2000">
            <QuickActions />
          </div>
        </div>

        {/* Stats and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-float-slow animation-delay-3000">
            <TodayStats />
          </div>
          <div className="animate-float-medium animation-delay-4000">
            <RecentActivity />
          </div>
        </div>
      </div>
      
      {/* Bottom gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      
      {/* Design showcase */}
      <DesignShowcase />
    </div>
  );
}

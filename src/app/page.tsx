import { Layout } from '@/components/Layout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TodayStats } from '@/components/dashboard/TodayStats';

export default function Home() {
  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Track your colostomy management and discover patterns
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardOverview />
            <TodayStats />
            <RecentActivity />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-8">
            <QuickActions />
          </div>
        </div>
      </div>
    </Layout>
  );
}

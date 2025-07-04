import { NextResponse } from 'next/server';
import { ApiResponse, DashboardStats } from '@/types';

export async function GET() {
  try {
    // Mock data for now - in production this would come from the database
    const mockStats: DashboardStats = {
      currentStreak: 3,
      totalDays: 28,
      successRate: 64, // 18/28 days
      avgOutputFreeTime: 18.5,
      todayMeals: 2,
      todayOutputs: 0,
      todayGasSessions: 1,
      hoursSinceIrrigation: 8
    };

    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: mockStats,
      message: 'Dashboard stats retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    const response: ApiResponse<DashboardStats> = {
      success: false,
      error: 'Failed to fetch dashboard stats'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

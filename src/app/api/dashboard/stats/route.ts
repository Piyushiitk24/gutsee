import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { db } from '@/lib/database';
import { ApiResponse, DashboardStats } from '@/types';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Use server-side Supabase client with cookies
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get dashboard stats from database
    const stats = await db.getDashboardStats(user.id);

    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: stats,
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

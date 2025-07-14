import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { db } from '@/lib/database';
import { ApiResponse } from '@/types';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
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

    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get recent activity from database
    const activities = await db.getRecentActivity(user.id, limit);

    const response: ApiResponse<typeof activities> = {
      success: true,
      data: activities,
      message: 'Recent activity retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to fetch recent activity'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

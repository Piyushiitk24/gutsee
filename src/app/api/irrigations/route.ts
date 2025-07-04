import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { db } from '@/lib/database';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
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
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get irrigations from database
    const irrigations = await db.getIrrigations(user.id, limit);

    const response: ApiResponse<typeof irrigations> = {
      success: true,
      data: irrigations,
      message: 'Irrigations retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching irrigations:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to fetch irrigations'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Create irrigation in database
    const irrigationData = {
      ...body,
      user_id: user.id,
      timestamp: new Date(body.timestamp).toISOString()
    };
    
    const irrigation = await db.createIrrigation(irrigationData);

    if (!irrigation) {
      return NextResponse.json(
        { success: false, error: 'Failed to create irrigation' },
        { status: 500 }
      );
    }

    const response: ApiResponse<typeof irrigation> = {
      success: true,
      data: irrigation,
      message: 'Irrigation created successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating irrigation:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to create irrigation'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

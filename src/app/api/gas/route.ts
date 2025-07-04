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

    // Get gas sessions from database
    const gasSessions = await db.getGasSessions(user.id, limit);

    const response: ApiResponse<typeof gasSessions> = {
      success: true,
      data: gasSessions,
      message: 'Gas sessions retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching gas sessions:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to fetch gas sessions'
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
    
    // Create gas session in database
    const gasData = {
      ...body,
      user_id: user.id,
      timestamp: new Date(body.timestamp).toISOString()
    };
    
    const gasSession = await db.createGasSession(gasData);

    if (!gasSession) {
      return NextResponse.json(
        { success: false, error: 'Failed to create gas session' },
        { status: 500 }
      );
    }

    const response: ApiResponse<typeof gasSession> = {
      success: true,
      data: gasSession,
      message: 'Gas session created successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating gas session:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to create gas session'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

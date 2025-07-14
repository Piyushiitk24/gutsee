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
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get gut outputs from database
    const outputs = await db.getGutOutputs(user.id, limit);

    const response: ApiResponse<typeof outputs> = {
      success: true,
      data: outputs,
      message: 'Gut outputs retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching gut outputs:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to fetch gut outputs'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    // Create gut output in database
    const outputData = {
      ...body,
      user_id: user.id,
      timestamp: new Date(body.timestamp).toISOString()
    };
    
    const output = await db.createGutOutput(outputData);

    if (!output) {
      return NextResponse.json(
        { success: false, error: 'Failed to create gut output' },
        { status: 500 }
      );
    }

    const response: ApiResponse<typeof output> = {
      success: true,
      data: output,
      message: 'Gut output created successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating gut output:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to create gut output'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

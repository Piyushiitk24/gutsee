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

    // Get stoma outputs from database
    const outputs = await db.getStomaOutputs(user.id, limit);

    const response: ApiResponse<typeof outputs> = {
      success: true,
      data: outputs,
      message: 'Stoma outputs retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stoma outputs:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to fetch stoma outputs'
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
    
    // Create stoma output in database
    const outputData = {
      ...body,
      user_id: user.id,
      timestamp: new Date(body.timestamp).toISOString()
    };
    
    const output = await db.createStomaOutput(outputData);

    if (!output) {
      return NextResponse.json(
        { success: false, error: 'Failed to create stoma output' },
        { status: 500 }
      );
    }

    const response: ApiResponse<typeof output> = {
      success: true,
      data: output,
      message: 'Stoma output created successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating stoma output:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to create stoma output'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

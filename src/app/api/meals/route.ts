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

    // Get meals from database
    const meals = await db.getMeals(user.id, limit);

    const response: ApiResponse<typeof meals> = {
      success: true,
      data: meals,
      message: 'Meals retrieved successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching meals:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to fetch meals'
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
    
    // Create meal in database
    const mealData = {
      ...body,
      user_id: user.id,
      timestamp: new Date(body.timestamp).toISOString()
    };
    
    const meal = await db.createMeal(mealData);

    if (!meal) {
      return NextResponse.json(
        { success: false, error: 'Failed to create meal' },
        { status: 500 }
      );
    }

    const response: ApiResponse<typeof meal> = {
      success: true,
      data: meal,
      message: 'Meal created successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating meal:', error);
    
    const response: ApiResponse<any> = {
      success: false,
      error: 'Failed to create meal'
    };

    return NextResponse.json(response, { status: 500 });
  }
}

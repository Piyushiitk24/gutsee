// API route for AI-powered meal plan generation

import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { duration, dietaryRestrictions, goals, userHistory } = await request.json();

    if (!duration || duration < 1 || duration > 30) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 30 days' },
        { status: 400 }
      );
    }

    const mealPlan = await GeminiService.generateMealPlan(
      duration,
      dietaryRestrictions || [],
      goals || [],
      userHistory || {}
    );

    return NextResponse.json({ success: true, data: mealPlan });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}

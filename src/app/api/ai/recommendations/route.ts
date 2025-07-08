// API route for personalized recommendations using Gemini AI

import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { userHistory, preferences } = await request.json();

    const currentTime = new Date();
    const recommendations = await GeminiService.getPersonalizedRecommendations(
      userHistory,
      currentTime,
      preferences
    );

    return NextResponse.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

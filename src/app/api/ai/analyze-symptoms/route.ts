// API route for symptom analysis using Gemini AI

import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { symptoms, recentMeals, outputs } = await request.json();

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { error: 'Invalid symptoms provided' },
        { status: 400 }
      );
    }

    const analysis = await GeminiService.analyzeSymptoms(
      symptoms,
      recentMeals || [],
      outputs || []
    );

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return NextResponse.json(
      { error: 'Failed to analyze symptoms' },
      { status: 500 }
    );
  }
}

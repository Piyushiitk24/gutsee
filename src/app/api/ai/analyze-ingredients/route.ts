// API route for ingredient analysis using Gemini AI

import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: 'Invalid ingredients provided' },
        { status: 400 }
      );
    }

    const analysis = await GeminiService.analyzeIngredients(ingredients);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error in ingredient analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze ingredients' },
      { status: 500 }
    );
  }
}

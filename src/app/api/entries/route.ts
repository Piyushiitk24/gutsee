import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { GeminiService } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, description, timestamp, userId, confidence } = body

    if (!type || !description || !timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, description, timestamp' },
        { status: 400 }
      )
    }

    // Use consistent client-side Supabase client like other routes
    const supabase = createClient()
    
    // Get the current user for authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Use authenticated user's ID, not the passed userId
    const finalUserId = user.id

    // Get AI analysis for the entry (optional - don't fail if this fails)
    let analysis: {
      flags: string[]
      riskLevel: 'low' | 'medium' | 'high'
      confidence: number
    } = {
      flags: [],
      riskLevel: 'low',
      confidence: confidence || 0.8
    }

    try {
      const aiAnalysis = await analyzeEntry(type, description)
      analysis.flags = aiAnalysis.flags
      analysis.riskLevel = aiAnalysis.riskLevel
      analysis.confidence = aiAnalysis.confidence
    } catch (analysisError) {
      console.warn('AI analysis failed, using defaults:', analysisError)
    }

    // Save the entry to database
    const { data: entry, error } = await supabase
      .from('health_entries')
      .insert({
        user_id: finalUserId,
        type,
        description,
        timestamp: new Date(timestamp).toISOString(),
        ai_flags: analysis.flags,
        risk_level: analysis.riskLevel,
        confidence_score: analysis.confidence
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to save entry to database', details: error.message },
        { status: 500 }
      )
    }

    console.log('Entry saved successfully:', entry)

    return NextResponse.json({ 
      success: true, 
      data: entry,
      message: 'Entry saved successfully'
    })

  } catch (error) {
    console.error('Error in entries API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Use consistent client-side Supabase client
    const supabase = createClient()
    
    // Get the current user for authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: entries, error } = await supabase
      .from('health_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch entries' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: entries 
    })

  } catch (error) {
    console.error('Error in entries API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function analyzeEntry(type: string, description: string) {
  try {
    // For food-related entries, use more sophisticated analysis
    if (['breakfast', 'lunch', 'dinner', 'snack', 'drinks'].includes(type)) {
      const analysis = await GeminiService.analyzeFoodEntry(description)
      return {
        flags: analysis.flags || [],
        riskLevel: analysis.riskLevel || 'low',
        confidence: analysis.confidence || 0.8,
        insights: analysis.insights || []
      }
    }

    // For symptom-related entries
    if (['symptoms', 'gas', 'bowel', 'mood', 'energy'].includes(type)) {
      const analysis = await GeminiService.analyzeSymptomEntry(description)
      return {
        flags: analysis.flags || [],
        riskLevel: analysis.severity || 'low',
        confidence: analysis.confidence || 0.7,
        insights: analysis.insights || []
      }
    }

    // Default analysis for other types
    return {
      flags: [],
      riskLevel: 'low' as const,
      confidence: 0.5,
      insights: []
    }

  } catch (error) {
    console.error('Error in AI analysis:', error)
    // Return default values if AI analysis fails
    return {
      flags: [],
      riskLevel: 'low' as const,
      confidence: 0.5,
      insights: []
    }
  }
}

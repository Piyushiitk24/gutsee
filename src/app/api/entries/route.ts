import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GeminiService } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { type, description, timestamp, userId } = await request.json()

    if (!type || !description || !timestamp || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Supabase client with server-side cookies
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', options)
          },
        },
      }
    )

    // Get AI analysis for the entry
    const analysis = await analyzeEntry(type, description)

    // Save the entry to database
    const { data: entry, error } = await supabase
      .from('health_entries')
      .insert({
        user_id: userId,
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
        { error: 'Failed to save entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...entry,
        analysis
      }
    })

  } catch (error) {
    console.error('Error in entries API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Create Supabase client with server-side cookies
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', options)
          },
        },
      }
    )

    const { data: entries, error } = await supabase
      .from('health_entries')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch entries' },
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
      { error: 'Internal server error' },
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

import { NextRequest, NextResponse } from 'next/server'
import { parseMultiCategoryEntry } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { description, timestamp } = body

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      )
    }

    const baseTimestamp = timestamp ? new Date(timestamp) : new Date()
    
    const result = await parseMultiCategoryEntry(description, baseTimestamp)
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error parsing multi-category entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to parse entry' },
      { status: 500 }
    )
  }
}

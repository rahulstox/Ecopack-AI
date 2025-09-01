// File: app/api/autopilot/route.js
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

async function callClimatiq(endpoint, payload) {
  const response = await fetch(
    `https://beta4.api.climatiq.io/v1-preview4/${endpoint}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const errorBody = await response.json()
    console.error(`Climatiq API Error (${endpoint}):`, errorBody)
    throw new Error(
      errorBody.message || `Failed at Climatiq endpoint: ${endpoint}`
    )
  }
  return response.json()
}

// ✅ THIS IS THE REQUIRED HELPER FUNCTION
const getParameterName = (unit) => {
  const unitLower = unit.toLowerCase()
  if (['km', 'mi'].includes(unitLower)) return 'distance'
  if (['kwh', 'gj'].includes(unitLower)) return 'energy'
  if (['meal', 'meals', 'serving', 'servings'].includes(unitLower))
    return 'number'
  return unitLower // Fallback
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const userId = session.user.id
    const { text, unit, value } = await request.json()
    if (!text || !unit || !value) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    // Step 1: Get suggestions from Climatiq Autopilot
    const suggestPayload = {
      query: text,
      unit_types: [getParameterName(unit)],
    }
    const suggestData = await callClimatiq('suggest', suggestPayload)

    if (!suggestData.suggestions || suggestData.suggestions.length === 0) {
      throw new Error('Climatiq could not find any matches for your query.')
    }

    // Step 2: Automatically select the best suggestion (highest score)
    const bestSuggestion = suggestData.suggestions[0]

    // Step 3: Use the suggestion_id to get a guaranteed estimate
    const estimatePayload = {
      suggestion_id: bestSuggestion.suggestion_id,
      parameters: {
        [getParameterName(unit)]: value,
      },
    }
    const estimateData = await callClimatiq('estimate', estimatePayload)

    const carbonFootprintKg = estimateData.co2e

    // Step 4: Save to database
    const newAction = {
      category: bestSuggestion.emission_factor.category.toLowerCase(),
      activity: bestSuggestion.emission_factor.name,
      value,
      unit,
      carbonFootprint: carbonFootprintKg,
      timestamp: new Date().toISOString(),
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const existingLog = await prisma.dailyLog.findFirst({
      where: { userId, date: today },
    })

    if (existingLog) {
      const currentActions = Array.isArray(existingLog.actions)
        ? existingLog.actions
        : []
      const updatedActions = [...currentActions, newAction]
      await prisma.dailyLog.update({
        where: { id: existingLog.id },
        data: {
          actions: updatedActions,
          carbonFootprint: { increment: carbonFootprintKg },
        },
      })
    } else {
      await prisma.dailyLog.create({
        data: {
          userId,
          date: today,
          actions: [newAction],
          carbonFootprint: carbonFootprintKg,
        },
      })
    }

    return NextResponse.json({
      message: 'Action logged successfully',
      carbonFootprint: carbonFootprintKg,
    })
  } catch (error) {
    console.error('Error in /api/autopilot:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to log action.' },
      { status: 500 }
    )
  }
}

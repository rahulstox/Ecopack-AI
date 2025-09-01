// File: app/api/calculate/route.js

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// This helper function makes our API calls to Climatiq clean and reusable.
async function callClimatiq(endpoint, payload) {
 const response = await fetch(`https://api.climatiq.io/${endpoint}`, {
   method: 'POST',
   headers: {
     Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`,
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(payload),
 })

  if (!response.ok) {
    const errorBody = await response.json()
    console.error(`Climatiq API Error (${endpoint}):`, errorBody)
    throw new Error(
      errorBody.message || `Failed at Climatiq endpoint: ${endpoint}`
    )
  }
  return response.json()
}

// This helper function translates our units to the correct Climatiq parameter names.
const getParameterName = (unit) => {
  const unitLower = unit.toLowerCase()
  if (['km', 'mi'].includes(unitLower)) return 'distance'
  if (['kwh', 'gj'].includes(unitLower)) return 'energy'
  if (['meal', 'meals', 'serving', 'servings'].includes(unitLower))
    return 'number'
  return unitLower // Fallback
}

export async function POST(request) {
  if (!process.env.CLIMATIQ_API_KEY) {
    console.error('Climatiq API key is missing.')
    return NextResponse.json(
      { error: 'Server configuration error.' },
      { status: 500 }
    )
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const { activity, unit, value } = await request.json() // We now expect activity, unit, and value

    if (!activity || !unit || !value) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      )
    }

    // --- AUTOPILOT WORKFLOW ---

    // Step 1: Get suggestions from Climatiq Autopilot using the 'suggest' endpoint
    const suggestData = await callClimatiq('v1-preview4/suggest', {
      query: activity,
      unit_types: [getParameterName(unit)],
    })

    if (!suggestData.suggestions || suggestData.suggestions.length === 0) {
      throw new Error('Climatiq could not find any matches for your query.')
    }

    // Step 2: Automatically select the best suggestion (the one with the highest score)
    const bestSuggestion = suggestData.suggestions[0]

    // Step 3: Use the suggestion_id to get a guaranteed estimate
    const estimateData = await callClimatiq('v1-preview4/estimate', {
      suggestion_id: bestSuggestion.suggestion_id,
      parameters: {
        [getParameterName(unit)]: value,
      },
    })

    const carbonFootprintKg = estimateData.co2e

    // Step 4: Save the successful result to our database
    const newAction = {
      category: bestSuggestion.emission_factor.category.toLowerCase(),
      activity: bestSuggestion.emission_factor.name, // Use the more descriptive name from Climatiq
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
    console.error('Error in /api/calculate:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to log action.' },
      { status: 500 }
    )
  }
}

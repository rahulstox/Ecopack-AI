import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {
  // 1. Check if the user is authenticated
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const body = await request.json()
    const { category, value, unit } = body

    // 2. We need a consistent date (without time) for the daily log
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    // 3. Find if a log for today already exists for this user
    const existingLog = await prisma.dailyLog.findFirst({
      where: {
        userId: userId,
        date: today,
      },
    })

    const newAction = { category, value, unit, timestamp: new Date() }

    if (existingLog) {
      // 4. If a log exists, update it by adding the new action
      await prisma.dailyLog.update({
        where: {
          id: existingLog.id,
        },
        data: {
          actions: {
            // 'push' is a Prisma command to add an element to a JSON array
            push: newAction,
          },
        },
      })
    } else {
      // 5. If no log exists for today, create a new one
      await prisma.dailyLog.create({
        data: {
          userId: userId,
          date: today,
          actions: [newAction],
        },
      })
    }

    return NextResponse.json(
      { message: 'Action logged successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error logging action:', error)
    return NextResponse.json({ error: 'Failed to log action' }, { status: 500 })
  }
}

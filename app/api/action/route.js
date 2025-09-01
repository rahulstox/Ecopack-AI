// File: app/api/action/route.js

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { logId, actionTimestamp } = await request.json()
    const userId = session.user.id

    const log = await prisma.dailyLog.findFirst({
      where: {
        id: logId,
        userId: userId,
      },
    })

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found or permission denied.' },
        { status: 404 }
      )
    }

    const actionToDelete = log.actions.find(
      (action) => action.timestamp === actionTimestamp
    )
    if (!actionToDelete) {
      return NextResponse.json(
        { error: 'Action not found in this log.' },
        { status: 404 }
      )
    }

    const updatedActions = log.actions.filter(
      (action) => action.timestamp !== actionTimestamp
    )

    // ✅ CORRECTED LOGIC: Check if this was the last action
    if (updatedActions.length === 0) {
      // If no actions are left, delete the entire daily log entry
      await prisma.dailyLog.delete({
        where: { id: logId },
      })
    } else {
      // If actions still remain, just update the log as before
      await prisma.dailyLog.update({
        where: {
          id: logId,
        },
        data: {
          actions: updatedActions,
          carbonFootprint: {
            decrement: actionToDelete.carbonFootprint,
          },
        },
      })
    }

    return NextResponse.json({ message: 'Action deleted successfully' })
  } catch (error) {
    console.error('Error deleting action:', error)
    return NextResponse.json(
      { error: 'Failed to delete action.' },
      { status: 500 }
    )
  }
}

// File: app/api/user/update-username/route.js

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { username } = body

    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long.' },
        { status: 400 }
      )
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { username: username },
    })

    return NextResponse.json({ message: 'Username updated' }, { status: 200 })
  } catch (error) {
    // This catches errors like the username already being taken
    return NextResponse.json(
      { error: 'Failed to update username.' },
      { status: 500 }
    )
  }
}

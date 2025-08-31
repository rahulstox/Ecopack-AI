// File: app/(main_app)/dashboard/page.js

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { LogActionDialog } from '@/components/LogActionDialog'
import ActionLog from '@/components/ActionLog'
import { redirect } from 'next/navigation' // Make sure redirect is imported

async function getLogs(userId) {
  if (!userId) return []

  const logs = await prisma.dailyLog.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return logs.map((log) => ({
    ...log,
    actions: Array.isArray(log.actions) ? log.actions : [],
  }))
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    redirect('/')
  }

  const logs = await getLogs(session.user.id)

  return (
    <div>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Welcome to your Dashboard</h1>
          <p className='mt-2 text-gray-600'>
            Hello, {session.user.username || session.user.name || 'friend'}!
            Track your progress below.
          </p>
        </div>
        <div>
          <LogActionDialog />
        </div>
      </div>

      <ActionLog logs={logs} />
    </div>
  )
}

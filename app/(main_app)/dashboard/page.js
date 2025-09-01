// File: app/(main_app)/dashboard/page.js

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { LogActionDialog } from '@/components/LogActionDialog'
import ActionLog from '@/components/ActionLog'
import { redirect } from 'next/navigation' 
import { FootprintChart } from '@/components/FootprintChart'

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

      <FootprintChart data={logs} />
      <div className='my-8 border-t' />
      <h2 className='text-2xl font-bold mb-4'>Action Log</h2>
      <p className='text-gray-60
0 mb-4'>
        Here is a detailed log of your daily actions and their carbon footprints.
      </p>
      <ActionLog logs={logs} />
    </div>
  )
}


import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { UsernameForm } from '@/components/UsernameForm'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/')
  }

  return (
    <div>
      <h1 className='text-3xl font-bold'>Settings</h1>
      <p className='mt-2 text-gray-600'>Manage your account and preferences.</p>

      <div className='mt-8'>
        <UsernameForm user={session.user} />
      </div>
    </div>
  )
}

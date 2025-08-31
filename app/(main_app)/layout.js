import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AuthButtons from '@/components/AuthButtons'

export default async function MainAppLayout({ children }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/')
  }
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm'>
        <nav className='container mx-auto flex items-center justify-between px-4 py-4'>
          <h1 className='text-xl font-bold text-emerald-600'>EcoPack AI</h1>
          <AuthButtons />
        </nav>
      </header>
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  )
}

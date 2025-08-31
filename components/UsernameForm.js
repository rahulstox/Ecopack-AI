// File: components/UsernameForm.js
'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Toaster, toast } from 'sonner' // For notifications

export function UsernameForm({ user }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: user?.username || '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/user/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.username }),
      })

      if (!response.ok) throw new Error('Username may already be taken.')

      toast.success('Username updated successfully!')
      // You might want to refresh the page or session here
      window.location.reload()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <Toaster richColors />
      <Card>
        <CardHeader>
          <CardTitle>Display Name</CardTitle>
          <CardDescription>
            This will be your public name on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex items-end gap-4'
          >
            <div className='flex-grow'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                {...register('username', { required: true, minLength: 3 })}
              />
            </div>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

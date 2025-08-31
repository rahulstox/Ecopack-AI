// File: components/LogActionDialog.js
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LogActionDialog() {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  // This function now sends the data to our backend API
  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save the action.')
      }

      console.log('Action saved successfully!')
      // In the future, we can add a success notification (toast) here
    } catch (error) {
      console.error(error)
      // We can add an error notification here
    } finally {
      // This part runs whether the API call succeeds or fails
      reset()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Log New Action</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Log an Eco-Friendly Action</DialogTitle>
            <DialogDescription>
              What have you done today to reduce your carbon footprint?
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='category' className='text-right'>
                Category
              </Label>
              <select
                id='category'
                {...register('category', { required: true })}
                className='col-span-3 h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm'
              >
                <option value=''>Select a category</option>
                <option value='transport'>Transport</option>
                <option value='food'>Food</option>
                <option value='energy'>Home Energy</option>
              </select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='value' className='text-right'>
                Amount
              </Label>
              <Input
                id='value'
                type='number'
                placeholder='e.g., 10'
                className='col-span-3'
                {...register('value', { required: true, valueAsNumber: true })}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='unit' className='text-right'>
                Unit
              </Label>
              <Input
                id='unit'
                placeholder='e.g., km, kWh, meals'
                className='col-span-3'
                {...register('unit', { required: true })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Save Action</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

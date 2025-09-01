// File: components/LogActionDialog.js
'use client'

import { useState, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster, toast } from 'sonner'

const activityOptions = {
  transport: [
    { value: 'car_petrol', label: 'Car (Petrol)', unit: 'km' },
    { value: 'car_diesel', label: 'Car (Diesel)', unit: 'km' },
    { value: 'car_electric', label: 'Car (Electric)', unit: 'km' },
    { value: 'bus', label: 'Bus', unit: 'km' },
    { value: 'train', label: 'Train', unit: 'km' },
  ],
  food: [
    { value: 'red_meat_meal', label: 'Red Meat Meal', unit: 'meal' },
    { value: 'chicken_meal', label: 'Chicken Meal', unit: 'meal' },
    { value: 'vegetarian_meal', label: 'Vegetarian Meal', unit: 'meal' },
    { value: 'vegan_meal', label: 'Vegan Meal', unit: 'meal' },
  ],
  energy: [
    { value: 'grid_electricity', label: 'Home Electricity', unit: 'kWh' },
  ],
}

export function LogActionDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, watch, setValue } = useForm()

  const selectedCategory = watch('category')
  const selectedActivity = watch('activity')

  useEffect(() => {
    if (selectedCategory) {
      setValue('activity', '')
      setValue('unit', '')
    }
  }, [selectedCategory, setValue])

  useEffect(() => {
    if (selectedCategory && selectedActivity) {
      const unit =
        activityOptions[selectedCategory]?.find(
          (opt) => opt.value === selectedActivity
        )?.unit || ''
      setValue('unit', unit)
    }
  }, [selectedActivity, selectedCategory, setValue])

  const handleSuccess = (message) => {
    toast.success(message)
    setTimeout(() => window.location.reload(), 1500)
    setOpen(false)
  }

  const handleError = (error) => {
    toast.error(error.message || 'An unknown error occurred.')
    setIsSubmitting(false)
  }

  const onAiSubmit = async (data) => {
    setIsSubmitting(true)
    const toastId = toast.loading('Interpreting your entry...')
    try {
      const interpretResponse = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.logEntry }),
      })
      if (!interpretResponse.ok)
        throw new Error('Could not understand your entry.')
      const { actions } = await interpretResponse.json()
      if (!actions || actions.length === 0) {
        toast.info('No actions found to log.', { id: toastId })
        setIsSubmitting(false)
        setOpen(false)
        reset()
        return
      }
      toast.loading(`Found ${actions.length} action(s). Calculating...`, {
        id: toastId,
      })
      const calculationPromises = actions.map((action) =>
        fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action),
        })
      )
      const results = await Promise.all(calculationPromises)
      const failedRequest = results.find((res) => !res.ok)
      if (failedRequest) {
        const errorData = await failedRequest.json()
        throw new Error(errorData.error || 'One or more actions failed.')
      }
      handleSuccess(`Successfully logged ${actions.length} new action(s)!`)
    } catch (error) {
      handleError(error)
    }
  }

  const onManualSubmit = async (data) => {
    setIsSubmitting(true)
    const toastId = toast.loading('Logging action...')
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save action.')
      }
      handleSuccess('Action logged successfully!')
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <>
      <Toaster richColors />
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isSubmitting) {
            setOpen(isOpen)
            reset()
          }
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={() => reset()}>Log New Action</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Log an Eco-Friendly Action</DialogTitle>
            <DialogDescription>
              Use AI for quick entry or switch to manual for more control.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue='ai' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='ai'>Log with AI</TabsTrigger>
              <TabsTrigger value='manual'>Log Manually</TabsTrigger>
            </TabsList>

            <TabsContent value='ai'>
              <form onSubmit={handleSubmit(onAiSubmit)}>
                <div className='grid gap-4 py-4'>
                  <Label htmlFor='logEntry'>Today's activities</Label>
                  <Textarea
                    id='logEntry'
                    placeholder='e.g., I drove my petrol car 15km...'
                    rows={5}
                    {...register('logEntry')}
                  />
                </div>
                <DialogFooter>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Logging...' : 'Save with AI'}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value='manual'>
              <form onSubmit={handleSubmit(onManualSubmit)}>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='category' className='text-right'>
                      Category
                    </Label>
                    <select
                      {...register('category')}
                      className='col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                    >
                      <option value=''>Select...</option>
                      <option value='transport'>Transport</option>
                      <option value='food'>Food</option>
                      <option value='energy'>Home Energy</option>
                    </select>
                  </div>

                  {selectedCategory && (
                    <>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='activity' className='text-right'>
                          Activity
                        </Label>
                        <select
                          {...register('activity')}
                          className='col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                        >
                          <option value=''>Select...</option>
                          {activityOptions[selectedCategory].map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='value' className='text-right'>
                          Amount
                        </Label>
                        <Input
                          id='value'
                          type='number'
                          step='any'
                          // ✅ CORRECTED: Only register the field once, with the correct options
                          {...register('value', {
                            required: true,
                            valueAsNumber: true,
                          })}
                          className='col-span-2'
                        />
                        <Input
                          id='unit'
                          readOnly
                          {...register('unit')}
                          className='col-span-1 bg-gray-100 text-center'
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Logging...' : 'Save Manually'}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

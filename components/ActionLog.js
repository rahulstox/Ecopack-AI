'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react' // Import a nice icon
import { toast, Toaster } from 'sonner' // Import toast for notifications

export default function ActionLog({ logs }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Handle the delete action
  const handleDelete = async (logId, actionTimestamp) => {
    const toastId = toast.loading('Deleting action...')
    try {
      const response = await fetch('/api/action', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId, actionTimestamp }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete action.')
      }

      toast.success('Action deleted!', { id: toastId })
      // Refresh the page to show the updated log
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      toast.error(error.message, { id: toastId })
    }
  }

  const totalFootprint =
    logs && logs.length > 0
      ? logs.reduce((total, log) => total + log.carbonFootprint, 0)
      : 0

  return (
    <>
      <Toaster richColors />
      <Card>
        <CardHeader>
          <CardTitle>Daily Log</CardTitle>
          <CardDescription>
            {/* Make sure this uses totalFootprint */}
            Total Footprint for Displayed Logs: {totalFootprint.toFixed(2)} kg
            CO₂e
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>CO₂ Footprint</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.flatMap((log) =>
                  (log.actions || []).map((action, index) => (
                    <TableRow key={`${log.id}-${index}`}>
                      <TableCell>{formatDate(log.date)}</TableCell>
                      {/* Use a more descriptive action name */}
                      <TableCell className='font-medium capitalize'>
                        {(action.activity || '').replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell>{`${action.value} ${action.unit}`}</TableCell>
                      <TableCell className='font-bold'>
                        {action.carbonFootprint?.toFixed(2) ?? 'N/A'} kg
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(log.id, action.timestamp)}
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>
                    You haven't logged any actions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
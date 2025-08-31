// File: components/ActionLog.js
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

export default function ActionLog({ logs }) {
  // A helper to format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Log</CardTitle>
        <CardDescription>
          A record of your recently logged eco-friendly actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) =>
                log.actions.map((action, index) => (
                  <TableRow key={`${log.id}-${index}`}>
                    <TableCell>{formatDate(log.date)}</TableCell>
                    <TableCell className='font-medium'>
                      {action.category}
                    </TableCell>
                    <TableCell>{`${action.value} ${action.unit}`}</TableCell>
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan='3' className='text-center'>
                  You haven't logged any actions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

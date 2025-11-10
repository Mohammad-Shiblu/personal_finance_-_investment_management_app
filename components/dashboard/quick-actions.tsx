/**
 * Quick Actions Component
 * Provides shortcuts for common financial management tasks
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Plus, Upload, Calculator, BarChart3, TrendingUp, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const quickActions = [
  {
    title: 'Add Expense',
    description: 'Log a new expense',
    icon: CreditCard,
    href: '/dashboard/expenses?action=add',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Import CSV',
    description: 'Upload bank statements',
    icon: Upload,
    href: '/dashboard/import',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Calculators',
    description: 'Financial planning tools',
    icon: Calculator,
    href: '/dashboard/calculators',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'View Analytics',
    description: 'Financial insights & trends',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    title: 'Add Investment',
    description: 'Track portfolio holdings',
    icon: Plus,
    href: '/dashboard/investments?action=add',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

export function QuickActions() {
  const router = useRouter()
  const [showIncomeDialog, setShowIncomeDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    frequency: 'monthly'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: formData.source,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: new Date(formData.date),
          isRecurring: formData.isRecurring,
          frequency: formData.frequency
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add income')
      }

      setFormData({
        source: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
        frequency: 'monthly'
      })
      
      setShowIncomeDialog(false)
      router.refresh()
      alert('Income added successfully!')
      
    } catch (err) {
      setError('Failed to add income. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your finances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Add Income - Opens Dialog */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={() => setShowIncomeDialog(true)}
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50 w-full"
              >
                <div className="p-3 rounded-lg bg-green-50">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    Add Income
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Record a new income entry
                  </div>
                </div>
              </Button>
            </motion.div>

            {/* Other actions */}
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index + 1) * 0.05 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50"
                >
                  <Link href={action.href}>
                    <div className={`p-3 rounded-lg ${action.bgColor}`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {action.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {action.description}
                      </div>
                    </div>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Income Dialog */}
      <Dialog open={showIncomeDialog} onOpenChange={setShowIncomeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Income</DialogTitle>
            <DialogDescription>
              Record a new income entry
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Income Source *
              </label>
              <input
                type="text"
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g., Salary, Freelance"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Amount *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional notes"
                rows={2}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              />
              <label htmlFor="recurring" className="text-sm">
                Recurring income
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowIncomeDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Adding...' : 'Add Income'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
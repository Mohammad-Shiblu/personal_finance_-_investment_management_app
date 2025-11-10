/**
 * Quick Actions Component
 * Provides shortcuts for common financial management tasks
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Plus, Upload, Calculator, BarChart3, TrendingUp, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '../../hooks/use-toast'

const quickActions = [
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
  const { toast } = useToast()
  const [showIncomeDialog, setShowIncomeDialog] = useState(false)
  const [showExpenseDialog, setShowExpenseDialog] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    source: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    frequency: ''
  })

  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: ''
  })

  useEffect(() => {
    if (showExpenseDialog) {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => data.success && setCategories(data.data))
    }
  }, [showExpenseDialog])

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...incomeForm, amount: parseFloat(incomeForm.amount) })
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: 'Income added successfully' })
        setShowIncomeDialog(false)
        setIncomeForm({ amount: '', source: '', description: '', date: new Date().toISOString().split('T')[0], isRecurring: false, frequency: '' })
        window.location.reload()
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add income', variant: 'destructive' })
    }
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...expenseForm, 
          amount: parseFloat(expenseForm.amount),
          description: expenseForm.description || 'Expense'
        })
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: 'Expense added successfully' })
        setShowExpenseDialog(false)
        setExpenseForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0], categoryId: '' })
        window.location.reload()
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add expense', variant: 'destructive' })
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
            {/* Add Income */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Button variant="ghost" onClick={() => setShowIncomeDialog(true)} className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50 w-full">
                <div className="p-3 rounded-lg bg-green-50">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Add Income</div>
                  <div className="text-xs text-gray-500 mt-1">Record a new income entry</div>
                </div>
              </Button>
            </motion.div>

            {/* Add Expense */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
              <Button variant="ghost" onClick={() => setShowExpenseDialog(true)} className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50 w-full">
                <div className="p-3 rounded-lg bg-red-50">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Add Expense</div>
                  <div className="text-xs text-gray-500 mt-1">Log a new expense</div>
                </div>
              </Button>
            </motion.div>

            {/* Other actions */}
            {quickActions.map((action, index) => (
              <motion.div key={action.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: (index + 2) * 0.05 }}>
                <Button variant="ghost" asChild className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50">
                  <Link href={action.href}>
                    <div className={`p-3 rounded-lg ${action.bgColor}`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{action.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{action.description}</div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Income</DialogTitle>
            <DialogDescription>Enter details for your income source</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleIncomeSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input id="amount" type="number" step="0.01" value={incomeForm.amount} onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })} placeholder="0.00" required />
            </div>
            <div>
              <Label htmlFor="source">Source *</Label>
              <Input id="source" value={incomeForm.source} onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })} placeholder="e.g., Salary, Freelance, Investment" required />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={incomeForm.date} onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={incomeForm.description} onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })} placeholder="Optional notes about this income" rows={3} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isRecurring" checked={incomeForm.isRecurring} onChange={(e) => setIncomeForm({ ...incomeForm, isRecurring: e.target.checked })} className="rounded" />
              <Label htmlFor="isRecurring">Recurring Income</Label>
            </div>
            {incomeForm.isRecurring && (
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={incomeForm.frequency} onValueChange={(value) => setIncomeForm({ ...incomeForm, frequency: value })}>
                  <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowIncomeDialog(false)}>Cancel</Button>
              <Button type="submit">Add Income</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Enter details for your expense</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <Label htmlFor="expAmount">Amount *</Label>
              <Input id="expAmount" type="number" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} placeholder="0.00" required />
            </div>
            <div>
              <Label htmlFor="expDescription">Description</Label>
              <Textarea id="expDescription" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="What was this expense for?" rows={3} />
            </div>
            <div>
              <Label htmlFor="expDate">Date *</Label>
              <Input id="expDate" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={expenseForm.categoryId} onValueChange={(value) => setExpenseForm({ ...expenseForm, categoryId: value })} required>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowExpenseDialog(false)}>Cancel</Button>
              <Button type="submit">Add Expense</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
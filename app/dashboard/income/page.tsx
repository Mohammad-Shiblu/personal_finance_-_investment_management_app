'use client'

/**
 * Income Management Page
 * Provides interface for tracking and managing income sources
 * Features: Add/Edit/Delete income entries, view income history, monthly summaries
 */

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { useToast } from '../../../hooks/use-toast'
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react'

// Type definition for income entry
interface Income {
  id: string
  amount: number
  source: string
  description: string | null
  date: string
  isRecurring: boolean
  frequency: string | null
  createdAt: string
}

export default function IncomePage() {
  // State management for income data and UI
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const { toast } = useToast()

  // Form state for income entry
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    frequency: ''
  })

  /**
   * Fetch all income entries from API on component mount
   */
  useEffect(() => {
    fetchIncomes()
  }, [])

  /**
   * Fetch income entries from the backend API
   * Loads all income records for the authenticated user
   */
  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/income')
      const result = await response.json()
      
      if (result.success) {
        setIncomes(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch income data',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load income data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle form submission for creating or updating income entry
   * Validates input and sends POST or PUT request to API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.amount || !formData.source || !formData.date) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = editingIncome ? '/api/income' : '/api/income'
      const method = editingIncome ? 'PUT' : 'POST'
      
      const payload = editingIncome 
        ? { ...formData, id: editingIncome.id, amount: parseFloat(formData.amount) }
        : { ...formData, amount: parseFloat(formData.amount) }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: editingIncome ? 'Income updated successfully' : 'Income added successfully'
        })
        setDialogOpen(false)
        resetForm()
        fetchIncomes()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save income',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save income entry',
        variant: 'destructive'
      })
    }
  }

  /**
   * Open dialog for editing existing income entry
   * Populates form with current income data
   */
  const handleEdit = (income: Income) => {
    setEditingIncome(income)
    setFormData({
      amount: income.amount.toString(),
      source: income.source,
      description: income.description || '',
      date: income.date.split('T')[0],
      isRecurring: income.isRecurring,
      frequency: income.frequency || ''
    })
    setDialogOpen(true)
  }

  /**
   * Delete income entry after confirmation
   * Sends DELETE request to API
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this income entry?')) return

    try {
      const response = await fetch(`/api/income/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Income deleted successfully'
        })
        fetchIncomes()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete income',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete income entry',
        variant: 'destructive'
      })
    }
  }

  /**
   * Reset form to initial state
   * Clears all form fields and editing state
   */
  const resetForm = () => {
    setFormData({
      amount: '',
      source: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      frequency: ''
    })
    setEditingIncome(null)
  }

  /**
   * Calculate total income from all entries
   */
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income Management</h1>
          <p className="mt-1 text-sm text-gray-600">Track your income sources</p>
        </div>
        
        {/* Add Income Button */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIncome ? 'Edit Income' : 'Add New Income'}</DialogTitle>
              <DialogDescription>
                {editingIncome ? 'Update income entry details' : 'Enter details for your income source'}
              </DialogDescription>
            </DialogHeader>
            
            {/* Income Entry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="source">Source *</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., Salary, Freelance, Investment"
                  required
                />
              </div>

              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional notes about this income"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isRecurring">Recurring Income</Label>
              </div>

              {formData.isRecurring && (
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
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
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingIncome ? 'Update' : 'Add'} Income
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-green-600" />
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">
            ${totalIncome.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {incomes.length} income {incomes.length === 1 ? 'entry' : 'entries'}
          </p>
        </CardContent>
      </Card>

      {/* Income List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
          <CardDescription>View and manage your income entries</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading income data...</p>
          ) : incomes.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No income entries yet. Click "Add Income" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Recurring</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomes.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell>{new Date(income.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{income.source}</TableCell>
                    <TableCell className="text-gray-600">
                      {income.description || '-'}
                    </TableCell>
                    <TableCell>
                      {income.isRecurring ? (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {income.frequency}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ${income.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(income)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(income.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

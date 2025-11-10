'use client'

/**
 * Expense Management Page
 * Provides interface for tracking and categorizing expenses
 * Features: Add/Edit/Delete expenses, category filtering, expense summaries
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
import { Plus, Pencil, Trash2, TrendingDown } from 'lucide-react'

// Type definitions
interface Expense {
  id: string
  amount: number
  description: string
  date: string
  categoryId: string
  category: {
    id: string
    name: string
    color: string | null
  }
  createdAt: string
}

interface Category {
  id: string
  name: string
  color: string | null
}

export default function ExpensesPage() {
  // State management
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: ''
  })

  /**
   * Load expenses and categories on component mount
   */
  useEffect(() => {
    fetchCategories()
    fetchExpenses()
  }, [])

  /**
   * Reload expenses when filter changes
   */
  useEffect(() => {
    fetchExpenses()
  }, [filterCategory])

  /**
   * Fetch all categories from API
   * Categories are used for expense classification
   */
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  /**
   * Fetch expenses with optional category filter
   * Loads expense records for the authenticated user
   */
  const fetchExpenses = async () => {
    try {
      const url = filterCategory === 'all' 
        ? '/api/expenses'
        : `/api/expenses?categoryId=${filterCategory}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setExpenses(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch expenses',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load expense data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle form submission for creating or updating expense
   * Validates input and sends POST or PUT request to API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.amount || !formData.description || !formData.date || !formData.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = '/api/expenses'
      const method = editingExpense ? 'PUT' : 'POST'
      
      const payload = editingExpense 
        ? { ...formData, id: editingExpense.id, amount: parseFloat(formData.amount) }
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
          description: editingExpense ? 'Expense updated successfully' : 'Expense added successfully'
        })
        setDialogOpen(false)
        resetForm()
        fetchExpenses()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save expense',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save expense entry',
        variant: 'destructive'
      })
    }
  }

  /**
   * Open dialog for editing existing expense
   * Populates form with current expense data
   */
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData({
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date.split('T')[0],
      categoryId: expense.categoryId
    })
    setDialogOpen(true)
  }

  /**
   * Delete expense entry after confirmation
   * Sends DELETE request to API
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Expense deleted successfully'
        })
        fetchExpenses()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete expense',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense entry',
        variant: 'destructive'
      })
    }
  }

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: ''
    })
    setEditingExpense(null)
  }

  /**
   * Calculate total expenses
   */
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="mt-1 text-sm text-gray-600">Track and categorize your expenses</p>
        </div>
        
        {/* Add Expense Button */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              <DialogDescription>
                {editingExpense ? 'Update expense details' : 'Enter details for your expense'}
              </DialogDescription>
            </DialogHeader>
            
            {/* Expense Entry Form */}
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What was this expense for?"
                  required
                  rows={3}
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
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExpense ? 'Update' : 'Add'} Expense
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary and Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="mr-2 h-5 w-5 text-red-600" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {expenses.length} expense {expenses.length === 1 ? 'entry' : 'entries'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Expense List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>View and manage your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No expenses found. Click "Add Expense" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: expense.category.color || '#e5e7eb',
                          color: '#1f2937'
                        }}
                      >
                        {expense.category.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
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

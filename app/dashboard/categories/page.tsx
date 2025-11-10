'use client'

/**
 * Category Management Page
 * Manage expense categories for organizing transactions
 */

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { useToast } from '../../../hooks/use-toast'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string | null
  color: string | null
  icon: string | null
  isDefault: boolean
  expenseCount?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4ECDC4'
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  /**
   * Fetch all categories with expense counts
   */
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeExpenseCount=true')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch categories',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle form submission for create/update
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const payload = editingCategory 
        ? { ...formData, id: editingCategory.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: editingCategory ? 'Category updated' : 'Category created'
        })
        setDialogOpen(false)
        resetForm()
        fetchCategories()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save category',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save category',
        variant: 'destructive'
      })
    }
  }

  /**
   * Open edit dialog
   */
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#4ECDC4'
    })
    setDialogOpen(true)
  }

  /**
   * Delete category
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Category deleted'
        })
        fetchCategories()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete category',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive'
      })
    }
  }

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#4ECDC4'
    })
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-600">Manage expense categories</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update category details' : 'Create a new expense category'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Groceries"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#4ECDC4"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5" />
            Your Categories
          </CardTitle>
          <CardDescription>
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No categories yet. Click "Add Category" to create one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: category.color || '#ccc' }}
                        />
                        <span className="text-xs text-gray-500">{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>{category.expenseCount || 0}</TableCell>
                    <TableCell>
                      {category.isDefault ? (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Default
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Custom
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {!category.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            disabled={category.expenseCount! > 0}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
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

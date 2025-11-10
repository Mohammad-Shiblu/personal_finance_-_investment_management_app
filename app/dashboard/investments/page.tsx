'use client'

/**
 * Investment Portfolio Page
 * Manage investment portfolio including ETFs, Crypto, Stocks, and Bonds
 * Features: Add/Edit/Delete investments, portfolio summary, performance tracking
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
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

// Type definitions
interface Investment {
  id: string
  name: string
  type: 'ETF' | 'Crypto' | 'Stock' | 'Bond'
  symbol: string | null
  quantity: number
  purchasePrice: number
  currentPrice: number | null
  purchaseDate: string
  lastPriceUpdate: string | null
  notes: string | null
  totalInvested: number
  totalCurrentValue: number
  gainLoss: number
  gainLossPercentage: number
}

export default function InvestmentsPage() {
  // State management
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Stock' as 'ETF' | 'Crypto' | 'Stock' | 'Bond',
    symbol: '',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  /**
   * Load investments on component mount
   */
  useEffect(() => {
    fetchInvestments()
  }, [])

  /**
   * Fetch all investments from API
   * Loads complete portfolio with calculated performance metrics
   */
  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments')
      const result = await response.json()
      
      if (result.success) {
        setInvestments(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch investments',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load investment data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle form submission for creating or updating investment
   * Validates input and sends POST or PUT request to API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.type || !formData.quantity || !formData.purchasePrice || !formData.purchaseDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = '/api/investments'
      const method = editingInvestment ? 'PUT' : 'POST'
      
      const payload = {
        ...(editingInvestment && { id: editingInvestment.id }),
        name: formData.name,
        type: formData.type,
        symbol: formData.symbol || null,
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : null,
        purchaseDate: formData.purchaseDate,
        notes: formData.notes || null
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: editingInvestment ? 'Investment updated successfully' : 'Investment added successfully'
        })
        setDialogOpen(false)
        resetForm()
        fetchInvestments()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save investment',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save investment',
        variant: 'destructive'
      })
    }
  }

  /**
   * Open dialog for editing existing investment
   * Populates form with current investment data
   */
  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment)
    setFormData({
      name: investment.name,
      type: investment.type,
      symbol: investment.symbol || '',
      quantity: investment.quantity.toString(),
      purchasePrice: investment.purchasePrice.toString(),
      currentPrice: investment.currentPrice?.toString() || '',
      purchaseDate: investment.purchaseDate.split('T')[0],
      notes: investment.notes || ''
    })
    setDialogOpen(true)
  }

  /**
   * Delete investment entry after confirmation
   * Sends DELETE request to API
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investment?')) return

    try {
      const response = await fetch(`/api/investments/${id}`, { method: 'DELETE' })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Investment deleted successfully'
        })
        fetchInvestments()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete investment',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete investment',
        variant: 'destructive'
      })
    }
  }

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Stock',
      symbol: '',
      quantity: '',
      purchasePrice: '',
      currentPrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setEditingInvestment(null)
  }

  /**
   * Calculate portfolio totals
   */
  const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.totalCurrentValue, 0)
  const totalGainLoss = totalCurrentValue - totalInvested
  const totalGainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
          <p className="mt-1 text-sm text-gray-600">Track your investments and portfolio performance</p>
        </div>
        
        {/* Add Investment Button */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingInvestment ? 'Edit Investment' : 'Add New Investment'}</DialogTitle>
              <DialogDescription>
                {editingInvestment ? 'Update investment details' : 'Enter details for your investment'}
              </DialogDescription>
            </DialogHeader>
            
            {/* Investment Entry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Investment Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Apple Inc., Bitcoin"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stock">Stock</SelectItem>
                      <SelectItem value="ETF">ETF</SelectItem>
                      <SelectItem value="Crypto">Crypto</SelectItem>
                      <SelectItem value="Bond">Bond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="symbol">Symbol/Ticker</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    placeholder="e.g., AAPL, BTC"
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.00000001"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="currentPrice">Current Price</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    placeholder="Leave empty to use purchase price"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes about this investment"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingInvestment ? 'Update' : 'Add'} Investment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalInvested.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalCurrentValue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {totalGainLoss >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              )}
              <div>
                <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(totalGainLoss).toFixed(2)}
                </p>
                <p className={`text-sm ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalGainLossPercentage >= 0 ? '+' : ''}{totalGainLossPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Investments</CardTitle>
          <CardDescription>View and manage your investment portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading investments...</p>
          ) : investments.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No investments yet. Click "Add Investment" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Purchase Price</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.name}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {investment.type}
                      </span>
                    </TableCell>
                    <TableCell>{investment.symbol || '-'}</TableCell>
                    <TableCell className="text-right">{investment.quantity}</TableCell>
                    <TableCell className="text-right">${investment.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      ${(investment.currentPrice || investment.purchasePrice).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${investment.totalCurrentValue.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      investment.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {investment.gainLoss >= 0 ? '+' : ''}${investment.gainLoss.toFixed(2)}
                      <br />
                      <span className="text-xs">
                        ({investment.gainLossPercentage >= 0 ? '+' : ''}{investment.gainLossPercentage.toFixed(2)}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(investment)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(investment.id)}
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

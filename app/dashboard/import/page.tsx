'use client'

/**
 * CSV Import Page
 * Allows users to import financial transactions from CSV files
 * Features: File upload, transaction preview, category mapping, bulk processing
 */

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { useToast } from '../../../hooks/use-toast'
import { Upload, FileText, CheckCircle, XCircle, Trash2 } from 'lucide-react'

// Type definitions
interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  category: string | null
  source: string
  imported: boolean
  processed: boolean
}

interface Category {
  id: string
  name: string
}

export default function ImportPage() {
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [categoryMappings, setCategoryMappings] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()

  /**
   * Load unprocessed transactions and categories on mount
   */
  useEffect(() => {
    fetchCategories()
    fetchUnprocessedTransactions()
  }, [])

  /**
   * Fetch all categories for expense mapping
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
   * Fetch unprocessed imported transactions
   * These are transactions that have been imported but not yet converted to income/expenses
   */
  const fetchUnprocessedTransactions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/import/transactions')
      const result = await response.json()
      
      if (result.success) {
        setTransactions(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch transactions',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle file selection
   * Validates that selected file is a CSV
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast({
          title: 'Invalid File',
          description: 'Please select a CSV file',
          variant: 'destructive'
        })
        return
      }
      setSelectedFile(file)
    }
  }

  /**
   * Upload and process CSV file
   * Sends file to backend for parsing and importing
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a CSV file to upload',
        variant: 'destructive'
      })
      return
    }

    try {
      setUploading(true)
      
      // Create form data with file
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('source', selectedFile.name)

      // Upload to API
      const response = await fetch('/api/import/csv', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Import Successful',
          description: `Imported ${result.data.successful} transactions. ${result.data.failed} failed.`
        })
        setSelectedFile(null)
        fetchUnprocessedTransactions()
      } else {
        toast({
          title: 'Import Failed',
          description: result.error || 'Failed to import CSV file',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload CSV file',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  /**
   * Update category mapping for a transaction
   * Used to assign categories to expense transactions
   */
  const handleCategoryMapping = (transactionId: string, categoryId: string) => {
    setCategoryMappings({
      ...categoryMappings,
      [transactionId]: categoryId
    })
  }

  /**
   * Process selected transactions
   * Converts imported transactions to income/expense records
   */
  const handleProcessTransactions = async (transactionIds: string[]) => {
    if (transactionIds.length === 0) {
      toast({
        title: 'No Transactions Selected',
        description: 'Please select transactions to process',
        variant: 'destructive'
      })
      return
    }

    try {
      const response = await fetch('/api/import/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionIds,
          categoryMappings
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Processing Complete',
          description: `Created ${result.data.incomeCreated} income and ${result.data.expensesCreated} expense entries`
        })
        fetchUnprocessedTransactions()
        setCategoryMappings({})
      } else {
        toast({
          title: 'Processing Failed',
          description: result.error || 'Failed to process transactions',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process transactions',
        variant: 'destructive'
      })
    }
  }

  /**
   * Process all unprocessed transactions
   */
  const handleProcessAll = () => {
    const allIds = transactions.map(t => t.id)
    handleProcessTransactions(allIds)
  }

  /**
   * Delete selected transactions
   * Removes imported transactions before processing
   */
  const handleDeleteTransactions = async (transactionIds: string[]) => {
    if (!confirm('Are you sure you want to delete these transactions?')) return

    try {
      const response = await fetch('/api/import/transactions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionIds })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: result.data.message
        })
        fetchUnprocessedTransactions()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete transactions',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete transactions',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Import Transactions</h1>
        <p className="mt-1 text-sm text-gray-600">Upload CSV files from your bank or financial institution</p>
      </div>

      {/* File Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Upload CSV File
          </CardTitle>
          <CardDescription>
            Select a CSV file containing your transactions. Required columns: date, description, amount, type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csvFile">CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload & Import'}
              </Button>
            </div>
          )}

          {/* CSV Format Help */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>date</strong>: Transaction date (YYYY-MM-DD format)</li>
              <li>• <strong>description</strong>: Transaction description</li>
              <li>• <strong>amount</strong>: Transaction amount (positive number)</li>
              <li>• <strong>type</strong>: "income" or "expense"</li>
              <li>• <strong>category</strong>: Optional category name</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Unprocessed Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Imported Transactions</CardTitle>
              <CardDescription>
                Review and process imported transactions ({transactions.length} pending)
              </CardDescription>
            </div>
            {transactions.length > 0 && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteTransactions(transactions.map(t => t.id))}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All
                </Button>
                <Button onClick={handleProcessAll}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Process All
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No pending transactions. Upload a CSV file to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {transaction.type === 'expense' ? (
                        <Select
                          value={categoryMappings[transaction.id] || ''}
                          onValueChange={(value) => handleCategoryMapping(transaction.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleProcessTransactions([transaction.id])}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTransactions([transaction.id])}
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
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


/**
 * Recent Transactions Component
 * Displays recent income and expense entries
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { ArrowUpRight, ArrowDownRight, ExternalLink, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  source?: string
  category?: {
    name: string
    color?: string
  }
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRecentTransactions()
  }, [])

  const fetchRecentTransactions = async () => {
    try {
      // Fetch recent income and expenses
      const [incomeResponse, expenseResponse] = await Promise.all([
        fetch('/api/income?limit=5'),
        fetch('/api/expenses?limit=5')
      ])

      const [incomeData, expenseData] = await Promise.all([
        incomeResponse.json(),
        expenseResponse.json()
      ])

      const recentTransactions: Transaction[] = []

      // Add recent income
      if (incomeData.success && incomeData.data) {
        incomeData.data.slice(0, 3).forEach((income: any) => {
          recentTransactions.push({
            id: income.id,
            type: 'income',
            amount: income.amount,
            description: income.description || income.source,
            date: income.date,
            source: income.source
          })
        })
      }

      // Add recent expenses
      if (expenseData.success && expenseData.data) {
        expenseData.data.slice(0, 3).forEach((expense: any) => {
          recentTransactions.push({
            id: expense.id,
            type: 'expense',
            amount: expense.amount,
            description: expense.description,
            date: expense.date,
            category: expense.category
          })
        })
      }

      // Sort by date (most recent first)
      recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setTransactions(recentTransactions.slice(0, 6))
    } catch (error) {
      console.error('Error fetching recent transactions:', error)
      setError('Failed to load recent transactions')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/analytics">
              View All
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm mb-2">No recent transactions</p>
            <p className="text-xs text-gray-500">
              Start by adding your income and expenses to see them here.
            </p>
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">
                    {transaction.description}
                  </p>
                  {transaction.category && (
                    <Badge variant="secondary" className="text-xs">
                      {transaction.category.name}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                  {transaction.source && (
                    <Badge variant="outline" className="text-xs">
                      {transaction.source}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

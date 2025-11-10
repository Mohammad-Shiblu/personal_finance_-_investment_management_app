
/**
 * Expense Category Chart Component
 * Displays expense breakdown by category using a pie chart
 */

'use client'

import { useState, useEffect } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

interface CategoryData {
  categoryName: string
  amount: number
  percentage: number
  color?: string
}

interface ChartData {
  name: string
  value: number
  percentage: number
  color: string
}

export default function ExpenseCategoryChart() {
  const [data, setData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategoryData()
  }, [])

  const fetchCategoryData = async () => {
    try {
      const response = await fetch('/api/expenses/by-category')
      const result = await response.json()

      if (result.success && result.data?.categoryBreakdown) {
        setData(result.data.categoryBreakdown)
      }
    } catch (error) {
      console.error('Error fetching category data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading category data...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No expense categories to display</p>
      </div>
    )
  }

  // Default colors for categories
  const defaultColors = [
    '#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', 
    '#80D8C3', '#A19AD3', '#72BF78', '#FFB366', '#8B5FBF'
  ]

  const chartData: ChartData[] = data.map((item, index) => ({
    name: item.categoryName,
    value: item.amount,
    percentage: item.percentage,
    color: item.color || defaultColors[index % defaultColors.length]
  }))

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
  }

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {formatCurrency(data.value)} ({data.payload.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderLegendText = (value: string, entry: any) => {
    const percentage = entry.payload?.percentage?.toFixed(1) || 0
    return `${value} (${percentage}%)`
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
          <Legend 
            verticalAlign="top"
            align="center"
            wrapperStyle={{ fontSize: 11, paddingBottom: '20px' }}
            iconType="circle"
            formatter={renderLegendText}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

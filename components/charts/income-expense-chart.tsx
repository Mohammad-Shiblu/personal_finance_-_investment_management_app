
/**
 * Income vs Expense Chart Component
 * Displays monthly income and expense trends using Recharts
 */

'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface ChartData {
  month: string
  income: number
  expenses: number
  net: number
}

interface IncomeExpenseChartProps {
  data: {
    incometrend?: Array<{ date: string; amount: number }>
    expensesTrend?: Array<{ date: string; amount: number }>
  } | null
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  if (!data?.incometrend || !data?.expensesTrend) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No trend data available</p>
      </div>
    )
  }

  // Combine income and expense data by month
  const chartData: ChartData[] = []
  const months = new Set([
    ...data.incometrend.map(item => item.date),
    ...data.expensesTrend.map(item => item.date)
  ])

  months.forEach(month => {
    const income = data.incometrend?.find(item => item.date === month)?.amount || 0
    const expense = data.expensesTrend?.find(item => item.date === month)?.amount || 0
    
    chartData.push({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      income,
      expenses: expense,
      net: income - expense
    })
  })

  // Sort by date
  chartData.sort((a, b) => a.month.localeCompare(b.month))

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [formatCurrency(value), name]}
            labelStyle={{ fontSize: 11 }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e0e0e0', 
              borderRadius: '6px',
              fontSize: 11 
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Income"
            dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Expenses"
            dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="net" 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Net Savings"
            dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

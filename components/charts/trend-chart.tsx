
/**
 * Trend Chart Component
 * Displays financial trends and projections
 */

'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'

interface ChartDataItem {
  month: string
  monthKey: string
  savings?: number
  projected?: number
  type: 'historical' | 'projected'
}

interface TrendChartProps {
  data: {
    incometrend?: Array<{ date: string; amount: number }>
    expensesTrend?: Array<{ date: string; amount: number }>
    projectedSavings?: Array<{ date: string; projected: number }>
    savingsRate?: number
  } | null
}

export default function TrendChart({ data }: TrendChartProps) {
  if (!data?.incometrend || !data?.expensesTrend) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No trend data available</p>
      </div>
    )
  }

  // Combine historical and projected data
  const chartData: ChartDataItem[] = []
  
  // Historical data
  const months = new Set([
    ...data.incometrend.map(item => item.date),
    ...data.expensesTrend.map(item => item.date)
  ])

  months.forEach(month => {
    const income = data.incometrend?.find(item => item.date === month)?.amount || 0
    const expense = data.expensesTrend?.find(item => item.date === month)?.amount || 0
    
    chartData.push({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      monthKey: month,
      savings: income - expense,
      type: 'historical'
    })
  })

  // Projected data
  if (data.projectedSavings && data.projectedSavings.length > 0) {
    data.projectedSavings.forEach(projection => {
      chartData.push({
        month: new Date(projection.date + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        monthKey: projection.date,
        projected: projection.projected,
        type: 'projected'
      })
    })
  }

  // Sort by date
  chartData.sort((a, b) => a.monthKey.localeCompare(b.monthKey))

  // Find the split point between historical and projected data
  const currentMonth = new Date().toISOString().slice(0, 7)
  const splitIndex = chartData.findIndex(item => item.monthKey > currentMonth)

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
  }

  return (
    <div className="space-y-4">
      {/* Savings Rate Display */}
      {data.savingsRate !== undefined && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-blue-900">Current Savings Rate</p>
            <p className="text-2xl font-bold text-blue-700">{data.savingsRate.toFixed(1)}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-600">
              {data.savingsRate >= 20 ? 'Excellent!' : data.savingsRate >= 10 ? 'Good' : 'Room for improvement'}
            </p>
            <p className="text-xs text-blue-500">Target: 20%+</p>
          </div>
        </div>
      )}

      {/* Trend Chart */}
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
            
            {splitIndex > 0 && (
              <ReferenceLine 
                x={chartData[splitIndex - 1]?.month} 
                stroke="#64748b" 
                strokeDasharray="2 2"
                label={{ value: "Now", position: "top" }}
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Historical Savings"
              dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="projected" 
              stroke="#3b82f6" 
              strokeWidth={2}
              strokeDasharray="8 4"
              name="Projected Savings"
              dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

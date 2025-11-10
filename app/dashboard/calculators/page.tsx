'use client'

/**
 * Financial Calculators Page
 * Provides various financial calculation tools
 * Features: Compound Interest, Savings Growth, Retirement Planning, Loan Calculator
 */

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useToast } from '../../../hooks/use-toast'
import { Calculator, TrendingUp, PiggyBank, Home } from 'lucide-react'

export default function CalculatorsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Compound Interest State
  const [compoundInterest, setCompoundInterest] = useState({
    principal: '',
    rate: '',
    time: '',
    frequency: '12'
  })
  const [compoundResult, setCompoundResult] = useState<any>(null)

  // Savings Growth State
  const [savingsGrowth, setSavingsGrowth] = useState({
    initialAmount: '',
    monthlyContribution: '',
    annualRate: '',
    years: ''
  })
  const [savingsResult, setSavingsResult] = useState<any>(null)

  // Retirement Planning State
  const [retirement, setRetirement] = useState({
    desiredMonthlyIncome: '',
    currentAge: '',
    retirementAge: '',
    currentSavings: '',
    expectedReturn: '7'
  })
  const [retirementResult, setRetirementResult] = useState<any>(null)

  // Loan Calculator State
  const [loan, setLoan] = useState({
    principal: '',
    annualRate: '',
    termYears: ''
  })
  const [loanResult, setLoanResult] = useState<any>(null)

  /**
   * Calculate compound interest
   * Sends calculation parameters to API and displays results
   */
  const calculateCompoundInterest = async () => {
    if (!compoundInterest.principal || !compoundInterest.rate || !compoundInterest.time) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/calculators/compound-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          principal: parseFloat(compoundInterest.principal),
          rate: parseFloat(compoundInterest.rate),
          time: parseInt(compoundInterest.time),
          frequency: parseInt(compoundInterest.frequency)
        })
      })

      const result = await response.json()

      if (result.success) {
        setCompoundResult(result.data)
      } else {
        toast({
          title: 'Calculation Error',
          description: result.error || 'Failed to calculate',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform calculation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calculate savings growth with monthly contributions
   * Sends calculation parameters to API and displays results
   */
  const calculateSavingsGrowth = async () => {
    if (!savingsGrowth.initialAmount || !savingsGrowth.monthlyContribution || !savingsGrowth.annualRate || !savingsGrowth.years) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/calculators/savings-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initialAmount: parseFloat(savingsGrowth.initialAmount),
          monthlyContribution: parseFloat(savingsGrowth.monthlyContribution),
          annualRate: parseFloat(savingsGrowth.annualRate),
          years: parseInt(savingsGrowth.years)
        })
      })

      const result = await response.json()

      if (result.success) {
        setSavingsResult(result.data)
      } else {
        toast({
          title: 'Calculation Error',
          description: result.error || 'Failed to calculate',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform calculation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calculate retirement planning needs
   * Determines required savings based on desired retirement income
   */
  const calculateRetirement = async () => {
    if (!retirement.desiredMonthlyIncome || !retirement.currentAge || !retirement.retirementAge) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/calculators/retirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desiredMonthlyIncome: parseFloat(retirement.desiredMonthlyIncome),
          currentAge: parseInt(retirement.currentAge),
          retirementAge: parseInt(retirement.retirementAge),
          currentSavings: parseFloat(retirement.currentSavings) || 0,
          expectedReturn: parseFloat(retirement.expectedReturn)
        })
      })

      const result = await response.json()

      if (result.success) {
        setRetirementResult(result.data)
      } else {
        toast({
          title: 'Calculation Error',
          description: result.error || 'Failed to calculate',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform calculation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calculate loan payment schedule
   * Computes monthly payment and total interest for a loan
   */
  const calculateLoan = async () => {
    if (!loan.principal || !loan.annualRate || !loan.termYears) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/calculators/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          principal: parseFloat(loan.principal),
          annualRate: parseFloat(loan.annualRate),
          termYears: parseInt(loan.termYears)
        })
      })

      const result = await response.json()

      if (result.success) {
        setLoanResult(result.data)
      } else {
        toast({
          title: 'Calculation Error',
          description: result.error || 'Failed to calculate',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform calculation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Calculators</h1>
        <p className="mt-1 text-sm text-gray-600">Plan your financial future with powerful calculation tools</p>
      </div>

      {/* Calculator Tabs */}
      <Tabs defaultValue="compound" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compound">Compound Interest</TabsTrigger>
          <TabsTrigger value="savings">Savings Growth</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
          <TabsTrigger value="loan">Loan</TabsTrigger>
        </TabsList>

        {/* Compound Interest Calculator */}
        <TabsContent value="compound">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Compound Interest Calculator
                </CardTitle>
                <CardDescription>
                  Calculate how your investment grows over time with compound interest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ci-principal">Principal Amount ($)</Label>
                  <Input
                    id="ci-principal"
                    type="number"
                    value={compoundInterest.principal}
                    onChange={(e) => setCompoundInterest({ ...compoundInterest, principal: e.target.value })}
                    placeholder="10000"
                  />
                </div>

                <div>
                  <Label htmlFor="ci-rate">Annual Interest Rate (%)</Label>
                  <Input
                    id="ci-rate"
                    type="number"
                    step="0.1"
                    value={compoundInterest.rate}
                    onChange={(e) => setCompoundInterest({ ...compoundInterest, rate: e.target.value })}
                    placeholder="5"
                  />
                </div>

                <div>
                  <Label htmlFor="ci-time">Time Period (years)</Label>
                  <Input
                    id="ci-time"
                    type="number"
                    value={compoundInterest.time}
                    onChange={(e) => setCompoundInterest({ ...compoundInterest, time: e.target.value })}
                    placeholder="10"
                  />
                </div>

                <div>
                  <Label htmlFor="ci-frequency">Compounding Frequency</Label>
                  <Select
                    value={compoundInterest.frequency}
                    onValueChange={(value) => setCompoundInterest({ ...compoundInterest, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Annually</SelectItem>
                      <SelectItem value="4">Quarterly</SelectItem>
                      <SelectItem value="12">Monthly</SelectItem>
                      <SelectItem value="365">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateCompoundInterest} disabled={loading} className="w-full">
                  {loading ? 'Calculating...' : 'Calculate'}
                </Button>
              </CardContent>
            </Card>

            {compoundResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Final Amount</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${compoundResult.finalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Interest Earned</p>
                    <p className="text-2xl font-semibold">
                      ${compoundResult.totalInterest.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Yearly Breakdown (Last 5 years)</p>
                    <div className="space-y-2">
                      {compoundResult.yearlyBreakdown.slice(-5).map((year: any) => (
                        <div key={year.year} className="flex justify-between text-sm">
                          <span>Year {year.year}</span>
                          <span className="font-medium">${year.endingAmount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Savings Growth Calculator */}
        <TabsContent value="savings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="mr-2 h-5 w-5" />
                  Savings Growth Calculator
                </CardTitle>
                <CardDescription>
                  Calculate savings growth with regular monthly contributions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sg-initial">Initial Amount ($)</Label>
                  <Input
                    id="sg-initial"
                    type="number"
                    value={savingsGrowth.initialAmount}
                    onChange={(e) => setSavingsGrowth({ ...savingsGrowth, initialAmount: e.target.value })}
                    placeholder="5000"
                  />
                </div>

                <div>
                  <Label htmlFor="sg-monthly">Monthly Contribution ($)</Label>
                  <Input
                    id="sg-monthly"
                    type="number"
                    value={savingsGrowth.monthlyContribution}
                    onChange={(e) => setSavingsGrowth({ ...savingsGrowth, monthlyContribution: e.target.value })}
                    placeholder="500"
                  />
                </div>

                <div>
                  <Label htmlFor="sg-rate">Annual Return Rate (%)</Label>
                  <Input
                    id="sg-rate"
                    type="number"
                    step="0.1"
                    value={savingsGrowth.annualRate}
                    onChange={(e) => setSavingsGrowth({ ...savingsGrowth, annualRate: e.target.value })}
                    placeholder="7"
                  />
                </div>

                <div>
                  <Label htmlFor="sg-years">Time Period (years)</Label>
                  <Input
                    id="sg-years"
                    type="number"
                    value={savingsGrowth.years}
                    onChange={(e) => setSavingsGrowth({ ...savingsGrowth, years: e.target.value })}
                    placeholder="20"
                  />
                </div>

                <Button onClick={calculateSavingsGrowth} disabled={loading} className="w-full">
                  {loading ? 'Calculating...' : 'Calculate'}
                </Button>
              </CardContent>
            </Card>

            {savingsResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Final Amount</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${savingsResult.finalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Contributions</p>
                    <p className="text-2xl font-semibold">
                      ${savingsResult.totalContributions.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interest Earned</p>
                    <p className="text-2xl font-semibold text-green-600">
                      ${savingsResult.totalInterest.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Retirement Planning Calculator */}
        <TabsContent value="retirement">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Retirement Planning Calculator
                </CardTitle>
                <CardDescription>
                  Calculate how much you need to save for retirement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ret-income">Desired Monthly Income ($)</Label>
                  <Input
                    id="ret-income"
                    type="number"
                    value={retirement.desiredMonthlyIncome}
                    onChange={(e) => setRetirement({ ...retirement, desiredMonthlyIncome: e.target.value })}
                    placeholder="5000"
                  />
                </div>

                <div>
                  <Label htmlFor="ret-current-age">Current Age</Label>
                  <Input
                    id="ret-current-age"
                    type="number"
                    value={retirement.currentAge}
                    onChange={(e) => setRetirement({ ...retirement, currentAge: e.target.value })}
                    placeholder="30"
                  />
                </div>

                <div>
                  <Label htmlFor="ret-retirement-age">Retirement Age</Label>
                  <Input
                    id="ret-retirement-age"
                    type="number"
                    value={retirement.retirementAge}
                    onChange={(e) => setRetirement({ ...retirement, retirementAge: e.target.value })}
                    placeholder="65"
                  />
                </div>

                <div>
                  <Label htmlFor="ret-current-savings">Current Savings ($)</Label>
                  <Input
                    id="ret-current-savings"
                    type="number"
                    value={retirement.currentSavings}
                    onChange={(e) => setRetirement({ ...retirement, currentSavings: e.target.value })}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label htmlFor="ret-return">Expected Annual Return (%)</Label>
                  <Input
                    id="ret-return"
                    type="number"
                    step="0.1"
                    value={retirement.expectedReturn}
                    onChange={(e) => setRetirement({ ...retirement, expectedReturn: e.target.value })}
                    placeholder="7"
                  />
                </div>

                <Button onClick={calculateRetirement} disabled={loading} className="w-full">
                  {loading ? 'Calculating...' : 'Calculate'}
                </Button>
              </CardContent>
            </Card>

            {retirementResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Needed Retirement Fund</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${retirementResult.neededRetirementFund.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Future Value of Current Savings</p>
                    <p className="text-2xl font-semibold">
                      ${retirementResult.futureValueOfCurrentSavings.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Additional Savings Needed</p>
                    <p className="text-2xl font-semibold text-orange-600">
                      ${retirementResult.additionalSavingsNeeded.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">Required Monthly Savings</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${retirementResult.requiredMonthlySavings.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on {retirementResult.yearsToRetirement} years until retirement
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Loan Calculator */}
        <TabsContent value="loan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  Loan Payment Calculator
                </CardTitle>
                <CardDescription>
                  Calculate monthly payments and total interest for a loan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loan-principal">Loan Amount ($)</Label>
                  <Input
                    id="loan-principal"
                    type="number"
                    value={loan.principal}
                    onChange={(e) => setLoan({ ...loan, principal: e.target.value })}
                    placeholder="200000"
                  />
                </div>

                <div>
                  <Label htmlFor="loan-rate">Annual Interest Rate (%)</Label>
                  <Input
                    id="loan-rate"
                    type="number"
                    step="0.1"
                    value={loan.annualRate}
                    onChange={(e) => setLoan({ ...loan, annualRate: e.target.value })}
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <Label htmlFor="loan-term">Loan Term (years)</Label>
                  <Input
                    id="loan-term"
                    type="number"
                    value={loan.termYears}
                    onChange={(e) => setLoan({ ...loan, termYears: e.target.value })}
                    placeholder="30"
                  />
                </div>

                <Button onClick={calculateLoan} disabled={loading} className="w-full">
                  {loading ? 'Calculating...' : 'Calculate'}
                </Button>
              </CardContent>
            </Card>

            {loanResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Payment</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${loanResult.monthlyPayment.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount Paid</p>
                    <p className="text-2xl font-semibold">
                      ${loanResult.totalPaid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Interest</p>
                    <p className="text-2xl font-semibold text-red-600">
                      ${loanResult.totalInterest.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">Loan Details</p>
                    <div className="space-y-1 text-sm mt-2">
                      <div className="flex justify-between">
                        <span>Principal:</span>
                        <span className="font-medium">${loanResult.principal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-medium">{loanResult.annualRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Term:</span>
                        <span className="font-medium">{loanResult.termYears} years</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


/**
 * Calculator Service Module
 * Handles financial calculations including compound interest and savings growth projections
 * Equivalent to a utility/service layer in Flask/FastAPI architecture
 */

import { 
  CompoundInterestCalculation, 
  CompoundInterestResult, 
  SavingsGrowthCalculation, 
  SavingsGrowthResult, 
  ApiResponse 
} from '../types'

export class CalculatorService {
  /**
   * Calculate compound interest with detailed yearly breakdown
   * Formula: A = P(1 + r/n)^(nt)
   * Where: A = final amount, P = principal, r = annual rate, n = compounding frequency, t = time
   * @param calculation - Compound interest calculation parameters
   * @returns Promise<ApiResponse> - API response with calculation results
   */
  static async calculateCompoundInterest(calculation: CompoundInterestCalculation): Promise<ApiResponse> {
    try {
      // Validate input parameters
      const validation = this.validateCompoundInterestInput(calculation)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }

      const { principal, rate, time, frequency } = calculation
      const annualRate = rate / 100 // Convert percentage to decimal
      const yearlyBreakdown = []

      let currentAmount = principal

      // Calculate year by year for detailed breakdown
      for (let year = 1; year <= time; year++) {
        const startingAmount = currentAmount
        
        // Calculate compound interest for this year
        // A = P(1 + r/n)^n for one year
        currentAmount = startingAmount * Math.pow((1 + annualRate / frequency), frequency)
        
        const interestEarned = currentAmount - startingAmount

        yearlyBreakdown.push({
          year,
          startingAmount: Math.round(startingAmount * 100) / 100,
          interestEarned: Math.round(interestEarned * 100) / 100,
          endingAmount: Math.round(currentAmount * 100) / 100
        })
      }

      const finalAmount = Math.round(currentAmount * 100) / 100
      const totalInterest = Math.round((finalAmount - principal) * 100) / 100

      const result: CompoundInterestResult = {
        finalAmount,
        totalInterest,
        yearlyBreakdown
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Error calculating compound interest:', error)
      return {
        success: false,
        error: 'Failed to calculate compound interest'
      }
    }
  }

  /**
   * Calculate savings growth with regular contributions
   * Combines initial amount with regular contributions and compound growth
   * @param calculation - Savings growth calculation parameters
   * @returns Promise<ApiResponse> - API response with calculation results
   */
  static async calculateSavingsGrowth(calculation: SavingsGrowthCalculation): Promise<ApiResponse> {
    try {
      // Validate input parameters
      const validation = this.validateSavingsGrowthInput(calculation)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }

      const { initialAmount, monthlyContribution, annualRate, years } = calculation
      const monthlyRate = (annualRate / 100) / 12 // Convert annual percentage to monthly decimal
      const totalMonths = years * 12
      const monthlyBreakdown = []

      let currentBalance = initialAmount
      let totalContributions = initialAmount

      // Calculate month by month
      for (let month = 1; month <= totalMonths; month++) {
        // Add monthly contribution
        currentBalance += monthlyContribution
        totalContributions += monthlyContribution

        // Apply monthly interest to the entire balance
        const interestEarned = currentBalance * monthlyRate
        currentBalance += interestEarned

        // Store breakdown for every 3rd month to avoid too much data
        if (month % 3 === 0 || month === totalMonths) {
          monthlyBreakdown.push({
            month,
            contribution: monthlyContribution,
            interestEarned: Math.round(interestEarned * 100) / 100,
            balance: Math.round(currentBalance * 100) / 100
          })
        }
      }

      const finalAmount = Math.round(currentBalance * 100) / 100
      const totalInterest = Math.round((finalAmount - totalContributions) * 100) / 100

      const result: SavingsGrowthResult = {
        finalAmount,
        totalContributions: Math.round(totalContributions * 100) / 100,
        totalInterest,
        monthlyBreakdown
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Error calculating savings growth:', error)
      return {
        success: false,
        error: 'Failed to calculate savings growth'
      }
    }
  }

  /**
   * Calculate retirement savings needed based on desired income
   * Uses the 4% withdrawal rule as a baseline
   * @param desiredMonthlyIncome - Monthly income needed in retirement
   * @param currentAge - Current age
   * @param retirementAge - Desired retirement age
   * @param currentSavings - Current retirement savings
   * @param expectedReturn - Expected annual return percentage
   * @returns Promise<ApiResponse> - API response with retirement calculation
   */
  static async calculateRetirementNeeds(
    desiredMonthlyIncome: number,
    currentAge: number,
    retirementAge: number,
    currentSavings: number = 0,
    expectedReturn: number = 7
  ): Promise<ApiResponse> {
    try {
      // Validate inputs
      if (desiredMonthlyIncome <= 0 || currentAge <= 0 || retirementAge <= currentAge) {
        return {
          success: false,
          error: 'Invalid input parameters for retirement calculation'
        }
      }

      const yearsToRetirement = retirementAge - currentAge
      const desiredAnnualIncome = desiredMonthlyIncome * 12
      
      // Using 4% withdrawal rule: need 25x annual expenses
      const neededRetirementFund = desiredAnnualIncome * 25
      
      // Calculate how current savings will grow
      const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + (expectedReturn / 100), yearsToRetirement)
      
      // Calculate additional savings needed
      const additionalSavingsNeeded = Math.max(0, neededRetirementFund - futureValueOfCurrentSavings)
      
      // Calculate required monthly savings using future value of annuity formula
      const monthlyRate = (expectedReturn / 100) / 12
      const totalMonths = yearsToRetirement * 12
      
      let requiredMonthlySavings = 0
      if (additionalSavingsNeeded > 0 && monthlyRate > 0) {
        requiredMonthlySavings = additionalSavingsNeeded * monthlyRate / 
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
      }

      const result = {
        neededRetirementFund: Math.round(neededRetirementFund),
        futureValueOfCurrentSavings: Math.round(futureValueOfCurrentSavings),
        additionalSavingsNeeded: Math.round(additionalSavingsNeeded),
        requiredMonthlySavings: Math.round(requiredMonthlySavings),
        yearsToRetirement,
        assumptions: {
          withdrawalRate: 4, // 4% withdrawal rule
          expectedReturn,
          inflationNotConsidered: true
        }
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Error calculating retirement needs:', error)
      return {
        success: false,
        error: 'Failed to calculate retirement needs'
      }
    }
  }

  /**
   * Calculate loan payment using amortization formula
   * @param principal - Loan amount
   * @param annualRate - Annual interest rate as percentage
   * @param termYears - Loan term in years
   * @returns Promise<ApiResponse> - API response with loan calculation
   */
  static async calculateLoanPayment(
    principal: number,
    annualRate: number,
    termYears: number
  ): Promise<ApiResponse> {
    try {
      if (principal <= 0 || annualRate < 0 || termYears <= 0) {
        return {
          success: false,
          error: 'Invalid loan parameters'
        }
      }

      const monthlyRate = (annualRate / 100) / 12
      const totalPayments = termYears * 12

      let monthlyPayment = 0
      if (monthlyRate > 0) {
        // Standard amortization formula
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1)
      } else {
        // If no interest, just divide principal by number of payments
        monthlyPayment = principal / totalPayments
      }

      const totalPaid = monthlyPayment * totalPayments
      const totalInterest = totalPaid - principal

      const result = {
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        principal,
        annualRate,
        termYears
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Error calculating loan payment:', error)
      return {
        success: false,
        error: 'Failed to calculate loan payment'
      }
    }
  }

  /**
   * Validate compound interest calculation input
   * @param calculation - Compound interest parameters
   * @returns Validation result
   */
  private static validateCompoundInterestInput(calculation: CompoundInterestCalculation): { valid: boolean; error?: string } {
    if (calculation.principal <= 0) {
      return { valid: false, error: 'Principal amount must be greater than 0' }
    }
    if (calculation.rate < 0 || calculation.rate > 100) {
      return { valid: false, error: 'Interest rate must be between 0 and 100' }
    }
    if (calculation.time <= 0 || calculation.time > 100) {
      return { valid: false, error: 'Time period must be between 1 and 100 years' }
    }
    if (![1, 4, 12, 52, 365].includes(calculation.frequency)) {
      return { valid: false, error: 'Compounding frequency must be 1 (annually), 4 (quarterly), 12 (monthly), 52 (weekly), or 365 (daily)' }
    }
    return { valid: true }
  }

  /**
   * Validate savings growth calculation input
   * @param calculation - Savings growth parameters
   * @returns Validation result
   */
  private static validateSavingsGrowthInput(calculation: SavingsGrowthCalculation): { valid: boolean; error?: string } {
    if (calculation.initialAmount < 0) {
      return { valid: false, error: 'Initial amount cannot be negative' }
    }
    if (calculation.monthlyContribution < 0) {
      return { valid: false, error: 'Monthly contribution cannot be negative' }
    }
    if (calculation.annualRate < 0 || calculation.annualRate > 100) {
      return { valid: false, error: 'Annual return rate must be between 0 and 100' }
    }
    if (calculation.years <= 0 || calculation.years > 100) {
      return { valid: false, error: 'Time period must be between 1 and 100 years' }
    }
    return { valid: true }
  }
}

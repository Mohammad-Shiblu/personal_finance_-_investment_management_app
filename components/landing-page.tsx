
/**
 * Landing Page Component
 * Welcome page for non-authenticated users with feature overview and auth links
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  PieChart, 
  Upload, 
  Shield,
  BarChart3,
  Wallet
} from 'lucide-react'

const features = [
  {
    icon: DollarSign,
    title: 'Income Tracking',
    description: 'Track multiple income sources with recurring and one-time entries'
  },
  {
    icon: Wallet,
    title: 'Expense Management', 
    description: 'Categorize and monitor your spending with customizable categories'
  },
  {
    icon: TrendingUp,
    title: 'Investment Portfolio',
    description: 'Track ETFs, crypto, stocks, and bonds with performance analytics'
  },
  {
    icon: Upload,
    title: 'CSV Import',
    description: 'Import transactions from bank statements and financial institutions'
  },
  {
    icon: Calculator,
    title: 'Financial Calculators',
    description: 'Compound interest, savings growth, retirement, and loan calculators'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Trend analysis, forecasting, and spending pattern insights'
  },
  {
    icon: PieChart,
    title: 'Visual Reports',
    description: 'Interactive charts and graphs for better financial understanding'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and stored securely'
  }
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">FinanceApp</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Take Control of Your
              <span className="text-green-600 block">Financial Future</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive financial management platform for tracking income, expenses, investments, 
              and gaining insights into your spending patterns with powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Start Free Today</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Finances
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modularity and extensibility in mind - this is Phase 1 of a comprehensive personal assistant platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <feature.icon className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-green-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Financial Life?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of people taking control of their finances with smart tracking and insights
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">Create Your Account</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-400" />
              <span className="text-lg font-semibold">FinanceApp</span>
            </div>
            <p className="text-gray-400">© 2024 Financial Management App. Phase 1 Foundation.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

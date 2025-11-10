'use client'

/**
 * Forgot Password Page
 * Request password reset link
 */

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [resetLink, setResetLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setResetLink('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (result.success) {
        setMessage(result.message)
        // Development only - show reset link
        if (result.resetLink) {
          setResetLink(result.resetLink)
        }
      } else {
        setMessage(result.error || 'Failed to process request')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Send Reset Link'}
            </Button>

            {message && (
              <div className={`p-3 rounded ${resetLink ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
                <p className="text-sm">{message}</p>
                {resetLink && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold mb-1">Development Mode - Reset Link:</p>
                    <Link href={resetLink} className="text-xs underline break-all">
                      {resetLink}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

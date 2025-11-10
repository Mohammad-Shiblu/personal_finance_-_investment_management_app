
/**
 * Sign Up Page
 * Registration page for new users
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth-config'
import { redirect } from 'next/navigation'
import { SignUpForm } from '../../../components/auth/signup-form'

export const dynamic = 'force-dynamic'

export default async function SignUpPage() {
  const session = await getServerSession(authOptions)

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { signout } from '@/app/auth/actions'
import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // Phase 1: Synthetic data for UI shell
  const userProfile = {
    fullName: user.user_metadata?.full_name || 'User',
    email: user.email
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Inflix Vault</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/dashboard" className="text-blue-600">Dashboard</Link>
              <Link href="/vault" className="hover:text-slate-900 transition-colors">My Vault</Link>
              <Link href="/workflows" className="hover:text-slate-900 transition-colors">Workflows</Link>
            </nav>
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">{userProfile.fullName}</span>
              <form action={signout}>
                <button
                  type="submit"
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
        <DashboardClient userName={userProfile.fullName} />
      </main>
    </div>
  )
}

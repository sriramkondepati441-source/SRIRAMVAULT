'use client'

import { useState, useEffect } from 'react'
import { updatePassword } from '@/app/actions/auth'
import { Lock, Loader2, ShieldCheck } from 'lucide-react'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')

  const getStrength = (pass: string) => {
    let score = 0
    if (pass.length >= 12) score += 25
    if (/[A-Z]/.test(pass)) score += 25
    if (/[a-z]/.test(pass)) score += 25
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25
    return score
  }

  const strength = getStrength(password)
  const strengthColor = strength < 50 ? 'bg-destructive' : strength < 75 ? 'bg-amber-500' : 'bg-emerald-500'

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    
    const confirm = formData.get('confirmPassword') as string
    const pass = formData.get('password') as string

    if (pass !== confirm) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const result = await updatePassword(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // Success redirects in the server action
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center border-b border-border bg-muted/20">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Create a new secure master password</p>
        </div>
        
        <div className="p-8">
          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20 text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="password" 
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 12 characters"
                  className="w-full h-11 bg-background border border-border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              {password.length > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Password strength</span>
                    <span className={strengthColor.replace('bg-', 'text-')}>{strength}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${strengthColor} transition-all duration-300`} style={{ width: `${strength}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="password" 
                  name="confirmPassword"
                  required
                  placeholder="Repeat your password"
                  className="w-full h-11 bg-background border border-border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || password.length < 12}
              className="w-full h-11 mt-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

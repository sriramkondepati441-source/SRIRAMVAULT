'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(12, "Password must be at least 12 characters"),
  consent: z.literal(true, {
    message: "You must accept the privacy notice"
  })
})

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
})

const resetSchema = z.object({
  email: z.string().email("Invalid email address")
})

export async function signup(formData: FormData) {
  const origin = (await headers()).get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const consent = formData.get('consent') === 'on'

  const validatedFields = signupSchema.safeParse({ email, password, fullName, consent })

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message }
  }

  const supabase = await createClient()

  // We sign up the user. If they already exist, Supabase handles it silently if configured,
  // or we catch it. We always return success to prevent email enumeration.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    console.error("Signup error (logged securely):", error.message)
    // We intentionally return success anyway to prevent enumeration,
    // unless it's a validation error that the user needs to fix.
  }

  return { success: true, message: "Check your email to verify your account" }
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validatedFields = loginSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    return { error: "Invalid email or password" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Invalid email or password" }
  }

  redirect('/dashboard')
}

export async function resetPassword(formData: FormData) {
  const origin = (await headers()).get('origin')
  const email = formData.get('email') as string

  const validatedFields = resetSchema.safeParse({ email })
  if (!validatedFields.success) {
    return { error: "Invalid email address" }
  }

  const supabase = await createClient()
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  })

  return { success: true, message: "If an account exists, a reset link has been sent to that email." }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  
  if (!password || password.length < 12) {
    return { error: "Password must be at least 12 characters" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: "Failed to update password. Your session may have expired." }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

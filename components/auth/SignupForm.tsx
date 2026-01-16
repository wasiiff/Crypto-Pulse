"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/lib/validators/auth"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"

type FormData = z.infer<typeof signupSchema>

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(signupSchema) })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function onSubmit(data: FormData) {
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json?.error || "Unable to register")
        return
      }

      setSuccess("Account created — redirecting to login...")
      setTimeout(() => router.push("/auth/login"), 1200)
    } catch (err) {
      setError("Network error")
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <Card className="overflow-visible bg-gradient-to-br from-black/70 via-neutral-900/60 to-black/70 border border-gray-800 shadow-lg backdrop-blur-md">
        <div className="absolute -right-12 -bottom-12 opacity-18 pointer-events-none">
          <svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 120 C90 20 170 20 240 120" stroke="#CBD5E1" strokeWidth="1" strokeOpacity="0.28" fill="none"/>
            <path d="M20 140 C90 240 170 240 240 140" stroke="#CBD5E1" strokeWidth="1" strokeOpacity="0.12" fill="none"/>
          </svg>
        </div>

        <CardHeader>
          <CardTitle className="text-white text-2xl">Create account</CardTitle>
          <CardDescription className="text-gray-400">Sign up to keep track of your favorite coins.</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </span>
                <Input className="pl-10" type="text" placeholder="Your name" {...register("name")} />
              </div>
              {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </span>
                <Input className="pl-10" type="email" placeholder="you@company.com" {...register("email")} />
              </div>
              {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </span>
                <Input
                  className="pl-10 pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a strong password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
            </div>

            {error && <div className="text-sm text-destructive">{error}</div>}
            {success && <div className="text-sm text-foreground">{success}</div>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-800" />
              <span className="text-xs text-gray-500">or continue with</span>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">GitHub</Button>
              <Button variant="outline" size="sm" className="flex-1">Google</Button>
            </div>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-white hover:underline">Sign in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

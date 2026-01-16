"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { loginSchema } from "@/lib/validators/auth"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"

type FormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(loginSchema) })

  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(data: FormData) {
    setError(null)
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    })

    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <Card className="overflow-visible bg-gradient-to-br from-black/70 via-neutral-900/60 to-black/70 border border-gray-800 shadow-2xl backdrop-blur-md">
        <div className="absolute -left-12 -top-12 opacity-20 pointer-events-none">
          <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#334155" stopOpacity="0.35" />
                <stop offset="1" stopColor="#0f172a" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            <path d="M10 120 C80 10 160 10 230 120" stroke="url(#g)" strokeWidth="1.4" fill="none" />
            <path d="M10 140 C80 250 160 250 230 140" stroke="#94A3B8" strokeWidth="1" strokeOpacity="0.22" fill="none" />
          </svg>
        </div>

        <CardHeader>
          <CardTitle className="text-white text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-gray-400">Sign in to access your watchlists and alerts.</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Password</label>
                <Link href="/auth/forgot" className="text-sm text-gray-500 hover:text-gray-300">Forgot?</Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </span>
                <Input
                  className="pl-10 pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your strong password"
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

            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
              <LogIn size={16} />
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-800" />
              <span className="text-xs text-gray-500">or continue with</span>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">
                Continue with GitHub
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Continue with Google
              </Button>
            </div>

            <div className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-white hover:underline">Create one</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

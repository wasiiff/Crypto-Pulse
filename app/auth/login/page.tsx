import React from "react"
import LoginForm from "@/components/auth/LoginForm"

export const metadata = {
  title: "Sign in — CryptoPulse",
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col gap-6 px-6">
          <h1 className="text-4xl font-semibold text-white">CryptoPulse</h1>
          <p className="text-gray-400">Real-time crypto insights, curated watchlists, and personalized market tracking.</p>
        </div>

        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

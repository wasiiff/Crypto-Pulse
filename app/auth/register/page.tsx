import React from "react"
import SignupForm from "@/components/auth/SignupForm"

export const metadata = {
  title: "Create account — CryptoPulse",
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-neutral-900 to-black p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col gap-6 px-6">
          <h1 className="text-4xl font-semibold text-white">Get started</h1>
          <p className="text-gray-400">Create your account and start tracking cryptocurrencies.</p>
        </div>

        <div className="flex items-center justify-center">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}

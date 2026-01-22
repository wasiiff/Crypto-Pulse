"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, Key, TrendingUp } from "lucide-react"

interface ValidationResult {
  success: boolean
  valid: boolean
  tier: string
  message: string
  timestamp?: string
  error?: string
}

export default function ApiTestPage() {
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState<any>(null)

  const validateKey = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/validate-api-key")
      const data = await res.json()
      setValidation(data)
    } catch (error) {
      setValidation({
        success: false,
        valid: false,
        tier: "error",
        message: "Failed to validate API key",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const testApiCall = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/coins/trending")
      const data = await res.json()
      setTestData(data)
    } catch (error) {
      setTestData({
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    validateKey()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">CoinGecko API Test</h1>
          <p className="text-muted-foreground">
            Validate your API key and test API connectivity
          </p>
        </div>

        {/* API Key Validation */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">API Key Status</h2>
                <p className="text-sm text-muted-foreground">
                  Check if your CoinGecko API key is valid
                </p>
              </div>
            </div>
            <Button onClick={validateKey} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                "Revalidate"
              )}
            </Button>
          </div>

          {validation && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start gap-3">
                {validation.valid ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 mt-0.5" />
                )}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        validation.valid
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {validation.valid ? "Valid" : "Invalid"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Tier:</span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        validation.tier === "pro"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {validation.tier.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {validation.message}
                  </p>
                  {validation.timestamp && (
                    <p className="text-xs text-muted-foreground">
                      Validated at: {new Date(validation.timestamp).toLocaleString()}
                    </p>
                  )}
                  {validation.error && (
                    <p className="text-xs text-red-500">Error: {validation.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* API Test Call */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Test API Call</h2>
                <p className="text-sm text-muted-foreground">
                  Fetch trending coins to test API connectivity
                </p>
              </div>
            </div>
            <Button onClick={testApiCall} disabled={loading} variant="outline">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test API"
              )}
            </Button>
          </div>

          {testData && (
            <div className="pt-4 border-t">
              {testData.error ? (
                <div className="flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-600">API Call Failed</p>
                    <p className="text-sm text-muted-foreground">{testData.error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">API Call Successful</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-xs">
                      {JSON.stringify(testData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* API Key Info */}
        <Card className="p-6 bg-blue-500/5 border-blue-500/20">
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400">
              📝 API Key Information
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Free Tier:</strong> 10-30 calls/minute, 250 coins per request
              </p>
              <p>
                <strong>Pro Tier:</strong> 500+ calls/minute, higher rate limits
              </p>
              <p>
                Your current API key:{" "}
                <code className="px-2 py-1 bg-muted rounded text-xs">
                  CG-6EZjwamS78XissjuwXcQkKhSth
                </code>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

import { validateApiKey } from "@/services/coingecko";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const validation = await validateApiKey();
    
    return NextResponse.json({
      success: true,
      ...validation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API key validation error:", error);
    return NextResponse.json(
      {
        success: false,
        valid: false,
        tier: "unknown",
        message: "Failed to validate API key",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

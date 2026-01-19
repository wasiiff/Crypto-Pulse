import { getMarketCoins } from "@/services/coingecko";
import { NextResponse } from "next/server";

// In-memory cache with separate entries per page/per_page
const marketCoinsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const per_page = Number(searchParams.get("per_page") || 20);

  // Create cache key
  const cacheKey = `${page}-${per_page}`;
  const now = Date.now();

  // Check cache
  const cached = marketCoinsCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    console.log(`[Market API] Cache hit for page ${page}, per_page ${per_page}`);
    return Response.json(cached.data);
  }

  try {
    const data = await getMarketCoins({ page, per_page });
    
    // Store in cache with the specific key
    marketCoinsCache.set(cacheKey, { data, timestamp: now });
    
    console.log(`[Market API] Fetched ${data.length} coins for page ${page}, per_page ${per_page}`);
    
    return Response.json(data);
  } catch (error) {
    console.error("[Market API] Error:", error);
    
    // If we have stale cache for this specific key, use it
    if (cached) {
      console.log(`[Market API] Error occurred, using stale cache for page ${page}`);
      return Response.json(cached.data);
    }
    
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}

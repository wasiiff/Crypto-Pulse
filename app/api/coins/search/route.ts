import { searchCoins } from "@/services/coingecko";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query.trim()) {
    return Response.json([]);
  }

  const data = await searchCoins(query);
  return Response.json(data);
}

import { getCoinDetails } from "@/services/coingecko";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await getCoinDetails(id);
  return Response.json(data);
}

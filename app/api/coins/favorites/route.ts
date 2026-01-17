import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorites";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const favorites = await Favorite.find({ userId: session.user.id });

        const ids = favorites.map((f) => f.coinId).join(",");

        if (!ids) return Response.json([]);

        const res = await fetch(
            `${process.env.COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}`
        );

        if (!res.ok) {
            console.error("CoinGecko API error:", res.status, res.statusText);
            return Response.json([]);
        }

        const data = await res.json();
        
        // Ensure we always return an array
        if (!Array.isArray(data)) {
            console.error("CoinGecko API returned non-array data:", data);
            return Response.json([]);
        }
        
        return Response.json(data);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return Response.json([]);
    }
}

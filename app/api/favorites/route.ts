import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Favorites from "@/models/Favorites";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({
            error: "Unauthorized"
        }, { status: 401 })
    }

    await connectDB();
    const favorites = await Favorites.find({ userId: session.user.id })
    return Response.json(favorites);
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({
                error: "Unauthorized"
            }, { status: 401 })
        }
        
        const body = await req.json();
        const { coinId, chainId = "ethereum", address = "0x0" } = body;

        if (!coinId) {
            return Response.json({
                error: "coinId is required"
            }, { status: 400 })
        }

        await connectDB();

        // Check if already exists
        const existing = await Favorites.findOne({
            userId: session.user.id,
            coinId: coinId
        });

        if (existing) {
            return Response.json(existing);
        }

        const addedFav = await Favorites.create({
            userId: session.user.id,
            coinId,
            chainId,
            address,
        })

        return Response.json(addedFav);
    } catch (error: any) {
        console.error("Error adding favorite:", error);
        return Response.json({
            error: error.message || "Failed to add favorite"
        }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({
                error: "Unauthorized"
            }, { status: 401 })
        }

        const { searchParams } = new URL(req.url);
        const coinId = searchParams.get("coinId")

        if (!coinId) {
            return Response.json({
                error: "coinId is required"
            }, { status: 400 })
        }

        await connectDB();

        const deletedFav = await Favorites.findOneAndDelete({
            coinId,
            userId: session.user.id,
        });

        return Response.json({ success: true, deleted: deletedFav });
    } catch (error: any) {
        console.error("Error deleting favorite:", error);
        return Response.json({
            error: error.message || "Failed to delete favorite"
        }, { status: 500 })
    }
}
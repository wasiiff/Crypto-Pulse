import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TokenAnalytics from '@/models/TokenAnalytics';

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || '24h';

    await dbConnect();

    // Calculate time range
    const now = new Date();
    let startTime = new Date();
    
    switch (timeframe) {
      case '1h':
        startTime.setHours(now.getHours() - 1);
        break;
      case '24h':
        startTime.setHours(now.getHours() - 24);
        break;
      case '7d':
        startTime.setDate(now.getDate() - 7);
        break;
      case '30d':
        startTime.setDate(now.getDate() - 30);
        break;
      default:
        startTime.setHours(now.getHours() - 24);
    }

    const analytics = await TokenAnalytics.find({
      tokenAddress: address.toLowerCase(),
      timestamp: { $gte: startTime },
    })
      .sort({ timestamp: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      analytics,
      timeframe,
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LaunchedToken from '@/models/LaunchedToken';
import TokenAnalytics from '@/models/TokenAnalytics';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get total tokens launched
    const totalTokensLaunched = await LaunchedToken.countDocuments();

    // Get active tokens (deployed status)
    const activeTokens = await LaunchedToken.countDocuments({ status: 'deployed' });

    // Calculate total fees collected
    const tokens = await LaunchedToken.find({}, 'launchFeePaid').lean();
    const totalFeesCollected = tokens.reduce((sum, token) => {
      return sum + parseFloat(token.launchFeePaid || '0');
    }, 0).toFixed(4);

    // Get total holders and transactions from analytics
    const analyticsData = await TokenAnalytics.aggregate([
      {
        $group: {
          _id: null,
          totalHolders: { $sum: '$currentHolders' },
          totalTransactions: { $sum: '$totalTransactions' },
        },
      },
    ]);

    const totalHolders = analyticsData[0]?.totalHolders || 0;
    const totalTransactions = analyticsData[0]?.totalTransactions || 0;

    // Calculate TVL (placeholder - would need real price data)
    const totalValueLocked = '0'; // Implement with real price feeds

    // Get recent launches (last 10)
    const recentLaunches = await LaunchedToken.find({ status: 'deployed' })
      .sort({ launchedAt: -1 })
      .limit(10)
      .select('tokenAddress name symbol logoUrl launchedAt chainId')
      .lean();

    // Get top tokens by holders
    const topTokens = await TokenAnalytics.find()
      .sort({ currentHolders: -1 })
      .limit(10)
      .populate('tokenAddress', 'name symbol logoUrl')
      .lean();

    const formattedTopTokens = topTokens.map((analytics: any) => ({
      tokenAddress: analytics.tokenAddress?.address || analytics.tokenAddress,
      name: analytics.tokenAddress?.name || 'Unknown',
      symbol: analytics.tokenAddress?.symbol || 'N/A',
      logoUrl: analytics.tokenAddress?.logoUrl,
      holders: analytics.currentHolders || 0,
      transactions: analytics.totalTransactions || 0,
      marketCap: analytics.marketCap,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalTokensLaunched,
        totalFeesCollected,
        totalValueLocked,
        activeTokens,
        totalHolders,
        totalTransactions,
        recentLaunches,
        topTokens: formattedTopTokens,
      },
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

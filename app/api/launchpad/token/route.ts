import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LaunchedToken from '@/models/LaunchedToken';
import TokenAnalytics from '@/models/TokenAnalytics';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenAddress = searchParams.get('address');

    if (!tokenAddress) {
      return NextResponse.json(
        { error: 'Token address is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get token details
    const token = await LaunchedToken.findOne({ 
      tokenAddress: tokenAddress.toLowerCase() 
    }).lean();

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    // Get analytics data
    const analytics = await TokenAnalytics.findOne({ 
      tokenAddress: tokenAddress.toLowerCase() 
    }).lean();

    return NextResponse.json({
      success: true,
      token: {
        ...token,
        analytics: analytics || null,
      },
    });

  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token details' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenAddress = searchParams.get('address');
    const body = await req.json();

    if (!tokenAddress) {
      return NextResponse.json(
        { error: 'Token address is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update token details (only allow certain fields)
    const allowedUpdates = [
      'website',
      'twitter',
      'telegram',
      'discord',
      'description',
      'logoUrl',
      'bannerUrl',
    ];

    const updates: any = {};
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const token = await LaunchedToken.findOneAndUpdate(
      { tokenAddress: tokenAddress.toLowerCase() },
      { $set: updates },
      { new: true }
    );

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      token,
    });

  } catch (error) {
    console.error('Error updating token:', error);
    return NextResponse.json(
      { error: 'Failed to update token' },
      { status: 500 }
    );
  }
}

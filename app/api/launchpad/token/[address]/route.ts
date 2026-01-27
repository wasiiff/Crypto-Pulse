import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LaunchedToken from '@/models/LaunchedToken';
import TokenAnalytics from '@/models/TokenAnalytics';

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;

    await dbConnect();

    const token = await LaunchedToken.findOne({
      tokenAddress: address.toLowerCase(),
    }).lean();

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    // Get latest analytics
    const latestAnalytics = await TokenAnalytics.findOne({
      tokenAddress: address.toLowerCase(),
    })
      .sort({ timestamp: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      token,
      analytics: latestAnalytics,
    });

  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    const body = await req.json();

    await dbConnect();

    const token = await LaunchedToken.findOneAndUpdate(
      { tokenAddress: address.toLowerCase() },
      { $set: body },
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

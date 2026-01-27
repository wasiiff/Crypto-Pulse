import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import LaunchedToken from '@/models/LaunchedToken';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const tokens = await LaunchedToken.find({
      creatorAddress: session.user.address,
    })
      .sort({ launchedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      tokens,
    });

  } catch (error) {
    console.error('Error fetching user tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

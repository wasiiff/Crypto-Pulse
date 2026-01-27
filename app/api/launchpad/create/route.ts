import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import LaunchedToken from '@/models/LaunchedToken';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      tokenAddress,
      name,
      symbol,
      decimals,
      totalSupply,
      chainId,
      chainName,
      hasTax,
      buyTax,
      sellTax,
      hasAntiBot,
      hasLiquidity,
      logoUrl,
      website,
      twitter,
      telegram,
      discord,
      description,
      transactionHash,
      launchFeePaid,
      featuresFees,
    } = body;

    // Validate required fields
    if (!tokenAddress || !name || !symbol || !totalSupply || !chainId || !transactionHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if token already exists
    const existingToken = await LaunchedToken.findOne({ tokenAddress });
    if (existingToken) {
      return NextResponse.json(
        { error: 'Token already registered' },
        { status: 409 }
      );
    }

    // Create new token record
    const launchedToken = await LaunchedToken.create({
      tokenAddress,
      name,
      symbol,
      decimals: decimals || 18,
      totalSupply,
      creatorAddress: session.user.address,
      creatorEmail: session.user.email,
      chainId,
      chainName,
      hasTax: hasTax || false,
      buyTax: buyTax || 0,
      sellTax: sellTax || 0,
      hasAntiBot: hasAntiBot || false,
      hasLiquidity: hasLiquidity || false,
      logoUrl,
      website,
      twitter,
      telegram,
      discord,
      description,
      transactionHash,
      launchFeePaid,
      featuresFees,
      status: 'deployed',
      launchedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      token: launchedToken,
    });

  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Failed to create token record' },
      { status: 500 }
    );
  }
}

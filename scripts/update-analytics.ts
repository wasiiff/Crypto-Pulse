/**
 * Analytics Update Service
 * 
 * This script updates token analytics data periodically
 * Run with: ts-node scripts/update-analytics.ts
 * Or set up as a cron job
 */

import dbConnect from '../lib/db';
import LaunchedToken from '../models/LaunchedToken';
import TokenAnalytics from '../models/TokenAnalytics';

// API Integration Functions
async function getTokenHolders(tokenAddress: string, chainId: number) {
  const chainMap: Record<number, string> = {
    1: 'eth',
    56: 'bsc',
    137: 'polygon',
    42161: 'arbitrum',
    8453: 'base',
  };

  try {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2/erc20/${tokenAddress}/owners?chain=${chainMap[chainId]}`,
      {
        headers: {
          'X-API-Key': process.env.MORALIS_API_KEY!,
        },
      }
    );

    if (!response.ok) throw new Error('Moralis API error');

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error(`Error fetching holders for ${tokenAddress}:`, error);
    return [];
  }
}

async function getTokenPrice(tokenAddress: string, chainId: number) {
  const platformMap: Record<number, string> = {
    1: 'ethereum',
    56: 'binance-smart-chain',
    137: 'polygon-pos',
    42161: 'arbitrum-one',
    8453: 'base',
  };

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/${platformMap[chainId]}?contract_addresses=${tokenAddress}&vs_currencies=usd&include_24hr_vol=true&include_market_cap=true`
    );

    if (!response.ok) throw new Error('CoinGecko API error');

    const data = await response.json();
    return data[tokenAddress.toLowerCase()] || null;
  } catch (error) {
    console.error(`Error fetching price for ${tokenAddress}:`, error);
    return null;
  }
}

async function updateTokenAnalytics(tokenAddress: string, chainId: number) {
  console.log(`Updating analytics for ${tokenAddress}...`);

  try {
    // Fetch data from APIs
    const holders = await getTokenHolders(tokenAddress, chainId);
    const priceData = await getTokenPrice(tokenAddress, chainId);

    // Calculate metrics
    const currentHolders = holders.length;
    const price = priceData?.usd || 0;
    const volume24h = priceData?.usd_24h_vol || 0;
    const marketCap = priceData?.usd_market_cap?.toString() || '0';

    // Update analytics
    await TokenAnalytics.findOneAndUpdate(
      { tokenAddress: tokenAddress.toLowerCase() },
      {
        $set: {
          chainId,
          currentHolders,
          price,
          volume24h,
          marketCap,
          lastUpdated: new Date(),
        },
        $push: {
          history: {
            $each: [{
              timestamp: new Date(),
              price,
              volume: volume24h.toString(),
              holders: currentHolders,
              transactions: 0, // Would need additional API call
            }],
            $slice: -100, // Keep last 100 data points
          },
        },
      },
      { upsert: true, new: true }
    );

    // Update token record
    await LaunchedToken.findOneAndUpdate(
      { tokenAddress: tokenAddress.toLowerCase() },
      {
        $set: {
          currentHolders,
          marketCap,
        },
      }
    );

    console.log(`✅ Updated ${tokenAddress}: ${currentHolders} holders, $${price}`);
  } catch (error) {
    console.error(`Error updating ${tokenAddress}:`, error);
  }
}

async function main() {
  console.log('Starting analytics update service...');
  console.log('Time:', new Date().toISOString());
  console.log('');

  await dbConnect();

  // Get all deployed tokens
  const tokens = await LaunchedToken.find({ status: 'deployed' });
  console.log(`Found ${tokens.length} tokens to update`);
  console.log('');

  // Update each token
  for (const token of tokens) {
    await updateTokenAnalytics(token.tokenAddress, token.chainId);
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('');
  console.log('✅ Analytics update complete!');
}

// Run immediately
main()
  .then(() => {
    console.log('Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

// Optional: Run periodically (every hour)
// setInterval(main, 3600000);

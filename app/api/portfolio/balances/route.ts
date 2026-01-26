import { NextRequest, NextResponse } from 'next/server'

const EVM_CHAIN_CONFIGS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    coingeckoId: 'ethereum',
    type: 'evm' as const,
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    coingeckoId: 'matic-network',
    type: 'evm' as const,
  },
  bsc: {
    id: 56,
    name: 'BNB Chain',
    rpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    coingeckoId: 'binancecoin',
    type: 'evm' as const,
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    coingeckoId: 'ethereum',
    type: 'evm' as const,
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    rpcUrl: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    coingeckoId: 'ethereum',
    type: 'evm' as const,
  },
  base: {
    id: 8453,
    name: 'Base',
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    coingeckoId: 'ethereum',
    type: 'evm' as const,
  },
  avalanche: {
    id: 43114,
    name: 'Avalanche',
    rpcUrl: process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    coingeckoId: 'avalanche-2',
    type: 'evm' as const,
  },
  fantom: {
    id: 250,
    name: 'Fantom',
    rpcUrl: process.env.FANTOM_RPC_URL || 'https://rpc.ftm.tools',
    nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
    coingeckoId: 'fantom',
    type: 'evm' as const,
  },
}

// ERC-20 ABI for balanceOf
const ERC20_BALANCE_ABI = '0x70a08231'

async function fetchNativeBalance(address: string, rpcUrl: string): Promise<string> {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
    })

    const data = await response.json()
    return data.result || '0x0'
  } catch (error) {
    console.error(`Error fetching balance from ${rpcUrl}:`, error)
    return '0x0'
  }
}

async function fetchTokenBalance(
  walletAddress: string,
  tokenAddress: string,
  rpcUrl: string
): Promise<string> {
  try {
    // Encode balanceOf(address) call
    const paddedAddress = walletAddress.slice(2).padStart(64, '0')
    const data = `${ERC20_BALANCE_ABI}${paddedAddress}`

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: tokenAddress,
            data: data,
          },
          'latest',
        ],
        id: 1,
      }),
    })

    const result = await response.json()
    return result.result || '0x0'
  } catch (error) {
    console.error(`Error fetching token balance:`, error)
    return '0x0'
  }
}

async function fetchBitcoinBalance(address: string): Promise<number> {
  try {
    // Using blockchain.info API
    const response = await fetch(`https://blockchain.info/q/addressbalance/${address}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) return 0
    const satoshis = await response.text()
    return parseInt(satoshis) / 1e8 // Convert satoshis to BTC
  } catch (error) {
    console.error('Error fetching Bitcoin balance:', error)
    return 0
  }
}

async function fetchTokensFromCoinGecko(
  walletAddress: string,
  chainId: string
): Promise<any[]> {
  try {
    // This would require CoinGecko Pro API or alternative service
    // For now, we'll use a predefined list of popular tokens
    return []
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return []
  }
}

// Popular ERC-20 tokens to check
const POPULAR_TOKENS: Record<string, Array<{ address: string; symbol: string; decimals: number; coingeckoId: string }>> = {
  ethereum: [
    { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', decimals: 6, coingeckoId: 'tether' },
    { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin' },
    { address: '0x6b175474e89094c44da98b954eedeac495271d0f', symbol: 'DAI', decimals: 18, coingeckoId: 'dai' },
    { address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', symbol: 'WBTC', decimals: 8, coingeckoId: 'wrapped-bitcoin' },
    { address: '0x514910771af9ca656af840dff83e8264ecf986ca', symbol: 'LINK', decimals: 18, coingeckoId: 'chainlink' },
    { address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', symbol: 'MATIC', decimals: 18, coingeckoId: 'matic-network' },
    { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', symbol: 'UNI', decimals: 18, coingeckoId: 'uniswap' },
    { address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', symbol: 'AAVE', decimals: 18, coingeckoId: 'aave' },
  ],
  polygon: [
    { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', symbol: 'USDT', decimals: 6, coingeckoId: 'tether' },
    { address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin' },
    { address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', symbol: 'DAI', decimals: 18, coingeckoId: 'dai' },
    { address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', symbol: 'WBTC', decimals: 8, coingeckoId: 'wrapped-bitcoin' },
    { address: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39', symbol: 'LINK', decimals: 18, coingeckoId: 'chainlink' },
  ],
  bsc: [
    { address: '0x55d398326f99059ff775485246999027b3197955', symbol: 'USDT', decimals: 18, coingeckoId: 'tether' },
    { address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', symbol: 'USDC', decimals: 18, coingeckoId: 'usd-coin' },
    { address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', symbol: 'DAI', decimals: 18, coingeckoId: 'dai' },
    { address: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c', symbol: 'BTCB', decimals: 18, coingeckoId: 'bitcoin-bep2' },
    { address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8', symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum' },
  ],
  arbitrum: [
    { address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', symbol: 'USDT', decimals: 6, coingeckoId: 'tether' },
    { address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin' },
    { address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', symbol: 'DAI', decimals: 18, coingeckoId: 'dai' },
    { address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f', symbol: 'WBTC', decimals: 8, coingeckoId: 'wrapped-bitcoin' },
  ],
  optimism: [
    { address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', symbol: 'USDT', decimals: 6, coingeckoId: 'tether' },
    { address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin' },
    { address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', symbol: 'DAI', decimals: 18, coingeckoId: 'dai' },
  ],
  base: [
    { address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', symbol: 'USDC', decimals: 6, coingeckoId: 'usd-coin' },
    { address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', symbol: 'DAI', decimals: 18, coingeckoId: 'dai' },
  ],
}

async function fetchCoinPrices(coingeckoIds: string[]): Promise<Record<string, { usd: number }>> {
  try {
    const uniqueIds = [...new Set(coingeckoIds)]
    if (uniqueIds.length === 0) return {}
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueIds.join(',')}&vs_currencies=usd`,
      { next: { revalidate: 60 } }
    )

    if (!response.ok) return {}
    return await response.json()
  } catch (error) {
    console.error('Error fetching coin prices:', error)
    return {}
  }
}

async function fetchCoinImages(coingeckoIds: string[]): Promise<Record<string, string>> {
  try {
    const uniqueIds = [...new Set(coingeckoIds)]
    if (uniqueIds.length === 0) return {}
    
    // Fetch coin data including images
    const promises = uniqueIds.map(async (id) => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`,
          { next: { revalidate: 3600 } } // Cache for 1 hour
        )
        if (!response.ok) return null
        const data = await response.json()
        return { id, image: data.image?.small || data.image?.thumb || '' }
      } catch (error) {
        console.error(`Error fetching image for ${id}:`, error)
        return null
      }
    })

    const results = await Promise.all(promises)
    const imageMap: Record<string, string> = {}
    
    results.forEach((result) => {
      if (result && result.image) {
        imageMap[result.id] = result.image
      }
    })

    return imageMap
  } catch (error) {
    console.error('Error fetching coin images:', error)
    return {}
  }
}

function hexToDecimal(hex: string, decimals: number = 18): number {
  const value = BigInt(hex)
  const divisor = BigInt(10 ** decimals)
  return Number(value) / Number(divisor)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('address')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    const allBalances: any[] = []

    // Check if it's an EVM address (most common case)
    const isEvmAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress)

    if (isEvmAddress) {
      // Fetch EVM chain balances in parallel
      const evmBalancePromises = Object.entries(EVM_CHAIN_CONFIGS).map(async ([key, config]) => {
        const chainBalances: any[] = []

        try {
          // Fetch native token balance
          const hexBalance = await fetchNativeBalance(walletAddress, config.rpcUrl)
          const nativeBalance = hexToDecimal(hexBalance, config.nativeCurrency.decimals)

          if (nativeBalance > 0) {
            chainBalances.push({
              chain: key,
              chainId: config.id,
              chainName: config.name,
              symbol: config.nativeCurrency.symbol,
              balance: nativeBalance,
              coingeckoId: config.coingeckoId,
              type: 'native',
              tokenAddress: null,
            })
          }

          // Fetch ERC-20 token balances
          const tokens = POPULAR_TOKENS[key] || []
          const tokenBalancePromises = tokens.map(async (token) => {
            try {
              const hexTokenBalance = await fetchTokenBalance(walletAddress, token.address, config.rpcUrl)
              const tokenBalance = hexToDecimal(hexTokenBalance, token.decimals)

              if (tokenBalance > 0) {
                return {
                  chain: key,
                  chainId: config.id,
                  chainName: config.name,
                  symbol: token.symbol,
                  balance: tokenBalance,
                  coingeckoId: token.coingeckoId,
                  type: 'token',
                  tokenAddress: token.address,
                }
              }
            } catch (error) {
              console.error(`Error fetching token ${token.symbol} on ${key}:`, error)
            }
            return null
          })

          const tokenBalances = (await Promise.all(tokenBalancePromises)).filter(Boolean)
          chainBalances.push(...tokenBalances)
        } catch (error) {
          console.error(`Error fetching balances for ${key}:`, error)
        }

        return chainBalances
      })

      const evmBalances = (await Promise.all(evmBalancePromises)).flat()
      allBalances.push(...evmBalances)
    }

    // Note: Bitcoin support removed as EVM wallets don't have Bitcoin addresses
    // Users should use their Bitcoin wallet address separately if needed

    if (allBalances.length === 0) {
      return NextResponse.json({
        walletAddress,
        totalValue: 0,
        balances: [],
        timestamp: new Date().toISOString(),
      })
    }

    // Fetch prices and images for all coins
    const coingeckoIds = allBalances.map((b) => b.coingeckoId)
    const [prices, images] = await Promise.all([
      fetchCoinPrices(coingeckoIds),
      fetchCoinImages(coingeckoIds)
    ])

    // Calculate USD values and add images
    const portfolioData = allBalances.map((item) => ({
      ...item,
      price: prices[item.coingeckoId]?.usd || 0,
      value: item.balance * (prices[item.coingeckoId]?.usd || 0),
      image: images[item.coingeckoId] || '',
    }))

    // Sort by value (highest first)
    portfolioData.sort((a, b) => b.value - a.value)

    const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0)

    return NextResponse.json({
      walletAddress,
      totalValue,
      balances: portfolioData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Portfolio API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}

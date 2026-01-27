'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Rocket,
  DollarSign,
  Activity,
  Users,
  TrendingUp,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface PlatformStats {
  totalTokensLaunched: number;
  totalFeesCollected: string;
  totalValueLocked: string;
  activeTokens: number;
  totalHolders: number;
  totalTransactions: number;
  recentLaunches: Array<{
    tokenAddress: string;
    name: string;
    symbol: string;
    logoUrl?: string;
    launchedAt: string;
    chainId: number;
  }>;
  topTokens: Array<{
    tokenAddress: string;
    name: string;
    symbol: string;
    logoUrl?: string;
    holders: number;
    transactions: number;
    marketCap?: string;
  }>;
}

export default function LaunchpadStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/launchpad/analytics');
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load platform statistics');
    } finally {
      setLoading(false);
    }
  };

  const getChainName = (chainId: number) => {
    const chains: Record<number, string> = {
      1: 'Ethereum',
      56: 'BSC',
      137: 'Polygon',
      42161: 'Arbitrum',
      8453: 'Base',
    };
    return chains[chainId] || `Chain ${chainId}`;
  };

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading platform statistics...</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Failed to load statistics</p>
        <Button onClick={fetchStats} className="mt-4">
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Platform Statistics</h2>
        <Button variant="outline" onClick={fetchStats}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalTokensLaunched}</h3>
          <p className="text-sm text-muted-foreground">Total Tokens Launched</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalFeesCollected} ETH</h3>
          <p className="text-sm text-muted-foreground">Total Fees Collected</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.activeTokens}</h3>
          <p className="text-sm text-muted-foreground">Active Tokens</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalHolders.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">Total Holders</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalTransactions.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">Total Transactions</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-bold mb-1">${stats.totalValueLocked}</h3>
          <p className="text-sm text-muted-foreground">Total Value Locked</p>
        </Card>
      </div>

      {/* Recent Launches */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Recent Launches</h3>
        {stats.recentLaunches.length > 0 ? (
          <div className="space-y-3">
            {stats.recentLaunches.map((token) => (
              <div
                key={token.tokenAddress}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  {token.logoUrl ? (
                    <img
                      src={token.logoUrl}
                      alt={token.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{token.name}</p>
                    <p className="text-sm text-muted-foreground">${token.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{getChainName(token.chainId)}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {new Date(token.launchedAt).toLocaleDateString()}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                  >
                    <a
                      href={`/launchpad/manage/${token.tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No recent launches</p>
        )}
      </Card>

      {/* Top Tokens */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Top Tokens by Holders</h3>
        {stats.topTokens.length > 0 ? (
          <div className="space-y-3">
            {stats.topTokens.map((token, index) => (
              <div
                key={token.tokenAddress}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  {token.logoUrl ? (
                    <img
                      src={token.logoUrl}
                      alt={token.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{token.name}</p>
                    <p className="text-sm text-muted-foreground">${token.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{token.holders.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Holders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{token.transactions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                  </div>
                  {token.marketCap && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">${token.marketCap}</p>
                      <p className="text-xs text-muted-foreground">Market Cap</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No token data available</p>
        )}
      </Card>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Settings, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Token {
  _id: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  totalSupply: string;
  chainId: number;
  hasTax: boolean;
  logoUrl?: string;
  launchedAt: string;
  status: string;
  currentHolders?: number;
  totalTransactions?: number;
}

export default function MyTokensList() {
  const { address, isConnected } = useAccount();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      fetchTokens();
    }
  }, [isConnected]);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/launchpad/my-tokens');
      
      if (!response.ok) throw new Error('Failed to fetch tokens');
      
      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Failed to load your tokens');
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
      11155111: 'Sepolia',
    };
    return chains[chainId] || `Chain ${chainId}`;
  };

  const getExplorerUrl = (chainId: number, address: string) => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      56: 'https://bscscan.com',
      137: 'https://polygonscan.com',
      42161: 'https://arbiscan.io',
      8453: 'https://basescan.org',
      11155111: 'https://sepolia.etherscan.io',
    };
    return `${explorers[chainId] || 'https://etherscan.io'}/token/${address}`;
  };

  if (!isConnected) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">Please connect your wallet to view your tokens</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your tokens...</p>
      </Card>
    );
  }

  if (tokens.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">You haven't launched any tokens yet</p>
        <p className="text-sm text-muted-foreground">Create your first token to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Tokens ({tokens.length})</h2>
        <Button variant="outline" onClick={fetchTokens}>
          Refresh
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <Card key={token._id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              {token.logoUrl ? (
                <img
                  src={token.logoUrl}
                  alt={token.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {token.symbol.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold">{token.name}</h3>
                <p className="text-sm text-muted-foreground">${token.symbol}</p>
                <Badge variant={token.status === 'deployed' ? 'default' : 'secondary'} className="mt-1">
                  {token.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Chain:</span>
                <span className="font-medium">{getChainName(token.chainId)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Supply:</span>
                <span className="font-medium">{parseFloat(token.totalSupply).toLocaleString()}</span>
              </div>
              {token.hasTax && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Features:</span>
                  <Badge variant="outline">Tax Enabled</Badge>
                </div>
              )}
              {token.currentHolders !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Holders:
                  </span>
                  <span className="font-medium">{token.currentHolders}</span>
                </div>
              )}
              {token.totalTransactions !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Transactions:
                  </span>
                  <span className="font-medium">{token.totalTransactions}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/launchpad/manage/${token.tokenAddress}`}>
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
              >
                <a
                  href={getExplorerUrl(token.chainId, token.tokenAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              Launched {new Date(token.launchedAt).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

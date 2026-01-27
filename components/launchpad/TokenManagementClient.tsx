'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Settings,
  ExternalLink,
  Save,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TokenData {
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  chainId: number;
  hasTax: boolean;
  buyTax: number;
  sellTax: number;
  logoUrl?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  description?: string;
  launchedAt: string;
  status: string;
  analytics?: {
    currentHolders: number;
    totalTransactions: number;
    price?: number;
    volume24h?: string;
    marketCap?: string;
    history?: Array<{
      timestamp: string;
      price: number;
      volume: string;
      holders: number;
    }>;
  };
}

const TAX_TOKEN_ABI = [
  {
    name: 'updateTax',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_buyTax', type: 'uint256' },
      { name: '_sellTax', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

export default function TokenManagementClient({ tokenAddress }: { tokenAddress: string }) {
  const { address, isConnected } = useAccount();
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'analytics'>('overview');

  const [formData, setFormData] = useState({
    website: '',
    twitter: '',
    telegram: '',
    description: '',
    buyTax: '',
    sellTax: '',
  });

  // Check if connected user is the owner
  const { data: ownerAddress } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: TAX_TOKEN_ABI,
    functionName: 'owner',
  });

  const isOwner = ownerAddress?.toLowerCase() === address?.toLowerCase();

  useEffect(() => {
    fetchTokenData();
  }, [tokenAddress]);

  useEffect(() => {
    if (token) {
      setFormData({
        website: token.website || '',
        twitter: token.twitter || '',
        telegram: token.telegram || '',
        description: token.description || '',
        buyTax: token.buyTax?.toString() || '',
        sellTax: token.sellTax?.toString() || '',
      });
    }
  }, [token]);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/launchpad/token?address=${tokenAddress}`);
      
      if (!response.ok) throw new Error('Failed to fetch token');
      
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error('Error fetching token:', error);
      toast.error('Failed to load token data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateInfo = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/launchpad/token?address=${tokenAddress}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website: formData.website,
          twitter: formData.twitter,
          telegram: formData.telegram,
          description: formData.description,
        }),
      });

      if (!response.ok) throw new Error('Update failed');

      toast.success('Token information updated successfully');
      fetchTokenData();
    } catch (error) {
      console.error('Error updating token:', error);
      toast.error('Failed to update token information');
    } finally {
      setUpdating(false);
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading token data...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Token not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {token.logoUrl ? (
              <img
                src={token.logoUrl}
                alt={token.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {token.symbol.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold">{token.name}</h1>
              <p className="text-xl text-muted-foreground">${token.symbol}</p>
            </div>
            <div className="ml-auto">
              <Badge variant={token.status === 'deployed' ? 'default' : 'secondary'}>
                {token.status}
              </Badge>
            </div>
          </div>

          {!isOwner && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-amber-600">
              You are not the owner of this token. Some features are restricted.
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {formatNumber(token.analytics?.currentHolders)}
            </h3>
            <p className="text-sm text-muted-foreground">Holders</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {formatNumber(token.analytics?.totalTransactions)}
            </h3>
            <p className="text-sm text-muted-foreground">Transactions</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              ${token.analytics?.volume24h || '0'}
            </h3>
            <p className="text-sm text-muted-foreground">24h Volume</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              ${token.analytics?.marketCap || '0'}
            </h3>
            <p className="text-sm text-muted-foreground">Market Cap</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
            className="rounded-b-none"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('analytics')}
            className="rounded-b-none"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          {isOwner && (
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('settings')}
              className="rounded-b-none"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          )}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Token Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {token.tokenAddress.slice(0, 10)}...{token.tokenAddress.slice(-8)}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                    >
                      <a
                        href={`https://etherscan.io/token/${token.tokenAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Supply</p>
                  <p className="font-semibold">{parseFloat(token.totalSupply).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Decimals</p>
                  <p className="font-semibold">{token.decimals}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Chain</p>
                  <p className="font-semibold">Chain {token.chainId}</p>
                </div>
                {token.hasTax && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Buy Tax</p>
                      <p className="font-semibold">{token.buyTax}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sell Tax</p>
                      <p className="font-semibold">{token.sellTax}%</p>
                    </div>
                  </>
                )}
              </div>

              {token.description && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{token.description}</p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {token.website && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={token.website} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  </Button>
                )}
                {token.twitter && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={`https://twitter.com/${token.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Twitter
                    </a>
                  </Button>
                )}
                {token.telegram && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={token.telegram} target="_blank" rel="noopener noreferrer">
                      Telegram
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Price & Volume History</h2>
              <Button size="sm" variant="outline" onClick={fetchTokenData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            {token.analytics?.history && token.analytics.history.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={token.analytics.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No historical data available yet
              </p>
            )}
          </Card>
        )}

        {activeTab === 'settings' && isOwner && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Update Token Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    placeholder="t.me/..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full min-h-[100px] px-3 py-2 border rounded-lg"
                    placeholder="Describe your token..."
                  />
                </div>
                <Button onClick={handleUpdateInfo} disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {token.hasTax && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Tax Settings</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Update buy and sell tax percentages (max 10%)
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="buyTax">Buy Tax (%)</Label>
                    <Input
                      id="buyTax"
                      name="buyTax"
                      type="number"
                      value={formData.buyTax}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sellTax">Sell Tax (%)</Label>
                    <Input
                      id="sellTax"
                      name="sellTax"
                      type="number"
                      value={formData.sellTax}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Tax Settings
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

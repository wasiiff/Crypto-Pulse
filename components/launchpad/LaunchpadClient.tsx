'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Coins, BarChart3, Shield } from 'lucide-react';
import TokenCreationForm from './TokenCreationForm';
import MyTokensList from './MyTokensList';
import LaunchpadStats from './LaunchpadStats';

export default function LaunchpadClient() {
  const [activeTab, setActiveTab] = useState<'create' | 'my-tokens' | 'stats'>('create');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Token Launchpad
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Launch your own ERC-20 token on Ethereum-based chains in minutes. 
            No coding required.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Coins className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Easy Token Creation</h3>
            <p className="text-sm text-muted-foreground">
              Create custom ERC-20 tokens with configurable supply, decimals, and features
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Advanced Features</h3>
            <p className="text-sm text-muted-foreground">
              Add buy/sell taxes, anti-bot protection, and automatic liquidity
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <BarChart3 className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Full Management</h3>
            <p className="text-sm text-muted-foreground">
              Monitor and manage your tokens with real-time analytics dashboard
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          <Button
            variant={activeTab === 'create' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('create')}
            className="rounded-b-none"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Create Token
          </Button>
          <Button
            variant={activeTab === 'my-tokens' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('my-tokens')}
            className="rounded-b-none"
          >
            <Coins className="w-4 h-4 mr-2" />
            My Tokens
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('stats')}
            className="rounded-b-none"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Platform Stats
          </Button>
        </div>

        {/* Content */}
        <div className="mb-12">
          {activeTab === 'create' && <TokenCreationForm />}
          {activeTab === 'my-tokens' && <MyTokensList />}
          {activeTab === 'stats' && <LaunchpadStats />}
        </div>

        {/* Pricing Info */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
          <h2 className="text-2xl font-bold mb-6 text-center">Launch Fees</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">0.1 ETH</div>
              <div className="text-sm text-muted-foreground">Base Launch Fee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">+0.02 ETH</div>
              <div className="text-sm text-muted-foreground">Tax Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">+0.02 ETH</div>
              <div className="text-sm text-muted-foreground">Anti-Bot Protection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">+0.03 ETH</div>
              <div className="text-sm text-muted-foreground">Auto Liquidity</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

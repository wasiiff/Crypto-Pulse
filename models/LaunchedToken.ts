import mongoose from 'mongoose';

const LaunchedTokenSchema = new mongoose.Schema({
  // Token Details
  tokenAddress: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  decimals: {
    type: Number,
    required: true,
    default: 18,
  },
  totalSupply: {
    type: String,
    required: true,
  },
  
  // Creator Info
  creatorAddress: {
    type: String,
    required: true,
    index: true,
  },
  creatorEmail: String,
  
  // Chain Info
  chainId: {
    type: Number,
    required: true,
  },
  chainName: String,
  
  // Token Features
  hasTax: {
    type: Boolean,
    default: false,
  },
  buyTax: {
    type: Number,
    default: 0,
  },
  sellTax: {
    type: Number,
    default: 0,
  },
  hasAntiBot: {
    type: Boolean,
    default: false,
  },
  hasLiquidity: {
    type: Boolean,
    default: false,
  },
  
  // Media
  logoUrl: String,
  bannerUrl: String,
  
  // Social Links
  website: String,
  twitter: String,
  telegram: String,
  discord: String,
  
  // Description
  description: String,
  
  // Launch Details
  launchedAt: {
    type: Date,
    default: Date.now,
  },
  transactionHash: String,
  
  // Fees Paid
  launchFeePaid: {
    type: String,
    required: true,
  },
  featuresFees: {
    type: Map,
    of: String,
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'deployed', 'verified', 'failed'],
    default: 'pending',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  
  // Analytics
  initialHolders: {
    type: Number,
    default: 1,
  },
  currentHolders: Number,
  totalTransactions: Number,
  marketCap: String,
  
  // Liquidity Info
  liquidityPool: String,
  initialLiquidity: String,
  
}, {
  timestamps: true,
});

// Indexes for efficient queries
LaunchedTokenSchema.index({ creatorAddress: 1, launchedAt: -1 });
LaunchedTokenSchema.index({ chainId: 1, launchedAt: -1 });
LaunchedTokenSchema.index({ status: 1 });

export default mongoose.models.LaunchedToken || mongoose.model('LaunchedToken', LaunchedTokenSchema);

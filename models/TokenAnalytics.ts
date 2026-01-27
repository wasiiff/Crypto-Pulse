import mongoose from 'mongoose';

const TokenAnalyticsSchema = new mongoose.Schema({
  tokenAddress: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  chainId: {
    type: Number,
    required: true,
  },
  
  // Current Stats
  currentHolders: {
    type: Number,
    default: 0,
  },
  totalTransactions: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  volume24h: {
    type: Number,
    default: 0,
  },
  marketCap: {
    type: String,
    default: '0',
  },
  
  // Historical Data
  history: [{
    timestamp: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    volume: {
      type: String,
      default: '0',
    },
    holders: {
      type: Number,
      default: 0,
    },
    transactions: {
      type: Number,
      default: 0,
    },
  }],
  
  // Top Holders
  topHolders: [{
    address: String,
    balance: String,
    percentage: Number,
  }],
  
  // Last Update
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  
}, {
  timestamps: true,
});

// Indexes for efficient queries
TokenAnalyticsSchema.index({ chainId: 1, currentHolders: -1 });
TokenAnalyticsSchema.index({ chainId: 1, totalTransactions: -1 });
TokenAnalyticsSchema.index({ lastUpdated: 1 });

export default mongoose.models.TokenAnalytics || mongoose.model('TokenAnalytics', TokenAnalyticsSchema);

# AI Trading Assistant - Complete Documentation

> A production-ready AI-powered cryptocurrency trading assistant with real-time market analysis, technical indicators, and context-aware conversations.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Setup Instructions](#setup-instructions)
5. [API Reference](#api-reference)
6. [Components](#components)
7. [Configuration](#configuration)
8. [Usage Examples](#usage-examples)
9. [Trading-Only Validation](#trading-only-validation)
10. [Technical Analysis Engine](#technical-analysis-engine)
11. [Customization](#customization)
12. [Requirements & Action Items](#requirements--action-items)

---

## Overview

The AI Trading Assistant is an intelligent chatbot specifically designed for cryptocurrency trading analysis. It provides:

- **Real-time market data** from CoinGecko API
- **Technical analysis** with RSI, MACD, SMA indicators
- **Context-aware responses** based on the coin being viewed
- **Trading-only focus** - redirects non-trading queries
- **Beautiful UI** with markdown rendering, animations, and feedback

### Key Differentiators

| Feature | Description |
|---------|-------------|
| Context-Aware | When on a coin page, prompts and analysis are specific to that coin |
| Trading-Only | Politely redirects non-crypto questions to stay focused |
| Real-time Data | Fetches live market data for accurate analysis |
| Technical Analysis | Built-in RSI, MACD, SMA, volatility calculations |
| Markdown Rendering | Beautiful formatting for AI responses |
| Feedback System | Thumbs up/down for response quality tracking |

---

## Features

### 🤖 AI-Powered Analysis
- GPT-4 powered intelligent responses
- Real-time cryptocurrency data integration
- Technical indicator interpretation
- Market trend predictions
- Risk management advice

### 📊 Technical Indicators
| Indicator | Description | Usage |
|-----------|-------------|-------|
| RSI (14) | Relative Strength Index | Overbought (>70) / Oversold (<30) |
| MACD | Moving Average Convergence Divergence | Momentum direction |
| SMA 20 | 20-day Simple Moving Average | Short-term trend |
| SMA 50 | 50-day Simple Moving Average | Medium-term trend |
| Volatility | Standard deviation of prices | Risk assessment |

### 💬 Chat Features
- ✅ Persistent chat history (MongoDB)
- ✅ Context-aware conversations
- ✅ Suggested prompts (context-specific)
- ✅ Copy message functionality
- ✅ Markdown rendering with syntax highlighting
- ✅ Thumbs up/down feedback
- ✅ Regenerate response option
- ✅ Real-time streaming responses
- ✅ Session management

### 🎨 UI/UX
- Modern design with gradients
- Smooth animations (Framer Motion)
- Responsive layout (mobile-friendly)
- Sheet/slide panel for coin pages
- Loading states with bouncing dots
- Live indicator badge

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │ TradingAssistant│  │ CoinAnalysisChat│  │ ChatMarkdown   │  │
│  │ (Full Page)     │  │ (Sheet Panel)   │  │ (Renderer)     │  │
│  └────────┬────────┘  └────────┬────────┘  └────────────────┘  │
│           │                    │                                 │
│           └──────────┬─────────┘                                 │
│                      ▼                                           │
│           ┌─────────────────────┐                               │
│           │   API Call Layer    │                               │
│           └──────────┬──────────┘                               │
└──────────────────────┼──────────────────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────────────────┐
│                      ▼           Backend                         │
│           ┌─────────────────────┐                               │
│           │ /api/trading-assistant                              │
│           │ ├── Trading Validation                              │
│           │ ├── Market Context Fetcher                          │
│           │ ├── Enhanced Prompt Builder                         │
│           │ └── AI Stream Handler                               │
│           └──────────┬──────────┘                               │
│                      │                                           │
│     ┌────────────────┼────────────────┐                         │
│     ▼                ▼                ▼                         │
│ ┌────────┐    ┌────────────┐   ┌──────────────┐                │
│ │CoinGecko│   │Trading     │   │ OpenAI API   │                │
│ │  API    │   │Analyzer    │   │ (GPT-4)      │                │
│ └────────┘   └────────────┘   └──────────────┘                │
│                      │                                           │
│                      ▼                                           │
│           ┌─────────────────────┐                               │
│           │    MongoDB          │                               │
│           │    (Chat History)   │                               │
│           └─────────────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
components/
├── trading-assistant/
│   ├── TradingAssistant.tsx      # Full-page chat interface
│   ├── CoinAnalysisChat.tsx      # Sheet panel for coin pages
│   ├── ChatMarkdown.tsx          # Markdown renderer
│   ├── PriceChart.tsx            # Price chart with indicators
│   └── TradingAssistantPremium.tsx # Premium design variant
├── ui/
│   └── sheet.tsx                 # Sheet/slide panel component

app/
├── trading-assistant/
│   └── page.tsx                  # Trading assistant page
└── api/
    ├── trading-assistant/
    │   └── route.ts              # Main API endpoint
    └── chat-history/
        └── route.ts              # Chat history CRUD

services/
├── trading-analysis.ts           # Technical analysis engine
└── coingecko.ts                  # Market data fetching

lib/
├── ai-config.ts                  # AI model configuration
└── db.ts                         # MongoDB connection

models/
└── ChatHistory.ts                # Chat history schema
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install ai @ai-sdk/openai @radix-ui/react-dialog react-markdown remark-gfm remark-breaks framer-motion
```

### 2. Environment Variables

Create/update your `.env.local` file:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Required: MongoDB Connection
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/blokklens

# Optional: CoinGecko Pro API (for higher rate limits)
COINGECKO_API_KEY=your-coingecko-api-key

# NextAuth Configuration (required for chat history)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)
6. Add to `.env.local` as `OPENAI_API_KEY`

### 4. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Add to `.env.local` as `MONGODB_URI`

### 5. Verify Installation

```bash
npm run dev
```

Visit:
- `/trading-assistant` - Full trading assistant page
- `/coins/bitcoin` - Coin page with AI chat button

---

## API Reference

### POST /api/trading-assistant

Main endpoint for AI chat interactions.

**Request Body:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  sessionId: string;
  coinId?: string; // Optional: For coin-specific analysis
}
```

**Response:** Server-Sent Events (SSE) stream of text

**Example:**
```typescript
const response = await fetch('/api/trading-assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Analyze Bitcoin' }],
    sessionId: 'session_123',
    coinId: 'bitcoin',
  }),
});

const reader = response.body?.getReader();
// Handle streaming response...
```

### GET /api/chat-history

Get user's chat history (requires authentication).

**Query Parameters:**
- `sessionId` (optional): Get specific session

**Response:**
```typescript
{
  sessionId: string;
  title: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: Date;
    metadata?: {
      coinId?: string;
      coinSymbol?: string;
      priceAtTime?: number;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### DELETE /api/chat-history

Delete a chat session.

**Query Parameters:**
- `sessionId` (required): Session to delete

---

## Components

### TradingAssistant

Full-page trading assistant interface.

```tsx
import TradingAssistant from '@/components/trading-assistant/TradingAssistant';

// Basic usage
<TradingAssistant />

// With coin context
<TradingAssistant coinId="bitcoin" coinSymbol="BTC" />
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `coinId` | `string?` | CoinGecko coin ID for context |
| `coinSymbol` | `string?` | Coin symbol to display |

### CoinAnalysisChat

Sheet panel that slides in from the right on coin detail pages.

```tsx
import CoinAnalysisChat from '@/components/trading-assistant/CoinAnalysisChat';

<CoinAnalysisChat
  coinId="bitcoin"
  coinSymbol="BTC"
  coinName="Bitcoin"
  coinData={{
    price: 45000,
    priceChange24h: 2.5,
    marketCap: 850000000000,
    volume24h: 25000000000,
  }}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `coinId` | `string` | CoinGecko coin ID |
| `coinSymbol` | `string` | Coin symbol |
| `coinName` | `string` | Full coin name |
| `coinData` | `CoinData?` | Current price data |
| `isOpen` | `boolean?` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void?` | Open state callback |

### ChatMarkdown

Renders markdown with custom styling for chat messages.

```tsx
import ChatMarkdown from '@/components/trading-assistant/ChatMarkdown';

<ChatMarkdown>
  {`## Analysis
  - **RSI**: 45 (Neutral)
  - **Trend**: Bullish`}
</ChatMarkdown>
```

---

## Configuration

### AI Model Configuration

Located in `lib/ai-config.ts`:

```typescript
export const AI_CONFIG = {
  defaultModel: 'gpt-4-turbo', // Options: gpt-4-turbo, gpt-4, gpt-3.5-turbo, gpt-4o
  temperature: 0.7,            // 0 = deterministic, 1 = creative
  maxTokens: 1000,
};
```

### Rate Limits

```typescript
export const RATE_LIMITS = {
  requestsPerMinute: 10,
  requestsPerHour: 50,
  requestsPerDay: 200,
  maxMessageLength: 1000,
  maxMessagesInConversation: 50,
};
```

### Feature Flags

```typescript
export const FEATURE_FLAGS = {
  enableChatHistory: true,
  enableTechnicalAnalysis: true,
  enablePriceCharts: true,
  enableSuggestedPrompts: true,
  enableCopyMessages: true,
  enableFeedback: true,      // Now enabled!
  enableVoiceInput: false,   // Future feature
};
```

---

## Trading-Only Validation

The chatbot is specifically designed for trading and cryptocurrency topics. It will politely redirect non-trading questions.

### How It Works

1. **Keyword Detection**: Checks for non-trading keywords (recipes, weather, movies, etc.)
2. **Context Override**: Trading keywords override non-trading detection
3. **Polite Redirect**: Returns a helpful message guiding users to trading topics

### Non-Trading Keywords (Blocked)
- recipe, cook, food, weather
- movie, music, game, sport
- joke, story, poem
- write code (non-crypto), python, javascript
- relationship, dating, health, doctor
- travel, vacation, hotel

### Trading Keywords (Always Allowed)
- crypto, bitcoin, ethereum
- trade, invest, token, coin
- defi, nft, blockchain
- price, market, chart
- rsi, macd, analysis
- bull, bear, portfolio, wallet

### Example Redirect Response

```markdown
I'm specifically designed to help with **cryptocurrency trading and analysis**. 🪙

Please ask me about:
- 📊 Price analysis and technical indicators
- 📈 Trading strategies and entry/exit points
- ⚠️ Risk assessment and management
- 💡 Market trends and predictions
- 📚 Educational content about crypto trading
```

---

## Technical Analysis Engine

Located in `services/trading-analysis.ts`.

### Available Indicators

```typescript
class TradingAnalyzer {
  // Simple Moving Average
  static calculateSMA(prices: number[], period: number): number;
  
  // Exponential Moving Average
  static calculateEMA(prices: number[], period: number): number;
  
  // Relative Strength Index
  static calculateRSI(prices: number[], period?: number): number;
  
  // MACD (Moving Average Convergence Divergence)
  static calculateMACD(prices: number[]): {
    macd: number;
    signal: number;
    histogram: number;
  };
  
  // Volatility (Standard Deviation)
  static calculateVolatility(prices: number[]): number;
  
  // Trend Detection
  static determineTrend(prices: number[]): 'bullish' | 'bearish' | 'neutral';
  
  // Comprehensive Analysis
  static analyzePriceData(prices: number[]): TechnicalIndicators;
  
  // Trading Signals
  static generateSignals(indicators: TechnicalIndicators, currentPrice: number): {
    signal: 'buy' | 'sell' | 'hold';
    confidence: number;
    reasons: string[];
  };
}
```

### Signal Generation Logic

| Condition | Signal | Weight |
|-----------|--------|--------|
| RSI < 30 | Buy | +1 |
| RSI > 70 | Sell | +1 |
| Bullish Trend | Buy | +1 |
| Bearish Trend | Sell | +1 |
| Positive MACD Histogram | Buy | +1 |
| Negative MACD Histogram | Sell | +1 |
| Price > SMA 20 & 50 | Buy | +1 |
| Price < SMA 20 & 50 | Sell | +1 |

---

## Requirements & Action Items

### For Production Deployment

#### Required (You Must Do)

1. **OpenAI API Key**
   - Get from [OpenAI Platform](https://platform.openai.com/)
   - Add to `.env.local` as `OPENAI_API_KEY`
   - **Cost**: ~$0.01-0.03 per 1K tokens

2. **MongoDB Database**
   - Create cluster at [MongoDB Atlas](https://mongodb.com/atlas)
   - Add connection string to `.env.local` as `MONGODB_URI`
   - **Free tier available**

3. **Authentication Setup**
   - Ensure NextAuth is properly configured
   - Set `NEXTAUTH_SECRET` in environment

#### Recommended

1. **CoinGecko Pro API** (Optional)
   - Free tier: 10-30 calls/minute
   - Pro tier: Higher limits, more endpoints
   - Add key to `.env.local` as `COINGECKO_API_KEY`

2. **Error Monitoring**
   - Add Sentry or similar for production error tracking
   - Monitor API usage and costs

3. **Rate Limiting**
   - Implement server-side rate limiting for production
   - Consider using Vercel AI Gateway

### Environment Variables Checklist

```env
# ✅ Required
OPENAI_API_KEY=sk-...
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-secret

# 📋 Optional
COINGECKO_API_KEY=...
AI_GATEWAY_URL=...
```

### Testing Checklist

- [ ] Visit `/trading-assistant` - Full page works
- [ ] Visit `/coins/bitcoin` - AI button opens chat sheet
- [ ] Send a trading question - Get AI response
- [ ] Send non-trading question - Get redirect message
- [ ] Click thumbs up/down - Feedback works
- [ ] Click regenerate - Response regenerates
- [ ] Copy message - Copies to clipboard
- [ ] Check mobile view - Responsive design works

---

## Customization

### Adding New Suggested Prompts

In the component, add to `SUGGESTED_PROMPTS` array:

```typescript
{
  icon: <YourIcon className="w-4 h-4" />,
  title: "Your Title",
  prompt: "Your full prompt text here",
  category: "Category",
  gradient: "from-color-500/10 to-color2-500/10 border-color-500/20"
}
```

### Modifying Trading Validation

In `app/api/trading-assistant/route.ts`:

```typescript
// Add to NON_TRADING_KEYWORDS
const NON_TRADING_KEYWORDS = [
  // existing...
  'your-new-blocked-keyword',
];

// Add to trading context (always allowed)
const tradingContext = [
  // existing...
  'your-new-allowed-term',
];
```

### Changing AI Model

In `lib/ai-config.ts`:

```typescript
export const AI_CONFIG = {
  defaultModel: 'gpt-4o', // Change to your preferred model
  temperature: 0.5,       // Lower for more deterministic
  // ...
};
```

---

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify environment variables are set
3. Check MongoDB connection
4. Verify OpenAI API key has credits

---

*Last Updated: January 2026*
*Version: 2.0.0 - Production Ready*

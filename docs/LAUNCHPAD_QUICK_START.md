# 🚀 Token Launchpad - Quick Start Guide

## What You Have

A complete token launchpad platform that allows users to:
- Launch ERC-20 tokens without coding
- Manage tokens with a dashboard
- Monitor analytics in real-time
- Collect fees automatically

## How Fees Work

### Fee Collection (Automatic)

When a user launches a token, they pay a fee that goes **directly to your wallet**:

```solidity
// In TokenFactory.sol
address public feeCollector = 0xYourWallet; // Set this to YOUR wallet
uint256 public launchFee = 0.1 ether;

function createToken() external payable {
    require(msg.value >= launchFee);
    payable(feeCollector).transfer(msg.value); // Instant payment to you
    // Deploy token...
}
```

**No withdrawal needed** - fees accumulate in your wallet automatically!

### Fee Structure

| Feature | Fee | Your Revenue |
|---------|-----|--------------|
| Basic Token | 0.1 ETH | 0.1 ETH |
| + Tax Features | +0.02 ETH | 0.12 ETH |
| + Anti-Bot | +0.02 ETH | 0.14 ETH |
| + Auto Liquidity | +0.03 ETH | 0.17 ETH |

**Example Revenue:**
- 100 launches/month × 0.12 ETH average = **12 ETH/month**
- At $2,000/ETH = **$24,000/month**

## Quick Setup (5 Steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:

```bash
# Your Wallet (Receives Fees)
NEXT_PUBLIC_FEE_COLLECTOR=0xYourWalletAddress

# Database (Free MongoDB Atlas)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blokklens

# Cloudinary (Free 25GB)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Alchemy (Free 300M compute units/month)
NEXT_PUBLIC_ALCHEMY_ID=your-alchemy-id
ALCHEMY_API_KEY=your-alchemy-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-string

# For deployment
PRIVATE_KEY=your-private-key-for-deployment
FEE_COLLECTOR_ADDRESS=0xYourWalletAddress
```

### 3. Deploy Smart Contracts

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy to testnet first
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

Copy the deployed address to `.env.local`:
```bash
NEXT_PUBLIC_FACTORY_ADDRESS=0xDeployedFactoryAddress
```

### 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000/launchpad

### 5. Deploy to Production

```bash
# Deploy to Vercel
vercel deploy --prod

# Or use Vercel dashboard
```

## Free APIs Setup

### 1. Cloudinary (Image Storage)
- Sign up: https://cloudinary.com
- Free tier: 25GB storage
- Create upload preset: `token_logos`
- Copy credentials to `.env.local`

### 2. MongoDB Atlas (Database)
- Sign up: https://www.mongodb.com/cloud/atlas
- Free tier: 512MB storage
- Create cluster and get connection string
- Add to `.env.local`

### 3. Alchemy (Blockchain RPC)
- Sign up: https://www.alchemy.com
- Free tier: 300M compute units/month
- Create app and get API key
- Add to `.env.local`

### 4. Moralis (Optional - Analytics)
- Sign up: https://moralis.io
- Free tier: 40k requests/month
- Get API key for analytics
- Add to `.env.local`

## Testing the Platform

### 1. Test on Sepolia Testnet

1. Get Sepolia ETH from faucet: https://sepoliafaucet.com
2. Connect wallet to Sepolia network
3. Go to launchpad page
4. Create a test token
5. Pay 0.1 Sepolia ETH
6. Check your wallet - fee should arrive instantly!

### 2. Verify Fee Collection

After someone launches a token:
1. Check your wallet balance
2. Fee should be there immediately
3. No withdrawal needed!

## Revenue Tracking

### Check Total Fees Collected

Visit: `/launchpad` → Platform Stats tab

Shows:
- Total tokens launched
- Total fees collected
- Active tokens
- Total holders

### Manual Calculation

```javascript
// In MongoDB or via API
const tokens = await LaunchedToken.find({});
const totalFees = tokens.reduce((sum, token) => {
  return sum + parseFloat(token.launchFeePaid);
}, 0);

console.log(`Total fees collected: ${totalFees} ETH`);
```

## Customization

### Change Launch Fees

Edit `contracts/TokenFactory.sol`:

```solidity
uint256 public launchFee = 0.1 ether; // Change this
uint256 public taxFeatureFee = 0.02 ether; // Change this
```

Redeploy contract after changes.

### Add New Features

1. Add feature to smart contract
2. Update frontend form
3. Add fee for feature
4. Deploy updated contract

## Troubleshooting

### Fees Not Arriving?

Check:
1. `feeCollector` address in contract is correct
2. Transaction succeeded on block explorer
3. Using correct network

### Contract Deployment Failed?

Check:
1. `PRIVATE_KEY` in `.env` is correct
2. Wallet has enough ETH for gas
3. RPC endpoint is working

### Logo Upload Not Working?

Check:
1. Cloudinary credentials are correct
2. Upload preset `token_logos` exists
3. Preset is set to "Unsigned"

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@blokklens.com

## Next Steps

1. ✅ Deploy to testnet and test
2. ✅ Deploy to mainnet
3. ✅ Market your platform
4. ✅ Collect fees automatically
5. ✅ Scale and add features

**You're ready to launch! 🚀**

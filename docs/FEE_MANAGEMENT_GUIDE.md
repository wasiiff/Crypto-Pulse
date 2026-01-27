# 💰 Fee Management & Revenue Guide

## Overview

This guide explains how fees are collected, managed, and tracked in the Token Launchpad platform.

## Fee Collection Mechanism

### How It Works

```
User Launches Token
       ↓
Pays Fee (0.1+ ETH)
       ↓
Smart Contract Receives Payment
       ↓
INSTANTLY Transfers to Your Wallet
       ↓
Fee Appears in Your Balance
```

**Key Point:** Fees are transferred **immediately** during the transaction. No withdrawal function needed!

### Smart Contract Code

```solidity
// contracts/TokenFactory.sol
contract TokenFactory {
    address public feeCollector; // YOUR WALLET ADDRESS
    uint256 public launchFee = 0.1 ether;
    
    constructor(address _feeCollector) {
        feeCollector = _feeCollector;
    }
    
    function createStandardToken(...) external payable {
        require(msg.value >= launchFee, "Insufficient fee");
        
        // Deploy token...
        
        // Transfer fee to your wallet IMMEDIATELY
        payable(feeCollector).transfer(msg.value);
        
        emit FeeCollected(msg.sender, msg.value);
    }
}
```

## Fee Structure

### Current Fees

| Feature | Fee (ETH) | Fee (USD @ $2k) |
|---------|-----------|-----------------|
| **Base Launch** | 0.1 | $200 |
| **Tax Features** | +0.02 | +$40 |
| **Anti-Bot** | +0.02 | +$40 |
| **Auto Liquidity** | +0.03 | +$60 |

### Fee Combinations

```
Basic Token:           0.1 ETH  ($200)
Token + Tax:          0.12 ETH  ($240)
Token + Tax + Bot:    0.14 ETH  ($280)
Full Featured:        0.17 ETH  ($340)
```

## Revenue Projections

### Conservative Scenario (100 launches/month)

```
Average fee: 0.12 ETH
Monthly launches: 100
Monthly revenue: 12 ETH

At $2,000/ETH: $24,000/month
At $3,000/ETH: $36,000/month
At $4,000/ETH: $48,000/month

Annual revenue: $288,000 - $576,000
```

### Moderate Scenario (300 launches/month)

```
Average fee: 0.13 ETH
Monthly launches: 300
Monthly revenue: 39 ETH

At $2,000/ETH: $78,000/month
At $3,000/ETH: $117,000/month
At $4,000/ETH: $156,000/month

Annual revenue: $936,000 - $1,872,000
```

### Optimistic Scenario (1000 launches/month)

```
Average fee: 0.14 ETH
Monthly launches: 1000
Monthly revenue: 140 ETH

At $2,000/ETH: $280,000/month
At $3,000/ETH: $420,000/month
At $4,000/ETH: $560,000/month

Annual revenue: $3,360,000 - $6,720,000
```

## Fee Tracking

### Via Platform Dashboard

1. Go to `/launchpad`
2. Click "Platform Stats" tab
3. View "Total Fees Collected"

### Via Database Query

```javascript
// Get total fees from MongoDB
const tokens = await LaunchedToken.find({});
const totalFees = tokens.reduce((sum, token) => {
  return sum + parseFloat(token.launchFeePaid || '0');
}, 0);

console.log(`Total fees: ${totalFees} ETH`);
```

### Via Smart Contract

```javascript
// Get total tokens launched
const factory = new ethers.Contract(factoryAddress, abi, provider);
const totalTokens = await factory.getTotalTokensLaunched();

// Calculate estimated fees
const estimatedFees = totalTokens * 0.12; // Average fee
```

### Via Block Explorer

1. Go to Etherscan
2. Enter your fee collector address
3. View "Internal Transactions"
4. Filter by "From: TokenFactory"
5. Sum all incoming transactions

## Fee Withdrawal

### No Withdrawal Needed!

Fees are sent directly to your wallet during each launch. You can:

1. **Keep in wallet** - Hold ETH
2. **Convert to stablecoin** - Use DEX
3. **Transfer to exchange** - Cash out
4. **Reinvest** - Use for marketing

### Emergency Withdrawal (If Needed)

If fees somehow get stuck in contract:

```solidity
// Only owner can call
function withdrawStuckFunds() external onlyOwner {
    payable(owner).transfer(address(this).balance);
}
```

## Fee Optimization Strategies

### 1. Dynamic Pricing

Adjust fees based on demand:

```solidity
// Update fees (only owner)
function updateLaunchFee(uint256 newFee) external onlyOwner {
    launchFee = newFee;
}
```

**Strategy:**
- High demand → Increase fees
- Low demand → Decrease fees
- Special promotions → Temporary discounts

### 2. Volume Discounts

Offer discounts for multiple launches:

```solidity
mapping(address => uint256) public launchCount;

function getDiscountedFee(address user) public view returns (uint256) {
    uint256 count = launchCount[user];
    if (count >= 10) return launchFee * 80 / 100; // 20% off
    if (count >= 5) return launchFee * 90 / 100;  // 10% off
    return launchFee;
}
```

### 3. Referral Program

Share revenue with referrers:

```solidity
function createTokenWithReferral(
    address referrer,
    ...
) external payable {
    require(msg.value >= launchFee);
    
    uint256 referralFee = msg.value * 10 / 100; // 10% to referrer
    uint256 platformFee = msg.value - referralFee;
    
    payable(referrer).transfer(referralFee);
    payable(feeCollector).transfer(platformFee);
}
```

### 4. Subscription Model

Monthly subscription for unlimited launches:

```solidity
mapping(address => uint256) public subscriptionExpiry;
uint256 public monthlySubscription = 1 ether;

function subscribe() external payable {
    require(msg.value >= monthlySubscription);
    subscriptionExpiry[msg.sender] = block.timestamp + 30 days;
    payable(feeCollector).transfer(msg.value);
}

function createToken(...) external payable {
    if (subscriptionExpiry[msg.sender] > block.timestamp) {
        // Free for subscribers
    } else {
        require(msg.value >= launchFee);
        payable(feeCollector).transfer(msg.value);
    }
}
```

## Additional Revenue Streams

### 1. Premium Features

```
Basic Analytics:     Free
Advanced Analytics:  $50/month
Marketing Tools:     $100/month
Priority Support:    $200/month
```

### 2. Advertisement Slots

```
Featured Token:      0.05 ETH/week
Banner Ad:           0.1 ETH/month
Homepage Spotlight:  0.2 ETH/week
```

### 3. Token Allocation

```
Platform receives 1% of token supply
Hold or sell based on performance
Potential long-term value
```

### 4. Liquidity Pool Fees

```
Charge 0.5% fee on LP creation
Earn from trading fees
Passive income stream
```

## Tax Considerations

### Record Keeping

Track all revenue:
- Date of launch
- Token address
- Fee amount (ETH)
- Fee amount (USD at time)
- Transaction hash

### Tax Treatment (Consult CPA)

Fees may be taxed as:
- Business income
- Capital gains (if held)
- Self-employment income

### Recommended Tools

- CoinTracker
- Koinly
- TaxBit
- CryptoTaxCalculator

## Security Best Practices

### 1. Multi-Sig Wallet

Use multi-sig for fee collector:
- Gnosis Safe
- Requires multiple signatures
- Prevents single point of failure

### 2. Regular Withdrawals

Don't accumulate large amounts:
- Withdraw weekly/monthly
- Convert to stablecoin
- Reduce risk

### 3. Insurance

Consider:
- Smart contract insurance
- Crypto custody insurance
- Business liability insurance

## Monitoring & Alerts

### Set Up Alerts

1. **Email Notifications**
   - New token launch
   - Fee received
   - Daily summary

2. **Telegram Bot**
   - Real-time notifications
   - Revenue updates
   - Error alerts

3. **Dashboard Monitoring**
   - Daily revenue
   - Monthly trends
   - User growth

### Example Alert Code

```javascript
// Send notification on new launch
async function notifyNewLaunch(token, fee) {
  await sendEmail({
    to: 'admin@blokklens.com',
    subject: 'New Token Launched!',
    body: `
      Token: ${token.name} (${token.symbol})
      Fee: ${fee} ETH
      Total Today: ${dailyTotal} ETH
    `
  });
  
  await sendTelegram({
    chat_id: YOUR_CHAT_ID,
    text: `🚀 New launch! ${token.name} - ${fee} ETH received`
  });
}
```

## FAQ

### Q: When do I receive fees?
**A:** Immediately during the token launch transaction. No delay.

### Q: Can users get refunds?
**A:** No, fees are non-refundable once token is deployed.

### Q: What if transaction fails?
**A:** User doesn't pay fee if deployment fails. They can try again.

### Q: Can I change fees after deployment?
**A:** Yes, using `updateLaunchFee()` function (owner only).

### Q: How do I track revenue?
**A:** Check wallet balance, platform dashboard, or database.

### Q: What about gas fees?
**A:** Users pay gas fees separately. You only receive launch fees.

### Q: Can I offer discounts?
**A:** Yes, implement discount logic in smart contract.

### Q: How to handle refund requests?
**A:** Manual process - send ETH from your wallet if needed.

## Summary

✅ Fees collected automatically
✅ Instant payment to your wallet
✅ No withdrawal needed
✅ Easy to track and monitor
✅ Multiple revenue streams possible
✅ Scalable and profitable

**Start collecting fees today! 🚀**

# SaveFi Smart Contracts

SaveFi is a gamified, no-loss savings protocol built on the Mantle network. Users deposit stablecoins into a vault that generates yield through decentralised finance (DeFi) protocols. Each week, the yield, not the principal, is awarded randomly to depositors. This makes saving safe, fun, and transparent, with provable fairness and future DAO governance for community-driven customisation

## Architecture

### Core Contracts

- **SaveFiVault.sol**: Main vault contract handling deposits, withdrawals, and draws
- **SaveToken.sol**: ERC20 governance token with voting capabilities  
- **MockUSDC.sol**: Mock USDC token for testing (replace with real USDC on mainnet)

### Key Features

1. **Deposits & Withdrawals**: Users can deposit/withdraw USDC anytime
2. **Yield Generation**: Deposits automatically earn yield (4.2% APY)
3. **Prize Draws**: Weekly automated draws distribute yield as prizes
4. **Weighted Selection**: Winning chances proportional to deposit amount
5. **Governance**: $SAVE token holders can vote on protocol proposals

## Network Configuration

### Mantle Mainnet
- **Chain ID**: 5000
- **RPC URL**: https://rpc.mantle.xyz
- **Currency**: MNT
- **Explorer**: https://mantlescan.xyz/

### Mantle Testnet  
- **Chain ID**: 5003
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **Currency**: MNT
- **Explorer**: https://sepolia.mantlescan.xyz/

## Installation

```bash
# Clone and setup
cd contracts
make install

# Build contracts
make build

# Run tests
make test
```

## Deployment

1. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

2. Deploy to Mantle mainnet:

```bash
make deploy-mantle
```

3. Deploy to Mantle testnet:

```bash
make deploy-mantle-testnet
```

## Testing

```bash
# Run all tests
make test

# Run tests with gas report
make test-gas

# Generate coverage report
make coverage
```

## Contract Functions

### SaveFiVault

#### Core Functions
- `deposit(uint256 amount)` - Deposit USDC to vault
- `withdraw(uint256 amount)` - Withdraw USDC from vault
- `balanceOf(address account)` - Get user's vault balance

#### Statistics
- `getTotalValueLocked()` - Total USDC deposited
- `getTotalParticipants()` - Number of active participants
- `getCurrentAPY()` - Current annual percentage yield
- `getUserWinningChance(address user)` - User's winning probability

#### Draw System
- `executeDraw()` - Execute weekly prize draw
- `getCurrentPrizePool()` - Available prize amount
- `getDrawInfo(uint256 drawId)` - Get draw details
- `getDrawHistory(uint256 offset, uint256 limit)` - Get historical draws

#### Leaderboards
- `getAllTimeLeaderboard(uint256 limit)` - Top winners by total winnings
- `getWeeklyWinners(uint256 weekOffset)` - Recent weekly winners

### SaveToken (Governance)

#### Token Functions
- `balanceOf(address account)` - Get SAVE token balance
- `getVotingPower(address user)` - Get user's voting power
- `delegate(address delegatee)` - Delegate voting power

#### Governance
- `createProposal(string title, string description, bytes data)` - Create proposal
- `castVote(uint256 proposalId, bool support)` - Vote on proposal
- `getProposal(uint256 proposalId)` - Get proposal details
- `getActiveProposals()` - Get currently active proposals

## Security

- All contracts use OpenZeppelin libraries for security
- ReentrancyGuard prevents reentrancy attacks
- Pausable functionality for emergency stops
- Ownable pattern for admin functions
- Comprehensive test coverage

## Gas Optimization

- Efficient storage patterns
- Minimal external calls
- Optimized loops and calculations
- Use of `immutable` and `constant` where possible

## user experience(Implementation Priority)

- Chainlink VRF - Critical for fair, verifiable draws
- Pimlico AA - Dramatically improves user experience
- Chainlink Automation - Ensures reliable weekly draws
- Para - Optimises gas costs as user base grows

## Frontend Integration

Contract addresses are automatically saved to `deployed-addresses.txt` after deployment.
```typescript
// config/web3.ts
export const CONTRACT_ADDRESSES = {
  SAVE_FI_VAULT: '0x896E731065Da2CBa4B289F769755630d0823AD46',
  SAVE_TOKEN: '0x3Bd9369511B5efCfD693147B6c32d6cC04A03a33', 
  MOCK_USDC: '0x68310Ee20f3D4611DE39E40fE352692cf48168bA'
}
```

MOCK_USDC=
SAVE_TOKEN=
SAVE_FI_VAULT=

## Development

```bash
# Format code
make fmt

# Start local node
make anvil

# Deploy locally
make deploy-local
```


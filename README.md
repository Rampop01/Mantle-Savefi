# SaveFi Smart Contracts

SaveFi is a no-loss lottery protocol built on Ethereum. Users deposit stablecoins which are invested in yield-generating strategies, and the yield is distributed as prizes through weekly draws.

## Features

- **No-Loss Guarantee**: Principal is always safe and withdrawable
- **Weekly Draws**: Automated prize distribution every 7 days
- **Yield Generation**: Deposits earn yield through DeFi protocols
- **Fair Selection**: Provably fair winner selection weighted by deposit size
- **Governance Token**: $SAVE token for protocol governance

## Architecture

### Core Contracts

- `SaveFiVault.sol`: Main vault contract handling deposits, withdrawals, and draws
- `SaveToken.sol`: ERC20 governance token with voting capabilities
- `AaveYieldStrategy.sol`: Yield generation strategy using Aave lending
- `MockRandomnessProvider.sol`: Randomness provider for winner selection

### Key Features

1. **Deposits & Withdrawals**: Users can deposit/withdraw stablecoins anytime
2. **Yield Generation**: Deposits are automatically invested in yield strategies
3. **Prize Draws**: Weekly automated draws distribute yield as prizes
4. **Weighted Selection**: Winning chances proportional to deposit amount
5. **Emergency Functions**: Emergency withdrawal and pause functionality

## Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd savefi-contracts

# Install dependencies
make install

# Build contracts
make build
\`\`\`

## Testing

\`\`\`bash
# Run all tests
make test

# Run tests with verbose output
make test-verbose

# Generate gas report
make test-gas

# Generate coverage report
make coverage
\`\`\`

## Deployment

1. Copy `.env.example` to `.env` and fill in your values:

\`\`\`bash
cp .env.example .env
\`\`\`

2. Deploy to local network:

\`\`\`bash
make deploy-local
\`\`\`

3. Deploy to testnet:

\`\`\`bash
make deploy-testnet
\`\`\`

## Contract Addresses

### Mainnet
- SaveFiVault: `TBD`
- SaveToken: `TBD`
- AaveYieldStrategy: `TBD`

### Testnet (Goerli)
- SaveFiVault: `TBD`
- SaveToken: `TBD`
- AaveYieldStrategy: `TBD`

## Usage

### Depositing

```solidity
// Approve USDC spending
IERC20(usdc).approve(vaultAddress, amount);

// Deposit to vault
ISaveFiVault(vaultAddress).deposit(amount);

# SaveFi Smart Contracts Makefile
# Requires Foundry to be installed

# Default target
.PHONY: help
help:
	@echo "SaveFi Smart Contracts"
	@echo ""
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  build       - Build contracts"
	@echo "  test        - Run tests"
	@echo "  test-gas    - Run tests with gas report"
	@echo "  coverage    - Generate coverage report"
	@echo "  deploy-local - Deploy to local network"
	@echo "  deploy-mantle - Deploy to Mantle mainnet"
	@echo "  verify      - Verify contracts on Mantlescan"
	@echo "  clean       - Clean build artifacts"

# Install dependencies
.PHONY: install
install:
	forge install OpenZeppelin/openzeppelin-contracts@v4.9.0 --no-commit
	forge install foundry-rs/forge-std --no-commit

# Build contracts
.PHONY: build
build:
	forge build

# Run tests
.PHONY: test
test:
	forge test -vv

# Run tests with gas report
.PHONY: test-gas
test-gas:
	forge test --gas-report

# Generate coverage report
.PHONY: coverage
coverage:
	forge coverage

# Deploy to local network (anvil)
.PHONY: deploy-local
deploy-local:
	forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Deploy to Mantle mainnet
.PHONY: deploy-mantle
deploy-mantle:
	@echo "Deploying to Mantle Mainnet..."
	@echo "Make sure you have set PRIVATE_KEY in .env file"
	forge script script/DeployMantle.s.sol:DeployMantleScript --rpc-url https://rpc.mantle.xyz --broadcast --verify --etherscan-api-key $(MANTLESCAN_API_KEY)

# Deploy to Mantle testnet
.PHONY: deploy-mantle-testnet
deploy-mantle-testnet:
	@echo "Deploying to Mantle Testnet..."
	forge script script/DeployMantle.s.sol:DeployMantleScript --rpc-url https://rpc.testnet.mantle.xyz --broadcast

# Verify contracts on Mantlescan
.PHONY: verify
verify:
	@echo "Verifying contracts on Mantlescan..."
	@echo "Usage: make verify CONTRACT=<contract_address> NAME=<contract_name>"
	forge verify-contract $(CONTRACT) $(NAME) --etherscan-api-key $(MANTLESCAN_API_KEY) --verifier-url https://explorer.mantle.xyz/api

# Clean build artifacts
.PHONY: clean
clean:
	forge clean

# Format code
.PHONY: fmt
fmt:
	forge fmt

# Check code formatting
.PHONY: fmt-check
fmt-check:
	forge fmt --check

# Run slither static analysis (requires slither to be installed)
.PHONY: slither
slither:
	slither src/

# Start local node
.PHONY: anvil
anvil:
	anvil --host 0.0.0.0 --port 8545

# Quick setup for development
.PHONY: setup
setup: install build test
	@echo "Setup complete! Ready for development."

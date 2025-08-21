// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {SaveFiVault} from "../src/SaveFiVault.sol";
import {SaveToken} from "../src/SaveToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract DeployMantleScript is Script {
    // Mantle network configuration
    uint256 constant MANTLE_CHAIN_ID = 5000;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        require(deployer.balance > 0.01 ether, "Insufficient MNT balance for deployment");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy contracts
        
        // 1. Deploy MockUSDC (for testing - replace with real USDC on mainnet)
        MockUSDC mockUsdc = new MockUSDC();
        
        // 2. Deploy SaveToken (Governance token)
        SaveToken saveToken = new SaveToken();
        
        // 3. Deploy SaveFiVault (Main vault contract)
        SaveFiVault vault = new SaveFiVault(
            address(mockUsdc), // Use real USDC address on mainnet: 0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9
            address(saveToken)
        );
        
        // 4. Configure contracts
        // Set vault as SaveToken owner for minting rewards
        saveToken.transferOwnership(address(vault));
        
        // Mint initial USDC for testing (remove for mainnet)
        mockUsdc.mint(deployer, 100_000 * 1e6); // 100k USDC for testing
        
        vm.stopBroadcast();
        
        // Labels for tracing in debugger/tools
        vm.label(address(mockUsdc), "MockUSDC");
        vm.label(address(saveToken), "SaveToken");
        vm.label(address(vault), "SaveFiVault");
        
        // Save addresses to file for frontend update
        string memory addresses = string(abi.encodePacked(
            "MOCK_USDC=", vm.toString(address(mockUsdc)), "\n",
            "SAVE_TOKEN=", vm.toString(address(saveToken)), "\n",
            "SAVE_FI_VAULT=", vm.toString(address(vault)), "\n"
        ));
        
        vm.writeFile("./deployed-addresses.txt", addresses);
        // Contract addresses saved to deployed-addresses.txt
    }
}

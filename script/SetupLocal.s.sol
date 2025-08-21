// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {SaveFiVault} from "../src/SaveFiVault.sol";
import {SaveToken} from "../src/SaveToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract SetupLocalScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy contracts
        MockUSDC mockUsdc = new MockUSDC();
        SaveToken saveToken = new SaveToken();
        SaveFiVault vault = new SaveFiVault(address(mockUsdc), address(saveToken));
        
        // Setup test data
        
        // Create test users
        address user1 = address(0x1111);
        address user2 = address(0x2222);
        address user3 = address(0x3333);
        
        // Mint USDC for test users
        mockUsdc.mint(user1, 50_000 * 1e6); // 50k USDC
        mockUsdc.mint(user2, 30_000 * 1e6); // 30k USDC
        mockUsdc.mint(user3, 20_000 * 1e6); // 20k USDC
        mockUsdc.mint(deployer, 100_000 * 1e6); // 100k USDC for deployer
        
        // Mint SAVE tokens for governance testing
        saveToken.mint(user1, 10_000 * 1e18); // 10k SAVE
        saveToken.mint(user2, 5_000 * 1e18);  // 5k SAVE
        saveToken.mint(user3, 3_000 * 1e18);  // 3k SAVE
        
        vm.stopBroadcast();
        
        // Setup deposits (simulate user actions)
        vm.startBroadcast(vm.envUint("USER1_PRIVATE_KEY"));
        mockUsdc.approve(address(vault), type(uint256).max);
        vault.deposit(10_000 * 1e6); // 10k USDC deposit
        vm.stopBroadcast();
        
        vm.startBroadcast(vm.envUint("USER2_PRIVATE_KEY"));
        mockUsdc.approve(address(vault), type(uint256).max);
        vault.deposit(15_000 * 1e6); // 15k USDC deposit
        vm.stopBroadcast();
        
        vm.startBroadcast(vm.envUint("USER3_PRIVATE_KEY"));
        mockUsdc.approve(address(vault), type(uint256).max);
        vault.deposit(5_000 * 1e6); // 5k USDC deposit
        vm.stopBroadcast();
        
        // Labels for easy tracing in debugger
        vm.label(address(mockUsdc), "MockUSDC");
        vm.label(address(saveToken), "SaveToken");
        vm.label(address(vault), "SaveFiVault");
    }
}

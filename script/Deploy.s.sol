// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {SaveFiVault} from "../src/SaveFiVault.sol";
import {SaveToken} from "../src/SaveToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy MockUSDC first (for testing)
        MockUSDC mockUsdc = new MockUSDC();
        
        // Deploy SaveToken
        SaveToken saveToken = new SaveToken();
        
        // Deploy SaveFiVault
        SaveFiVault vault = new SaveFiVault(
            address(mockUsdc),
            address(saveToken)
        );
        
        // Set vault address in SaveToken for future integrations
        saveToken.transferOwnership(address(vault));
        
        // Mint some initial SAVE tokens to vault for rewards
        // saveToken.mint(address(vault), 1_000_000 * 1e18); // 1M SAVE tokens
        
        vm.stopBroadcast();
        
        // Log deployment summary
        vm.label(address(mockUsdc), "MockUSDC");
        vm.label(address(saveToken), "SaveToken");
        vm.label(address(vault), "SaveFiVault");
    }
}

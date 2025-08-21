// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";

contract GenerateABIScript is Script {
    function run() external view {
        // This script helps generate ABI files for frontend integration
        // Use 'forge inspect <ContractName> abi' to get JSON ABI
        // Examples:
        // forge inspect SaveFiVault abi > SaveFiVault.json
        // forge inspect SaveToken abi > SaveToken.json
        // forge inspect MockUSDC abi > MockUSDC.json
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    uint8 private _decimals = 6; // USDC has 6 decimals
    
    constructor() ERC20("Mock USDC", "USDC") {
        // Mint 1M USDC for testing
        _mint(msg.sender, 1_000_000 * 10**_decimals);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function faucet(uint256 amount) external {
        require(amount <= 10_000 * 10**_decimals, "Max 10k USDC per request");
        _mint(msg.sender, amount);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {SaveFiVault} from "../src/SaveFiVault.sol";
import {SaveToken} from "../src/SaveToken.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {ISaveFiVault} from "../src/interfaces/ISaveFiVault.sol";

contract SaveFiVaultTest is Test {
    SaveFiVault public vault;
    SaveToken public saveToken;
    MockUSDC public mockUsdc;
    
    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    address public user3 = address(0x3);
    
    uint256 constant INITIAL_BALANCE = 10_000 * 1e6; // 10k USDC
    
    function setUp() public {
        // Deploy contracts
        mockUsdc = new MockUSDC();
        saveToken = new SaveToken();
        vault = new SaveFiVault(address(mockUsdc), address(saveToken));
        
        // Setup test users with USDC
        mockUsdc.mint(user1, INITIAL_BALANCE);
        mockUsdc.mint(user2, INITIAL_BALANCE);
        mockUsdc.mint(user3, INITIAL_BALANCE);
        
        // Approve vault to spend USDC
        vm.prank(user1);
        mockUsdc.approve(address(vault), type(uint256).max);
        
        vm.prank(user2);
        mockUsdc.approve(address(vault), type(uint256).max);
        
        vm.prank(user3);
        mockUsdc.approve(address(vault), type(uint256).max);
    }
    
    function testDeposit() public {
        uint256 depositAmount = 1000 * 1e6; // 1000 USDC
        
        vm.prank(user1);
        vault.deposit(depositAmount);
        
        assertEq(vault.balanceOf(user1), depositAmount);
        assertEq(vault.getTotalValueLocked(), depositAmount);
        assertEq(vault.getTotalParticipants(), 1);
    }
    
    function testMultipleDeposits() public {
        uint256 amount1 = 1000 * 1e6;
        uint256 amount2 = 2000 * 1e6;
        uint256 amount3 = 500 * 1e6;
        
        vm.prank(user1);
        vault.deposit(amount1);
        
        vm.prank(user2);
        vault.deposit(amount2);
        
        vm.prank(user3);
        vault.deposit(amount3);
        
        assertEq(vault.balanceOf(user1), amount1);
        assertEq(vault.balanceOf(user2), amount2);
        assertEq(vault.balanceOf(user3), amount3);
        assertEq(vault.getTotalValueLocked(), amount1 + amount2 + amount3);
        assertEq(vault.getTotalParticipants(), 3);
    }
    
    function testWithdraw() public {
        uint256 depositAmount = 1000 * 1e6;
        uint256 withdrawAmount = 300 * 1e6;
        
        vm.prank(user1);
        vault.deposit(depositAmount);
        
        vm.prank(user1);
        vault.withdraw(withdrawAmount);
        
        assertEq(vault.balanceOf(user1), depositAmount - withdrawAmount);
        assertEq(vault.getTotalValueLocked(), depositAmount - withdrawAmount);
    }
    
    function testFullWithdraw() public {
        uint256 depositAmount = 1000 * 1e6;
        
        vm.prank(user1);
        vault.deposit(depositAmount);
        
        assertEq(vault.getTotalParticipants(), 1);
        
        vm.prank(user1);
        vault.withdraw(depositAmount);
        
        assertEq(vault.balanceOf(user1), 0);
        assertEq(vault.getTotalValueLocked(), 0);
        // Note: participant count doesn't decrease immediately in current implementation
    }
    
    function testWinningChanceCalculation() public {
        uint256 amount1 = 1000 * 1e6; // 1000 USDC
        uint256 amount2 = 3000 * 1e6; // 3000 USDC
        
        vm.prank(user1);
        vault.deposit(amount1);
        
        vm.prank(user2);
        vault.deposit(amount2);
        
        // Total: 4000 USDC
        // User1: 1000/4000 = 25% = 2500 basis points
        // User2: 3000/4000 = 75% = 7500 basis points
        
        assertEq(vault.getUserWinningChance(user1), 2500);
        assertEq(vault.getUserWinningChance(user2), 7500);
    }
    
    function testYieldGeneration() public {
        uint256 depositAmount = 10000 * 1e6; // 10k USDC
        
        vm.prank(user1);
        vault.deposit(depositAmount);
        
        // Fast forward 30 days
        vm.warp(block.timestamp + 30 days);
        
        // Trigger yield update by making another deposit
        vm.prank(user2);
        vault.deposit(1 * 1e6);
        
        uint256 totalYield = vault.getTotalYieldGenerated();
        assertTrue(totalYield > 0, "Yield should be generated");
        
        // Check approximate yield (4.2% APY for 30 days)
        uint256 expectedYield = (depositAmount * 420 * 30 days) / (10000 * 365 days);
        assertApproxEqRel(totalYield, expectedYield, 0.01e18); // 1% tolerance
    }
    
    function testDrawExecution() public {
        uint256 amount1 = 5000 * 1e6;
        uint256 amount2 = 3000 * 1e6;
        uint256 amount3 = 2000 * 1e6;
        
        // Setup participants
        vm.prank(user1);
        vault.deposit(amount1);
        
        vm.prank(user2);
        vault.deposit(amount2);
        
        vm.prank(user3);
        vault.deposit(amount3);
        
        // Fast forward to generate yield and allow draw
        vm.warp(block.timestamp + 8 days);
        
        // Execute draw
        vault.executeDraw();
        
        // Check draw was recorded
        ISaveFiVault.DrawInfo memory draw = vault.getDrawInfo(1);
        assertTrue(draw.executed, "Draw should be executed");
        assertTrue(draw.winner != address(0), "Should have a winner");
        assertTrue(draw.prizeAmount > 0, "Should have prize amount");
        assertEq(draw.participantCount, 3);
    }
    
    function testCannotExecuteDrawTooEarly() public {
        vm.prank(user1);
        vault.deposit(1000 * 1e6);
        
        // Try to execute draw immediately
        vm.expectRevert("Draw not ready");
        vault.executeDraw();
    }
    
    function testUserStats() public {
        uint256 depositAmount = 2000 * 1e6;
        
        vm.prank(user1);
        vault.deposit(depositAmount);
        
        ISaveFiVault.UserStats memory stats = vault.getUserStats(user1);
        assertEq(stats.totalDeposited, depositAmount);
        assertEq(stats.totalWinnings, 0);
        assertEq(stats.drawsWon, 0);
        assertTrue(stats.lastDepositTime > 0);
    }
    
    function testMinimumDeposit() public {
        uint256 tooSmall = 0.5 * 1e6; // 0.5 USDC (below 1 USDC minimum)
        
        vm.prank(user1);
        vm.expectRevert("Amount below minimum");
        vault.deposit(tooSmall);
    }
    
    function testInsufficientBalance() public {
        uint256 depositAmount = 1000 * 1e6;
        
        vm.prank(user1);
        vault.deposit(depositAmount);
        
        vm.prank(user1);
        vm.expectRevert("Insufficient balance");
        vault.withdraw(depositAmount + 1);
    }
    
    function testPauseUnpause() public {
        vault.pause();
        
        vm.prank(user1);
        vm.expectRevert("Pausable: paused");
        vault.deposit(1000 * 1e6);
        
        vault.unpause();
        
        vm.prank(user1);
        vault.deposit(1000 * 1e6); // Should work now
        
        assertEq(vault.balanceOf(user1), 1000 * 1e6);
    }
    
    function testOnlyOwnerFunctions() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        vault.setApy(1000);
        
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        vault.pause();
    }
    
    function testSetAPY() public {
        uint256 newApy = 1000; // 10%
        vault.setApy(newApy);
        assertEq(vault.getCurrentApy(), newApy);
        
        // Test maximum APY limit
        vm.expectRevert("APY too high");
        vault.setApy(2001); // 20.01%
    }
}

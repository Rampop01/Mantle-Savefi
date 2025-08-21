// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ISaveFiVault {
    struct DrawInfo {
        uint256 id;
        uint256 timestamp;
        address winner;
        uint256 prizeAmount;
        uint256 participantCount;
        uint256 totalValueLocked;
        bool executed;
    }

    struct WinnerInfo {
        address winner;
        uint256 prizeAmount;
        uint256 drawId;
        uint256 timestamp;
        uint256 userDeposit;
        uint256 winningChance;
    }

    struct UserStats {
        uint256 totalDeposited;
        uint256 totalWinnings;
        uint256 drawsWon;
        uint256 lastDepositTime;
    }

    struct LeaderboardEntry {
        address user;
        uint256 totalWinnings;
        uint256 drawsWon;
        uint256 totalDeposits;
        uint256 winRate;
    }

    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event DrawExecuted(uint256 indexed drawId, address indexed winner, uint256 prizeAmount);
    event YieldGenerated(uint256 amount);

    // Core vault functions
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    
    // User data functions
    function getUserTotalDeposited(address user) external view returns (uint256);
    function getUserStats(address user) external view returns (UserStats memory);
    function getUserYieldEarned(address user) external view returns (uint256);
    function getUserWinningChance(address user) external view returns (uint256);
    
    // Vault statistics
    function getTotalValueLocked() external view returns (uint256);
    function getTotalParticipants() external view returns (uint256);
    function getTotalYieldGenerated() external view returns (uint256);
    function getCurrentApy() external view returns (uint256);
    
    // Draw system
    function getCurrentDrawId() external view returns (uint256);
    function getDrawInfo(uint256 drawId) external view returns (DrawInfo memory);
    function getNextDrawTime() external view returns (uint256);
    function getCurrentPrizePool() external view returns (uint256);
    function executeDraw() external;
    
    // Leaderboard functions
    function getWeeklyWinners(uint256 weekOffset) external view returns (WinnerInfo[] memory);
    function getAllTimeLeaderboard(uint256 limit) external view returns (LeaderboardEntry[] memory);
    function getDrawHistory(uint256 offset, uint256 limit) external view returns (DrawInfo[] memory);
}

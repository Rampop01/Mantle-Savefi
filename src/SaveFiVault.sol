// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {ISaveFiVault} from "./interfaces/ISaveFiVault.sol";
import {ISaveToken} from "./interfaces/ISaveToken.sol";

contract SaveFiVault is ISaveFiVault, ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public immutable DEPOSIT_TOKEN; // USDC
    ISaveToken public saveToken;
    
    uint256 public constant DRAW_INTERVAL = 5 minutes;
    uint256 public constant MIN_DEPOSIT = 1e6; // 1 USDC
    uint256 public constant PROTOCOL_FEE = 500; // 5%
    uint256 public constant BASIS_POINTS = 10000;
    
    uint256 public currentDrawId;
    uint256 public lastDrawTime;
    uint256 public totalDeposits;
    uint256 public totalYieldGenerated;
    uint256 public protocolFees;
    
    mapping(address => uint256) private userBalances;
    mapping(address => UserStats) public userStats;
    mapping(uint256 => DrawInfo) public draws;
    mapping(address => uint256[]) public userWinHistory;
    
    address[] public participants;
    mapping(address => bool) public isParticipant;
    
    // Yield strategy (simplified for demo)
    uint256 public currentApy = 420; // 4.2% APY in basis points
    uint256 public lastYieldUpdate;
    
    constructor(
        address _depositToken,
        address _saveToken
    ) {
        DEPOSIT_TOKEN = IERC20(_depositToken);
        saveToken = ISaveToken(_saveToken);
        lastDrawTime = block.timestamp;
        lastYieldUpdate = block.timestamp;
        currentDrawId = 1;
    }

    modifier onlyValidAmount(uint256 amount) {
        require(amount >= MIN_DEPOSIT, "Amount below minimum");
        _;
    }

    function deposit(uint256 amount) external override nonReentrant whenNotPaused onlyValidAmount(amount) {
        require(amount > 0, "Invalid amount");
        
        DEPOSIT_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        
        if (!isParticipant[msg.sender]) {
            participants.push(msg.sender);
            isParticipant[msg.sender] = true;
        }
        
        userBalances[msg.sender] += amount;
        totalDeposits += amount;
        
        userStats[msg.sender].totalDeposited += amount;
        userStats[msg.sender].lastDepositTime = block.timestamp;
        
        _updateYield();
        
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external override nonReentrant {
        require(amount > 0, "Invalid amount");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] -= amount;
        totalDeposits -= amount;
        
        if (userBalances[msg.sender] == 0) {
            isParticipant[msg.sender] = false;
            _removeParticipant(msg.sender);
        }
        
        _updateYield();
        
        DEPOSIT_TOKEN.safeTransfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, amount);
    }

    function balanceOf(address account) external view override returns (uint256) {
        return userBalances[account];
    }

    function getUserTotalDeposited(address user) external view override returns (uint256) {
        return userStats[user].totalDeposited;
    }

    function getUserStats(address user) external view override returns (UserStats memory) {
        return userStats[user];
    }

    function getUserYieldEarned(address user) external view override returns (uint256) {
        if (totalDeposits == 0) return 0;
        return (totalYieldGenerated * userBalances[user]) / totalDeposits;
    }

    function getUserWinningChance(address user) external view override returns (uint256) {
        if (totalDeposits == 0) return 0;
        return (userBalances[user] * 10000) / totalDeposits; // Return in basis points
    }

    function getTotalValueLocked() external view override returns (uint256) {
        return totalDeposits;
    }

    function getTotalParticipants() external view override returns (uint256) {
        return participants.length;
    }

    function getTotalYieldGenerated() external view override returns (uint256) {
        return totalYieldGenerated;
    }

    function getCurrentApy() external view override returns (uint256) {
        return currentApy;
    }

    function getCurrentDrawId() external view override returns (uint256) {
        return currentDrawId;
    }

    function getDrawInfo(uint256 drawId) external view override returns (DrawInfo memory) {
        return draws[drawId];
    }

    function getNextDrawTime() external view override returns (uint256) {
        return lastDrawTime + DRAW_INTERVAL;
    }

    function getCurrentPrizePool() external view override returns (uint256) {
        uint256 pendingYield = _calculatePendingYield();
        uint256 totalYield = totalYieldGenerated + pendingYield;
        uint256 fees = (totalYield * PROTOCOL_FEE) / BASIS_POINTS;
        return totalYield - fees - protocolFees;
    }

    function executeDraw() external override nonReentrant {
        require(block.timestamp >= lastDrawTime + DRAW_INTERVAL, "Draw not ready");
        require(participants.length > 0, "No participants");
        
        _updateYield();
        
        uint256 prizePool = this.getCurrentPrizePool();
        require(prizePool > 0, "No prize pool");
        
        address winner = _selectWinner();
        
        draws[currentDrawId] = DrawInfo({
            id: currentDrawId,
            timestamp: block.timestamp,
            winner: winner,
            prizeAmount: prizePool,
            participantCount: participants.length,
            totalValueLocked: totalDeposits,
            executed: true
        });
        
        userStats[winner].totalWinnings += prizePool;
        userStats[winner].drawsWon += 1;
        userWinHistory[winner].push(currentDrawId);
        
        // Transfer prize to winner
        DEPOSIT_TOKEN.safeTransfer(winner, prizePool);
        
        // Update protocol fees
        uint256 fees = (totalYieldGenerated * PROTOCOL_FEE) / BASIS_POINTS;
        protocolFees += fees;
        
        // Reset for next draw
        totalYieldGenerated = 0;
        lastDrawTime = block.timestamp;
        currentDrawId++;
        
        emit DrawExecuted(currentDrawId - 1, winner, prizePool);
    }

    function getWeeklyWinners(uint256 weekOffset) external view override returns (WinnerInfo[] memory) {
        uint256 targetWeek = currentDrawId > weekOffset ? currentDrawId - weekOffset : 1;
        uint256 count = 0;
        
        // Count winners in the target week
        for (uint256 i = targetWeek; i < currentDrawId && count < 10; i++) {
            if (draws[i].executed) count++;
        }
        
        WinnerInfo[] memory winners = new WinnerInfo[](count);
        uint256 index = 0;
        
        for (uint256 i = targetWeek; i < currentDrawId && index < count; i++) {
            if (draws[i].executed) {
                DrawInfo memory draw = draws[i];
                winners[index] = WinnerInfo({
                    winner: draw.winner,
                    prizeAmount: draw.prizeAmount,
                    drawId: draw.id,
                    timestamp: draw.timestamp,
                    userDeposit: userBalances[draw.winner],
                    winningChance: totalDeposits > 0 ? (userBalances[draw.winner] * 10000) / totalDeposits : 0
                });
                index++;
            }
        }
        
        return winners;
    }

    function getAllTimeLeaderboard(uint256 limit) external view override returns (LeaderboardEntry[] memory) {
        uint256 count = participants.length > limit ? limit : participants.length;
        LeaderboardEntry[] memory leaderboard = new LeaderboardEntry[](count);
        
        // Simple implementation - in production, this would be optimized
        for (uint256 i = 0; i < count; i++) {
            address user = participants[i];
            UserStats memory stats = userStats[user];
            
            leaderboard[i] = LeaderboardEntry({
                user: user,
                totalWinnings: stats.totalWinnings,
                drawsWon: stats.drawsWon,
                totalDeposits: stats.totalDeposited,
                winRate: stats.totalDeposited > 0 ? (stats.drawsWon * 10000) / (currentDrawId - 1) : 0
            });
        }
        
        return leaderboard;
    }

    function getDrawHistory(uint256 offset, uint256 limit) external view override returns (DrawInfo[] memory) {
        uint256 start = offset + 1;
        uint256 end = start + limit;
        if (end > currentDrawId) end = currentDrawId;
        
        uint256 count = end > start ? end - start : 0;
        DrawInfo[] memory history = new DrawInfo[](count);
        
        for (uint256 i = 0; i < count; i++) {
            history[i] = draws[start + i];
        }
        
        return history;
    }

    // Internal functions
    function _updateYield() internal {
        uint256 timeElapsed = block.timestamp - lastYieldUpdate;
        if (timeElapsed > 0 && totalDeposits > 0) {
            uint256 yieldAmount = _calculatePendingYield();
            totalYieldGenerated += yieldAmount;
            lastYieldUpdate = block.timestamp;
            
            if (yieldAmount > 0) {
                emit YieldGenerated(yieldAmount);
            }
        }
    }

    function _calculatePendingYield() internal view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastYieldUpdate;
        if (timeElapsed == 0 || totalDeposits == 0) return 0;
        
        // Simple yield calculation: APY * deposits * time / year
        return (totalDeposits * currentApy * timeElapsed) / (BASIS_POINTS * 365 days);
    }

    function _selectWinner() internal view returns (address) {
        require(participants.length > 0, "No participants");
        
        // Simple weighted random selection based on deposit amounts
        uint256 randomSeed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            currentDrawId,
            totalDeposits
        )));
        
        uint256 randomNumber = randomSeed % totalDeposits;
        uint256 cumulativeWeight = 0;
        
        for (uint256 i = 0; i < participants.length; i++) {
            cumulativeWeight += userBalances[participants[i]];
            if (randomNumber < cumulativeWeight) {
                return participants[i];
            }
        }
        
        return participants[participants.length - 1]; // Fallback
    }

    function _removeParticipant(address user) internal {
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == user) {
                participants[i] = participants[participants.length - 1];
                participants.pop();
                break;
            }
        }
    }

    // Admin functions
    function setApy(uint256 newApy) external onlyOwner {
        require(newApy <= 2000, "APY too high"); // Max 20%
        currentApy = newApy;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdrawProtocolFees() external onlyOwner {
        uint256 amount = protocolFees;
        protocolFees = 0;
        DEPOSIT_TOKEN.safeTransfer(owner(), amount);
    }

    function setSaveToken(address _saveToken) external onlyOwner {
        saveToken = ISaveToken(_saveToken);
    }
}

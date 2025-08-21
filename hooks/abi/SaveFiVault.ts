export const abi = [
  // Core vault functions
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw", 
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  
  // User data functions
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserTotalDeposited",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserStats",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "totalDeposited", "type": "uint256"},
          {"internalType": "uint256", "name": "totalWinnings", "type": "uint256"},
          {"internalType": "uint256", "name": "drawsWon", "type": "uint256"},
          {"internalType": "uint256", "name": "lastDepositTime", "type": "uint256"}
        ],
        "internalType": "struct ISaveFiVault.UserStats",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserYieldEarned",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserWinningChance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Vault statistics
  {
    "inputs": [],
    "name": "getTotalValueLocked",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalParticipants",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalYieldGenerated",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentAPY",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Draw system
  {
    "inputs": [],
    "name": "getCurrentDrawId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "drawId", "type": "uint256"}],
    "name": "getDrawInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "address", "name": "winner", "type": "address"},
          {"internalType": "uint256", "name": "prizeAmount", "type": "uint256"},
          {"internalType": "uint256", "name": "participantCount", "type": "uint256"},
          {"internalType": "uint256", "name": "totalValueLocked", "type": "uint256"},
          {"internalType": "bool", "name": "executed", "type": "bool"}
        ],
        "internalType": "struct ISaveFiVault.DrawInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNextDrawTime",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentPrizePool",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "executeDraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Leaderboard functions
  {
    "inputs": [{"internalType": "uint256", "name": "weekOffset", "type": "uint256"}],
    "name": "getWeeklyWinners",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "winner", "type": "address"},
          {"internalType": "uint256", "name": "prizeAmount", "type": "uint256"},
          {"internalType": "uint256", "name": "drawId", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "userDeposit", "type": "uint256"},
          {"internalType": "uint256", "name": "winningChance", "type": "uint256"}
        ],
        "internalType": "struct ISaveFiVault.WinnerInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "limit", "type": "uint256"}],
    "name": "getAllTimeLeaderboard",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "user", "type": "address"},
          {"internalType": "uint256", "name": "totalWinnings", "type": "uint256"},
          {"internalType": "uint256", "name": "drawsWon", "type": "uint256"},
          {"internalType": "uint256", "name": "totalDeposits", "type": "uint256"},
          {"internalType": "uint256", "name": "winRate", "type": "uint256"}
        ],
        "internalType": "struct ISaveFiVault.LeaderboardEntry[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "offset", "type": "uint256"},
      {"internalType": "uint256", "name": "limit", "type": "uint256"}
    ],
    "name": "getDrawHistory",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "address", "name": "winner", "type": "address"},
          {"internalType": "uint256", "name": "prizeAmount", "type": "uint256"},
          {"internalType": "uint256", "name": "participantCount", "type": "uint256"},
          {"internalType": "uint256", "name": "totalValueLocked", "type": "uint256"},
          {"internalType": "bool", "name": "executed", "type": "bool"}
        ],
        "internalType": "struct ISaveFiVault.DrawInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "drawId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "winner", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "prizeAmount", "type": "uint256"}
    ],
    "name": "DrawExecuted",
    "type": "event"
  }
] as const

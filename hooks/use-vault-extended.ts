import { useContractRead, useContractWrite, useContractReads } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/web3'
import { abi } from './abi/SaveFiVault'

// Extended vault hooks for all the new functionality

// User data hooks
export function useUserStats(address: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getUserStats',
    args: [address],
    enabled: !!address,
  })
}

export function useUserTotalDeposited(address: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getUserTotalDeposited',
    args: [address],
    enabled: !!address,
  })
}

export function useUserYieldEarned(address: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getUserYieldEarned',
    args: [address],
    enabled: !!address,
  })
}

export function useUserWinningChance(address: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getUserWinningChance',
    args: [address],
    enabled: !!address,
  })
}

// Vault statistics hooks
export function useVaultStats() {
  return useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getTotalValueLocked',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getTotalParticipants',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getTotalYieldGenerated',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getCurrentAPY',
      },
    ],
  })
}

export function useTotalValueLocked() {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getTotalValueLocked',
  })
}

export function useTotalParticipants() {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getTotalParticipants',
  })
}

export function useCurrentAPY() {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getCurrentAPY',
  })
}

// Draw system hooks
export function useCurrentDraw() {
  return useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getCurrentDrawId',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getNextDrawTime',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getCurrentPrizePool',
      },
    ],
  })
}

export function useDrawInfo(drawId: number | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getDrawInfo',
    args: [drawId],
    enabled: drawId !== undefined,
  })
}

export function useDrawHistory(offset: number = 0, limit: number = 10) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getDrawHistory',
    args: [offset, limit],
  })
}

export function useExecuteDraw() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'executeDraw',
  })
}

// Leaderboard hooks
export function useWeeklyWinners(weekOffset: number = 0) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getWeeklyWinners',
    args: [weekOffset],
  })
}

export function useAllTimeLeaderboard(limit: number = 10) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'getAllTimeLeaderboard',
    args: [limit],
  })
}

// Dashboard data hook - combines multiple calls for efficiency
export function useDashboardData(userAddress: string | undefined) {
  return useContractReads({
    contracts: [
      // User data
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'balanceOf',
        args: [userAddress],
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getUserStats',
        args: [userAddress],
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getUserWinningChance',
        args: [userAddress],
      },
      // Vault stats
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getTotalValueLocked',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getTotalParticipants',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getCurrentPrizePool',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
        abi,
        functionName: 'getNextDrawTime',
      },
    ],
    enabled: !!userAddress,
  })
}

import { useContractRead, useContractWrite, useContractReads } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/web3'
import { abi } from './abi/SaveToken'

// Governance hooks for SaveToken

// Token data hooks
export function useSaveTokenBalance(address: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  })
}

export function useVotingPower(address: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getVotingPower',
    args: [address],
    enabled: !!address,
  })
}

export function useTotalSupply() {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'totalSupply',
  })
}

// Proposal hooks
export function useProposalCount() {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getProposalCount',
  })
}

export function useProposal(proposalId: number | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getProposal',
    args: [proposalId],
    enabled: proposalId !== undefined,
  })
}

export function useActiveProposals() {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getActiveProposals',
  })
}

export function useProposalState(proposalId: number | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getProposalState',
    args: [proposalId],
    enabled: proposalId !== undefined,
  })
}

export function useProposalVotes(proposalId: number | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getProposalVotes',
    args: [proposalId],
    enabled: proposalId !== undefined,
  })
}

export function useQuorumRequired() {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getQuorumRequired',
  })
}

// User voting hooks
export function useUserVote(proposalId: number | undefined, userAddress: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getUserVote',
    args: [proposalId, userAddress],
    enabled: proposalId !== undefined && !!userAddress,
  })
}

export function useUserVotingHistory(userAddress: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'getUserVotingHistory',
    args: [userAddress],
    enabled: !!userAddress,
  })
}

// Write hooks
export function useCreateProposal() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'createProposal',
  })
}

export function useCastVote() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'castVote',
  })
}

export function useExecuteProposal() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'executeProposal',
  })
}

export function useDelegate() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.SAVE_TOKEN,
    abi,
    functionName: 'delegate',
  })
}

// Combined hooks for dashboard views
export function useGovernanceDashboard(userAddress: string | undefined) {
  return useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESSES.SAVE_TOKEN,
        abi,
        functionName: 'balanceOf',
        args: [userAddress],
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_TOKEN,
        abi,
        functionName: 'getVotingPower',
        args: [userAddress],
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_TOKEN,
        abi,
        functionName: 'getProposalCount',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_TOKEN,
        abi,
        functionName: 'getActiveProposals',
      },
      {
        address: CONTRACT_ADDRESSES.SAVE_TOKEN,
        abi,
        functionName: 'getQuorumRequired',
      },
    ],
    enabled: !!userAddress,
  })
}

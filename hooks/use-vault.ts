import { useContractRead, useContractWrite } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/web3'
import { abi } from './abi/SaveFiVault'

export function useVaultBalance(address: string | undefined) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  })
}

export function useVaultDeposit() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'deposit',
  })
}

export function useVaultWithdraw() {
  return useContractWrite({
    address: CONTRACT_ADDRESSES.SAVE_FI_VAULT,
    abi,
    functionName: 'withdraw',
  })
}
